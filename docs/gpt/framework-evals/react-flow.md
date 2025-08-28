# React Flow — Embeddable n8n-like Editor Evaluation

- Source: docs/gpt/n8n-like-options.md (single source)

## Overview

React Flow is listed as a mature React graph/canvas library suitable for building a custom visual workflow builder.

## Embeddability

Identified as ideal to embed a custom builder in React.

## Node/Edge Model

Not specified in source file.

## Execution Considerations

For a build-your-own editor track (e.g., React Flow), execution engine, persistence, logs, retry, and connectors must be implemented separately.

## Integrations

Not specified in source file.

## Observability & Collaboration

Not specified in source file.

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

## Decision Guidance Fit Notes

- Preferable when deep in-app UX parity with custom security/tenancy is needed (build-your-own track)

## Next Steps

- Spike 1: React Flow editor + minimal executor (1–2 days)
