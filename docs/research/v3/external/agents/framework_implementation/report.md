### Framework Implementation Notes (External‑Only)

Date: 2025-08-24

## Auth flows
- **API key (header/query)**: Prefer header (e.g., `Authorization: Bearer <token>`). Avoid query string where possible. Store in secret manager; never log.
- **OAuth 2.0**: Support client credentials for server-to-server; refresh tokens for long‑running jobs. Auto‑refresh on 401/invalid_token once per run with jitter. Persist new tokens securely.
- **Signed requests (HMAC)**: Canonicalize method, path, timestamp, and body; compute HMAC with shared secret; send signature and timestamp headers. Reject if clock skew > allowed window.
- **Session cookies**: If vendor issues cookies, bind to a per-session key in the key‑value store and rotate on 401/403.
- **Rotation & least privilege**: Scope tokens by environment and dataset. Rotate credentials regularly; support multiple tokens and round‑robin under rate‑limit pressure.

## Pagination patterns
- **Cursor-based**: Use `next_cursor`/`next_token` from response. Stop when cursor is null/absent or when time/id boundary reached.
- **Time-bounded windowing**: For backfills, page newest→oldest until `created_at < lower_bound`.
- **ID seek (since_id/max_id)**: Maintain high‑water mark per stream. Resume from last seen id/time on reruns.
- **Offset/limit (page/per_page)**: Guard against drift; prefer cursor if both exist. Cap `limit` to vendor max.
- **Duplication control**: De‑dupe by stable id. Write idempotently to output (e.g., upsert by id).

## Retries and backoff
- **When to retry**: 429, 408, 425, 500, 502, 503, 504, network timeouts, connection resets. Do not retry non‑transient 4xx (e.g., 400, 401 after refresh, 403, 404).
- **Backoff**: Exponential with jitter. Respect `Retry-After` if present; cap with max delay and total time budget.
- **Idempotency**: Use idempotency keys where supported; otherwise restrict retries to GET/HEAD or safe POSTs.
- **Circuit breaking**: Trip on sustained high failure rate; cool down before resuming. Emit alerts.

## Caching
- **Request cache**: Key by method + normalized URL + auth scope + body hash. TTL tuned to endpoint volatility. Serve 304 with ETag/If-None-Match where supported.
- **Entity cache**: Cache normalized entities (e.g., users, media) separately with longer TTL than timelines.
- **De‑duplication**: Bloom filter or Redis SET per run to avoid re‑processing ids.
- **Cold start**: Pre‑seed with last run’s high‑water marks and cursors.

## Observability
- **Structured logs**: JSON logs for request/response metadata, status, latency, retries, backoff delay, rate‑limit state, cursor positions, and output counts. Include `run_id`, `stream`, `request_id`.
- **Metrics**: Counters (requests, successes, errors, retries), histograms (latency, payload size), gauges (in‑flight, queue depth), and rate‑limit remaining. Export to Prometheus/OpenTelemetry.
- **Tracing**: Propagate trace/span ids through HTTP clients; annotate external calls and parse stages.
- **Dashboards & alerts**: SLOs on success rate and p95 latency; alerts on sustained 429s, error spikes, empty pages streaks, and backlog growth.

## Pseudocode

### Apify actor run lifecycle
```python
class ActorRun:
    def main(self):
        actor = ApifyActor()
        actor.init()                                  # initialize SDK, logging, kv-store, dataset

        run_id = actor.new_run_id()
        input_payload = actor.get_input()             # seeds, time window, auth, feature flags

        state_store = actor.open_kv_store(namespace=f"state:{run_id}")
        output_dataset = actor.open_dataset(name=f"dataset:{run_id}")
        request_queue = actor.open_request_queue(name=f"queue:{run_id}")

        seeds = normalize_seeds(input_payload)
        for seed in seeds:
            request_queue.add_request(url=seed.url, user_data={"type": seed.type})

        rate_controller = RateLimiter(budget_per_sec=input_payload.get("rps", 5))
        deduper = Deduper(backing_store=state_store)

        try:
            while actor.is_running():
                if request_queue.is_empty():
                    if actor.idle_for(seconds=10):
                        break                         # graceful shutdown when work is done

                rate_controller.consume(1)            # throttle before taking a request
                request = request_queue.fetch_next()
                if request is None:
                    continue

                try:
                    response = http_fetch_with_retry(request, auth=input_payload.auth)
                    parsed_items, next_requests = parse_response(request, response)

                    for item in parsed_items:
                        if deduper.see(item.id):
                            output_dataset.push_item(item)

                    for next_req in next_requests:
                        if not deduper.see(next_req.fingerprint):
                            request_queue.add_request(**next_req.to_dict())

                    actor.set_checkpoint(state_store, cursor=parsed_items.last_cursor)
                    request_queue.mark_done(request)
                except TransientError as e:
                    request_queue.reclaim(request, delay_seconds=e.retry_after or 10)
                    actor.log_warning("Transient error", error=str(e))
                except FatalError as e:
                    request_queue.mark_failed(request, error=str(e))
                    actor.log_error("Fatal error", error=str(e))
        finally:
            actor.persist_state(state_store)
            actor.maybe_migrate()                     # Apify can migrate actors across workers
            actor.exit()
```

### Bright Data proxy usage
```python
def build_proxy_session(session_id: str, region: str | None = None) -> dict:
    username = f"customer-<id>-zone-<zone>-session-{session_id}"  # include session pinning
    if region:
        username += f"-country-{region}"
    password = "<password>"

    proxy_host = "<proxy_host>"      # e.g., provided by vendor
    proxy_port = 22225               # e.g., provided by vendor

    proxy_url = f"http://{username}:{password}@{proxy_host}:{proxy_port}"
    return {"http": proxy_url, "https": proxy_url}


def fetch_with_bright_data(url: str) -> HttpResponse:
    session_id = uuid4().hex
    proxies = build_proxy_session(session_id, region="US")

    try:
        resp = http.get(url, timeout=30, proxies=proxies, headers={
            "User-Agent": rotate_user_agent(),
            "Accept-Language": "en-US,en;q=0.9",
        })
        if is_blocked(resp):                   # e.g., 403/429, captcha detected, or honeypot markers
            raise TransientError("Blocked by target")
        return resp
    except TransientError:
        # rotate session and retry once fast before full retry logic
        proxies = build_proxy_session(uuid4().hex, region="US")
        return http.get(url, timeout=30, proxies=proxies)
```

### Generic retry with exponential backoff
```python
def retry_with_exponential_backoff(operation, *,
                                   max_attempts: int = 6,
                                   base_delay_seconds: float = 0.5,
                                   max_delay_seconds: float = 30.0,
                                   total_time_budget_seconds: float = 120.0,
                                   is_retryable: callable = None):
    start = now()
    attempt = 0
    last_error = None

    def default_is_retryable(error) -> bool:
        if isinstance(error, HttpError):
            if error.status in {408, 425, 429, 500, 502, 503, 504}:
                return True
            return False
        if isinstance(error, NetworkError):
            return True
        return False

    checker = is_retryable or default_is_retryable

    while attempt < max_attempts and (now() - start).total_seconds() < total_time_budget_seconds:
        try:
            return operation()
        except Exception as e:
            last_error = e
            if not checker(e):
                raise

            attempt += 1
            retry_after = getattr(e, "retry_after_seconds", None)
            if retry_after is not None:
                delay = min(retry_after, max_delay_seconds)
            else:
                # exponential backoff with full jitter
                exponential = base_delay_seconds * (2 ** (attempt - 1))
                delay = min(exponential, max_delay_seconds)
                delay = random.uniform(0, delay)

            sleep(delay)

    raise last_error
```
