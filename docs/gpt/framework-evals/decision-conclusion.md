## In‑App Workflow Strategy — Final Conclusion

### Executive decision
- **Primary path (build)**: Adopt React Flow as the native editor, with XState for complex UI/interaction state, and optionally Sequential Workflow Designer (SWD) for linear flows. Use Convex for real‑time sync and persistence. Implement a server‑side execution layer for a minimal node set (Webhook → HTTP → Transform) and expand iteratively.
- **Fallback path (buy)**: Self‑host Activepieces and embed via iframe/SSO only if we need immediate connector breadth, retries, and logs faster than we can build. Treat it as a separate automation plane rather than an in‑canvas editor.

### Why this decision holds
- **Embedding and UX control**: Our product needs a truly native, branded, collaborative editor. React Flow provides first‑class React integration and UX control; iframe‑based builders cannot match this.
- **Tenancy and security**: Native editor in our app with server execution gives us precise isolation, RBAC, and data residency aligned to our requirements.
- **Scope fit**: React Flow covers the editor surface; we consciously own execution, logs, retries, and observability over time, matching our long‑term differentiation.
- **Optionality preserved**: Activepieces remains a parallel plane for external automations if/when connector breadth or time‑to‑market pressures spike.

### What we intentionally deprioritize now
- **Node‑RED and Automatisch**: Useful for IoT/protocol breadth or simple external automations, but misaligned with native in‑app UX and type‑safe integration needs.
- **Hosted builders (Zapier/Make/Pipedream/Klamp/Latenode/Gumloop/Rayven)**: Strong catalogs and ops, but editors live outside our app. Good for integrations, not for our canvas.

### Success criteria to validate the build path
- **Editor UX**: Smooth pan/zoom, node add/remove, edges, and selection at 60fps on typical flows (≤100 nodes) on mid‑range laptops.
- **Collaboration**: Real‑time presence and conflict‑free updates via Convex; <250ms perceived latency on shared edits in the same region.
- **Execution MVP**: Deterministic server interpreter for the 3‑node pipeline (Webhook, HTTP, Transform), idempotent runs, basic run logs, and retry‑on‑fail with backoff.
- **Observability**: Per‑run trace with step timings and payload snapshots (redacted per secret policy). Exportable JSON.
- **Extensibility**: Node registry that supports versioned nodes and schema evolution (deprecate but still read historical runs).

### Risks and mitigations
- **Engine complexity creeps** → Start with the 3‑node MVP. Enforce a strict node contract and a single runner abstraction. Add queues and distributed workers only when needed.
- **Connector backlog** → Provide an HTTP node with templating and auth presets (Bearer/OAuth2/API Key) to cover 70% of early use cases. Add SDK for custom nodes later.
- **Performance regressions** → Budget perf tests in CI for common canvas interactions and run execution micro‑benchmarks. Profile regularly.
- **Scope drift** → Keep the canvas/editor and execution concerns separate in code and ownership.

### Immediate next steps
- **Spike A (build)**: React Flow editor + Convex sync + server interpreter for Webhook → HTTP → Transform. Persist flow JSON and store run logs. Aim for a demoable vertical slice.
- **Spike B (buy, optional)**: Self‑host Activepieces, implement the same 3‑step flow, embed via iframe/SSO. Compare embedding friction, logs/retries, and secrets management.

### Decision gate after spikes
- Proceed with the build path if: embedding is seamless, collaboration meets latency goals, and the interpreter MVP is stable with basic retries/logs.
- Consider the buy path if: build misses the embedding/latency bar or timelines, or connectors become the critical path for early users.

### Operating model
- Keep Activepieces as a separate automation plane for external integrations and back‑office automations. The React Flow canvas remains the product’s native in‑app builder. Do not mix the two UIs; bridge via webhooks and secrets.

### Long‑term outlook (6–12 months)
- Graduate from MVP interpreter to a queued, resumable runner with durable storage, step‑level retries, exponential backoff, and partial‑failure handling.
- Introduce a node SDK with strong typing, input/output schema validation, and versioning.
- Add role‑based access and workspace isolation guarantees; harden audit logs.

### Final takeaway
- For our collaborative, embedded canvas, the **build path** (React Flow + XState + optional SWD + Convex + server interpreter) is the best fit. Maintain **Activepieces** as a parallel, self‑hosted automation plane when connector breadth or delivery speed outweighs in‑app UX control. This preserves velocity now and compound ownership later.


