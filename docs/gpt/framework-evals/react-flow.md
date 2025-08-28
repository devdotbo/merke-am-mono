# React Flow — Embeddable n8n-like Editor Evaluation

- Source: docs/gpt/n8n-like-options.md (single source)

## Overview

React Flow is listed as a mature React graph/canvas library suitable for building a custom visual workflow builder.

## Embeddability

Identified as ideal to embed a custom builder in React. Rich hooks (`useReactFlow`, `useNodesState`, `useEdgesState`), custom node/edge types, and viewport controls make it straightforward to build an in‑app editor.

## Node/Edge Model

- Nodes and edges are plain objects with ids and data; custom node components receive `data`, selection state, and handle IDs.
- Connection validation via `isValidConnection`; port types and direction enforced by you.
- Layout can be manual or via external libs (Dagre/ELK) to compute positions.

## Execution Considerations

For a build-your-own editor track (e.g., React Flow), execution engine, persistence, logs, retry, and connectors must be implemented separately. Common approach: persist a JSON graph; run server-side with a queue/worker (e.g., Node.js + BullMQ), emit per‑step logs, and surface timelines back to the canvas.

## Integrations

- Use `reactflow` with `zustand` or your state store; add ELK/Dagre for auto‑layout; integrate code editors (Monaco) in node bodies; employ `dnd-kit`/`react-dnd` for palette drag‑and‑drop.

## Observability & Collaboration

- Observe editor events (add/update/remove nodes/edges) to autosave and validate graphs.
- For collaboration, pair with CRDTs (Yjs/Automerge) and awareness cursors; React Flow Pro offers enterprise features (selection box performance, helpers) but CRDT wiring is app‑level.

## Licensing

MIT core with optional Pro extras.

## Pros

- Mature React graph/canvas library
- Ideal to embed a custom builder in React
- Full control over UX, nodes, permissions, and data model (in build-your-own track)

## Cons

- Must implement execution engine, persistence, logs, retries, and connectors (in build-your-own track)

## Recommended POC

- Build minimal canvas with draggable nodes and typed ports
- Implement node schema and JSON graph format; persist to backend
- Create three node types: HTTP Request, Transform (JS), Trigger (Webhook)
- Execute server-side: interpret JSON graph step-by-step with retries and logs
- Show run timeline and per-node output

### Embedding checklist
1) Define node schema and type system; implement connection validation.
2) Create palette with drag‑and‑drop; snap‑to‑grid and zoom limits.
3) Add mini‑map, controls, and selection interactions; keyboard shortcuts.
4) Persist with optimistic updates and autosave; version graphs.
5) Add ELK/Dagre optional layout; support lock/view‑only modes.
6) Instrument events to analytics; guard against large graphs (virtualization strategies).

### Fit signals
- Strong need for native in‑app UX and deep customization.
- Willingness to implement/own the execution engine and connectors.

### Risks / open questions
- Performance for 5k+ nodes without virtualization; test early.
- CRDT complexity for real‑time collaboration; pick Yjs/Automerge strategy.
- Theming consistency with design system; test custom nodes in dark mode.

### References (last reviewed: 2025‑08‑28)
- Docs: https://reactflow.dev
- Examples: https://reactflow.dev/examples

## Decision Guidance Fit Notes

- Preferable when deep in-app UX parity with custom security/tenancy is needed (build-your-own track)

## Next Steps

- Spike 1: React Flow editor + minimal executor (1–2 days)
