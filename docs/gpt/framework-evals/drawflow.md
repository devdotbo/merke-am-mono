# Drawflow — Embeddable n8n-like Editor Evaluation

- Source: docs/gpt/n8n-like-options.md (local) + web research (cited)

## Overview

Drawflow is a lightweight, dependency‑free JavaScript library for building node‑based visual editors on the web. It provides drag‑and‑drop nodes, multiple inputs/outputs, connection routing, zoom/pan, modules (workspaces), import/export to JSON, and an event system. It is a canvas/editor library only (no execution engine). [1][2]

## Embeddability

- Vanilla JS (no dependencies), usable via CDN or `npm i drawflow`. [1]
- Works with Vue 2 and Vue 3; nodes can render as plain HTML or registered Vue components; Nuxt projects may need `transpile: ['drawflow']`. [1]
- Exposes an imperative API: create `new Drawflow(container, [Vue, parent])`, then `editor.start()`. [1]
- Mobile support (touch/gesture), zoom controls, editor modes: `edit`, `fixed`, `view`. [1][2]
- Styling via bundled CSS; theme generator exists for quick customization. [1][2]

## Node/Edge Model

- Nodes: created with `addNode(name, inputs, outputs, x, y, className, data, html, typenode)` where `html` is the node body (string/HTMLElement or registered key). `data` is a JSON payload; form fields can bind via `df-*` attributes to auto‑sync into `data`. [1]
- Connections: ports are positional and identified as `input_#`/`output_#`. Multiple inputs/outputs and multiple connections are supported. Reroute (waypoints) can be enabled. [1]
- Events: rich event set for node/connection lifecycle (`nodeCreated`, `connectionCreated`, `nodeDataChanged`, `zoom`, etc.). [1]
- Modules: logical workspaces (`Home`, custom modules) to separate flows. [1]
- Persistence: `editor.export()`/`editor.import(json)` serialize/restore a JSON structure under a `drawflow` root keyed by module, with per‑node `id`, `name`, `data`, `class`, `html`, `inputs/outputs`, and positions. [1]

## Execution Considerations

- No built‑in execution/runtime engine, schedulers, retries, or webhooks. The library provides only the canvas/editor and JSON schema; you must implement any server/client runner that interprets the exported graph. [1][2]

## Integrations

- No built‑in connectors (HTTP, DB, SaaS, etc.). Integrations are achieved by authoring custom nodes (HTML or Vue components) and by handling persistence/execution externally. [1]

## Observability & Collaboration

- Provides UI/editor events for instrumentation in your app. [1]
- JSON import/export supports save/load and versioning strategies you implement. [1]
- Real‑time multi‑user collaboration, run logs, metrics, and step replays are not provided. Unknown beyond the event hooks. [1]

## Licensing

- MIT License. [1]

## Pros

- Lightweight, dependency‑free, easy to embed. [1]
- Flexible node rendering (plain HTML or Vue components). [1]
- Multiple inputs/outputs, reroute points, zoom/pan, modules. [1]
- Good event coverage for integrating with host app. [1]
- Import/export JSON; theme generator for fast styling. [1][2]
- Permissive MIT license. [1]

## Cons

- No built‑in execution engine or connectors. [1][2]
- No official React bindings; Vue integration only. [1]
- TypeScript types are community‑provided (`@types/drawflow`). [1]
- Collaboration, auditing, and runtime observability are not built‑in (host must implement). [1]

## Recommended POC

- Embed Drawflow in a minimal page/div; enable reroute and editor modes. [1][2]
- Implement three custom nodes (HTML or Vue): Trigger (Webhook placeholder), HTTP Request (config form with `df-*` bindings), Transform (JS expression). [1]
- Persist `editor.export()` JSON to backend and reload via `editor.import()`. [1]
- Wire host‑side event listeners (`nodeDataChanged`, `connectionCreated`) to validate graph and sync autosaves. [1]
- Write a tiny interpreter (outside Drawflow) to execute the saved JSON sequentially and log per‑node outputs, proving editor→runtime handshake.

## Decision Guidance Fit Notes

- Best fit when you need an embeddable, minimal node editor with full control over UX and a custom runtime, and when Vue or plain HTML nodes are acceptable. [1]
- Not a fit if you need an out‑of‑the‑box automation runtime, schedulers, retries, or a large connector catalog; those are out of scope. [1][2]

## Next Steps

- Spike: embed Drawflow, build 3 nodes, save/load JSON, and emit validation events. [1]
- Decide on node schema and mapping from exported JSON to your execution model.
- Evaluate theming with the theme generator for brand alignment. [2]
- If TypeScript is required, adopt `@types/drawflow` and add runtime guards around editor API. [1]

References:
- [1] https://github.com/jerosoler/Drawflow
- [2] https://jerosoler.github.io/Drawflow/