### Framework Decision Matrix Weights — External‑Only (v2)

Date: 2025‑08‑24

This weighting prioritizes outcomes for an external‑only approach to X/Twitter data acquisition under the constraints in `../../shared/context.md`. Emphasis is placed on legal/compliance safety, breadth of coverage across required surfaces, and operational reliability at scale (e.g., 1M posts/month scenarios), with latency and initial engineering effort de‑emphasized relative to batch‑oriented research workflows.

#### Criteria and rationale
- **Coverage**: Ability to capture required X/Twitter surfaces (posts, threads, timelines, search, media) with appropriate metadata and rate limits. Missing surfaces forces costly workarounds or vendor hopping.
- **Cost**: Total cost of ownership at typical volumes (e.g., 1M posts/month), including egress, add‑ons, and overage exposure.
- **Reliability**: Uptime/SLOs, delivery consistency, robustness to API/HTML changes, and backfill success under retries.
- **Latency**: End‑to‑end time to acquire and deliver data. Less critical for batch research; critical only for near‑real‑time use.
- **Compliance**: Alignment with X.com ToS and applicable laws (GDPR/CCPA/DSA), vendor data handling, and auditability to reduce enforcement and reputational risk.
- **Engineering effort**: Initial integration complexity (auth, pagination, mapping to neutral schema, SDK maturity) assuming senior engineer bandwidth.
- **Maintenance**: Ongoing effort to handle provider churn, anti‑bot changes, version bumps, and observability.

#### Weights
| Criterion | Weight |
|---|---:|
| Coverage | 0.28 |
| Compliance | 0.20 |
| Reliability | 0.18 |
| Cost | 0.14 |
| Maintenance | 0.10 |
| Engineering effort | 0.06 |
| Latency | 0.04 |

Rationale highlights:
- **Coverage (0.28)**: Gaps directly cap program value; breadth across surfaces and query modalities is the primary differentiator externally.
- **Compliance (0.20)**: External‑only work must be defensible; compliance risk can nullify any cost or speed gains.
- **Reliability (0.18)**: Flaky delivery multiplies retries, burns quota, and jeopardizes research timelines.
- **Cost (0.14)**: Material at scale but subordinate to feasibility (coverage/compliance/reliability). Scenario modeling handles price variance.
- **Maintenance (0.10)**: Provider/API churn is predictable; sustained effort impacts total cost more than initial build.
- **Engineering effort (0.06)**: One‑time integration cost is amortized; SDKs and examples typically reduce lift.
- **Latency (0.04)**: Batch workloads tolerate hours‑scale latency; only critical for alerting/ops use‑cases outside this scope.

#### Normalized weight vector
Order: [coverage, cost, reliability, latency, compliance, engineering_effort, maintenance]

```
[0.28, 0.14, 0.18, 0.04, 0.20, 0.06, 0.10]
```

Assumptions:
- Batch‑oriented research focus; no strict real‑time SLAs.
- Senior engineer available; preference for managed providers over bespoke scraping when feasible.
- Compliance is a first‑class constraint rather than an after‑the‑fact check.