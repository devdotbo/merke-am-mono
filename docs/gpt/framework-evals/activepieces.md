### Overview
Activepieces is an open‑source Zapier/n8n‑style automation platform with a visual builder, triggers/actions ("pieces"), run logs, and a server‑side execution engine. It can be self‑hosted or used as a managed cloud service, making it a strong fit when you want ready‑made connectors and faster time‑to‑market.

### Embedding model
- Primary approach: host a dedicated instance and embed the builder via an iframe or reverse‑proxy inside your app.
- Manage flows, runs, connections, and secrets through REST APIs; use webhooks for inbound triggers.
- Single‑sign‑on via OIDC/OAuth2 or token‑based session bridging; basic branding via environment configuration.

### Licensing
- Core is MIT‑licensed OSS. Hosted/enterprise plans add features and support under commercial terms.

### Execution engine
- Node.js worker/queue architecture; horizontal scaling with separate DB/Redis.
- Triggers: webhooks, schedules, polling; step retries, timeouts, and error paths.
- Per‑run logs, inputs/outputs capture, and manual re‑runs.

### Connectors/integrations
- Hundreds of community and official connectors (HTTP, Slack, Gmail, Google Sheets, databases, etc.).
- Custom connectors via a TypeScript SDK; package and distribute privately.

### Embedding friction
- No first‑class React/JS embeddable editor; iframe is the practical route.
- Multi‑tenant isolation and RBAC are adequate but not fine‑grained; expect to do auth/session brokering.
- Theming/white‑label is limited without forking; deep UX changes require contributing to the Angular app.

### Pros
- OSS, permissive license; quick self‑host with Docker.
- Rich connector catalog; webhooks/schedules built‑in.
- Solid logs and run introspection; API surface for automation.

### Cons
- Editor not natively embeddable; iframe + SSO glue required.
- Limited granular RBAC/auditing compared to enterprise iPaaS.
- Customizing UX requires Angular expertise.

### POC steps
1) Self‑host via Docker Compose (Postgres + Redis).
2) Create a flow with Webhook → HTTP Request → Transform (JS).
3) Embed the builder via iframe behind your auth; wire OIDC.
4) Validate logs, retries, schedules; export/import a flow.
5) Build one custom connector (TypeScript SDK).

### Recommendation
If an iframe‑embedded builder is acceptable, Activepieces offers the fastest path to a functioning, self‑hosted automation capability with broad connectors. If you need tight in‑app UX control or domain‑specific nodes, prefer building on `React Flow` and integrating only the Activepieces execution patterns.

### Security and tenancy notes
- Secrets: stored server‑side; scope to workspace/project. Validate secret at-rest encryption and key rotation strategy.
- Multi‑tenant isolation: prefer separate DB schemas or instances per tenant for stricter isolation; review RBAC for editors vs runners.
- Auditing: capture run logs, edits, and credential changes; forward to your SIEM via webhooks or log drains.
- Compliance: confirm data residency and backups when self‑hosting (Postgres), and ensure webhook ingress egress allowlists.

### Embedding checklist
1) Identity: establish SSO or signed token handoff to the builder UI; map tenants→projects.
2) Networking: front builder with your reverse proxy; set CORS, cookie domain, CSRF.
3) Theming: apply brand via environment/CSS overrides; validate dark/light.
4) Catalog: curate connector list; hide unfinished connectors; pre-provision OAuth apps.
5) Governance: define who can publish flows, manage secrets, and view logs.
6) Observability: export runs to analytics; add alerts on failure rates/latency.

### Fit signals
- You want OSS, self‑hosted automation with many ready connectors and acceptable iframe embedding.
- Your product needs webhooks, schedules, retries, and run logs without building an engine.
- Team is fine with Angular-based editor living as a separate surface behind SSO.

### Anti‑signals / risks
- Hard requirement for fully native, React‑level editor customization.
- Need for fine‑grained RBAC, audit trails, or multi‑region data residency beyond what’s available.
- Deep white‑label and UX parity with your app (beyond branding) is mandatory.

### Open questions to validate
- SSO: confirm OIDC config paths and session timeouts with your IdP.
- Rate limits: per‑connector and per‑tenant limits; backoff behaviors.
- Export/import: portability guarantees and version compatibility across upgrades.
- Custom connectors: packaging, private distribution, and testing workflow.

### References (last reviewed: 2025‑08‑28)
- Docs: [Activepieces Documentation](https://www.activepieces.com/docs)
- GitHub: [activepieces/activepieces](https://github.com/activepieces/activepieces)
- SDK: [Create custom pieces](https://www.activepieces.com/docs/developers/pieces/overview)