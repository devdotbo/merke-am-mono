### Apify — X/Twitter Access (External‑Only)

#### Executive summary and recommendation
- **Summary**: Apify provides a marketplace of prebuilt "Actors" for X/Twitter scraping and a managed platform (API, SDKs, proxy, storage). It’s fast to pilot and operationally convenient, but data access depends on third‑party scrapers and often requires user cookies/auth tokens. Platform API rate limits are generous; latency depends on Actor design and run scheduling.
- **Stance**: **Viable for non‑official access** when compliance risk is acceptable and volume/costs are modeled carefully. Prefer Actors with clear per‑item pricing and active maintenance.

#### Coverage & features
- **Entity coverage** (varies by Actor):
  - **Users/follow graphs**: followers, following, subscriptions lists (requires cookies) [vendor docs; Actor page] (retrieved 2025‑08‑24)
    - `curious_coder/twitter-scraper` — followers/following/subscriptions, cursor support, min/max delay options, proxy input, dataset outputs. Pricing: $29/month + usage.
    - Source: `https://apify.com/curious_coder/twitter-scraper.md`
  - **Search/timelines/threads/media** (by keyword/hashtag, with filters) [vendor docs; Actor page] (retrieved 2025‑08‑24)
    - `epctex/twitter-search-scraper` — search with language, verification filters, media filters, min interactions, geo, date ranges; proxy input; outputs tweets and conversation context. Pricing: $20/month + usage.
    - Source: `https://apify.com/epctex/twitter-search-scraper.md`
  - **Other Twitter/X Actors** (fixed/monthly or per‑item pricing exist; selection matters) (retrieved 2025‑08‑24)
    - Store search shows additional X/Twitter Actors, including fixed‑price and per‑item models.
    - Source: `https://apify.com/store?query=twitter`
- **Result delivery**: Dataset items via Apify API v2; outputs retrievable as JSON with pagination (`limit`, `offset`) [vendor docs] (retrieved 2025‑08‑24)
  - Source: `https://docs.apify.com/api/v2`

#### Rate limits and latency
- **API platform limits (vendor‑claimed)** [retrieved 2025‑08‑24]:
  - Global: 250,000 requests/minute per user (authenticated) or per IP (unauthenticated).
  - Default per‑resource: 30 requests/second per resource (higher on selected endpoints: up to 200 rps for run/task and dataset push, 100 rps for KV store CRUD).
  - Exponential backoff recommended on HTTP 429.
  - Source: `https://docs.apify.com/api/v2` → Rate limiting.
- **Latency**:
  - Actor synchronous run endpoint waits up to 300s; longer runs require polling or async flow (vendor‑claimed). Source: `https://docs.apify.com/api/v2` (retrieved 2025‑08‑24).
  - End‑to‑end latency depends on the specific Actor (start queue, navigation, throttling, proxies). No independent benchmarks found; treat performance claims as vendor‑ or seller‑claimed.

#### Pricing and 1M posts/month scenario
- **Pricing models observed** (Actor‑specific; retrieved 2025‑08‑24):
  - Flat monthly fee + usage (e.g., $29/month + usage for `curious_coder/twitter-scraper`). Source: `https://apify.com/curious_coder/twitter-scraper.md`.
  - Flat monthly (some “unlimited” offerings), or **per dataset item** pricing for tweets on certain Actors (store listings). Source: `https://apify.com/store?query=twitter`.
- **Platform**: Additional Apify platform charges may apply (compute units, storage, proxy transfer). See pricing page for plan limits and proxy costs. Source: `https://apify.com/pricing` (retrieved 2025‑08‑24).
- **Worked example (assumptions clearly stated; vendor‑claimed where applicable)**:
  - Assumptions:
    - Choose a per‑item Twitter/X Actor advertised at $0.0004 per tweet (observed in store listing metadata; vendor‑managed listing). Source: `https://apify.com/store?query=twitter` (retrieved 2025‑08‑24).
    - 1 page ≈ 20 tweets; 50 pages/thread; but cost is per tweet, so pagination overhead doesn’t change item costs.
    - 5% retries/backoffs; 95% success rate; per‑item billing counts only successful items (typical store semantics; confirm on chosen Actor)
    - Excludes proxy bandwidth, compute units, and storage transfer (variable by run and plan).
  - Calculation:
    - 1,000,000 tweets × $0.0004/tweet = **$400.00**/month (Actor data item fees).
  - Notes: Add Apify proxy bandwidth and compute units per plan; these vary by plan and proxy type. Validate on `https://apify.com/pricing`.

#### Reliability & SLA
- **Status page**: Public incident/uptime history available. No explicit public uptime SLA stated on status page. Source: `https://status.apify.com` (retrieved 2025‑08‑24).
- **Trust Center**: Security/compliance documentation via vendor portal (access‑controlled). Source: `https://trust.apify.com` (retrieved 2025‑08‑24).
- **Terms**: General terms disclaim platform liability; no guaranteed SLA in public terms. Source: `https://docs.apify.com/legal/general-terms-and-conditions` (retrieved 2025‑08‑24).

#### Compliance posture
- **ToS alignment**: Many Twitter/X Actors require authenticated cookies or tokens and scrape content outside official X APIs. This can conflict with X.com’s Terms of Service and robots rules; customers are responsible for lawful use. Source: Apify General Terms (Sections 5, 10, 11) `https://docs.apify.com/legal/general-terms-and-conditions` (retrieved 2025‑08‑24).
- **Data handling**: Results stored in Apify datasets/Key‑Value Stores; access controlled by API token (Bearer) [vendor docs] (retrieved 2025‑08‑24). Source: `https://docs.apify.com/api/v2` → Authentication.
- **Security**: Trust Center provides security posture documentation (e.g., certifications, policies) through Vanta portal; details may require NDA/portal access. Source: `https://trust.apify.com` (retrieved 2025‑08‑24).

#### Implementation notes
- **Auth**:
  - Apify API: Bearer token in `Authorization: Bearer <token>` or `?token=` (less secure). Source: `https://docs.apify.com/api/v2` (retrieved 2025‑08‑24).
  - Actor‑level: Some Twitter Actors require `cookie`/`authTokens` inputs; follow Actor instructions (e.g., export browser cookies via extension). Sources: `https://apify.com/curious_coder/twitter-scraper.md`, `https://apify.com/epctex/twitter-search-scraper.md` (retrieved 2025‑08‑24).
- **Pagination**:
  - Platform API: list endpoints use `limit`/`offset` (and dataset listItems) with max enforced by endpoint. Source: `https://docs.apify.com/api/v2` (retrieved 2025‑08‑24).
  - Actor I/O: Twitter Actors often expose cursor/`maxItems`; read each Actor’s schema (e.g., `cursor`, `count` on `curious_coder/twitter-scraper`; `maxItems` on `epctex/twitter-search-scraper`).
- **Retries/backoff**:
  - Follow Apify guidance for exponential backoff on 429; SDKs implement backoff automatically. Source: `https://docs.apify.com/api/v2` → Rate limiting (retrieved 2025‑08‑24).
- **SDK usage**:
  - JS Client quick pattern: initialize `ApifyClient(token)`, `client.actor("<actor>").call(input)`, then `client.dataset(id).listItems()`. Source: `https://docs.apify.com/api/client/js/` (retrieved 2025‑08‑24).
  - Python Client: similar flow with `ApifyClient(token)` and `client.actor("<actor>").call(...)`. Source: `https://docs.apify.com/api/client/python/` (retrieved 2025‑08‑24).
- **Proxy**:
  - Most Twitter Actors recommend residential proxies; specify via `proxy` input (e.g., `useApifyProxy`, groups). Validate bandwidth costs on pricing page. Sources: Actor pages; `https://apify.com/pricing` (retrieved 2025‑08‑24).

#### References (retrieved 2025‑08‑24)
- Apify API v2 — Authentication, Pagination, Rate limiting (vendor‑claimed): `https://docs.apify.com/api/v2`
- Apify JS API client docs: `https://docs.apify.com/api/client/js/`
- Apify Python API client docs: `https://docs.apify.com/api/client/python/`
- Apify pricing (plans, proxy, usage): `https://apify.com/pricing`
- Apify Store search (Twitter Actors, pricing models): `https://apify.com/store?query=twitter`
- Actor: Twitter followers scraper — `curious_coder/twitter-scraper` (features, inputs, $29/month + usage): `https://apify.com/curious_coder/twitter-scraper.md`
- Actor: Twitter Search Scraper — `epctex/twitter-search-scraper` (features, inputs, $20/month + usage): `https://apify.com/epctex/twitter-search-scraper.md`
- Apify General Terms and Conditions: `https://docs.apify.com/legal/general-terms-and-conditions`
- Apify Trust Center (security/compliance portal): `https://trust.apify.com`
- Apify Status page: `https://status.apify.com`