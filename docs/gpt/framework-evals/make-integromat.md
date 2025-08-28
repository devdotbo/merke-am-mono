### Overview
Make (formerly Integromat) is a mature, hosted visual automation platform for building “scenarios” (node-based workflows) that orchestrate SaaS apps, webhooks, and data transformations. It emphasizes powerful visual mapping, array iteration, branching, and robust execution monitoring.

### Embedding model
No official embeddable editor widget or self-hosted option. Integration typically relies on deep-linking users into Make’s editor, sharing read-only scenario views, or provisioning via API where available. Enterprise SSO (e.g., SAML) exists, but white-label/OEM embedding is limited and contractual.

### Licensing
Commercial SaaS with usage-based pricing (operations/bundles) and enterprise plans. Not open source. Terms may restrict redistribution/white-label without partner agreements.

### Execution engine
Cloud-native orchestrator with triggers (webhooks, schedules, polling), retries and error routing, concurrency controls, and detailed run histories. Strong data mapping with functions, array iterators, and a JavaScript “Code” step for custom logic. Secrets/connections managed within the platform.

### Connectors/integrations
Large catalog (1,500+ apps). Generic HTTP, Webhooks, file/email, and data-store modules cover gaps. Custom connectors (“Make Apps”) support private or public distribution; app review may apply for public listing.

### Embedding friction
High. The editor cannot be embedded as a React/JS component, and there is no self-hosting. UX integration depends on external navigation (deep links/iframes), separate auth domain, and Make’s RBAC model. Data residency/compliance must align with Make’s regions and policies.

### Pros
- Extremely rich connector catalog and reliable execution engine
- Powerful visual mapping, iteration, and JS code step
- Mature logging, error handling, and operational controls
- Fast time-to-value; minimal infra to manage

### Cons
- No embeddable editor; closed SaaS; vendor lock-in
- No self-hosting; limited white-label/OEM options
- Usage pricing and rate limits can be unpredictable
- Limited programmatic control over UX and scenario editing

### POC steps
- Create trial/enterprise org; configure SSO if needed
- Build a baseline scenario: Webhook → HTTP Request → Code (JS transform) → HTTP POST
- Prototype a private “Make App” or use HTTP for custom APIs
- Evaluate logs, retries, error routes, concurrency, and quotas
- Test template-based provisioning and API-driven parameterization
- Validate secrets management, RBAC, and data residency

### Recommendation
Use Make when connector breadth and speed outweigh the need for an in-app, embeddable builder. For a productized, “n8n-like” editor inside your app or for self-hosting, prefer Activepieces or a custom React Flow/Rete.js editor plus your own executor. Consider Make via deep links and webhooks only if externalizing the builder is acceptable.

### Embedding checklist
1) Decide deep-link vs iframe; configure SSO (SAML/OIDC) for seamless navigation.
2) Provision templates and scenarios via API where available; pre-fill connections.
3) Implement webhooks and HTTP endpoints with IP allowlists and auth verification.
4) Capture run logs and errors via exports/API into your SIEM/analytics.
5) Establish governance for scenario ownership, access, and change control.
6) Model cost: operations/limits; alert on approaching quotas.

### Fit signals
- You prioritize connector breadth, powerful mapping, and operational maturity.
- Externalizing the editor is acceptable within your product experience.

### Risks / open questions
- OEM/white‑label constraints and licensing terms for embedding.
- Data residency and compliance coverage for your customers.
- API coverage for provisioning and template parameterization.

### References (last reviewed: 2025‑08‑28)
- Site: https://www.make.com
- Help: https://www.make.com/en/help