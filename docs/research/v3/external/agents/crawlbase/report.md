## Executive summary and recommendation stance

Crawlbase (formerly ProxyCrawl) provides a general-purpose Crawling API and Smart Proxy with built‑in headless browsers and anti‑bot handling. It can access X/Twitter web pages when supplied with proper headers/cookies and by enabling JavaScript rendering. Given X.com’s gating and frequent changes, expect cookie-based sessions and scrolling to be required. Recommendation: viable for external-only trials and comparative benchmarking; proceed with caution on ToS/compliance and plan for cookie/session management and backoff.

## Coverage & features for X/Twitter
- **Targets**: Public X/Twitter web pages (e.g., profiles, posts, search, explore) via generic fetching.
- **JS rendering**: **Yes**. Use the JavaScript token (real browsers) for client‑rendered content and anti‑bot flows.
- **Infinite scroll**: Supported via `scroll=true` and `scroll_interval` for timeline/search result pagination.
- **Headers/cookies**: Forwarding supported; Smart Proxy forwards custom headers and cookies to the target. Useful for logged‑in flows when required by X/Twitter.
- **Structured output**: Raw HTML/JSON of the fetched page; no Twitter‑specific parser. App code must extract posts/threads/media.
- **Deprecations**: Scraper API was sunset for new sign‑ups (Oct 1, 2024). Use Crawling API + Smart Proxy.

Sources: Crawling API docs (rate/latency/JS, scroll), Smart Proxy docs (headers/cookies), Scraper API sunset notice.

## Rate limits and latency
- **Rate limit**: 20 requests/second per token (can be increased upon request). Vendor‑claimed.
- **Latency**: Average 4–10 seconds; vendor recommends client timeouts ≥90 seconds. Vendor‑claimed.
- **429 handling**: Returned when rate limit is exceeded; backoff required.

References: Crawling API docs.

## Pricing model and tiers (1M posts/month scenario)
- **Free trial**: First 1,000 requests are free. Vendor‑claimed.
- **Public pricing**: No transparent per‑request price found on the public pricing page; pricing appears plan/sales‑driven.
- **Scenario (assumptions; not vendor pricing)**: If cost is P dollars per 1,000 successful requests, then monthly cost for 1,000,000 posts is: `(1,000,000 / 1,000) × P = 1,000 × P`.
  - Example sensitivities (hypothetical): P=$1 → $1,000; P=$2 → $2,000; P=$3 → $3,000.
- Note: Crawlbase charges only successful requests.

References: Crawling API docs (free trial, charge-on-success); public pricing page (no rates visible).

## Reliability & SLA
- **Status**: Public status page with component health; currently shows systems operational and recent days without incidents (see status timeline).
- **SLA**: No explicit SLA/SLO published on public docs; treat as best‑effort unless negotiated.

References: Status page.

## Compliance posture (ToS, anti‑abuse, data handling)
- **Site ToS**: Customers are responsible for complying with third‑party terms (including X.com). Use headers/cookies only with proper authorization.
- **Anti‑abuse**: Product provides anti‑bot measures (headless browsers/rotating UA). Use ethically and lawfully.
- **Data handling**: Smart Proxy forwards request headers/cookies to the target; do not transmit sensitive data unless necessary and permitted. Charges only for successful requests.
- **Policies**: See Terms and Privacy.

References: Terms, Privacy, product docs text indicating real‑browser/anti‑bot and header forwarding.

## Implementation notes
- **Auth**: Two tokens: normal and JavaScript (for real browsers). Prefer JS token for X/Twitter.
- **Pagination/scroll**: Use `scroll=true` and tune `scroll_interval` to load additional results.
- **Headers/cookies**: Supply session cookies and a realistic `User-Agent` when X/Twitter requires login; Smart Proxy forwards them. If `User-Agent` is blank, Smart Proxy rotates it.
- **Retries/backoff**: On 429 or transient 5xx/520, use exponential backoff with jitter; respect 20 rps per token. Keep request timeout ≥90s.
- **Sample requests**:
  - Crawling API with JS and scroll (timeline/search):
    ```bash
    curl 'https://api.crawlbase.com/?token=JS_TOKEN&scroll=true&scroll_interval=20&url=https%3A%2F%2Fx.com%2Fexplore'
    ```
  - Smart Proxy with headers/cookies (logged‑in page):
    ```bash
    curl \
      -H 'Accept-Language: en-US,en;q=0.9' \
      -H 'User-Agent: Mozilla/5.0 ...' \
      --cookie 'auth_token=...; ct0=...' \
      -x 'https://USER_TOKEN:[email protected]:8013' -k \
      'https://x.com/i/api/graphql/...'
    ```
- **SDKs**: Vendor lists API libraries in dashboard; generic HTTP clients suffice.

## References (retrieved 2025‑08‑24)
- Crawlbase — Crawling API intro (rate limit, latency, tokens, free trial, success‑only billing): `https://crawlbase.com/docs/crawling-api/`
- Crawlbase — Crawling API parameters (scroll usage examples): `https://crawlbase.com/docs/crawling-api/parameters/`
- Crawlbase — Headless Browsers (JS token/real browsers): `https://crawlbase.com/docs/crawling-api/headless-browsers/`
- Crawlbase — Scraper API notice (sunset as of 2024‑10‑01): `https://crawlbase.com/docs/scraper-api/`
- Crawlbase — Smart Proxy (endpoints, usage): `https://crawlbase.com/docs/smart-proxy/`
- Crawlbase — Smart Proxy headers & cookies (forwarding, UA behavior): `https://crawlbase.com/docs/smart-proxy/headers-cookies/`
- Crawlbase — API Status Codes (429, 520, etc.): `https://crawlbase.com/docs/status-codes/`
- Crawlbase — Status page (operational status and history): `https://status.crawlbase.com/`
- Crawlbase — Pricing (public plans page; no per‑request rates visible): `https://crawlbase.com/pricing`
- Crawlbase — Terms: `https://crawlbase.com/terms`
- Crawlbase — Privacy: `https://crawlbase.com/privacy`