## Risk Assessment — Provider vs OSS (External‑Only)

Date: 2025-08-24

### Methodology and scoring
- **Scale**: Probability (P) and Impact (I) scored as 1=Low, 2=Medium, 3=High.
- **Risk score**: R = P × I (1–9). Higher is worse. Used to rank and prioritize mitigations.
- **Assumptions**: Qualitative assessment based only on `../../shared/context.md`. No external quantitative claims.

### Provider approach (API/vendor)

#### Top risks and mitigations
| Risk | P | I | R | Early signals | Primary mitigations |
|---|---:|---:|---:|---|---|
| API policy change or deprecation | 3 | 3 | 9 | Changelog notices, 4xx/410 spikes | Multi-vendor abstraction; monitor deprecation feeds; contract SLAs; fallback to OSS collector |
| Key suspension / throttling | 3 | 3 | 9 | 401/403/429 rates up; quota exhaustion | Key pool and rotation; backoff/jitter; auto‑throttle; budget caps; pre‑reserved capacity |
| Cost overrun or pricing change | 2 | 3 | 6 | Unit cost drift; unexpected pagination | Rate caps; pre‑estimation with sampling; alerts; reserved/annual pricing negotiations |
| Data completeness / schema gaps | 2 | 3 | 6 | Field null rates; schema diffs | Normalize schema; contract-required fields; validation sampling; vendor escalations; fill via secondary source |
| Latency/SLA breach | 2 | 2 | 4 | P95↑; queue depth↑ | Async queues; retries with idempotency; multi‑region; parallel vendors for hot paths |
| Vendor lock‑in | 2 | 2 | 4 | Tight coupling in code | Interface layer + adapters; mapping to neutral schema; conformance tests |
| Compliance/Privacy misalignment | 1 | 3 | 3 | DPA gaps; ToS deltas | Counsel review; DPA/SCCs; data minimization; purpose limits; deletion workflows |
| Security incident at vendor | 1 | 3 | 3 | Vendor advisories | Least‑privilege keys; rotate secrets; audit logs; contingency disable switch |

#### Immediate control plan
- **Abstraction**: One interface with adapters per provider; map to a neutral content schema.
- **Quotas**: Per‑key and global rate limiters; budget guardrails with hard stops.
- **Reliability**: Circuit breakers; retries with exponential backoff and jitter; dead‑letter queues.
- **Monitoring**: Field-level null tracking, 4xx/5xx rates, P95 latency, unit cost; vendor status webhooks.

### Open‑source approach (self‑managed collectors)

#### Top risks and mitigations
| Risk | P | I | R | Early signals | Primary mitigations |
|---|---:|---:|---:|---|---|
| Anti‑bot detection / IP bans | 3 | 3 | 9 | 403/429 bursts; captcha rate | Residential/mobile proxy rotation; headless‑stealth; randomized think‑time; concurrency caps; fingerprint mgmt |
| Site/API changes break flows | 3 | 3 | 9 | Selector errors; DOM/layout diffs | Contract tests; synthetic monitors; rapid patch cadence; feature flags; canary runs |
| Legal/ToS enforcement risk | 2 | 3 | 6 | DMCA/abuse complaints | Counsel review; ToS‑aligned scope; documented purpose limits; takedown process |
| Throughput ceilings / proxy cost | 3 | 2 | 6 | Queue backlog; proxy spend↑ | Capacity planning; adaptive concurrency; cache/ETag use; cost alerts; off‑peak scheduling |
| Account/cookie invalidation | 2 | 2 | 4 | Auth failures; 2FA prompts | Secret vault; rotation; device binding; session health checks; fallback auths |
| Data correctness/personalization drift | 2 | 2 | 4 | Inconsistencies vs control | Use neutral accounts; deterministic headers; sampling against ground truth; dedupe |
| Operational complexity/on‑call | 2 | 2 | 4 | Pager noise; toil | Full observability (logs/metrics/traces); runbooks; auto‑remediation; clear SLOs |

#### Immediate control plan
- **Resilience**: Rotating proxies, pool hygiene, and adaptive rate control per domain.
- **Quality**: Schema validators; sample-based diffing vs control accounts; de‑personalized fetch profiles.
- **Ops**: Synthetic end‑to‑end checks; golden‑path canaries; structured logs with request IDs; on‑call playbooks.

### Combined risk matrix (3×3 heat, qualitative)
- **High probability & high impact (red)**: Provider policy changes; provider key suspension; OSS anti‑bot bans; OSS site changes.
- **High probability & medium impact (orange)**: OSS throughput/proxy cost.
- **Medium probability & high impact (orange)**: Legal/ToS risks; provider cost spikes; provider data gaps.
- **Medium probability & medium impact (yellow)**: Latency/SLA breach; vendor lock‑in; ops burden; data drift.

### Mitigation architecture (both approaches)
- **Neutral schema + adapters**: All sources map into a single normalized X/Twitter content schema with strict validators.
- **Source diversification**: At least two independent collection paths (e.g., primary provider + OSS fallback) behind a router.
- **Governance**: Data retention limits, PII minimization, access controls, audit logging, and deletion workflows.
- **Budget and rate governance**: Unit‑cost monitors, spend caps, per‑source rate shaping, and automatic pauses.
- **Reliability patterns**: Idempotent writes, retries with jitter, circuit breakers, bulkheads, DLQs.
- **Quality gates**: Field null/enum checks, deduplication, and periodic re‑crawl sampling against truth sets.

### Acceptance criteria
- **Continuity**: Loss of any single source degrades throughput by ≤30% for ≤72h.
- **Quality**: Field null rates within predefined thresholds; duplicates <1% on rolling 24h.
- **Compliance**: Documented ToS/DPAs; deletion and request handling within policy windows.
- **Cost**: Alerting at 50/80/100% of monthly budget; automatic throttle at 100%.
