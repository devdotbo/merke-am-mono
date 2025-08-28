### Overview
Zapier is the dominant hosted automation platform with thousands of prebuilt integrations and a mature run engine for end‑user automations.

### Embedding model
Zapier Embed (JS SDK/iframe) lets you embed a template gallery and prebuilt Zaps in your app. It does not expose the full editor as a white‑label component; users finish configuration in Zapier.

### Licensing
Proprietary SaaS; tiered pricing by tasks/features. Partner/Embed programs have additional terms.

### Execution engine
Cloud‑only. Triggers (polling, instant webhooks), multi‑step flows, branching, robust retries, run history, alerting, and per‑step logs. Strong uptime; SLAs on higher plans.

### Connectors
6k+ apps across SaaS categories. Build your own “Zapier app” to publish private/public connectors.

### Embedding friction
Low for template/gallery embedding; medium if you need SSO, tenant‑scoped connections, or deep lifecycle events.

### Pros
- Largest connector catalog; reliable execution
- Quick end‑user activation with templates
- Mature logging, retries, and quotas

### Cons
- No self‑hosting; vendor lock‑in
- Limited white‑label control; editor not embeddable
- Custom logic constrained vs code‑first engines

### POC steps
1) Create a private Zapier app for your product (OAuth).
2) Build 3 templates (Webhook/HTTP, Transform, Notify).
3) Enable Zapier Embed in a test page; pass user context.
4) Measure activation, runs, and error rates.

### Recommendation
Best when your goal is to let users connect your app to the broader SaaS ecosystem fast. Not suitable if you need an in‑app, fully embedded builder or on‑prem execution.

### Embedding checklist
1) Implement Zapier Embed for template/gallery; set signed user context.
2) Build a private Zapier app for your API (OAuth); publish templates.
3) Provide webhooks and target endpoints with verification and allowlists.
4) Track activation, task usage, and errors; set quota alerts.
5) Coordinate support: escalations for rate limits and connector issues.

### Fit signals
- You want the largest connector catalog and quick user activation.
- Template‑driven onboarding aligns with your UX.

### Risks / open questions
- Editor not embeddable; users complete setup in Zapier.
- Pricing per task; cost predictability for high‑volume users.
- Data residency/compliance constrained to Zapier regions.

### References (last reviewed: 2025‑08‑28)
- Docs: https://platform.zapier.com
- Embed: https://zapier.com/partner/embed