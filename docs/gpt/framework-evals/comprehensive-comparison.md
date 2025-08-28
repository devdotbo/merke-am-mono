## Embeddable Workflow Builders and Automation Platforms — Comprehensive Comparison

### Scope
This document consolidates evaluations across embeddable node editors and automation platforms to help choose an n8n‑like solution for in‑app workflows. Sources include the individual framework notes in this directory and the overview in `docs/gpt/n8n-like-options.md`.

### Landscape covered
- Build‑your‑own editors: React Flow, Rete.js, Drawflow, Litegraph.js, bpmn‑js
- Productized/self‑host/hosted platforms: Activepieces, Node‑RED, Flowise, Zapier, Make (Integromat), Pipedream, Klamp.io, Latenode, Gumloop, Rayven

## Executive summary
- **Two primary tracks**
  - **Build‑your‑own editor**: React Flow or Rete.js (optionally Drawflow/Litegraph.js/bpmn‑js) when you need deep in‑app UX control, custom nodes, and strict tenancy. You must own the execution engine, persistence, logs, retries, and connectors.
  - **Productized automation**: Activepieces (self‑host) or Node‑RED (self‑host) for fastest path to working flows with execution, logs, and connectors. Hosted options (Zapier, Make, Pipedream, Klamp.io, Latenode, Gumloop, Rayven) trade embeddability for speed and catalog.
- **Quick picks**
  - **Deep in‑app, React UX parity**: React Flow → build editor + server executor.
  - **Self‑hosted, broad connectors**: Activepieces; Node‑RED for IoT/protocol breadth.
  - **AI chat/RAG**: Flowise (editor via iframe; embed chat widget natively).
  - **Largest connector catalogs**: Zapier, Make (editor external to your app).
  - **Developer‑first code + connectors**: Pipedream (hosted).
  - **Embedded iPaaS (white‑label)**: Klamp.io (hosted, iframe/components).
  - **Quick cloud prototypes**: Latenode (JS‑first), Gumloop (AI/RPA‑like web tasks).
  - **BPMN compliance**: bpmn‑js + external engine (Camunda/Zeebe).

## High‑level comparison

### Legend
- **Embedding**: Native component = in‑app React/Vue/canvas SDK; Iframe = external full UI
- **Exec**: Built‑in execution engine in the product (Y/N/Partial)

### Landscape matrix
| Framework | Category | License | Self‑host | Embedding | Exec |
|---|---|---|---:|---|---|
| React Flow | Build‑your‑own editor | MIT | N/A | Native React component | No |
| Rete.js (v2) | Build‑your‑own editor | MIT | N/A | Native (React/Vue renderers) | No |
| Drawflow | Build‑your‑own editor | MIT | N/A | Native (vanilla/Vue) | No |
| Litegraph.js | Build‑your‑own editor | MIT | N/A | Native (canvas) | Partial (client‑side only) |
| bpmn‑js | Build‑your‑own modeler | MIT | N/A | Native (JS) | No (pair with engine) |
| Activepieces | Automation platform | MIT (core) | Yes | Iframe (builder) | Yes |
| Node‑RED | Automation platform | Apache‑2.0 | Yes | Iframe/full page; subpath mount | Yes |
| Flowise | AI workflow platform | MIT | Yes | Iframe (builder), native chat widget | Yes |
| Zapier | Hosted automation | Proprietary | No | Embed gallery/iframe (no full editor) | Yes |
| Make (Integromat) | Hosted automation | Proprietary | No | External UI (no SDK) | Yes |
| Pipedream | Hosted automation | Proprietary | No | External UI (no SDK) | Yes |
| Klamp.io | Embedded iPaaS (hosted) | Proprietary | No | Iframe/JS components | Yes |
| Latenode | Hosted low/no‑code | Proprietary | No | External UI/iframe | Yes |
| Gumloop | Hosted AI/RPA builder | Proprietary | No | External UI/iframe | Yes |
| Rayven | Enterprise integration/IoT | Proprietary | Private cloud/on‑prem | External UI/iframe | Yes |

## Capabilities matrix

| Framework | Triggers (webhook/schedule) | Retries & error handling | Logs/observability | Connector breadth | Custom connector SDK | RBAC/multi‑tenant | Theming/white‑label |
|---|---|---|---|---|---|---|---|
| React Flow | No | No | No (app‑level) | N/A | N/A | App‑defined | App‑defined |
| Rete.js | No | No | No (app‑level) | N/A | N/A | App‑defined | App‑defined |
| Drawflow | No | No | No (app‑level) | N/A | N/A | App‑defined | CSS/theme |
| Litegraph.js | No (editor) | No | Minimal (client) | N/A | N/A | App‑defined | CSS |
| bpmn‑js | No | No | No (modeler only) | N/A | Via engine | App‑defined | CSS/modules |
| Activepieces | Yes | Yes | Yes | High | Yes (TS SDK) | Moderate | Limited branding |
| Node‑RED | Yes | Partial | Yes | High (incl. IoT) | Yes (JS nodes) | Basic | Limited theme |
| Flowise | Webhook; request‑driven | Partial | Basic | Medium (AI‑centric) | Limited | Basic | Limited |
| Zapier | Yes | Yes | Yes | Very high | Yes (Zapier app) | Good | Limited |
| Make | Yes | Yes | Yes | Very high | Yes (Make Apps) | Good | Limited |
| Pipedream | Yes | Yes | Yes | High | Yes (components) | Good | Limited |
| Klamp.io | Yes | Yes | Yes | High | Yes | Good | Good |
| Latenode | Yes | Yes | Yes | Medium | Code node | Basic | Limited |
| Gumloop | Yes | Partial | Yes | Medium (web/RPA) | Limited | Basic | Limited |
| Rayven | Yes | Yes | Yes | High (OT/IT) | Yes | Enterprise | Limited |

Notes:
- Build‑your‑own editors expose events and JSON; all runtime features must be implemented in your backend.
- Litegraph.js includes a client execution loop; for server automation treat it as an editor only.

## Scenario‑based recommendations
- **Fully embedded builder with strict UX control and tenancy**: Prefer `React Flow` (primary) or `Rete.js`. Use `Drawflow`/`Litegraph.js` for lighter canvases. If BPMN standardization is required, use `bpmn‑js` + external engine.
- **Self‑hosted execution with ready connectors**: Prefer `Activepieces` (general SaaS) or `Node‑RED` (protocols/IoT). Embed via iframe/subpath and SSO.
- **AI chat/RAG workflows**: Prefer `Flowise` (chat widget embedding, iframe editor).
- **Max connector breadth quickly**: Prefer `Zapier` or `Make` via external editor and templates.
- **Developer‑first automations**: Prefer `Pipedream` for code + connectors.
- **Embedded iPaaS with vendor‑hosted control plane**: Prefer `Klamp.io` if iframe/components are acceptable.
- **Quick hosted prototyping**: `Latenode` (JS‑first) or `Gumloop` (AI/web RPA).
- **Industrial/IoT, enterprise ops**: `Rayven` (standalone platform with SSO/portal integration).

## Decision matrix (1–5, higher is better)

Criteria: Embeddability (in‑app), Self‑host option, Connector breadth, Execution maturity, UX customization, Time‑to‑market, Observability, Multi‑tenant readiness, Licensing friendliness.

| Framework | Embed | Self‑host | Connectors | Exec | UX control | TTM | Observability | Multi‑tenant | License |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| React Flow | 5 | 5 (n/a editor) | 1 | 1 | 5 | 2 | 1 | 5 | 5 |
| Rete.js | 4 | 5 (n/a editor) | 1 | 1 | 5 | 2 | 1 | 5 | 5 |
| Drawflow | 4 | 5 (n/a editor) | 1 | 1 | 4 | 3 | 1 | 5 | 5 |
| Litegraph.js | 4 | 5 (n/a editor) | 1 | 2 | 4 | 3 | 1 | 5 | 5 |
| bpmn‑js | 4 | 5 (n/a modeler) | 1 | 1 | 4 | 3 | 1 | 5 | 5 |
| Activepieces | 3 (iframe) | 5 | 4 | 4 | 2 | 5 | 4 | 3 | 5 |
| Node‑RED | 2–3 (iframe/subpath) | 5 | 4 | 4 | 2 | 4 | 4 | 2 | 5 |
| Flowise | 2–3 (iframe/widget) | 5 | 3 (AI‑centric) | 3 | 2 | 5 | 3 | 2 | 5 |
| Zapier | 2 (gallery/embed) | 1 | 5 | 5 | 1 | 5 | 5 | 4 | 2 |
| Make | 1–2 (external) | 1 | 5 | 5 | 1 | 5 | 5 | 4 | 2 |
| Pipedream | 1–2 (external) | 1 | 4 | 5 | 1 | 5 | 5 | 4 | 2 |
| Klamp.io | 3 (embed) | 1 | 4 | 4 | 2 | 5 | 4 | 4 | 2 |
| Latenode | 1–2 (external) | 1 | 3 | 4 | 1 | 5 | 4 | 3 | 2 |
| Gumloop | 1–2 (external) | 1 | 3 | 4 | 1 | 5 | 4 | 3 | 2 |
| Rayven | 1–2 (external) | 4 | 4 | 5 | 1 | 3 | 5 | 5 | 2 |

Notes: Self‑host “5” for editors/modelers indicates neutrality—self‑hosting applies to your app, not the library. Scores are directional to assist trade‑offs, not absolute.

## Per‑framework fit notes (one‑liners)
- **React Flow**: Best for a native React editor with full UX control; bring your own engine.
- **Rete.js**: Flexible engine + renderer stack for domain‑specific nodes; bring your own engine.
- **Drawflow**: Lightweight, dependency‑free editor (vanilla/Vue); great for simple canvases.
- **Litegraph.js**: Simple editor with a client execution loop; treat as editor for server automations.
- **bpmn‑js**: Standards‑based BPMN modeler; pair with Camunda/Zeebe to execute.
- **Activepieces**: Self‑hosted automation with rich connectors; builder via iframe; solid logs.
- **Node‑RED**: Self‑hosted flow runtime with strong protocol/IoT support; full‑page editor.
- **Flowise**: AI/RAG focus; easy chat embedding; builder via iframe; limited schedulers/retries.
- **Zapier**: Largest connector catalog; embed templates/gallery; editor remains in Zapier.
- **Make**: Powerful visual mapping and execution; external editor; enterprise SSO.
- **Pipedream**: Developer‑first code+connectors; great logs; external editor.
- **Klamp.io**: Hosted embedded iPaaS; white‑label components; fast vendor‑backed path.
- **Latenode**: JS‑first low/no‑code with AI copilot; fast prototyping; hosted only.
- **Gumloop**: AI/web RPA oriented; browsing/extraction built‑in; hosted only.
- **Rayven**: Enterprise integration/IoT; platform‑scale, not meant for in‑app embedding.

## Recommended next steps
- **Spike A (build path)**: React Flow minimal editor + server interpreter (3 nodes: Webhook, HTTP, Transform). Persist JSON, add run logs.
- **Spike B (buy path)**: Self‑host Activepieces; build equivalent 3‑step flow; embed builder via iframe/SSO. Assess logs, retries, secrets.
- Compare DX, embedding friction, observability, and multi‑tenant fit. Decide track.

## References
- See individual files in `docs/gpt/framework-evals/` for detailed notes and links.
- Overview: `docs/gpt/n8n-like-options.md`


