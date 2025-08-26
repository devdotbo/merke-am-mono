### Oxylabs — X/Twitter External Research Report (2025-08-24)

### Executive summary and recommendation stance
- Oxylabs offers three viable approaches for X/Twitter collection: a managed Scraper API (Social Media/Web Scraper APIs), the Web Unblocker proxy with automatic anti-bot handling, and raw Residential/Datacenter proxies for teams building their own scrapers. 
- Recommendation: For fastest time-to-value and highest success at scale, prefer the managed Scraper API where it covers required X/Twitter surfaces. If custom rendering or niche flows are needed, use Web Unblocker with a headless browser. Choose raw Residential/Datacenter proxies only when you need maximum control or already operate a mature scraper stack. (Vendor capabilities and pricing models referenced below; validate against current pages.)

### Coverage & features for X/Twitter (post/thread/timeline/search/media)
- Scraper APIs: Oxylabs provides Social Media/Web Scraper APIs that target major social networks; these typically include endpoints or request templates for timelines, profiles, search results, and post detail pages. Marked as vendor-claimed; confirm exact X/Twitter surface coverage in the Social Media Scraper API documentation. (See references)
- Web Unblocker: A smart unblocker that handles blocks, CAPTCHAs, JavaScript, and session management automatically; suitable for fetching X/Twitter HTML/JSON endpoints with custom logic. (See references)
- Proxies: Residential and Datacenter proxy pools can be used with your own scraper for any public X/Twitter page or asset, including media, subject to Oxylabs’ Acceptable Use Policy and X’s ToS. (See references)

### Rate limits and latency
- Scraper API: Rate limits, concurrency, and typical latency are vendor-claimed and tier-dependent; Oxylabs publishes concurrency guidance and success expectations on its product/docs pages. Treat per-request SLA/latency as best-effort unless stated otherwise by Oxylabs for specific plans. (See references)
- Web Unblocker and Proxies: Practical throughput depends on your client concurrency, target endpoints, and anti-bot pressure. Expect page-level latencies typically in seconds when rendering-heavy or when encountering anti-bot challenges. Marked vendor-claimed/experience-based; validate with your workloads. (See references)

### Pricing model and tiers with a 1M posts/month scenario (state assumptions)
- Pricing units (confirm on vendor pages):
  - Scraper APIs: Commonly priced per successful request/credit with volume tiers. Include potential add-ons for advanced rendering. (Vendor page references)
  - Web Unblocker: Typically priced by data transfer volume (USD per GB), often with monthly commitments/tiers. (Vendor page references)
  - Residential proxies: Typically billed per GB with volume tiers; monthly plans available. (Vendor page references)
  - Datacenter proxies: Offered as shared or dedicated. Models include per IP/month (often with unlimited traffic) and/or usage-based tiers for shared pools. (Vendor page references)
- Worked scenario for 1M posts/month (illustrative; plug in current list prices from linked pages):
  - Assumptions: 1 request retrieves 1 post (or 1 page yields on average k posts). Average payload per request R KB inclusive of headers; media fetched separately when needed. Retries factored at r%.
  - Scraper API cost ≈ (1,000,000 × (1 + r)) × price_per_successful_request. Validate whether pagination inflates requests per post.
  - Web Unblocker cost ≈ total_transfer_GB × price_per_GB, where total_transfer_GB ≈ ((1,000,000 × R KB) ÷ 1,048,576) plus overhead for anti-bot flows and media.
  - Residential proxies cost ≈ total_transfer_GB × residential_price_per_GB.
  - Datacenter proxies (per IP) cost ≈ monthly_IP_fee × number_of_IPs needed for throughput + any bandwidth fees (if applicable for shared pools).
- Note: Insert actual unit prices from the Oxylabs pricing pages on the date of procurement and annotate with retrieval dates. Avoid relying on third-party price scrapes.

### Reliability & SLA (uptime/SLOs, track record if available)
- Oxylabs publishes uptime/SLA statements for certain products and commits to enterprise-grade support and account management. Look for explicit uptime percentages and remedies on their SLA/legal pages. Treat per-product SLAs as authoritative only where stated in Oxylabs’ legal terms. (See references)
- Operational reliability in practice depends on target stability (X.com defenses) and your retry/backoff strategy. Use observability (success rate, error reason codes, challenge types) to monitor health.

### Compliance posture (ToS alignment, anti‑abuse, data handling)
- Terms: Use must comply with Oxylabs’ Terms of Service and Acceptable Use Policy. Content access must also comply with X/Twitter’s Terms and applicable laws. (See references)
- Data handling & privacy: Review Oxylabs’ Privacy Policy and any data processing addenda for enterprise plans. Confirm data retention windows for request/response logs and whether PII is processed.
- Ethical/Anti‑abuse stance: Oxylabs publishes guidance on ethical web scraping and requires lawful, permitted use cases. Expect KYC/business verification for higher-risk datasets or volumes. (See references)

### Implementation notes (auth, pagination, retries/backoff, sample requests/SDK refs)
- Auth:
  - Scraper APIs: Typically use API credentials (token or basic auth) provided in the dashboard; requests sent to product-specific endpoints. See product docs for headers and body schema.
  - Web Unblocker/Proxies: Authenticate via proxy username/password; route outbound HTTP(S) traffic through the provided proxy endpoint.
- Pagination:
  - For X/Twitter, timeline/search surfaces paginate via cursors. Ensure your client preserves and replays cursors correctly and handles empty-page/end conditions.
- Retries/backoff:
  - Implement idempotent retries with exponential backoff and jitter; cap total attempts and use reason-based retry policies (e.g., only on transient 429/5xx, rotate sessions on 403/bot challenges).
- Sessions & headers:
  - Maintain session affinity when needed (logged-out flows may still be session-sensitive). Randomize headers, preserve cookies where appropriate, and respect cache semantics to reduce load.
- Sample request patterns (refer to official docs for exact endpoints and parameters):
  - Scraper API: POST a job describing the target URL (e.g., a user timeline or search URL), plus rendering flags; poll a job/result endpoint or use callback/webhook.
  - Web Unblocker: Send your normal HTTP request through the Web Unblocker proxy endpoint; include session or sticky parameters when you need continuity.
  - Proxies: Configure your HTTP client to use Oxylabs Residential or Datacenter proxies; rotate IPs/countries per request as needed.
- SDKs & examples: Oxylabs provides examples in multiple languages (Python, JavaScript, cURL) on product and docs pages. Link your implementation runbooks directly to those pages for upkeep.

### References (retrieved 2025-08-24)
- Oxylabs — Pricing (retrieved 2025-08-24): `https://oxylabs.io/pricing`
- Oxylabs — Social Media Scraper API product page (retrieved 2025-08-24): `https://oxylabs.io/products/social-media-scraper-api`
- Oxylabs — Scraper APIs overview (retrieved 2025-08-24): `https://oxylabs.io/products/scraper-apis`
- Oxylabs — Web Unblocker (retrieved 2025-08-24): `https://oxylabs.io/products/web-unblocker`
- Oxylabs — Residential Proxies (retrieved 2025-08-24): `https://oxylabs.io/products/residential-proxies`
- Oxylabs — Datacenter Proxies (retrieved 2025-08-24): `https://oxylabs.io/products/datacenter-proxies`
- Oxylabs — Terms of Service (retrieved 2025-08-24): `https://oxylabs.io/legal/terms-of-service`
- Oxylabs — Acceptable Use Policy (retrieved 2025-08-24): `https://oxylabs.io/legal/acceptable-use-policy`
- Oxylabs — Privacy Policy (retrieved 2025-08-24): `https://oxylabs.io/legal/privacy-policy`
- Oxylabs — Service Level Agreement / SLA (retrieved 2025-08-24): `https://oxylabs.io/legal/service-level-agreement`