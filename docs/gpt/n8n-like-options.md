## n8n-like workflow libraries and platforms (embeddable options)

### Scope
Goal: identify libraries/platforms with an "n8n"-style visual workflow builder (drag/drop nodes on a canvas) that we can embed or integrate into a web app.

### Selection criteria
- Embeddable editor: React or JS widget; ability to host/self-host
- Licensing: permissive OSS (MIT/Apache) preferred; commercial terms acceptable if embeddable
- Node/edge model: custom node SDK, IO ports, data mapping, validation
- Execution engine: run flows server-side; webhooks, schedules, retries, error handling
- Integrations: HTTP, DB, queues, SaaS connectors; custom connectors
- Collab/Versioning: save/load graphs; export/import JSON/YAML; environment/config separation
- Observability: run logs, metrics, tracing, step replays
- Auth/Multi-tenant: workspace isolation, RBAC, audit (nice-to-have)

### Landscape (representative)
- Flowise (AI workflow builder; embeddable widgets, OSS)
- Klamp.io (embedded integration platform; drag/drop builder, commercial)
- Make/Integromat (hosted visual automation; rich connectors)
- Pipedream (dev-centric, code+integrations; hosted)
- Node-RED (OSS flow-based; strong IoT focus; self-host)
- Activepieces (MIT OSS; self-host; large connector set)
- Latenode (no/low-code with AI copilot; hosted)
- Zapier (hosted; very large connector catalog)
- Gumloop (AI-oriented builder; hosted)
- Rayven (enterprise integration platform; hosted)

Related canvas/editor libs (build-your-own):
- React Flow (MIT core, Pro extras; mature React graph/canvas)
- Rete.js v2 (MIT; node editor engine; good for custom nodes)
- Litegraph.js (MIT; browser node editor)
- bpmn-js (MIT; BPMN modeling; enterprise workflows)
- Drawflow (MIT; lightweight node editor)

### Quick notes (licensing/embedding)
- React Flow: MIT core, optional Pro; ideal to embed a custom builder in React.
- Rete.js: MIT; flexible node editor for custom domain-specific nodes.
- Litegraph.js: MIT; simple to start; fewer ecosystem features than React Flow.
- bpmn-js: MIT; standards-based modeling; pair with an engine (Camunda/Zeebe).
- Drawflow: MIT; lightweight alternative for simpler canvases.
- Node-RED: Apache-2.0; self-host editor; embedding the full editor is possible but opinionated.
- Activepieces: MIT; self-host automation, connectors, visual builder.
- Flowise: OSS; embeddable widgets for AI workflows.
- Klamp.io/Make/Pipedream/Zapier/Latenode/Gumloop/Rayven: hosted/commercial; check embedding SDKs/iframes/API.

### Shortlist (two tracks)
- Build-your-own editor track: React Flow or Rete.js
  - Pros: full control over UX, nodes, permissions, and data model
  - Cons: must implement execution engine, persistence, logs, retry, connectors
- Productized automation track: Activepieces (self-host) or Node-RED
  - Pros: ready-made execution engine, visual builder, connectors
  - Cons: customizing UX/embedding to match in-app "n8n" feel may be limited

### Recommended POC
1) Custom editor POC (React Flow)
   - Build minimal canvas with draggable nodes and typed ports
   - Implement node schema and JSON graph format; persist to backend
   - Create 3 node types: HTTP Request, Transform (JS), Trigger (Webhook)
   - Execute server-side: interpret JSON graph, step-by-step with retries and logs
   - Show run timeline and per-node output

2) Self-host automation POC (Activepieces)
   - Deploy self-host instance
   - Create flows matching the three nodes above
   - Embed builder via iframe or reverse-proxy; evaluate white-label options
   - Validate webhooks, scheduling, secrets, and run logs

### Decision guidance
- Need deep in-app UX parity with custom security/tenancy: prefer React Flow/Rete.js build
- Need faster time-to-market and connectors: prefer Activepieces; consider Node-RED for IoT
- AI-first flows: consider Flowise; for BPMN/enterprise ops, consider bpmn-js + engine

### Next steps
- Spike 1: React Flow editor + minimal executor (1-2 days)
- Spike 2: Activepieces self-host + embed test (0.5-1 day)
- Compare DX, embedding friction, run observability, and maintenance cost
