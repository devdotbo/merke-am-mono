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