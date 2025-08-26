## Executive summary and recommendation stance

RapidAPI’s public marketplace lists multiple unaffiliated sellers offering "Twitter/X" data access via unofficial endpoints. Two current examples are "Twttr API" (publisher: davethebeast) and "The Old Bird" (publisher: datahungrybeast). Listings emphasize broad coverage (search, timelines, tweet/user details) and fast responses but provide limited public details on rate limits, latency, and SLAs without logging in. Pricing is typically plan‑based per request on RapidAPI, but exact tiers for these sellers are not publicly visible.

- Recommendation: proceed only with a tightly scoped pilot and compliance review. Prefer the official X API where feasible for ToS alignment; use RapidAPI sellers as last‑resort for non‑account, public‑content use cases with clear risk acceptance, rotating infrastructure, and strict observability.


### Coverage & features for X/Twitter (post/thread/timeline/search/media)

- Twttr API (davethebeast) — vendor‑claimed: endpoints for tweet details; user followers/followings; likes, comments, quoted tweets, retweets; search (top/latest/videos/photos/people); user tweets/replies/media/likes; lookup by username or ID; autocomplete.
  - Source (vendor page excerpt): see References.
- The Old Bird (datahungrybeast) — vendor‑claimed: similar coverage: tweet details; followers/followings; engagements; search (top/latest/videos/photos/people); user tweets/replies/media/likes; profile info by username or ID.
  - Source (vendor page excerpt): see References.

Notes: Neither listing exposes schema guarantees or thread/Conversation API semantics publicly; expect HTML/JSON parsed responses subject to X UI changes.


### Rate limits and latency (vendor‑claimed vs verified)

- Twttr API — no public numeric rate limits or latency on the unauthenticated listing. Vendor references general capability but no ms/SLA figures. (vendor‑claimed: N/A)
- The Old Bird — no public numeric rate limits or latency on the unauthenticated listing. (vendor‑claimed: N/A)
- Platform note: RapidAPI plans often enforce per‑minute/day quotas per subscription; specifics require login/subscription. See RapidAPI "Subscriptions" docs.

Independently verified latency: not verified.


### Pricing model and tiers with a 1M posts/month scenario (state assumptions)

- Public pricing for the two reviewed sellers is not visible without login (pricing tab gated). Therefore, no vendor‑quoted numbers can be cited here.
- Typical RapidAPI marketplace pricing patterns: per‑request quotas by plan (Free/Basic/Pro/Ultra), overage per extra request. Concrete rates vary by seller and endpoint. See RapidAPI documentation on subscriptions/usage.

1M‑posts scenario (assumptions for planning only; not vendor‑quoted):
- Assumptions:
  - Collection requires 1 request per post on average (varies 0.5–3.0 depending on endpoint pagination and expansions).
  - Price per 1,000 requests could range materially across sellers; run a sensitivity analysis once actual plan pages are accessible.
- Cost template:
  - Requests = 1,000,000 posts × requests_per_post.
  - Cost = (Requests / 1,000) × price_per_1k.
- Action: obtain exact plan pages after creating an account, then recompute costs with the above template.


### Reliability & SLA (uptime/SLOs, track record)

- Twttr API — listing shows recent activity ("Updated 1 month ago" on publisher’s profile). No SLA/uptime figures published on public page.
- The Old Bird — publisher profile indicates recent updates ("Updated 2–3 months ago"). No SLA/uptime figures published on public page.
- Platform: RapidAPI provides marketplace plumbing but individual sellers’ uptime/quality varies; no hub‑wide SLA guarantees for third‑party APIs.

Reliability signals to check post‑login: plan quotas, error rate guidance, retry headers, status page links, community Q&A/reviews.


### Compliance posture (ToS alignment, anti‑abuse, data handling)

- X.com ToS and automation rules generally prohibit scraping and unauthorized data access. Marketplace sellers appear to use unofficial methods; data collection should treat content as public but still consider rights of data subjects and platform policies.
- Risks: endpoint breakage due to UI changes; IP blocking; account penalties if logged‑in scraping is attempted; potential contractual issues if terms are violated.
- Data protection: if any personal data is processed, ensure GDPR/CCPA compliance (lawful basis, minimization, retention limits). Avoid collection of sensitive categories.


### Implementation notes (auth, pagination, retries/backoff, sample requests/SDK refs)

- Auth via RapidAPI headers:
  - `X-RapidAPI-Key: <your_app_key>` (account/app‑scoped)
  - `X-RapidAPI-Host: <api-specific-host>`
  - Reference: RapidAPI keys and rotation guide.
- Pagination: sellers typically expose cursor/`next_token`‑style parameters; expect variable limits per endpoint. Validate per‑endpoint docs once subscribed.
- Retries/backoff: implement exponential backoff on 429/5xx; respect any `Retry-After` headers returned by RapidAPI gateway or upstream.
- Observability: log request IDs, status codes, and quota headers to trace overage events; alert on sustained 4xx/5xx.
- Sample (cURL skeleton):

```bash
curl --request GET \
  --url "https://<provider-host>/endpoint?query=..." \
  --header "X-RapidAPI-Key: $RAPIDAPI_KEY" \
  --header "X-RapidAPI-Host: <provider-host>"
```


### References with retrieval dates

- Twttr API — provider profile (vendor description; updated 1 month ago) — (retrieved 2025‑08‑24): `https://rapidapi.com/user/davethebeast`
- The Old Bird — provider profile (vendor description; updated 2–3 months ago) — (retrieved 2025‑08‑24): `https://rapidapi.com/user/datahungrybeast`
- RapidAPI — API Keys / Key Rotation (auth header conventions) — (retrieved 2025‑08‑24): `https://docs.rapidapi.com/docs/keys-and-key-rotation`
- RapidAPI — Subscriptions (plans/usage concepts) — (retrieved 2025‑08‑24): `https://docs.rapidapi.com/docs/subscriptions`
- RapidAPI Hub search (X/Twitter related listings; marketplace overview page) — (retrieved 2025‑08‑24): `http://rapidapi.com/search/x%20twitter`

Notes:
- Many RapidAPI listing pages (including pricing tabs) require login/CAPTCHA; quantitative pricing/latency details could not be independently verified without authentication at the time of retrieval. Once access is granted, capture exact plan names, monthly quotas, per‑request overage, and any vendor‑claimed latency/SLA to update this report.
