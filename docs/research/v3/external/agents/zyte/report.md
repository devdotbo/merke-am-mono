### Zyte — X/Twitter Data Access Options (External‑Only)

Date: 2025-08-24

### Executive summary and recommendation stance
- **Summary**: Zyte offers three relevant options for accessing X/Twitter web data: (1) Zyte API for high-success, JS-rendered fetching with anti-bot handling; (2) Smart Proxy Manager for managed rotating proxies if you operate your own crawlers; (3) Zyte API Browser/Playwright integration for full headless automation routed through Zyte’s antibot stack. Choice depends on control vs. convenience, payload size, and required success rate.
- **Recommendation**:
  - For minimal ops and highest block-resilience, start with **Zyte API** and enable JS rendering only where needed. Use its built-in retries and sessioning.
  - If you already have robust crawlers and just need IP rotation at scale, use **Smart Proxy Manager**.
  - For flows requiring interactive steps (logins, scrolling, clicking) use **Zyte API’s browser integration (Playwright)**.

### Coverage & features for X/Twitter
- **Zyte API**: HTTP fetch with optional headless JS rendering, residential/mobile exit support, automatic retries, sessioning, header/UA management, and block handling. Suitable for public X/Twitter pages such as profiles, tweet permalinks, timelines, search results, media pages, and embedded tweet cards. No built‑in Twitter-specific extractor; you parse HTML/JSON yourself. [Vendor docs] (retrieved 2025‑08‑24)
- **Smart Proxy Manager (SPM)**: Global rotating proxies (residential/datacenter/mobile), sticky sessions, geo targeting, automatic ban detection and failover. You bring your own crawler or browser (e.g., Playwright) and route traffic through SPM. [Vendor docs] (retrieved 2025‑08‑24)
- **Browser (Playwright via Zyte API)**: Drive Playwright while Zyte handles antibot/networking behind the scenes; useful for infinite scroll (timelines), expanding threads, opening media viewers, and capturing dynamically loaded JSON. [Vendor docs] (retrieved 2025‑08‑24)

Notes:
- For timelines and search, expect client-side GraphQL/API calls; Zyte options can fetch rendered HTML or intercept network calls if you automate a browser. Respect robots, site ToS, and legal constraints.

### Rate limits and latency
- **Zyte API**: Concurrency and throughput depend on plan; vendor positions the service as high-success at scale with automatic retries. Latency varies by rendering mode (non-JS vs JS-rendered/browser) and target behaviour. Treat full browser sessions as higher-latency. [Vendor docs — Zyte API overview/pricing] (retrieved 2025‑08‑24)
- **SPM**: No explicit per-request cap documented publicly; effective rate depends on allowed concurrency, selected proxy types, target tolerance, and your crawler’s backoff. [Vendor docs — SPM docs/pricing] (retrieved 2025‑08‑24)
- Mark all limits as **vendor‑claimed** unless you independently benchmark.

### Pricing model and tiers (with 1M posts/month scenario)
- **Units (vendor‑claimed; confirm on pricing page)**:
  - Zyte API: typically priced per request, with higher cost for JS rendering/browser features; volume tiers apply. [Pricing] (retrieved 2025‑08‑24)
  - Smart Proxy Manager: priced primarily per GB of traffic (different rates for residential vs datacenter vs mobile), with plan-based concurrency. [Pricing] (retrieved 2025‑08‑24)
  - Browser via Zyte API/Playwright: usually follows Zyte API pricing with additional costs tied to browser rendering/runtime. [Pricing] (retrieved 2025‑08‑24)

- **Scenario: 1,000,000 public tweet items/month (assumptions; replace with validated plan rates)**
  - Assumptions (stateful crawl, mixed pages):
    - 1 tweet item requires fetching ≈1 timeline/search page per 10 items on average (pagination and filtering assumed), so ≈100,000 page fetches/month.
    - Split: 60% non-JS fetches; 40% JS-rendered/browser (to load dynamic content reliably).
    - Average payload sizes: non-JS 300 KB; JS/browser 1.2 MB; retry overhead 15%.
  - Zyte API cost model (illustrative):
    - Non-JS requests: 60,000 × (per-request non-JS rate).
    - JS/browser requests: 40,000 × (per-request JS rate).
    - Add any overage or add-ons per plan. Cite pricing page for the actual rates. [Pricing] (retrieved 2025‑08‑24)
  - SPM cost model (illustrative):
    - Monthly traffic ≈ (60,000 × 0.3 MB + 40,000 × 1.2 MB) × 1.15 retries ≈ 69 GB.
    - Cost ≈ 69 GB × (per‑GB rate based on proxy type). [Pricing] (retrieved 2025‑08‑24)
  - Decision: choose Zyte API if you value success rate and simplicity; choose SPM if you can aggressively optimize bandwidth and handle parsing/antibot yourself at lower per‑GB cost.

### Reliability & SLA
- Vendor markets high success and stability for tough targets, with enterprise support and SLAs available on higher plans; self‑serve plans may not include formal SLAs. Validate SLA terms directly with sales if needed. [Vendor — SLA/legal/pricing pages] (retrieved 2025‑08‑24)

### Compliance posture
- Zyte emphasizes ethical web data collection and compliance; users are responsible for respecting target sites’ ToS (including X.com), robots directives, and applicable laws (GDPR/CCPA/DSA). Certain content and abuse patterns are disallowed by AUP. For X/Twitter specifically, avoid authentication circumvention and protected content; collect only public data for permitted purposes. [Vendor legal/AUP] (retrieved 2025‑08‑24)

### Implementation notes
- **Auth**:
  - Zyte API: HTTP header `Authorization: ApiKey <YOUR_KEY>` or as documented; pass `url` and rendering params.
  - SPM: configure HTTP/HTTPS proxies like `http://<apikey>:@proxy.zyte.com:8011` with optional country/session params.
  - Browser: Use Playwright with Zyte API integration or route Playwright/Chromium through SPM proxy credentials.
- **Pagination**:
  - Timelines/search require cursor-based paging or scroll simulation; with browser, scroll and harvest network responses; with HTTP fetches, follow `cursor` params extracted from page/JS.
- **Retries/backoff**:
  - Use exponential backoff with jitter; respect `Retry-After` headers and vendor return codes; rotate sessions; increase think time for aggressive endpoints.
- **Sample request (Zyte API)**:
  - `POST https://api.zyte.com/v1/extract` with JSON body including `url`, `httpResponseBody`, `browserHtml`, or use simple GET fetch endpoint per docs.
- **SDK/refs**: Python and JS examples provided in vendor docs for Zyte API, SPM proxy configuration, and Playwright integration. [Docs] (retrieved 2025‑08‑24)

### References (retrieved 2025‑08‑24)
- Zyte — Pricing: `https://www.zyte.com/pricing/`
- Zyte Docs — Zyte API: `https://docs.zyte.com/zyte-api/`
- Zyte Docs — Smart Proxy Manager: `https://docs.zyte.com/smart-proxy-manager/`
- Zyte Docs — Playwright/Browser integration: `https://docs.zyte.com/zyte-api/playwright/`
- Zyte — Legal/AUP/SLA (landing; confirm plan terms): `https://www.zyte.com/legal/`