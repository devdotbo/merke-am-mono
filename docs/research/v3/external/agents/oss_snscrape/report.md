### snscrape — Open‑Source Baseline (External‑Only)

Date: 2025‑08‑24

### Executive summary
- **Stance**: Useful as a free baseline for light‑to‑moderate, best‑effort X/Twitter collection, but fragile and not production‑grade without proxies, monitoring, and frequent maintenance.
- **Why**: It scrapes public web endpoints (no official API), so breakages occur whenever X changes its frontend or anti‑bot posture. Community fixes arrive, but not guaranteed on strict timelines.

### Scope and capabilities (X/Twitter)
- **Data types**: Public post search (query operators), user timelines, individual post lookups; basic entities (hashtags, mentions) via search queries.
- **Fields**: Typical tweet metadata (id, url, timestamp, text/renderedContent, user, counts, language; when available: in‑reply‑to/conversation IDs, quoted/retweeted links, outlinks, and some media references). Exact availability can vary as X changes its HTML/JSON surface.
- **Modes**: CLI and Python library; JSONL output is supported for downstream pipelines.

### Maintenance and project health
- **Activity**: Long‑running project with periodic bursts of maintenance addressing upstream breakages in X’s web flows.
- **Risk**: Regressions are common when X ships frontend/anti‑bot updates; issue tracker shows recurring break/fix cycles.

### Typical throughput and reliability (informational)
- **Throughput**: No documented guarantees. Performance depends on network, proxy quality, and X throttling. Expect variability and intermittent stalls during rate‑limit windows.
- **Stability**: Works until it doesn’t; pin versions and be prepared to hotfix or temporarily pause collection when breakages are reported.

### Setup and auth
- **Install**: `pip install snscrape` (Python ≥3.8 recommended). CLI: `snscrape`.
- **Auth**: Designed for public, unauthenticated scraping; does not rely on official API keys. Authenticated flows are not a supported/guaranteed pathway.
- **Environment**: Prefer running behind stable egress (or proxies) and with containerized, reproducible environments to isolate dependency changes.

### Usage and pagination
- **CLI examples**:
  - Search: `snscrape --jsonl --progress twitter-search "from:jack since:2024-01-01 until:2024-12-31" > out.jsonl`
  - User timeline: `snscrape --jsonl twitter-user jack --max-results 1000 > jack.jsonl`
- **Pagination**: Handled internally via X’s cursor mechanisms. Control volume with `--max-results` and query slicing (e.g., `since:`/`until:`). For backfills, partition by time windows to avoid deep cursors.

### Retries, backoff, and resilience
- **Built‑in**: Basic network retries exist, but are not tuned for adversarial rate‑limits.
- **Recommended wrapper**:
  - Implement exponential backoff on HTTP 429/403 and transient 5xx.
  - Add jitter and cap (e.g., backoff 2^n seconds up to 5–10 minutes on sustained 429).
  - Persist last successful cursor/ID to resume safely.
  - Treat empty pages or sudden drops to zero throughput as a soft‑failure and retry after a cool‑down.

### Anti‑bot and ban handling
- **Proxies**: Use reputable rotating residential/mobile proxies; avoid datacenter IPs during large pulls.
- **Traffic shaping**: Randomized delays, concurrency caps (e.g., 1–3 concurrent tasks), and user‑agent rotation. Avoid predictable schedules.
- **Segmentation**: Slice queries by time windows and users to distribute load; prefer many short runs over monolithic crawls.
- **Fallback plan**: Monitor community issues for breakages; pause and upgrade/pin as needed.

### Observability and maintenance burden
- **Logging**: Always enable progress/log output and stream JSONL to durable storage. Capture HTTP status trends and retry counters.
- **Dashboards**: Track items/hour, error rate by status code, and time‑to‑first‑result per job. Alert on sudden changes.
- **Burden**: Medium‑to‑high in production contexts. Expect periodic interventions (version bumps, hotfixes, proxy adjustments) especially after notable X platform changes.

### Compliance considerations (non‑exhaustive)
- **ToS**: Scraping may violate X’s Terms; apply legal review and respect robots/robots‑equivalent controls as appropriate.
- **Privacy/Regulatory**: Evaluate GDPR/CCPA/DSA obligations for storage, purpose limitation, and user rights.

### References (retrieved 2025‑08‑24)
- snscrape — GitHub repository and README (retrieved 2025‑08‑24): https://github.com/JustAnotherArchivist/snscrape
- snscrape — Issues (Twitter/X breakages, maintenance discussions) (retrieved 2025‑08‑24): https://github.com/JustAnotherArchivist/snscrape/issues
- Example CLI usage in README (retrieved 2025‑08‑24): https://github.com/JustAnotherArchivist/snscrape#readme
- Twitter/X Terms of Service (retrieved 2025‑08‑24): https://twitter.com/tos