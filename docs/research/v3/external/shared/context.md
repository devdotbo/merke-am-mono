### Shared Context — External-Only Research (v2)

Date: 2025-08-24

Scope and constraints:
- Use only external sources. Allowed tooling: Tavily remote search, Context7 docs, GitHub MCP, and generic web search.
- Do not read any local project files except this shared context file.
- Do not read other agents' folders or outputs.
- Cite every quantitative claim with a URL and retrieval date; mark vendor-claimed vs independently verified.
- Pricing and availability are subject to change; include date on every price.
- Prefer primary sources (vendor docs, official pricing pages). Validate major claims with recent third-party sources where available (≤12 months).
- If your runtime supports extended context (≥272k tokens), enable it.

Provider report required sections (single report.md per agent):
- Executive summary and recommendation stance
- Coverage & features for X/Twitter (post/thread/timeline/search/media)
- Rate limits and latency (mark vendor-claimed if not independently verified)
- Pricing model and tiers with a 1M posts/month scenario (state assumptions)
- Reliability & SLA (uptime/SLOs, track record if available)
- Compliance posture (ToS alignment, anti‑abuse, data handling)
- Implementation notes (auth, pagination, retries/backoff, sample requests/SDK refs)
- References with retrieval dates

Open-source baseline report sections:
- Scope and capabilities, maintenance/health, typical throughput
- Setup & auth (cookies/tokens as applicable), pagination, retries/backoff
- Anti-bot/ban handling considerations; proxy requirements
- Observability (logging/metrics) and maintenance burden
- References with retrieval dates

Framework task expectations:
- Methodology: codify process, acceptance criteria, and quality checks
- Normalized schema: propose neutral X/Twitter content schema and mapping notes
- Implementation notes: pseudocode for Apify run, Bright Data proxy usage, generic retry/backoff
- Compliance notes: ToS considerations for X.com, GDPR/CCPA/DSA notes
- Risk assessment: top risks, probability×impact, mitigations
- Cost scenarios: template assumptions and worked example for 1M posts/month
- Weights: decision matrix weights with rationale

Citation format example:
- Text: "$2.00 per 1,000 requests (retrieved 2025‑08‑24)"
- Reference list entry: "Provider — Pricing page (retrieved 2025‑08‑24): https://example.com/pricing"

Output rules:
- Produce exactly one `report.md` in your own directory. Do not write anywhere else.
- Keep summaries crisp; put details and all links in the References section.


