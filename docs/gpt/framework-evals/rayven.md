### Overview
Rayven (Dynamix) is an enterprise integration/IoT platform for real‑time data pipelines, device integration, and analytics dashboards.

### Embedding model
Not designed as an embeddable editor. Typical deployment is as a standalone platform with SSO/portal integration; limited feasibility via iframe only.

### Licensing
Commercial enterprise licensing; deployments in private cloud or on‑prem with managed services.

### Execution engine
Streaming and batch pipelines with low‑latency processing, rules, ML model hosting, alerting, and robust observability; HA/DR options.

### Connectors
Strong OT/IoT and IT connectors: OPC‑UA, Modbus, MQTT, REST, SQL, cloud services. Custom connectors via SDK/services.

### Embedding friction
High: platform‑scale product, opinionated UX, and infra requirements; not aimed at white‑label embedding into another app.

### Pros
- Enterprise‑grade reliability, security, and observability
- Rich industrial protocol support and real‑time processing
- Vendor services for onboarding and integration

### Cons
- Overkill for app‑embedded automation
- Cost/complexity; long lead times
- Limited control over editor UX and tenant model

### POC steps
1) Vendor discovery and sandbox access.
2) Connect sample data source (MQTT/REST), build basic transform and alert.
3) Evaluate SSO/portal integration and data residency needs.
4) Estimate TCO and change‑control process.

### Recommendation
Choose only if you have industrial/IoT requirements and can adopt a standalone enterprise platform. For embedding in a web app, prefer lighter, embeddable options.

### Embedding checklist
1) Treat as standalone platform; integrate via SSO/portal links.
2) Define data ingress/egress contracts (MQTT, REST, DB) and network security.
3) Map tenants to Rayven workspaces/projects; audit scopes and roles.
4) Establish data residency, backup, and HA/DR documentation.
5) Plan incident response and change‑control aligned with vendor processes.

### Fit signals
- Industrial protocols and real‑time pipelines are core requirements.
- Need enterprise SLAs, HA/DR, and managed services.

### Risks / open questions
- Embedding is limited; UX remains in Rayven’s portal.
- Vendor services dependency and lead times.
- Total cost of ownership vs building lighter solutions.

### References (last reviewed: 2025‑08‑28)
- Site: https://rayven.io