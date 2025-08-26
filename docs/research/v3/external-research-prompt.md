# External-Only Research Prompt (v2) — produced by Cursor GPT (High-Effort) via MCP servers

Purpose: Produce an independent v2 research report about alternative API solutions for X/Twitter content access without reading any local repository documents. Use only external sources via enabled tools (Tavily MCP remote, Context7, GitHub MCP, and web search). The output should be a clean, self-contained Markdown report with dated citations.

Constraints:
- Do NOT read or reference any local files in this repo or workspace.
- Use ONLY external tools/data sources: Tavily remote MCP, Context7 documentation fetch, GitHub MCP, and generic web search.
- Prefer primary sources and vendor docs; clearly mark vendor-claimed metrics.
- All prices, latencies, and success rates MUST include a retrieval date and a citation URL.
- Avoid unverifiable claims (no hearsay). If uncertain, qualify as "vendor-claimed" or omit.

Scope:
- Providers to evaluate: Apify, Bright Data, Zyte, ScraperAPI, Smartproxy, Oxylabs, Crawlbase, Scrapingdog, ZenRows, TwitterAPI.io, RapidAPI marketplace providers, and open-source baselines (Twscrape, snscrape, Playwright/Puppeteer + stealth). Add others if surfaced by search.
- Capabilities to compare: Coverage (post/thread/timeline/search/media), rate limits, latency, cost model, reliability (SLA/track record), compliance posture, engineering effort, and maintenance.
- Deliverables:
  1) Executive summary with primary recommendation and enterprise alternative
  2) Comparison matrix
  3) Risk assessment table with top risks and mitigations
  4) Weighted decision matrix (state weights explicitly)
  5) Implementation notes: auth, pagination, retries/backoff, sample data model, caching, observability
  6) Compliance section (ToS, GDPR/CCPA/DSA considerations)
  7) References with dated links

Methodology (tools-first, external only):
1) Tavily MCP search:
   - Use queries like: "Apify Twitter X scraper pricing site:docs.apify.com", "Bright Data Twitter scraping pricing", "Zyte Smart Proxy Twitter", "TwitterAPI.io pricing", "Crawlbase Twitter scraping docs".
   - For each provider, extract pricing units (per request/result/credit), rate limits, feature coverage, and any SLA/reliability notes.
2) Context7 docs:
   - Resolve library IDs where relevant (e.g., official SDK docs) and fetch docs for authentication flows, pagination, and SDK usage.
3) GitHub MCP:
   - Search official repos or popular libraries (e.g., twscrape, sns‑scrape, ntscraper) for maintenance status, recent commits, and issue health.
4) Generic web search:
   - Validate major claims with independent sources (benchmarks, case studies). Prefer recent content (≤12 months).

Reporting standards:
- Use a clear matrix with ✓/~/✗ coverage markers.
- Quote costs as ranges and specify plan tiers and units; include a short cost scenario (e.g., 1M posts/month) with assumptions.
- Mark latency as vendor-claimed unless a reproducible, dated third-party benchmark is available.
- Define a normalized post schema and note mapping differences per provider.
- Provide implementation-ready pseudo-code for: Apify run lifecycle, Bright Data proxy usage, and generic retry with exponential backoff.

Compliance guidance:
- Summarize ToS restrictions for scraping X.com and highlight when the official API may be required.
- Note jurisdictional concerns (GDPR DSAR obligations, retention limits) and risk mitigations (public-data-only policy, consent-based collection).

Output format:
- One Markdown document with the sections in Scope/Deliverables, including:
  - Comparison Matrix
  - Risk Matrix (probability×impact) and Top Risks & Mitigations
  - Weighted Decision Matrix with explicit weights
  - Implementation Notes (auth, pagination, backoff, caching, observability)
  - Normalized Data Schema and adapter guidance
  - Compliance Notes
  - References with retrieval dates

Quality checks before finalizing:
- Every quantitative claim has a citation and retrieval date.
- No local file references were used.
- Pricing and availability marked "subject to change" and dated.
- Clearly distinguish "vendor-claimed" vs independently verified.
