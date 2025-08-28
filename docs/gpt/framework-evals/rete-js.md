# Rete.js — Embeddable n8n-like Editor Evaluation

- Source: docs/gpt/n8n-like-options.md (single source)

## Overview
Rete.js v2 is an MIT-licensed node editor engine highlighted as flexible and good for custom domain-specific nodes. It is considered in the build-your-own editor track.

## Embeddability
Listed as a related canvas/editor library for building a custom editor. Rete v2 separates the engine (dataflow) from UI renderers (React/Vue/Canvas). Typical stack combines `rete-area-plugin` (viewport), `rete-connection-plugin` (edges), and a renderer plugin.

## Node/Edge Model
- Good for custom domain-specific nodes.
- Components define inputs/outputs and processing; nodes store `data` editable via controls.
- Connections link typed sockets; engine processes graphs reactively with optional async/caching.

## Execution Considerations
- As part of the build-your-own track, you must implement the execution engine, persistence, logs, retries, and connectors.
 - Rete engine is suitable for local validation; run production executions server-side (queue/worker). Persist schema as JSON and map to your runtime.

## Integrations
- Connectors are not provided; they must be implemented. Renderer plugins for React/Vue; add ELK/Dagre for auto-layout; embed Monaco editor; palette via `dnd-kit` or custom UI.

## Observability & Collaboration
- Run logs must be implemented by you (as part of the build-your-own track).
- Capture editor events to autosave/version; integrate Yjs/Automerge for real-time collaboration and cursors.

## Licensing
MIT.

## Pros
- Flexible node editor for custom domain-specific nodes.
- Part of a build-your-own approach that offers full control over UX, nodes, permissions, and data model.

## Cons
- Must implement execution engine, persistence, logs, retries, and connectors.

## Recommended POC
1) Build minimal editor with React renderer, area and connection plugins.
2) Create three components (Trigger, HTTP Request, Transform) with typed sockets and validation.
3) Persist/load JSON; add schema validation on connect.
4) Implement a server interpreter that executes the saved graph and returns per-node outputs.

## Decision Guidance Fit Notes
Fits cases needing deep in-app UX parity with custom security/tenancy.

## Next Steps
 - Spike: minimal editor + server interpreter; test save/load and validation.

### References (last reviewed: 2025‑08‑28)
- Docs: https://retejs.org
- Examples: https://retejs.org/docs/
