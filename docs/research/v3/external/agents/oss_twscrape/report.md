### twscrape — Open‑Source Baseline (External‑Only)

Date: 2025‑08‑24

### Executive summary and recommendation stance
- twscrape is an actively maintained Python library and CLI that accesses X/Twitter’s private GraphQL and search endpoints using authenticated consumer accounts. It supports async scraping, account pools, and rotation to smooth rate limits. Suitable for research/data collection when you can supply logged‑in accounts and proxies. Not ToS‑safe for official/commercial API compliance.
- Recommendation: viable open‑source baseline for authenticated X data collection when compliance risk is accepted and you can operate an account+proxy pool. Use with robust observability and backoff; expect ongoing maintenance as X changes.

### Scope and capabilities
- Coverage: search (tabs: Latest/Top/Media), tweet details, tweet replies, retweeters/favoriters, users (by id/login), timelines (tweets, tweets+replies, media), followers/following/verified followers/subscriptions, lists (timeline), trends. Returns parsed SNScrape‑style models and/or raw HTTP responses; supports async iteration and a convenience `gather` helper. [README/PyPI]
- Auth model: requires authorized X accounts; supports either cookie‑based auth or interactive login with email IMAP/“manual code” flow. Sessions are saved/restored. [README/PyPI]
- Rate‑limit posture: automatic account switching within a pool to distribute requests across sessions. [README/PyPI]

### Maintenance/health
- Active repo: latest release v0.17.0 (2025‑04‑29) with GraphQL endpoint updates; ongoing tagged releases through 2025. Stars ~1.8k; open issues ~58. Last commit 2025‑04‑29. [GitHub repo, Releases]
- PyPI latest: 0.17.0 published 2025‑04‑29; supports Python 3.10–3.13. [PyPI]

### Typical throughput (qualitative)
- Throughput depends on: number/quality of logged‑in accounts, proxy pool, and X’s dynamic rate limits. The library’s async design and account rotation enable concurrent scraping; some endpoints (e.g., tweet replies) expose small server‑side page sizes, limiting per‑request yield. Plan capacity around concurrent accounts rather than per‑account RPS. [README/PyPI]

### Setup & auth
- Install: `pip install twscrape`. [PyPI]
- Accounts DB: local SQLite (`accounts.db` by default). [README/PyPI]
- Add accounts (CLI): `twscrape add_accounts <file> <format>` with columns `username:password:email:email_password:_:cookies` (cookies optional if doing live login). [README/PyPI]
- Login: `twscrape login_accounts` (supports IMAP‑based email code retrieval) or `--manual` to enter codes; cookies‑only accounts do not require login. [README/PyPI]
- Programmatic: `API()` then `api.pool.add_account(..., cookies="abc=..; ct0=..")` or with credentials; `await api.pool.login_all()` persists cookies for reuse. [README/PyPI]

### Pagination
- API methods are async generators; pass `limit` to cap total yielded items. `search`, `followers`, `following`, `user_tweets`, etc., paginate automatically until `limit` or exhaustion. [README/PyPI]
- Some endpoints have small server‑enforced page sizes (e.g., tweet replies “~few per page” noted in docs), which constrains throughput per request. [README/PyPI]

### Retries and backoff
- Library behavior: release notes mention improved handling of network failures; README highlights automatic account switching on rate limits. Explicit retry/backoff policy is not documented. [Releases, README/PyPI]
- Implementation guidance: add caller‑side exponential backoff with jitter on HTTP 429/5xx, and treat auth challenges as signals to rotate accounts, re‑login, or cool down the affected session.

### Anti‑bot/ban handling and proxy use
- Requires authenticated sessions; provider docs recommend cookie‑based accounts as “more stable” than live login. Proxies are recommended to avoid IP‑based restrictions. Expect occasional re‑verification and bans; plan to replenish accounts. [README/PyPI]
- Operational tips (general):
  - Rotate residential/mobile proxies; keep session affinity (stick a session to an IP until it fails).
  - Randomize think times; avoid bursty patterns; spread workloads across accounts.
  - Monitor for 401/403/302 to login pages; quarantine and re‑login accounts as needed.

### Observability
- Built‑in logging: `twscrape.logger.set_log_level("DEBUG")`. [README/PyPI]
- CLI introspection: `twscrape accounts` shows `logged_in`, `active`, `last_used`, `total_req`, `error_msg` per account; useful for live pool health. [README/PyPI]
- Suggested additions: wrap calls with metrics (success/error counts, 429s, per‑account request counters, latency histograms) and structured logs capturing endpoint, account id, proxy id, HTTP status, retry count.

### Maintenance burden
- Medium: X frequently changes GraphQL endpoints and anti‑bot measures; the project has been keeping pace via releases in 2025, but you should expect breakages requiring dependency updates and occasionally updating account/proxy ops. Operating a healthy account pool (creation, re‑login, cookie refresh) is the dominant cost.

### References (retrieved 2025‑08‑24)
- GitHub — twscrape repository: `https://github.com/vladkens/twscrape`
- GitHub — Releases v0.17.0: `https://github.com/vladkens/twscrape/releases/tag/v0.17.0`
- GitHub — API repo metadata (stars/issues/updated): `https://api.github.com/repos/vladkens/twscrape`
- GitHub — Latest commit API: `https://api.github.com/repos/vladkens/twscrape/commits?per_page=1`
- PyPI — twscrape project page (version, classifiers, README): `https://pypi.org/project/twscrape/`