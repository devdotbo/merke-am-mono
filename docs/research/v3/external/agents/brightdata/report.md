### Bright Data — X/Twitter Content Access (External‑Only)

Date: 2025-08-24

### Executive summary and recommendation stance
Bright Data provides web access infrastructure (proxies, Unlocker API, Browser API, Crawl API) suitable for collecting public X/Twitter web content via headless browsing or HTTP fetching routed through anti-bot tooling. It does not offer an official X/Twitter API; access is via public web endpoints with anti-bot evasion. Pricing is a mix of per-request (Unlocker/Crawl API) and per-GB or per-IP (proxies/browser). Vendor-claimed reliability and success rates are strong; formal SLAs are not prominently published. Recommendation: viable for compliant, web-surface collection at scale if you can manage ToS/ethics, budget for retries/bandwidth, and accept vendor-claimed SLOs.

### Coverage & features for X/Twitter
- Public web surface (not official API): timelines, profiles, search results, post permalinks, media URLs accessible via web
- Approaches:
  - Unlocker API: automated unblock, CAPTCHA solving, adaptive headers; claims near-100% success on tough sites (vendor-claimed) (retrieved 2025‑08‑24)
  - Browser API: managed headless browser for JS-rendered pages (retrieved 2025‑08‑24)
  - Proxy networks: residential, mobile, ISP, datacenter for IP rotation/geotargeting (retrieved 2025‑08‑24)
  - Crawl API: page-oriented scraping pipeline billed per request (retrieved 2025‑08‑24)
- Media: public image/video URLs can be fetched; bandwidth costs apply on proxy/browser products
- No first‑party X/Twitter endpoints or elevated firehose/search capabilities are provided

References: Web Unlocker product page; Pricing menus listing products and starting prices.

### Rate limits and latency
- Vendor-claimed success: “extremely high success rate (typically 100%)” for Web Unlocker (FAQ; vendor‑claimed, not independently verified) (retrieved 2025‑08‑24)
- Rate limits: no fixed per-second limits documented publicly for Unlocker/Crawl API; practical throughput depends on concurrency caps negotiated per account and target site defenses (vendor docs/pages do not publish numeric RPS)
- Latency: not published; expect higher latencies for JS-rendered flows (Browser API) and heavy unblock logic. Plan for seconds-level P95 on complex pages; measure and tune concurrency

References: Web Unlocker FAQ; product/docs hubs.

### Pricing model and tiers (with 1M posts/month scenario)
Published “starts from” pricing (indicative; vendor-claimed):
- Unlocker API: $1 per 1,000 requests (retrieved 2025‑08‑24)
- Crawl API: $1 per 1,000 requests (retrieved 2025‑08‑24)
- Browser API: $5 per GB (retrieved 2025‑08‑24)
- Residential proxies: starts at $2.50/GB (promo) (retrieved 2025‑08‑24)
- Datacenter proxies: starts at $0.90/IP (retrieved 2025‑08‑24)
- ISP proxies: starts at $1.30/IP (retrieved 2025‑08‑24)

Assumptions for 1M posts/month:
- Mix: Unlocker API for navigation; Residential for bandwidth; some pages served via JS (Browser API) for guarded flows
- Yield: 20 posts per page-load on average; 1M posts ≈ 50,000 page loads
- Average payload per load: 200 KB (HTML+assets after unlock; conservative) → 50,000 × 200 KB ≈ 10 GB data transfer
- Unlocker calls per page-load: 1

Estimated monthly cost (illustrative):
- Unlocker API: 50,000 requests × ($1 / 1,000) ≈ $50 (retrieved 2025‑08‑24)
- Residential bandwidth: ~10 GB × $2.50/GB ≈ $25 (retrieved 2025‑08‑24)
- Browser API: if 20% of pages require JS rendering → 10,000 page loads; assume 350 KB extra/page ≈ 3.5 GB → 3.5 × $5/GB ≈ $17.50 (retrieved 2025‑08‑24)
- Headroom for retries/blocks: +50% buffer ≈ $46
- Indicative subtotal ≈ $50 + $25 + $17.5 + $46 ≈ $138.5/month

Notes:
- If page yields are lower (e.g., 10 posts/page) or asset weights higher, bandwidth grows materially
- Some Bright Data configurations require precommit/minimums; pricing can differ by plan and negotiation

### Reliability & SLA
- Network status dashboard advertised for transparency (retrieved 2025‑08‑24)
- 24/7 support and dedicated account managers marketed; formal SLA page was not found; treat uptime/SLOs as vendor‑claimed unless contractually specified (retrieved 2025‑08‑24)

### Compliance posture (ToS, anti‑abuse, data handling)
- Acceptable Use Policy published; customers are responsible for lawful and ToS‑compliant use (retrieved 2025‑08‑24)
- Trust Center outlines security/compliance posture (retrieved 2025‑08‑24)
- For X/Twitter: adhere to x.com ToS/robots, avoid authentication circumvention, respect rate limits and user privacy; ensure GDPR/CCPA basis if processing personal data; perform DPIA when appropriate

### Implementation notes
- Auth & setup: provision Bright Data account; configure products (Unlocker, Browser API, proxies). Credentials are passed via proxy auth or API keys (see docs hub) (retrieved 2025‑08‑24)
- Pagination: X web UI paginates via scroll; detect next cursors or use deterministic URL params when available; persist cursors for idempotency
- Retries/backoff: implement exponential backoff with jitter; classify 403/429/5xx; rotate IPs/locations; keep session stickiness when required for continuity
- Anti‑bot: prefer Unlocker for guarded endpoints; fall back to Browser API for heavy JS; randomize headers and timing where appropriate
- Sample flow (pseudocode):
  1) Build search URL for x.com with query/time window
  2) Fetch via Unlocker; if blocked or dynamic, route via Browser API
  3) Parse posts from HTML/JSON payload; store normalized records
  4) Follow pagination cursor until quota/time bound
- SDK/refs: product/docs hubs list integrations (LangChain, LlamaIndex, n8n) helpful for orchestration (retrieved 2025‑08‑24)

### References (retrieved 2025‑08‑24)
- Bright Data — Pricing menu entries (products and "starts from" pricing): `https://brightdata.com/products/web-scraper/social-media-scrape`
- Bright Data — Pricing (landing): `https://brightdata.com/pricing`
- Bright Data — Unlocker API product page (features): `https://brightdata.com/products/web-unlocker`
- Bright Data — Web Unlocker FAQ (success rate claim): `https://brightdata.com/products/web-unlocker`
- Bright Data — Browser API (pricing via menu): `https://brightdata.com/products/web-scraping-browser` (linked from menus)
- Bright Data — Network status: `https://brightdata.com/network-status`
- Bright Data — Acceptable Use Policy: `https://brightdata.com/acceptable-use-policy`
- Bright Data — Trust Center: `https://brightdata.com/trustcenter`
- Bright Data — Docs hub: `https://docs.brightdata.com`
