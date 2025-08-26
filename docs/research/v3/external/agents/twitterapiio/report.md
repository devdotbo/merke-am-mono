### TwitterAPI.io — Provider Research (External‑Only)

#### Endpoint coverage
- **Search**: Advanced search for tweets with filters and cursor pagination; up to ~20 results per page. See `Tweet Advanced Search`.
- **User timelines**: Recent tweets by user, paginated (up to ~20 per page). See `Get User Last Tweets`.
- **Threads & conversations**: Thread/context retrieval, replies, quotes, retweeters. See `Get Tweet Thread Context`, `Get Tweet Reply`, `Get Tweet Quote`, `Get Tweet Retweeter`.
- **Tweets & users**: Batch/get tweets by IDs; get user by username; batch get users by IDs.
- **Followers/graph**: Followers and followings endpoints.
- **Lists & communities**: List members/followers; community info/members/moderators; join/leave community (v2).
- **Write actions**: Create tweet (v1/v2), like/unlike (v2), retweet/unretweet (v2), upload tweet image, send DM (v2).
- **Webhooks & auth**: Webhook rules (add/update/delete/list); API‑key auth (no OAuth required) and login endpoints for account workflows.

Key docs:
- `Tweet Advanced Search`: https://docs.twitterapi.io/api-reference/endpoint/tweet_advanced_search
- `Get User Last Tweets`: https://docs.twitterapi.io/api-reference/endpoint/get_user_last_tweets
- `Get Tweet Thread Context`: https://docs.twitterapi.io/api-reference/endpoint/get_tweet_thread_context
- `Get Tweets by IDs`: https://docs.twitterapi.io/api-reference/endpoint/get_tweet_by_ids
- `Get User by Username`: https://docs.twitterapi.io/api-reference/endpoint/get_user_by_username
- `Get User Followers`: https://docs.twitterapi.io/api-reference/endpoint/get_user_followers

#### Limits and quotas
- **QPS (queries per second) scales with account balance (credits):**
  - ≥ 1,000 credits: 3 QPS
  - ≥ 5,000 credits: 6 QPS
  - ≥ 10,000 credits: 10 QPS
  - ≥ 50,000 credits: 20 QPS
- Notes:
  - Marketing claims “no limits,” but effective throughput is governed by balance‑tiered QPS caps.
  - Pagination sizes are typically up to ~20 items per page on timeline/search endpoints.

Source: QPS Limits page — https://twitterapi.io/qps-limits

#### Pricing
- **Pay‑as‑you‑go; no minimum spend** (vendor language).
- Indicative unit prices (docs):
  - $0.15 per 1,000 tweets
  - $0.18 per 1,000 user profiles
  - $0.15 per 1,000 followers
  - Minimum charge: $0.00015 per request (even if no data returned)
- **Discounts**: “Special offer” pricing for students and research institutions (per docs intro).

Sources:
- Pricing page — https://twitterapi.io/pricing
- Docs intro (pricing bullets) — https://docs.twitterapi.io/introduction

#### Latency and SLAs
- **Latency**: No explicit numeric latency (ms) guarantees found in public docs/pages reviewed.
- **SLA/Uptime**: Public status page is provided; no formal SLA percentage stated on docs/pages reviewed.

Sources:
- Homepage/docs reviewed for latency claims — https://twitterapi.io
- Status page — https://twitterapi.io/status

#### Reliability and operational signals
- **Status page** shows component status and recent incident timeline; subscription options available.
- Docs emphasize “high QPS” and “high‑performance,” but without quantitative SLO/SLA commitments.

#### Notes and caveats
- Per‑request minimum charge applies even on empty results; batch endpoints are recommended to optimize cost where available (e.g., batch user lookups).
- For frequent real‑time monitoring of many accounts, vendor suggests webhook/websocket workflows over naive polling of timeline endpoints (see docs/blog).

---

#### References
- Docs home: https://docs.twitterapi.io
- API reference sitemap (endpoints list): https://docs.twitterapi.io/sitemap.xml
- Advanced search: https://docs.twitterapi.io/api-reference/endpoint/tweet_advanced_search
- User timeline (last tweets): https://docs.twitterapi.io/api-reference/endpoint/get_user_last_tweets
- Thread context: https://docs.twitterapi.io/api-reference/endpoint/get_tweet_thread_context
- Get tweets by IDs: https://docs.twitterapi.io/api-reference/endpoint/get_tweet_by_ids
- Get user by username: https://docs.twitterapi.io/api-reference/endpoint/get_user_by_username
- Followers: https://docs.twitterapi.io/api-reference/endpoint/get_user_followers
- QPS limits: https://twitterapi.io/qps-limits
- Pricing: https://twitterapi.io/pricing
- Authentication: https://docs.twitterapi.io/authentication
- Status: https://twitterapi.io/status
