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