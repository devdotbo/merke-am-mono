### Open‑Source Baseline: Headless Browser + Stealth (Playwright/Puppeteer)

Date: 2025‑08‑24

#### Executive summary and stance
Headless browsers with stealth hardening (Playwright/Puppeteer plus stealth plugins) remain a flexible fallback for X/Twitter when official APIs or lightweight HTTP scrapers are insufficient. They can render client‑side apps, carry real session cookies, and mimic human interaction. However, they are resource‑heavy, sensitive to anti‑bot changes, and require disciplined proxy/session hygiene and observability. Use for targeted coverage and workflows that must execute the real web app; avoid for bulk ingestion at very high scale.

---

### Scope & capabilities for X/Twitter
- **Coverage**: Timeline/home, user profiles, tweet threads/conversation, search results, media pages, and embedded cards. Works both unauthenticated (guest) and authenticated (logged‑in cookie state), though authenticated browsing is generally more reliable.
- **Rendering & interaction**: Full SPA rendering, infinite scroll, click/hover/open media, capture network responses (GraphQL/REST), and take DOM snapshots.
- **Data access patterns**:
  - Parse rendered DOM for posts, counts, timestamps.
  - Intercept JSON responses from X web app GraphQL endpoints via response handlers.
  - Persist and reuse authenticated session state to access protected views.

### Typical throughput & reliability (qualitative)
- **Throughput**: Constrained by CPU/RAM and site complexity, since each page requires full JS execution and rendering. Scale horizontally with multiple browsers/containers and controlled concurrency per host. Use task queues and per‑IP/session sharding rather than unbounded concurrency.
- **Reliability**: Sensitive to X UI and network API changes, to stealth plugin health, to proxy reputation, and to session age. Expect periodic breakages requiring selector/flow updates. Build robust retries with backoff, circuit‑breakers for noisy IPs, and auto‑rotation of sessions.

### Setup & authentication
- **Playwright**
  - Reuse logged‑in sessions with storage state to avoid re‑auth flows and interstitials. See Playwright authentication state reuse docs (storageState).
  - Use tracing/video for debugging flaky flows.
  - Configure proxy at browser launch when needed.
- **Puppeteer**
  - Use `puppeteer-extra` with the stealth plugin to reduce common headless signals.
  - Configure proxies via `--proxy-server` or upstream helpers like `proxy-chain` for authenticated providers.

### Anti‑bot/ban handling
- **Stealth hardening**: Apply `puppeteer-extra-plugin-stealth` (Puppeteer) or `playwright-extra` stealth for Playwright to mask common headless indicators (WebGL, UA hints, navigator properties). These reduce, not eliminate, detection.
- **Session strategy**: Prefer authenticated, aged sessions with realistic locales/timezones. Rotate across multiple session buckets; avoid sharing one account across many IPs. Persist storage state per session.
- **Behavioral realism**: Human‑like waits, scroll pacing, limited parallel tabs per IP, avoid deterministic input timings. Randomize viewport within reasonable bounds; pin stable fonts/UA.
- **Network hygiene**: Residential/mobile proxies for higher trust targets; rotate IPs on specific HTTP status patterns, JavaScript challenges, or repeated soft‑blocks. Respect robots/ToS and throttle to site norms.
- **CAPTCHA/interstitials**: Integrate solver services where legally permissible; prefer avoiding triggers via better session/proxy hygiene first.

### Proxy requirements & strategy
- Prefer residential/mobile proxy networks for high‑friction surfaces; datacenter can work for low‑risk endpoints but is more frequently challenged.
- Rotate IPs per session or per N requests; implement sticky sessions where continuity is needed (e.g., infinite scroll), then rotate on completion or on challenge detection.
- Centralize proxy config; surface per‑request metadata (exit IP ASN/geo, success/failure) to inform adaptive routing.

### Pagination, retries, backoff
- **Pagination**: Implement infinite scroll with scroll‑and‑wait loops until a stopping criterion (items, date cut‑off) or until no new nodes appear. Additionally, capture network JSON to avoid brittle selectors.
- **Retries**: Classify failures: transient network/timeout, soft‑block (interstitial), hard‑block (login wall). Retry transient with exponential backoff and jitter; refresh session or proxy on soft‑block; abandon or queue for manual review on hard‑block.
- **Backoff**: Honor `Retry-After` when present; apply per‑host token buckets to cap concurrency/throughput.

### Observability & maintenance
- **Observability**: Enable Playwright trace/video/snapshots around failures; persist network logs for key routes; add redaction for PII/secrets. Emit structured logs (JSON) with session id, proxy id, URL, response pattern, and classification of failure.
- **Regression safety**: Pin versions of browsers, Playwright/Puppeteer, and stealth plugins. Maintain synthetic checks (canary journeys) for critical flows. Add feature flags to disable risky evasions if they regress.
- **Operational load**: Plan for periodic break/fix when X updates UI or anti‑bot, and when stealth plugins update evasion sets. Keep a small library of resilient locators and network pattern matchers.

---

### Minimal implementation notes
- **Playwright (Node.js) sketch**
  - Launch Chromium with optional proxy; load persistent auth state; navigate; scroll and listen to `page.on('response')` to parse GraphQL payloads; extract and emit normalized records.
  - Use tracing in failure paths and structured logs for triage.
- **Puppeteer (Node.js) sketch**
  - Use `puppeteer-extra` + stealth; configure proxy; load cookies; navigate; scroll; parse DOM and/or intercept network via `page.on('response')` equivalents.
- **Concurrency**
  - Use a worker pool/cluster model to bound browsers and pages per worker; shard by session and proxy to avoid cross‑contamination.

---

### References (retrieved 2025‑08‑24)
- Playwright — Authentication state reuse docs: https://playwright.dev/docs/auth
- Playwright — Trace Viewer (tracing, video, snapshots): https://playwright.dev/docs/trace-viewer
- Playwright — Network and proxies (HTTP proxy, events): https://playwright.dev/docs/network
- Playwright API — `BrowserType.launch` proxy option: https://playwright.dev/docs/api/class-browsertype#browsertype-launch-option-proxy
- Puppeteer — Official documentation: https://pptr.dev/
- puppeteer‑extra — Stealth plugin and ecosystem: https://github.com/berstend/puppeteer-extra
- puppeteer‑extra‑plugin‑stealth — Evasions for headless detection: https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth
- playwright‑extra — Stealth support for Playwright: https://github.com/berstend/playwright-extra
- Apify — proxy-chain (proxy authentication helper for headless browsers): https://github.com/apify/proxy-chain
- Oxylabs — Proxy rotation best practices: https://oxylabs.io/blog/web-scraping-proxy-rotation
- Intoli — Detecting Chrome headless (limitations and evasions): https://intoli.com/blog/not-possible-to-block-chrome-headless/
- MDN — Retry-After HTTP header (backoff considerations): https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After
