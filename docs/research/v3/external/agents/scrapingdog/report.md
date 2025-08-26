### Executive summary and recommendation stance
Scrapingdog offers an external Twitter/X scraping API that returns tweet engagement metadata (views, retweets, likes, bookmarks) and handle info in JSON by passing tweet URLs. It uses a credit-based model (Twitter API = 5 credits/request) with automatic retries and concurrency limits. Good fit for lightweight tweet-detail extraction at moderate scale if credit pricing is favorable; limited transparency on $ pricing and formal rate limits. Proceed if price-per-credit is acceptable; otherwise compare to providers with clearer cost disclosures.

### Coverage & features for X/Twitter (posts/threads/timelines/search/media)
- Tweet details: Extracts views, retweets, likes, bookmarks, and the Twitter handle; JSON output claimed on the product page (vendor-claimed) [Twitter Scraper API page].
- Access pattern: Vendor markets “pass the tweet URL and get JSON” (vendor-claimed). No public docs page shows thread/timeline/search/media endpoints; scope appears centered on tweet-level extraction.

Citations:
- Vendor page text indicates supported fields and JSON output (retrieved 2025‑08‑24): https://www.scrapingdog.com/twitter-scraper-api/

### Rate limits and latency
- Automatic retry behavior: Requests are retried up to 60 seconds; if all retries fail within 60s, API returns 410. Only successful 200/404 responses are charged (vendor docs) (vendor‑claimed) (retrieved 2025‑08‑24): https://docs.scrapingdog.com/documentation.md
- Concurrency: Exceeding plan’s concurrent connection limit returns 429 (vendor‑claimed) (retrieved 2025‑08‑24): https://docs.scrapingdog.com/documentation.md
- Free plan overage: No overage; >1000 requests/month returns 403 on free plan (vendor‑claimed) (retrieved 2025‑08‑24): https://docs.scrapingdog.com/documentation.md
- Latency: No specific p50/p95 published. Effective per‑request ceiling ~60s due to retry window (vendor‑claimed) (retrieved 2025‑08‑24): https://docs.scrapingdog.com/documentation.md

### Pricing model and tiers with a 1M posts/month scenario (assumptions stated)
- Credit model: Twitter Scraper API costs 5 credits per request (vendor docs) (retrieved 2025‑08‑24): https://docs.scrapingdog.com/documentation.md
- Free credits: “Get 1000 free credits” (retrieved 2025‑08‑24): https://www.scrapingdog.com/
- Public $ pricing: Not published on a static pricing page we could retrieve. The homepage uses an in‑page “Pricing” section that did not render to static fetch; no /pricing page exists (404 when tested). Treat $/credit as unknown; confirm with sales or the dashboard.

1M tweets/month cost example (credit basis):
- Credits required: 1,000,000 tweets × 5 credits/tweet = 5,000,000 credits/month.
- Dollar cost sensitivity (assumptions; illustrative only):
  - If $1.00 per 1,000 credits: ≈ $5,000/month
  - If $2.00 per 1,000 credits: ≈ $10,000/month
  - If $3.00 per 1,000 credits: ≈ $15,000/month
Note: Replace the $/1k credits figure with Scrapingdog’s actual plan pricing when available.

### Reliability & SLA (uptime/SLOs)
- SLA page is published (content not numerically specific in our fetch) (retrieved 2025‑08‑24): https://www.scrapingdog.com/sla/
- Public status page (UptimeRobot) (retrieved 2025‑08‑24): https://stats.uptimerobot.com/SAQkQwbOYj
- Automatic retries up to 60s for difficult sites; 410 on timeout; only successful 200/404 charged (vendor‑claimed) (retrieved 2025‑08‑24): https://docs.scrapingdog.com/documentation.md

### Compliance posture (ToS alignment, anti‑abuse, data handling)
- Terms of Service (retrieved 2025‑08‑24): https://www.scrapingdog.com/terms/
- Privacy Policy (retrieved 2025‑08‑24): https://www.scrapingdog.com/privacy/
- GDPR/DPAs (retrieved 2025‑08‑24): https://www.scrapingdog.com/gdpr/ and https://www.scrapingdog.com/data-processing-agreement/
- X/Twitter ToS: Scraping Twitter content may be restricted; ensure you have rights to access/process the data and that usage complies with X Terms, robots directives, and applicable law. Implement rate control, respect robots and auth walls, and avoid collecting sensitive personal data without lawful basis.

### Implementation notes (auth, pagination, retries/backoff, sample requests/SDK refs)
- Auth: API key in requests (retrieved 2025‑08‑24): https://docs.scrapingdog.com/documentation.md
- Base URL: https://api.scrapingdog.com/ (retrieved 2025‑08‑24): https://docs.scrapingdog.com/documentation.md
- Pattern: Forward the target URL (tweet URL) to the API along with your API key; API returns HTML/JSON depending on the specific product (vendor‑claimed) (retrieved 2025‑08‑24): https://docs.scrapingdog.com/documentation.md and https://www.scrapingdog.com/twitter-scraper-api/
- Concurrency/backoff: If you receive 429, reduce concurrency or upgrade plan. Implement exponential backoff with jitter. Treat 410 as retriable (after short delay), up to your own SLA.
- Timeout: Allow up to 60s per request to accommodate the provider’s internal retries (vendor‑claimed) (retrieved 2025‑08‑24): https://docs.scrapingdog.com/documentation.md
- Example (illustrative HTTP GET):
  - GET https://api.scrapingdog.com/?api_key=YOUR_KEY&url={ENCODED_TWEET_URL}
  - Handle 200 (JSON/HTML per endpoint), 404 (charged), 410 (timeout; not charged; retry), 429 (backoff), 403 (plan limit), 401 (auth).
- Docs hub (retrieved 2025‑08‑24): https://docs.scrapingdog.com/

### References (retrieved 2025‑08‑24)
- Scrapingdog — Twitter Scraper API page (features, JSON claim): https://www.scrapingdog.com/twitter-scraper-api/
- Scrapingdog — Documentation (API behavior, errors, concurrency, credits; includes Twitter = 5 credits): https://docs.scrapingdog.com/documentation.md
- Scrapingdog — Homepage (free 1000 credits): https://www.scrapingdog.com/
- Scrapingdog — SLA: https://www.scrapingdog.com/sla/
- Scrapingdog — Terms of Service: https://www.scrapingdog.com/terms/
- Scrapingdog — Privacy Policy: https://www.scrapingdog.com/privacy/
- Scrapingdog — GDPR: https://www.scrapingdog.com/gdpr/
- Scrapingdog — Status page: https://stats.uptimerobot.com/SAQkQwbOYj
