## Framework Cost Scenarios — External‑Only (v2)

Date: 2025-08-24

### Executive summary
- This note provides a reusable cost model and worked examples for acquiring X/Twitter posts via external providers only, with explicit assumptions, retries/backoff, success rates, and sensitivity ranges.
- Replace the assumed unit prices with vendor-quoted figures and cite them per the References guidance.

### Scope and approach
- External-only collection using third-party APIs/proxies. No first-party X API usage assumed here.
- Costs modeled per attempt and aggregated across retries with capped exponential backoff.
- Components: request fees, proxy egress, compute, storage, and an overhead factor for observability/queues.

### Assumptions (replace with cited prices for production)
- Volume target: 1,000,000 posts/month requested.
- Per-attempt base success probability p0: varies by scenario (Low/Base/High below).
- Retry policy: up to 2 retries (3 total attempts) with exponential backoff and jitter: 1s, 2s (+/− 20% jitter).
- Success after retries: S = 1 − (1 − p0)^3.
- Expected attempts per requested post (with cap=3): E_attempts = p0 + 2·p0·(1−p0) + 3·(1−p0)^2.
- Payload sizes (wire): JSON tweet payload only; media not fetched. Size varies by scenario.
- Compute is lightweight parsing/enrichment on 1 vCPU equivalent.
- Storage is compressed JSON per successfully acquired post.
- Overhead covers logging, metrics, queue infra, coordination.

Note: Unit prices below are hypothetical for modeling purposes only; replace with vendor pricing and cite sources.

### Cost model (units explicit)
Let N = requested posts/month; A = total attempts = N · E_attempts; Ns = successful posts = N · S.

- Request fees: Cost_req = A · C_req [$ per attempt]
- Proxy egress: GB_proxy = A · bytes_per_attempt / 1,073,741,824; Cost_net = GB_proxy · C_GB [$ per GB]
- Compute: Hours = A · cpu_seconds_per_attempt / 3600; Cost_cpu = Hours · C_vcpu_hr [$ per vCPU·hr]
- Storage: GB_store = Ns · bytes_per_success / 1,073,741,824; Cost_store = GB_store · C_store_GBmo [$ per GB·mo]
- Overhead: Cost_ovh = ovh_pct · (Cost_req + Cost_net + Cost_cpu + Cost_store)
- Total monthly cost: Cost_total = Cost_req + Cost_net + Cost_cpu + Cost_store + Cost_ovh

### Worked scenarios for N = 1,000,000 posts/month
All currency USD. Assumptions called out per scenario.

#### Low-cost/optimistic
- p0 = 0.90; E_attempts = 1.11; S = 0.999 (3 attempts)
- C_req = $0.0015/attempt; bytes_per_attempt = 5,000 bytes
- C_GB = $3.00/GB; cpu_seconds_per_attempt = 0.20 s; C_vcpu_hr = $0.03/hr
- bytes_per_success = 2,000 bytes; C_store_GBmo = $0.020/GB·mo; ovh_pct = 10%

Computed:
- A = 1,110,000 attempts; Ns = 999,000 successes
- Cost_req = $1,665.00
- GB_proxy ≈ 5.30 GB; Cost_net ≈ $15.89
- Hours ≈ 61.67; Cost_cpu ≈ $1.85
- GB_store ≈ 1.86–1.95 GB; Cost_store ≈ $0.04
- Overhead ≈ $168.28
- Total ≈ $1,851.06/month

#### Base/middle
- p0 = 0.75; E_attempts = 1.3125; S ≈ 0.984375
- C_req = $0.0020/attempt; bytes_per_attempt = 6,000 bytes
- C_GB = $5.00/GB; cpu_seconds_per_attempt = 0.25 s; C_vcpu_hr = $0.04/hr
- bytes_per_success = 3,000 bytes; C_store_GBmo = $0.023/GB·mo; ovh_pct = 15%

Computed:
- A = 1,312,500 attempts; Ns ≈ 984,375 successes
- Cost_req = $2,625.00
- GB_proxy ≈ 7.88 GB; Cost_net ≈ $39.38
- Hours ≈ 91.15; Cost_cpu ≈ $3.65
- GB_store ≈ 2.75–2.82 GB; Cost_store ≈ $0.06–$0.07
- Overhead ≈ $400.21
- Total ≈ $3,068.31/month

#### High-cost/conservative
- p0 = 0.60; E_attempts = 1.56; S = 0.936
- C_req = $0.0030/attempt; bytes_per_attempt = 8,000 bytes
- C_GB = $10.00/GB; cpu_seconds_per_attempt = 0.30 s; C_vcpu_hr = $0.06/hr
- bytes_per_success = 4,000 bytes; C_store_GBmo = $0.030/GB·mo; ovh_pct = 25%

Computed:
- A = 1,560,000 attempts; Ns = 936,000 successes
- Cost_req = $4,680.00
- GB_proxy ≈ 11.90 GB; Cost_net ≈ $119.00
- Hours ≈ 130.00; Cost_cpu ≈ $7.80
- GB_store ≈ 3.44–3.58 GB; Cost_store ≈ $0.10–$0.11
- Overhead ≈ $1,201.73
- Total ≈ $6,008.64/month

### Sensitivity highlights (holding others at Base)
- Per-attempt request price (C_req): ±10% changes total by ≈ ±8.6% (dominant driver).
- Base success probability (p0): +0.05 lowers total attempts by ≈ 6–9% under cap=3; total scales roughly linearly with E_attempts.
- Proxy egress price (C_GB): Each $1/GB changes total by ≈ $7.9 per 1M posts at 6 KB/attempt.
- Backoff cap: Allowing a 3rd retry (total 4 attempts) increases S but may increase total cost if p0 < ~0.7; evaluate per vendor error mix.

### Implementation notes (retry/backoff)
- Use capped exponential backoff with full jitter.
- Treat HTTP 5xx/429/transport errors as retryable; 4xx (except 408/409/425/429) as non-retryable.
- Pseudocode:
```python
from random import random
from time import sleep

MAX_RETRIES = 2
BASE_DELAY_S = 1.0
JITTER = 0.2

for attempt in range(0, MAX_RETRIES + 1):
    ok, err = fetch_once()
    if ok:
        break
    if attempt == MAX_RETRIES or not is_retryable(err):
        raise err
    delay = BASE_DELAY_S * (2 ** attempt)
    jitter = 1 + (random() * 2 - 1) * JITTER
    sleep(delay * jitter)
```

### How to productionize this model
- Replace C_req, C_GB, C_vcpu_hr, C_store_GBmo with vendor-quoted prices; cite each with retrieval dates in References.
- Measure p0 empirically per provider and per target; recompute E_attempts and S.
- If fetching media, include media bytes in bytes_per_attempt and bytes_per_success; add CDN egress if applicable.
- Track per-endpoint latency and error taxonomies to tune retry caps.

### References
- No vendor pricing cited in this framework scenario. All numeric unit prices are modeling assumptions for illustration only and must be replaced with provider prices cited from official sources (retrieved 2025-08-24 when added).
