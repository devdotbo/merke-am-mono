### Overview
Open‑source visual builder for LLM/RAG workflows ("chatflows"). Drag‑and‑drop nodes (LLMs, retrievers, memory, tools). Exposes flows via REST and embeddable chat widgets. Optimized for AI use cases, not general iPaaS.

### Embedding model
- Client: drop‑in JS/React chat widget (bubble or inline) bound to a flow.
- Server: REST prediction endpoints with streaming, session, and metadata support.
- Editor: self‑hosted builder can be iframed; no official white‑label editor SDK.

### Licensing
- MIT open source; permissive for self‑hosting/customization.
- Optional hosted "Flowise Cloud" with commercial terms.

### Execution engine
- Node.js runtime interprets node graphs per request; synchronous HTTP with optional streaming.
- Persists flows/credentials in SQLite/Postgres; basic logs and chat history.
- No built‑in scheduling, distributed workers, or robust retries.

### Connectors/integrations
- AI providers: OpenAI/Azure, Anthropic, Google, Mistral, etc.
- Vector/DB: Pinecone, Qdrant, Weaviate, Chroma, Milvus; diverse loaders/tools.
- Limited generic SaaS connectors vs n8n/Activepieces.

### Embedding friction
- Chat widget: low (simple script + flow ID + key).
- REST backend: moderate; you own auth/tenancy policies.
- Editor: high; iframe feasible but theming/auth control is limited.

### Pros
- OSS, self‑hostable; very fast path to LLM/RAG.
- Broad AI‑centric nodes; streaming and session support.
- Simple chat embedding with minimal glue code.

### Cons
- Not a general automation platform; thin outside AI domain.
- Limited reliability features (retries/schedules/workers).
- Weak multi‑tenant/white‑label editor story.

### POC steps
1) Self‑host via Docker; configure DB and encryption key.
2) Build RAG chatflow (loader → splitter → vector DB → LLM + memory).
3) Store provider keys in Credentials; validate test run.
4) Expose REST and chat widget; enable streaming.
5) Embed widget in a sample app; pass user/session metadata.
6) Capture logs; measure latency and token cost.

### Recommendation
Use Flowise when you need embeddable AI chat/RAG quickly and can accept limited editor embedding and iPaaS features. For broad connectors, webhooks/schedules/retries, prefer Activepieces or Node‑RED, or build a custom React Flow editor plus a bespoke executor.

### Embedding checklist
1) Decide: widget vs REST. For widget, secure key scoping; for REST, implement auth/tenancy middleware.
2) Provision flows and credentials per tenant; restrict provider keys and models via policy.
3) Add streaming SSE with abort support; surface token usage and latency metrics.
4) Implement observability: prompt/response logging with PII redaction and sampling.
5) Rate limits/backoff for provider APIs; retries with jitter; circuit breakers.
6) For iframe editor, set SSO, CORS, and brand theme; document limits.

### Fit signals
- AI chat/RAG is the primary use case and you need speed to value.
- Simple chat embedding suffices; editor white‑label is not required.

### Risks / open questions
- Multi‑tenant isolation of credentials and data; rotation processes.
- Lack of schedulers/workers; suitability for background jobs.
- Export/import stability and flow versioning between releases.

### References (last reviewed: 2025‑08‑28)
- Docs: https://docs.flowiseai.com
- GitHub: https://github.com/FlowiseAI/Flowise