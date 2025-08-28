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