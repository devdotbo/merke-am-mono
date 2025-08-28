# Litegraph.js — Embeddable n8n-like Editor Evaluation

- Source: docs/gpt/n8n-like-options.md (single source)

## Overview

MIT-licensed browser node editor; listed under "Related canvas/editor libs (build-your-own)". Simple to start; fewer ecosystem features than React Flow.

## Embeddability
- Vanilla JS/ESM; create an `LGraph` and `LGraphCanvas` bound to an HTML `<canvas>`.
- Ships with basic CSS; embed as a widget; no React/Vue dependency.
- Serialize/deserialize graphs to JSON for persistence.

## Node/Edge Model
- Nodes subclass `LiteGraph.LGraphNode`; define inputs/outputs (typed slots) and `onExecute`.
- Edges are links between slots; multiple inputs/outputs supported depending on node.
- Per-node UI widgets (sliders, dropdowns) can bind to node properties.

## Execution Considerations
- Includes a built-in client-side execution engine calling `onExecute` per node on ticks.
- For backend automation, treat Litegraph as editor only and run a server interpreter; map saved JSON to your runtime model.
- No built-in retries/schedules/webhooks; implement externally.

## Integrations
- No connector catalog; implement custom nodes (e.g., HTTP via `fetch`) and data adapters.
- Combine with ELK/Dagre for layout if auto-positioning is needed.

## Observability & Collaboration
- Expose editor events to autosave/version; add run logs in your runtime.
- Real-time collaboration requires CRDTs (Yjs/Automerge) and custom cursors.

## Licensing

MIT.

## Pros

- Simple to start.

## Cons

- Fewer ecosystem features than React Flow.

## Recommended POC
1) Embed `LGraphCanvas` and register three nodes: Trigger, HTTP Request (fetch), Transform (JS).
2) Persist to JSON; reload and restore positions/slots.
3) Write a tiny server interpreter to execute the saved graph and return per-node outputs.

## Decision Guidance Fit Notes

- Listed under "Related canvas/editor libs (build-your-own)".
- Compared to React Flow, fewer ecosystem features.

## Next Steps
 - Spike: minimal editor + execution bridge; test performance and theming.

### References (last reviewed: 2025‑08‑28)
- GitHub: https://github.com/jagenjo/litegraph.js
- Wiki: https://github.com/jagenjo/litegraph.js/wiki
