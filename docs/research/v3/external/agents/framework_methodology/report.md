## Methodology and Reporting Standards — External‑Only Agents Framework

Date: 2025‑08‑24
Alignment: Shared Context — External‑Only Research (v2)
Scope: Applies to all provider and OSS agent reports under `docs/research/v3/external/agents/*`.

### 1) Scope and constraints (must follow)
- Use only external sources. Allowed tooling: Tavily remote search, Context7 docs, GitHub MCP, and generic web search.
- Do not read local project files other than `docs/research/v3/external/shared/context.md`.
- Do not read or reuse other agents’ folders or outputs.
- Cite every quantitative claim with a URL and retrieval date; explicitly mark claims as [Vendor‑claimed] or [Verified].
- Prefer primary sources (official docs/pricing). Validate major claims using credible third‑party sources when available (≤12 months old).
- Pricing and availability change; include a retrieval date on every price.
- If runtime supports extended context (≥272k tokens), enable it to retain comprehensive source notes during drafting.

### 2) Tools‑first research process
1. Define objectives
   - Enumerate required sections per report type (Provider vs OSS) before searching.
   - List decisive questions that impact recommendation, cost, feasibility, and risk.
2. Plan queries
   - Prepare primary‑source queries (e.g., "Pricing <provider>", "API rate limits <provider>").
   - Prepare validation queries (e.g., "<provider> outage", "<provider> latency benchmark", "review", "independent test").
3. Execute searches (allowed tools only)
   - Prioritize vendor docs, pricing pages, official changelogs, status pages.
   - Seek recent independent validation (benchmarks, reputable blogs, academic/industry writeups ≤12 months).
4. Capture evidence
   - For each finding, record: claim, units, number, URL, retrieval date, and tag ([Vendor‑claimed] or [Verified]).
   - Normalize units while capturing (e.g., requests/second, $/1,000 units).
5. Synthesize
   - Fill the required sections using normalized figures and clearly labeled claims.
   - Note gaps where only vendor claims exist; state verification plan or risk.
6. Review and finalize
   - Run the Acceptance Criteria and Quality Checks below before publishing.

### 3) Reporting standards and required sections
- Provider report (single `report.md` per agent) MUST include:
  - Executive summary and recommendation stance
  - Coverage & features for X/Twitter (post/thread/timeline/search/media)
  - Rate limits and latency (mark [Vendor‑claimed] if not independently verified)
  - Pricing model and tiers with a 1M posts/month scenario (state assumptions)
  - Reliability & SLA (uptime/SLOs, track record if available)
  - Compliance posture (ToS alignment, anti‑abuse, data handling)
  - Implementation notes (auth, pagination, retries/backoff, sample requests/SDK refs)
  - References with retrieval dates
- Open‑source baseline report MUST include:
  - Scope and capabilities, maintenance/health, typical throughput
  - Setup & auth (cookies/tokens as applicable), pagination, retries/backoff
  - Anti‑bot/ban handling; proxy requirements
  - Observability (logging/metrics) and maintenance burden
  - References with retrieval dates
- Formatting
  - Keep executive summaries crisp (≤6 bullets). Put all URLs in the References section.
  - Label every quantitative claim inline with [Vendor‑claimed] or [Verified].
  - Use consistent units and currency (USD) unless a source mandates otherwise.

### 4) Citation standards
- Inline format for prices and numbers: "$2.00 per 1,000 requests (retrieved 2025‑08‑24)".
- Reference list entries: "Provider — Pricing page (retrieved 2025‑08‑24): https://example.com/pricing".
- Always include a retrieval date. Use permalinks when possible; add archived link if volatility is high.
- Tie each inline claim to exactly one reference entry. If a claim aggregates multiple sources, list all relevant references.
- Mark evidence quality next to the claim:
  - [Verified]: Independently validated (credible third‑party ≤12 months) or directly measured by a reproducible test.
  - [Vendor‑claimed]: Only vendor source available or independent evidence is stale/low‑quality.

### 5) Validation rules (vendor‑claimed vs verified)
- Verification thresholds
  - Major decision drivers (coverage, rate limits, latency, pricing, SLA) should be [Verified] where feasible. If not, call out as a risk.
  - Minor details (SDK convenience, optional endpoints) may remain [Vendor‑claimed] if non‑critical.
- Recency
  - Verified evidence must be ≤12 months old. Older sources revert to [Vendor‑claimed] unless reconfirmed.
- Consistency and normalization
  - Convert all rates to standard forms (e.g., requests/second and requests/day), prices to $/1,000 units.
  - Reconcile conflicting numbers; favor primary docs if recent, else latest credible third‑party. Note discrepancies explicitly.
- Reproducibility (where applicable)
  - Document the test outline (inputs, environment, measurement method). If reproduction is not possible externally, state why.

### 6) Acceptance criteria (publish‑ready)
- Completeness
  - All required sections present for the report type (Provider or OSS).
  - Executive summary includes a clear recommendation stance and 3–6 bullets.
- Evidence
  - Every quantitative claim cites a URL with a retrieval date and is labeled [Vendor‑claimed] or [Verified].
  - Major decision drivers have [Verified] evidence or an explicit risk note.
- Cost scenario
  - Includes the 1M posts/month scenario with explicit assumptions and worked math.
- Quality
  - Units and currency normalized; math checked; links resolve.
  - Recency checks pass (≤12 months for verifications). Any older items are flagged.
- Compliance
  - Notes ToS alignment, anti‑abuse posture, and data handling at minimum.

### 7) Quality checks (pre‑publish checklist)
- Link audit: all reference URLs are reachable; use HTTPS where available.
- Date audit: every citation includes a retrieval date; verifications are ≤12 months old.
- Math audit: recompute all totals, averages, and unit conversions.
- Consistency audit: labels [Vendor‑claimed]/[Verified] present and correct; units normalized to standard forms.
- Structure audit: all required sections included and ordered; executive summary is crisp.
- Risk audit: unverified major claims are explicitly called out with mitigation or follow‑up plan.

### 8) Cost scenario template (1M posts/month)
Assumptions to state explicitly:
- What constitutes a billable unit (e.g., request, post, API call, GB).
- Coverage strategy and duplication rate (e.g., % of posts retrieved multiple times due to pagination or polling).
- Error/retry rate and backoff policy; expected over‑fetch overhead.
- Concurrency requirements and any tier‑based limits.
- For OSS: proxy type, proxy cost per GB/request, and success rate.

Template (copy into provider/OSS reports and fill):

| Item | Quantity (per month) | Unit price (USD) | Subtotal (USD) |
|---|---:|---:|---:|
| Base included units | <X> | <included> | 0.00 |
| Overage units | <Y> | $<p per 1,000 units> | = (Y/1,000) * p |
| Requests retries/overhead | <R> | $<p per 1,000> | = (R/1,000) * p |
| Optional add‑ons (e.g., enterprise support) | <qty> | $<price> | <calc> |
| OSS proxies bandwidth/requests | <qty> | $<price> | <calc> |
| Storage/egress (if applicable) | <qty> | $<price> | <calc> |
| Estimated total |  |  | SUM |

Worked example (show your math in report):
- Target: 1,000,000 posts/month
- Assumptions: 1 API call returns 100 posts; 10% retry overhead; price $2.00 per 1,000 requests [Vendor‑claimed]
- Calculation:
  - Required requests ≈ 1,000,000 / 100 = 10,000
  - Retry overhead ≈ 10,000 × 10% = 1,000
  - Billable requests ≈ 11,000 → Cost ≈ (11,000/1,000) × $2.00 = $22.00
- Replace with actual provider/OSS units and prices; cite sources with retrieval dates.

### 9) Implementation notes (what to include in reports)
- Auth: keys/tokens, scopes, session/cookie handling for OSS when applicable.
- Pagination: cursors vs offsets; thread/timeline traversal specifics for X/Twitter.
- Retries/backoff: exponential backoff with jitter; idempotency guidance.
- Sample requests/SDK: minimal example or link to official SDK docs.
- Observability: recommended logs/metrics for throughput, errors, and latency.

### 10) Compliance notes (what to include in reports)
- X.com ToS alignment for data collection and redistribution.
- Anti‑abuse measures (rate compliance, respectful crawling, user privacy).
- Data protection (GDPR/CCPA/DSA) considerations relevant to the solution.

### 11) Risk handling in reports
- Identify top risks (e.g., rate‑limit volatility, ban risk, pricing changes).
- Rate each risk qualitatively or with probability × impact if data permits.
- Provide concrete mitigations (alternative providers, backoff strategies, proxy type changes, caching).

### 12) References section requirements
- List every URL cited with a clear title and retrieval date.
- Group by provider/tool where helpful. Keep inline text light; put details here.

---

Authoring note: This methodology is external‑only. Do not incorporate local code, logs, or other agents’ outputs. All findings must be supported by externally retrievable sources with retrieval dates and explicit [Vendor‑claimed]/[Verified] labels.