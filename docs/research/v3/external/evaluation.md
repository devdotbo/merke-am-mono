## External-Only Provider/OSS Evaluation (v3)

Date: 2025-08-24

Alignment: `agents/framework_methodology`, `framework_weights`, `framework_schema`, `framework_costs`, `framework_compliance`, `framework_risk`, `framework_implementation`.

### Method recap
- Criteria and weights per `framework_weights`:
  - Coverage 0.28, Compliance 0.20, Reliability 0.18, Cost 0.14, Maintenance 0.10, Engineering effort 0.06, Latency 0.04.
- Scoring scale: 0–5 (0 = not supported, 5 = best-in-class). Evidence labels in source reports apply ([Vendor‑claimed] vs [Verified]).
- Sources: Non‑cc reports under `external/agents/*/report.md`. CC versions were ignored per request.

### Rubric notes
- Coverage considers posts/threads/timelines/search/media support and pagination.
- Compliance reflects X.com ToS alignment and regulatory posture; official API preference where applicable.
- Reliability captures stated uptime/SLOs and operational signals; vendor claims marked accordingly.
- Cost uses the 1M posts/month template in `framework_costs`; where prices are unknown, relative cost risk is reflected, not absolute.
- Maintenance/Engineering reflect ongoing churn and initial integration lift, given `framework_implementation` guidance.
- Latency is down‑weighted for batch research per `framework_weights`.

### Weighted scores (summary)

| Provider/OSS | Coverage | Compliance | Reliability | Cost | Maint. | Eng. Effort | Latency | Weighted Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| TwitterAPI.io | 4.0 | 3.5 | 3.0 | 4.5 | 3.5 | 4.0 | 3.5 | 3.78 |
| Apify (Actors) | 3.5 | 2.0 | 3.0 | 4.0 | 3.0 | 4.0 | 3.0 | 3.17 |
| Zyte | 3.5 | 2.0 | 3.5 | 3.5 | 3.0 | 3.5 | 3.0 | 3.10 |
| Bright Data | 3.5 | 2.0 | 3.5 | 4.0 | 3.0 | 3.0 | 3.0 | 3.13 |
| Oxylabs | 3.5 | 2.0 | 3.5 | 3.5 | 3.0 | 3.0 | 3.0 | 3.06 |
| Smartproxy | 3.0 | 2.0 | 3.5 | 3.5 | 3.0 | 3.5 | 3.0 | 2.99 |
| ZenRows | 3.0 | 2.0 | 3.0 | 3.0 | 3.0 | 3.5 | 3.0 | 2.82 |
| Crawlbase | 3.0 | 2.0 | 3.0 | 3.0 | 3.0 | 3.0 | 2.5 | 2.70 |
| ScraperAPI | 2.5 | 2.0 | 2.5 | 3.0 | 3.0 | 3.0 | 2.5 | 2.53 |
| Scrapingdog | 2.0 | 2.0 | 2.5 | 2.5 | 3.0 | 3.5 | 2.5 | 2.39 |
| OSS: twscrape | 4.0 | 1.5 | 2.5 | 4.0 | 2.5 | 2.5 | 2.5 | 2.92 |
| OSS: headless+stealth | 3.5 | 1.5 | 2.5 | 3.0 | 2.5 | 2.5 | 2.0 | 2.55 |
| OSS: snscrape | 2.5 | 1.5 | 2.0 | 5.0 | 2.0 | 3.5 | 3.5 | 2.69 |

Notes:
- Scores are derived from the non‑cc reports’ claims and gaps. Where reports lacked verified numbers, scores reflect risk and uncertainty per `framework_methodology` validation rules.
- Compliance for non‑official approaches is inherently lower given X.com ToS and regulatory considerations in `framework_compliance`.

### Rationale highlights
- TwitterAPI.io ranks highest given broad endpoint coverage and transparent unit pricing with balance‑tiered QPS; compliance is still not official X API, so scored below a hypothetical official route.
- Apify/managed unblockers (Zyte, Bright Data, Oxylabs, Smartproxy) cluster closely; their success depends on JS rendering, proxies, and page yield assumptions. Reliability largely vendor‑claimed; compliance risk persists.
- OSS options offer strong flexibility/cost but lowest compliance and higher maintenance; twscrape leads OSS by coverage and operability with account pools, but carries operational and legal risk.

### Recommendation
- Primary (batch research): TwitterAPI.io for transparent pricing and broad coverage, with strict observability and schema mapping per `framework_schema`.
- Secondary/fallback: Managed unblocker (Zyte or Bright Data) for difficult endpoints; add Apify for rapid pilots where suitable Actors exist.
- OSS fallback: twscrape for authenticated flows when risk accepted; snscrape or headless+stealth for public surfaces with strict rate control and proxy hygiene.

### Implementation notes
- Map all sources to the normalized schema (`framework_schema`). Persist provenance and rate‑limit observations.
- Apply retries with jitter and budget caps (`framework_implementation`).
- Compute costs monthly using the 1M‑posts template; replace placeholders with cited prices from each provider’s pages (`framework_costs`).
- Enforce compliance gates: ToS alignment checks, DPIA/LIA where needed, and deletion handling (`framework_compliance`).

### Risks and mitigations
- Unverified vendor claims on success/SLA: mitigate by pilot benchmarks and dual‑sourcing.
- X UI/API churn: mitigate via adapter layer and conformance tests; keep an OSS fallback on warm standby.
- Cost drift due to retries/overhead: budget buffers and monitor unit costs; tune pagination to maximize items per request.

## Consolidated Evaluation — External‑Only v3 (X/Twitter Access)

Date: 2025‑08‑24

### Executive summary
- **Primary recommendation**: Start with `TwitterAPI.io` for broad coverage and very low unit costs [Vendor‑claimed], fronted by an interface layer and strict observability. Add an **OSS fallback** combining `twscrape` (authenticated) and `Headless + Stealth` for resiliency on critical flows. Gate usage with compliance review.
- **Enterprise alternative**: If you need higher block‑resilience and bring‑your‑own parsing, choose a managed unblocker stack (`Bright Data`/`Oxylabs`/`Zyte`) and operate parsers against X web surfaces; costs scale with JS rendering and residential bandwidth.
- **Actor marketplace**: `Apify` is a fast pilot path; pick actively maintained Actors with per‑item pricing and validate legal posture. Track real costs including proxy/compute.
- **Compliance**: External‑only methods carry ToS/legal risk (see Compliance). Prefer official/licensed APIs where feasible; otherwise restrict to public data, minimize fields, and implement deletion handling.
- **Architecture**: Neutral schema + adapters, source diversification (provider + OSS), budget/rate governance, and quality gates as per framework.

### Scope and sources
This evaluation synthesizes the v3 external agent reports and applies the shared evaluation frameworks (methodology, weights, costs, implementation, compliance, risk). All quantitative vendor figures are labeled Vendor‑claimed unless independently verified in the agent reports (retrieved 2025‑08‑24).

## Comparison matrix (coverage emphasis)

Legend: ✓ strong, ~ partial/mixed, ✗ limited/unclear

| Provider | Coverage (posts/threads/timelines/search/media) | Compliance | Reliability | Cost transparency | Notes |
|---|---|---|---|---|---|
| TwitterAPI.io | ✓ (search, timelines, threads, IDs, followers; QPS tiers) | ~ (unofficial; ToS risk) | ~ (status page; no formal SLA) | ✓ (e.g., $0.15/1k tweets) | Balance‑tiered QPS; small page sizes (~20) [Vendor‑claimed]
| Apify | ✓ (varies by Actor) | ~ (scraping; cookie‑based flows) | ~ (platform solid, actor‑dependent) | ~ (actor/per‑item + platform) | Rapid pilot; choose maintained Actors
| Bright Data | ✓ (web via Unlocker/Browser/proxies) | ~ (scraping; AUP) | ✓ (strong network; enterprise support) | ✓ (starts‑from listed) | You build parsing; JS often required
| Zyte | ✓ (Zyte API/SPM/Browser) | ~ (scraping; AUP) | ✓ (high‑success positioning) | ~ (tiered; per‑request multipliers) | Protected requests can be costly
| Smartproxy | ✓ (Web Scraping API + proxies) | ~ | ~ | ~ | Turnkey unblocking; BYO parsing
| Oxylabs | ✓ (Scraper APIs/Unblocker/proxies) | ~ | ✓ | ~ | Enterprise posture; APIs where available
| Crawlbase | ~ (generic; scroll/JS) | ~ | ~ | ~ | 20 rps/token; 4–10s typical latency [Vendor‑claimed]
| ScraperAPI | ~ (generic; render/async) | ~ | ~ | ✗ (no public $) | 70s timeout guidance [Vendor‑claimed]
| Scrapingdog | ✗ (tweet detail focus) | ~ | ~ | ✗ ($/credit unclear) | 5 credits/tweet [Vendor‑claimed]
| ZenRows | ~ (universal API; JS/proxy multipliers) | ~ | ~ | ✓ (clear multipliers) | 5×–25× for protected pages [Vendor‑claimed]
| RapidAPI sellers | ~ (listing‑dependent) | ✗ (unofficial aggregators) | ✗ (varies by seller) | ✗ (gated) | Pilot only with caution
| OSS: snscrape | ~ (public search/timelines) | ~ | ✗ (fragile to UI changes) | ✓ (free) | Good baseline; best‑effort
| OSS: twscrape | ✓ (auth’d GraphQL/search) | ✗ | ~ | ✓ (free) | Needs account+proxy ops
| OSS: Headless+Stealth | ✓ (full web app) | ✗ | ✗ | ~ (infra+proxies) | Highest control; highest ops

## Weighted decision matrix (framework weights)

Weights (order: coverage, cost, reliability, latency, compliance, engineering_effort, maintenance):
```
[0.28, 0.14, 0.18, 0.04, 0.20, 0.06, 0.10]
```

Scores are 1–5 (5 best), derived from agent reports and qualitative assessments; higher is better.

| Option | Score |
|---|---:|
| TwitterAPI.io | 4.14 |
| Bright Data | 3.43 |
| Oxylabs | 3.41 |
| Apify | 3.35 |
| Zyte | 3.32 |
| Headless + Stealth (OSS) | 3.24 |
| Smartproxy | 3.18 |
| ZenRows | 3.04 |
| ScraperAPI | 3.02 |
| Crawlbase | 3.00 |
| snscrape (OSS) | 2.97 |
| RapidAPI marketplace | 2.81 |
| Scrapingdog | 2.73 |

Interpretation:
- **TwitterAPI.io** ranks highest on coverage and cost; monitor QPS tiers and apply strong guardrails for spend and ToS alignment.
- **Network vendors (Bright Data/Oxylabs/Zyte)** are close behind when weighted for reliability and compliance controls you can negotiate; they require building/maintaining parsers.
- **OSS** is valuable as a cost‑free fallback or for bespoke flows but carries higher operational and compliance risk.

### Cost scenarios (1M posts/month, illustrative)
- **TwitterAPI.io**: $0.15 per 1,000 tweets → ≈ $150/month [Vendor‑claimed; retrieved 2025‑08‑24]. Assumes 1 request → 1 post via batch endpoints or similar efficiency.
- **Apify (example Actor)**: $0.0004 per tweet → ≈ $400/month for 1M items [Vendor‑claimed]. Additional proxy/compute per plan.
- **Bright Data**: Mixed Unlocker + Browser + residential scenario ≈ $138.5/month under optimistic page yield/bytes (example assumptions) [Vendor‑claimed]. Real‑world X often needs more JS/data → budget higher.
- **ZenRows**: If protected pages require JS+premium proxy (25×), 1M requests ≈ $2,500 (pricing‑page example multipliers) [Vendor‑claimed].
- For other providers with gated/opaque pricing, use the framework cost template to recompute once plan rates are known.

### Real‑world user feedback (anecdotal)
- r/DataHoarder (2025‑04): "It seems fine... User tweets are paginated. The tweets/page is very low (20) which makes me a little concerned." [Anecdotal] — `https://www.reddit.com/r/DataHoarder/comments/1jx1iea/xtwitter_scraping_options_2025/`
- r/SaaS (2025‑08): "For X I'm using this one (they have more generous pricing) — https://twitterapi.io/." [Anecdotal] — `https://www.reddit.com/r/SaaS/comments/1mugxr2/what_are_you_building_right_now_ill_find_people/`
- n8n community (2025‑06): "Try twitterapi.io — i used it to parse tweets (...) but now have problem with retweets and custom http node to publish from 2+ accounts." [Anecdotal] — `https://community.n8n.io/t/need-help-scraping-tweets-replies-from-about-10-x-twitter-users-free-api/137455`
- n8n workflow template (2025‑07): Uses `twitterapi.io` for all requests; claims ~3s to fetch a 15‑tweet thread and ≈$0.0027 per 15‑tweet thread. [Community template] — `https://n8n.io/workflows/4088-extract-and-merge-twitter-x-threads-using-twitterapiio/`

## Risk assessment (probability × impact; 1–3 each → R=1–9)

Top risks and mitigations (from framework, adapted):

| Risk | P | I | R | Early signals | Primary mitigations |
|---|---:|---:|---:|---|---|
| Provider policy change/deprecation | 3 | 3 | 9 | Changelog, 4xx/410 spikes | Multi‑vendor adapters; monitor; SLAs; OSS fallback |
| Key suspension/throttling | 3 | 3 | 9 | 401/403/429 ↑ | Key pools; auto‑throttle; budget caps |
| OSS anti‑bot bans | 3 | 3 | 9 | 403/429 bursts | Residential/mobile proxies; stealth; adaptive concurrency |
| Site/API changes (OSS) | 3 | 3 | 9 | Selector/DOM diffs | Contract tests; canaries; fast patch cadence |
| Cost overrun/pricing drift | 2 | 3 | 6 | Unit cost drift | Rate caps; sampling; alerts; reserved pricing |
| Data completeness/schema gaps | 2 | 3 | 6 | Null/enum diffs | Normalize schema; validation; vendor escalation |
| Legal/ToS enforcement | 2 | 3 | 6 | Complaints/notices | Counsel review; scope control; takedowns |

### Mitigation architecture
- **Neutral schema + adapters** mapping all sources into a normalized X/Twitter model with strict validators.
- **Source diversification**: at least two independent collection paths (primary provider + OSS fallback) behind a router.
- **Budget/rate governance**: unit‑cost monitors, spend caps, per‑source rate shaping, automatic pauses.
- **Reliability patterns**: idempotent writes, retries with jitter, circuit breakers, DLQs.
- **Quality gates**: field null/enum checks, dedupe, and sampling vs truth sets.

## Compliance (X.com and privacy)
- **ToS alignment**: Scraping and automated access can violate X.com ToS; prefer official APIs or licensed data where feasible. Avoid bypassing auth/rate limits.
- **Public‑data‑only**: Limit to public content; avoid protected accounts and login walls unless you have rights.
- **Data protection**: Establish lawful basis (e.g., legitimate interests), minimize fields, set retention limits, and implement deletion/DSAR workflows.
- **Jurisdictions**: EU/UK GDPR, US CFAA/contract claims, and other regimes may increase risk; consult counsel.

## Implementation notes (from framework)
- **Auth**: API keys, OAuth where applicable; for OSS/logged‑in flows, manage cookies/tokens safely and rotate.
- **Pagination**: Prefer cursors/high‑water marks; resume from checkpoints.
- **Retries/backoff**: Exponential with jitter; respect `Retry‑After`; idempotency where supported; circuit breakers on sustained failures.
- **Caching**: Request/entity caches; ETag/If‑None‑Match where possible; dedupe per run.
- **Observability**: Structured logs, metrics (success/error/retries/latency), traces; dashboards and alerts on 429s, error spikes, backlog growth.

## Recommendation and next steps
1) **Pilot** `TwitterAPI.io` on a constrained slice (e.g., 50k posts) to validate coverage, cost, and operational signals. Wire to the neutral schema and enable full observability.
2) **Stand up fallback** with `twscrape` for authenticated flows and `Headless + Stealth` for edge cases. Route via a source selector with health/cost signals.
3) **Negotiate a secondary** network vendor (`Bright Data`/`Oxylabs`/`Zyte`) to handle tougher endpoints and provide resilience if the primary degrades.
4) **Governance**: institute spend caps, rate shaping, and compliance guardrails (public‑data‑only; deletion handling).

### References (selection; all retrieved 2025‑08‑24)
- TwitterAPI.io — Pricing, QPS limits, endpoints: `https://twitterapi.io/pricing`, `https://twitterapi.io/qps-limits`, `https://docs.twitterapi.io/`
- Apify — API docs, pricing, store: `https://docs.apify.com/api/v2`, `https://apify.com/pricing`, `https://apify.com/store?query=twitter`
- Bright Data — Pricing/products: `https://brightdata.com/pricing`, `https://brightdata.com/products/web-unlocker`
- Zyte — Pricing/docs (API, SPM, Browser): `https://www.zyte.com/pricing/`, `https://docs.zyte.com/`
- Smartproxy — Pricing/products: `https://smartproxy.com/pricing`, `https://smartproxy.com/products/web-scraping-api`
- Oxylabs — Pricing/products: `https://oxylabs.io/pricing`, `https://oxylabs.io/products/web-unblocker`
- Crawlbase — Crawling API docs: `https://crawlbase.com/docs/crawling-api/`
- ScraperAPI — Docs/pricing: `https://docs.scraperapi.com/`, `https://www.scraperapi.com/pricing`
- Scrapingdog — Twitter API page, docs: `https://www.scrapingdog.com/twitter-scraper-api/`, `https://docs.scrapingdog.com/documentation.md`
- ZenRows — Pricing/docs: `https://www.zenrows.com/pricing`, `https://docs.zenrows.com/`
- RapidAPI — Keys/subscriptions: `https://docs.rapidapi.com/`
- OSS — twscrape: `https://github.com/vladkens/twscrape`; snscrape: `https://github.com/JustAnotherArchivist/snscrape`


