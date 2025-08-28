## Overview
Node-RED is an open-source, flow-based automation tool built on Node.js. It provides a browser-based editor for wiring nodes that pass JSON-like `msg` objects between steps. Popular in IoT/edge, it’s also suitable for general HTTP/data automations and can be fully self-hosted.

## Embedding model
- Use as a module inside an Express app (embed the runtime), mount the admin/editor on a subpath, and control auth/features via `settings.js` (`adminAuth`, `httpNodeAuth`, `editorTheme`, palette filters).
- Or host separately and embed the editor via reverse proxy/iframe with SSO at the gateway. True multi-tenant isolation typically means running separate runtimes per tenant.

## Licensing
Apache-2.0 (core/editor). Community nodes are npm packages with varied OSS licenses; verify on a per-node basis. Business-friendly for self-hosting.

## Execution engine
Event-driven Node.js runtime; nodes handle async work and pass `msg` forward. Triggers include webhooks (HTTP In), timers (Inject), MQTT, file, and more. Error handling via Catch/Status nodes; retries/backoff implemented at node/flow level. Supports context stores, environment vars/secrets, and run/debug logs.

## Connectors/integrations
Large catalog (core + community): HTTP/REST, MQTT, WebSockets, TCP/UDP, email, files, databases (Postgres, MySQL, Mongo, Redis), and many cloud/SaaS services. Custom nodes authored in JavaScript and published to npm.

## Embedding friction
Editor is a full-page web app, not a React widget. Theming and palette curation exist, but deep white-labeling and granular in-app embedding are limited. RBAC is basic; per-workspace isolation and multi-tenant within one runtime are non-trivial. Projects/Git help with versioning, but enterprise change control requires process.

## Pros
- Mature OSS, active ecosystem, easy self-hosting
- Rich protocol support (IoT-first) and many connectors
- Fast to prototype; powerful Function node (JS)
- Extensible via custom nodes; good debugging UX
- Apache-2.0 license

## Cons
- Editor not designed for fine-grained in-app embedding
- Limited RBAC; multi-tenant isolation requires multiple runtimes
- Branding/theming flexibility is constrained
- Connector quality varies across community nodes
- Type/schema validation is manual per node/flow

## POC steps
- Deploy Node-RED (container or module in Express); configure `adminAuth` and subpath
- Create minimal flow: HTTP In → Function (transform) → HTTP Request → Debug
- Package one custom node (Transform with schema guards) and load locally
- Embed editor behind reverse proxy/iframe; restrict palette via `editorTheme`
- Validate webhooks, schedules, secrets, logs; export/import flows via Projects

## Recommendation
Use Node-RED when you need fast, self-hosted automation with strong IoT/protocol support and a ready runtime. If you need a deeply embedded, brand-matched builder with strict multi-tenant isolation, prefer building with React Flow/Rete.js or evaluate Activepieces for productized automation.