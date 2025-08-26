### ZenRows — X/Twitter Access (External‑Only)

Date: 2025‑08‑24

### Executive summary and recommendation stance
- **Stance**: Viable generic web‑unblocker to fetch public X/Twitter content, but not Twitter‑specific; success likely requires JS rendering + residential proxies. Costs and throughput hinge on “protected” requests. Consider as a fallback when official APIs or first‑party feeds are unavailable.
- **Why/Why not**:
  - **Pros**: Anti‑bot stack (Cloudflare/DataDome/Akamai), headless JS rendering, residential proxies, sessions, auto‑retries, SDKs. Concurrency controls and clear request‑cost multipliers. [Vendor‑claimed.]
  - **Cons**: No Twitter‑specific scraper API/docs; heavy pages often need costly features (5×–25× multipliers). Uptime figures vary across pages. Compliance risk if scraping logged‑in/blocked areas.

### Coverage & features for X/Twitter (posts/threads/timelines/search/media)
- **Access model**: Universal HTTP scraping API at `https://api.zenrows.com/v1/` with parameters such as `js_render`, `premium_proxy`, `proxy_country`, `session_id`, `css_extractor`, `autoparse`, `json_response`, `wait`, `wait_for`, screenshots, and custom headers. [Vendor docs.]
- **Anti‑bot & JS**: Headless browser rendering to execute JS; combine with residential proxies to bypass WAFs/fingerprinting. [Vendor docs.]
- **Twitter specifics**: No official Twitter/X guide or Twitter‑specific scraper API found on zenrows.com; use the universal API patterns above for public endpoints. [Vendor site; 404 for likely blog slugs.]
- **Media**: Can fetch media URLs present in page/JSON via `json_response` or parse HTML; screenshots supported for visual capture. [Vendor docs.]

### Rate limits and latency
- **Concurrency limits (vendor‑claimed)** per plan for Universal Scraper API: Developer 5; Startup 20; Business 50; Business 500 100; Business 1K 150; Business 2K 200; Business 3K 250; Enterprise custom. Response size limits 5–50 MB by tier. Headers include `Concurrency-Limit`, `Concurrency-Remaining`, `X-Request-Cost`. Canceled client requests may hold slots up to ~3 minutes; `429` if exceeded. Latency not published; JS rendering increases time. [Vendor docs.]

### Pricing model and tiers with a 1M posts/month scenario
- **Plan inclusions (vendor‑claimed, monthly)**: examples
  - Developer $69: ~250k basic results; 10k protected; 12.73 GB Scraping Browser/Residential proxies. 
  - Startup $129: ~1M basic; 40k protected; 24.76 GB.
  - Business $299: ~3M basic; 120k protected; 60 GB. [Pricing page.] 
- **Per‑1k request cost multipliers (vendor‑claimed)**:
  - Pricing page FAQ example on Business: Basic $0.10 / 1,000; JS 5× ($0.50); Premium proxies 10× ($1.00); Both 25× ($2.50). [Pricing page.] 
  - Docs page shows Basic $0.10; JS $0.45; Proxies $0.90; Both $2.50. Treat as inconsistent marketing; use pricing page values operationally. [Docs + pricing.] 
- **1M posts/month scenario (assumptions stated)**:
  - Assumptions: 1 post ≈ 1 request; public unauthenticated pages; success on X/Twitter typically needs JS rendering + residential proxies; thus “Both” 25× pricing. [Assumption; vendor docs indicate domains may require JS/proxy.] 
  - Cost using pricing‑page example (vendor‑claimed):
    - Basic only: 1,000,000 / 1,000 × $0.10 ≈ **$100**.
    - JS only (5×): ≈ **$500**.
    - Premium proxies only (10×): ≈ **$1,000**.
    - Both (25×): ≈ **$2,500**.
  - Plan‑quota feasibility: Startup includes ~1M basic but only ~40k protected; Business includes ~120k protected. To reach ~1M protected‑equivalent (if “Both” required), quotas are insufficient; budget for Enterprise scale or per‑1k costs as above. [Pricing page.] 

### Reliability & SLA
- **Uptime/guarantees (vendor‑claimed)**: Pricing cards reference “99.1% uptime guarantee” on some proxy items; Startup mentions “99.3% uptime guarantee”; docs state 99.9% uptime for Scraping Browser/residential IPs. Treat as marketing targets with variance across pages. Status page is available. [Vendor pricing/docs/status.]

### Compliance posture (ToS alignment, anti‑abuse, data handling)
- **Provider controls**: Error codes include forbidden‑site logic (`REQS001`) and domain requirements (`REQS002`) that may mandate JS rendering and/or premium proxies. Feature gating by plan; usage and concurrency limits enforced. [Vendor docs.]
- **Your obligations**: Ensure lawful basis and respect X/Twitter ToS/robots/robots‑like controls. Avoid logged‑in or paywalled areas without rights. Store API keys securely; rotate; monitor usage. [General best practice; provider docs.] 

### Implementation notes (auth, pagination, retries/backoff, sample requests/SDK refs)
- **Auth**: Send `apikey` as query param to `https://api.zenrows.com/v1/` with `url` target parameter.
- **Anti‑bot settings**: Begin without extras; progressively enable `js_render=true`, `premium_proxy=true`, and `proxy_country` only when needed to control cost. Use `session_id` for multi‑step flows.
- **Extraction**: Prefer `json_response=true` to capture XHR/fetch calls when pages hydrate data; else `css_extractor` or `autoparse`.
- **Retries/backoff**: Implement exponential backoff; respect `429` and observe `Concurrency-Remaining` to pace. Avoid client timeouts <3m to prevent slot starvation.
- **Pagination/infinite scroll**: Use `js_instructions` to scroll/click “Show more” and `wait_for` feed selectors.
- **SDKs**: Python `zenrows` and JavaScript `zenrows` support built‑in concurrency and retries. [Vendor docs.] 

Example (Python; JS rendering + premium proxy):
```python
import requests
params = {
  "url": "https://x.com/some_user/status/123",
  "apikey": "YOUR_ZENROWS_API_KEY",
  "js_render": "true",
  "premium_proxy": "true",
  "wait_for": "article",  # feed/post selector
  "json_response": "true"
}
r = requests.get("https://api.zenrows.com/v1/", params=params, timeout=180)
r.raise_for_status()
print(r.text)
```

### References (retrieved 2025‑08‑24)
- ZenRows — Pricing page (vendor‑claimed): [https://www.zenrows.com/pricing](https://www.zenrows.com/pricing)
- ZenRows — Pricing page (text mirror used for access): [http://r.jina.ai/http://www.zenrows.com/pricing](http://r.jina.ai/http://www.zenrows.com/pricing)
- ZenRows Docs — Universal Scraper API reference (vendor‑claimed): [https://docs.zenrows.com/universal-scraper-api/api-reference](https://docs.zenrows.com/universal-scraper-api/api-reference)
- Text mirror of API reference: [http://r.jina.ai/http://docs.zenrows.com/universal-scraper-api/api-reference](http://r.jina.ai/http://docs.zenrows.com/universal-scraper-api/api-reference)
- ZenRows Docs — Make your first request: [https://docs.zenrows.com/universal-scraper-api/first-request](https://docs.zenrows.com/universal-scraper-api/first-request)
- Text mirror of first request: [http://r.jina.ai/http://docs.zenrows.com/universal-scraper-api/first-request](http://r.jina.ai/http://docs.zenrows.com/universal-scraper-api/first-request)
- ZenRows Docs — JavaScript Rendering feature: [https://docs.zenrows.com/universal-scraper-api/features/js-rendering](https://docs.zenrows.com/universal-scraper-api/features/js-rendering)
- Text mirror of JS rendering: [http://r.jina.ai/http://docs.zenrows.com/universal-scraper-api/features/js-rendering](http://r.jina.ai/http://docs.zenrows.com/universal-scraper-api/features/js-rendering)
- ZenRows Docs — Concurrency: [https://docs.zenrows.com/universal-scraper-api/features/concurrency](https://docs.zenrows.com/universal-scraper-api/features/concurrency)
- Text mirror of concurrency: [http://r.jina.ai/http://docs.zenrows.com/universal-scraper-api/features/concurrency](http://r.jina.ai/http://docs.zenrows.com/universal-scraper-api/features/concurrency)
- ZenRows Docs — API Error Codes (forbidden sites, requirements): [https://docs.zenrows.com/api-error-codes](https://docs.zenrows.com/api-error-codes)
- Text mirror of API Error Codes: [http://r.jina.ai/http://docs.zenrows.com/api-error-codes](http://r.jina.ai/http://docs.zenrows.com/api-error-codes)
- ZenRows Docs — Welcome/docs hub (products and uptime mentions): [https://www.zenrows.com/docs](https://www.zenrows.com/docs) | mirror: [http://r.jina.ai/http://www.zenrows.com/docs](http://r.jina.ai/http://www.zenrows.com/docs)

Notes: No current ZenRows blog/tutorial specifically for “Twitter/X scraping” was found (several likely slugs return 404). Use the universal API guidance above for X/Twitter.
