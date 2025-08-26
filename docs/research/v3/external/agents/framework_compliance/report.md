### Framework Compliance Notes — X.com (External‑Only)

This is a practical, non‑legal summary to guide external‑only research and integrations. Consult counsel for final interpretation.

### X.com ToS constraints (high‑level)
- **No unauthorized scraping or automated access**: Systematic collection, crawling, or bulk export of site content without prior authorization can violate ToS and anti‑circumvention laws.
- **Prefer official access channels**: Where an official API or licensed data product exists, ToS generally expects you to use that instead of headless scraping.
- **Respect rate limiting and technical controls**: Do not bypass login gates, rate limits, or protective measures.
- **Attribution and display rules**: If content is used, maintain links back to the original posts/authors and do not misrepresent or de‑contextualize content.
- **Deletions and user choices**: Honor content removals, account suspensions, and visibility choices; avoid re‑surfacing deleted or protected content.
- **No resale or substitution dataset**: Do not build a product that replaces platform functionality using unlicensed copies of content.

### When the official API may be required or strongly preferred
- **Any systematic or commercial ingestion** (large‑scale timelines, search, firehose‑like feeds, historical backfills).
- **Use cases needing reliability/compliance hooks** (deletion/compliance streams, fields that require terms acceptance).
- **Redistribution or enrichment** at scale, or where specific fields/uses are contractually restricted without API terms.
- **Operating in jurisdictions with higher enforcement risk** (EU, UK, some US states) where ToS breaches can compound with regulatory exposure.

### GDPR, CCPA/CPRA, DSA — key considerations
- **Lawful basis**: Establish a defensible basis (legitimate interests, consent, or contract). Avoid processing special‑category data unless an exemption clearly applies.
- **Transparency**: Provide a clear notice describing sources (public X.com content), purposes, recipients, retention, and user rights.
- **Data minimization & purpose limitation**: Collect only necessary fields; avoid storing full raw payloads where aggregates suffice.
- **Rights handling**: Implement access, correction, deletion, and objection workflows; honor platform deletions and user opt‑outs.
- **Cross‑border transfers**: Use valid transfer mechanisms (e.g., SCCs) for EU/UK data; assess vendor subprocessors.
- **Do Not Sell/Share (CPRA)**: Provide opt‑out where data could constitute “sale/share” or cross‑context behavioral advertising.
- **DSA/Online platform rules**: Avoid misleading presentation, respect platform terms, and document systemic risk mitigations for any public‑facing recommender uses.

### Jurisdictional notes (non‑exhaustive)
- **EU/UK**: GDPR/UK GDPR and database rights may apply; scraping may trigger sui generis database right claims; PECR may apply to tracking.
- **US**: Contract/ToS claims, Computer Fraud and Abuse Act (CFAA) and state analogs risk if bypassing technical controls.
- **Brazil (LGPD), Canada (PIPEDA), India (DPDPA), China (PIPL)**: Similar principles with stricter cross‑border and consent rules in some cases.

### Retention and deletion
- **Minimize retention**: Keep data only as long as necessary for the stated purpose; define maximum retention periods.
- **Honor platform signals**: Periodically reconcile with deletion/suspension signals; suppress removed or protected content.
- **Derived data**: Prefer storing derived, non‑personal aggregates; segregate raw personal data with tighter TTLs and access controls.

### Mitigations and best practices
- **Public‑data‑only**: Limit collection to publicly visible content; exclude protected or login‑gated content.
- **Consent‑based collection when feasible**: Especially for creators, partners, or private/workspace data.
- **Use official APIs or licensed data**: Gains clearer terms, deletion hooks, and auditability.
- **Field minimization & hashing**: Store only needed fields; hash user identifiers where feasible; avoid storing sensitive inferences.
- **Geofencing & jurisdictional controls**: Adjust collection/processing based on user/platform jurisdiction.
- **Governance**: Maintain ROPA, DPIA/LIA, data maps, and incident response; execute DPAs with vendors; log provenance.
- **User controls**: Provide suppression/opt‑out channels and document how they propagate to caches and derivatives.

### Red flags / no‑go zones
- Bypassing authentication, rate limits, or anti‑bot controls.
- Collecting from private/protected accounts or non‑public endpoints.
- Reselling raw content or building a substitute service from unlicensed copies.
- Ignoring deletions, user requests, or retention limits.

> Disclaimer: This is not legal advice. Validate against the latest X.com terms and applicable laws before launch.