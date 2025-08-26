You are running inside Cursor Agent CLI (headless).
Repository root: /home/user/git/2025_2/wavehack/merke-am/merke-am-landing
Agents root: /home/user/git/2025_2/wavehack/merke-am/merke-am-landing/docs/research/v3/external/agents
Working directory: /home/user/git/2025_2/wavehack/merke-am/merke-am-landing/docs/research/v3/external/agents/apify
Write exactly one file named report.md into this directory: /home/user/git/2025_2/wavehack/merke-am/merke-am-landing/docs/research/v3/external/agents/apify
Do not ask about paths; you already know them. Proceed to complete the task per the prompt below.
---
### Provider Research Prompt — Apify (External‑Only)

Read: `../../shared/context.md` only. Do not read other agents.

Goal: Produce `report.md` (in this folder) covering Apify as an alternative for X/Twitter content access.

Must include sections defined in the shared context: coverage/features, rate limits & latency, pricing with a 1M posts/month scenario, reliability/SLA, compliance posture, implementation notes (auth, pagination, retries/backoff, SDK), and references with retrieval dates.

Tooling: Tavily remote search, Context7 for SDK docs, GitHub MCP for repos/issues; generic web search as needed. No other local files.

Priorities:
- Prefer Apify primary sources (docs.apify.com, apify.com/pricing, Apify SDK/Actors docs) and official blog/engineering posts.
- Mark latency as vendor-claimed unless third-party benchmarks exist.
- State assumptions for the cost scenario (pages per thread, posts per page, retries, success rate).

Suggested queries:
- "site:docs.apify.com twitter OR x.com scraper pricing"
- "site:apify.com pricing"
- "Apify Twitter scraper actor pricing site:apify.com"
- "Apify SDK pagination Twitter"
- "Apify rate limits SLA uptime"

Deliverable: `report.md` in this directory, with dated citations and a References section.
