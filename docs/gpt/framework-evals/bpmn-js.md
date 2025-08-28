### Overview
`bpmn-js` is a browser-based BPMN 2.0 renderer/modeler from bpmn.io. It offers a rich, standards-compliant editor, not a runtime.

### Embedding model
- Import as ESM; mount `Modeler` into a DOM node.
- Integrate with React/Vue via thin wrappers; use APIs/events.
- Save/load BPMN XML; export SVG; extend via modules (palette, context pad, properties panel).

### Licensing
MIT. Commercial support via Camunda/bpmn.io.

### Execution engine
None. Pair with Camunda 7/8 (Zeebe), Flowable, or jBPM to execute BPMN XML.

### Connectors/integrations
None built-in. Use engine-side connectors/job workers; attach metadata via BPMN extension elements.

### Embedding friction
- You own XML persistence, validation, and versioning.
- Custom tasks need extension elements and custom renderers.
- Properties panel/forms are separate packages; theming via CSS.

### Pros
- Standards-based BPMN; mature, well-documented.
- Powerful modeling UX; reliable import/export.
- Highly extensible via modules and moddle extensions.
- Large ecosystem (Camunda/Zeebe/Flowable).

### Cons
- No executor; separate engine and infrastructure required.
- BPMN semantics add learning curve for non-experts.
- Harder to mimic n8n-like node UX than generic canvas libs.
- No connector catalog, run logs, or retries out of the box.

### POC steps
1) Embed `bpmn-js` in a React page with properties panel.
2) Model StartEvent → ServiceTask (HTTP) → EndEvent; add extension metadata.
3) Export BPMN XML and deploy to Camunda 8 (Zeebe) or Camunda 7.
4) Implement a worker/connector to perform the HTTP call; run a test.
5) Show run status via engine APIs and link to the diagram.

### Recommendation
Adopt `bpmn-js` when BPMN compliance and engine-backed execution are required. For an n8n-like in-app builder, prefer `React Flow` (build) or `Activepieces` (buy).

### Extension architecture quick guide
- Properties: use `bpmn-js-properties-panel` and `bpmn-properties-panel` (new) with `bpmn-js` to edit element attributes.
- Moddle: define extension elements via a `moddle` JSON schema to store custom metadata on tasks/events.
- Custom renderers: provide modules to render custom icons/shapes (e.g., a custom ServiceTask).
- Validation: implement rule checks using `diagram-js` rules or validate exported XML server-side.

### Embedding checklist
1) Mount `Modeler` in a React component; wrap import/export and command stack undo/redo.
2) Add properties panel and a basic palette with custom entries.
3) Persist BPMN XML with versioning and migration plan; store alongside deployment metadata.
4) Integrate with an engine API (Camunda 8/Zeebe or 7): deploy, start process, correlate messages, fetch incidents.
5) Add overlays for run state (token position) using engine data.

### Fit signals
- Need BPMN 2.0 diagrams with portability across engines.
- Teams familiar with BPMN semantics and ops for an external engine.
- Desire to separate modeling (front-end) from execution (back-end).

### Anti‑signals / risks
- Product requires an n8n-like canvas (non‑BPMN UX) with domain‑specific nodes.
- Limited capacity to operate Camunda/Zeebe/Flowable infrastructure.
- Heavy customization of properties panel/themes beyond CSS tolerance.

### Open questions to validate
- Which engine? (Camunda 8 vs 7 vs Flowable) and required SLAs.
- Multi‑tenancy: per-tenant models and deployments; XML governance and approvals.
- Versioning: process version migration strategy; rollback plan.
- Task workers: language/SDK choice, retries/backoff, and dead‑letter handling.

### References (last reviewed: 2025‑08‑28)
- Docs: [bpmn.io](https://bpmn.io)
- Properties panel: [bpmn-io/bpmn-properties-panel](https://github.com/bpmn-io/bpmn-properties-panel)
- Camunda 8 (Zeebe): [docs.camunda.io](https://docs.camunda.io)