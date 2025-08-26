## merke.am — Monorepo

Monorepo for the Merke dApp, landing site, and docs. Built with Next.js 15, Turbo, and Convex. Wallet UX via Reown AppKit + Wagmi, with Convex Agents + RAG providing AI support. Preparing for 0G integration.

### Apps

- apps/landing — marketing site (port 3000)
- apps/docs — documentation site (port 3001)
- apps/app — dApp product (port 3002)

### Packages

- packages/ui — shared UI components
- packages/eslint-config — internal ESLint presets
- packages/typescript-config — TS configs
- packages/brand — shared brand tokens and CSS

### Prerequisites

- Node >= 18
- pnpm 9

### Install

```bash
pnpm i
```

### Develop (all apps)

```bash
pnpm dev
```

Or run an app individually:

```bash
pnpm --filter merke-am-landing dev  # :3000
pnpm --filter merke-am-docs dev     # :3001
pnpm --filter merke-am-app dev      # :3002
```

### Build

```bash
pnpm build
```

### Lint & Types

```bash
pnpm lint
pnpm check-types
```

### dApp quickstart

Set env vars in `apps/app/.env`:

```
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id
OPENAI_API_KEY=sk-...
```

Run app + Convex:

```bash
pnpm --filter merke-am-app dev
pnpm --filter merke-am-app convex:dev
```

### 0G integration (planned)

- Wire 0G client/SDK next to Wagmi when available
- Add Convex actions/tools for 0G read/write
- RAG ingestion of 0G-sourced data

### Repository scripts

```json
{
  "build": "turbo run build",
  "dev": "turbo run dev",
  "lint": "turbo run lint",
  "check-types": "turbo run check-types"
}
```

### Links

- dApp README — `apps/app/README.md`
- Landing README — `apps/landing/README.md`
- Docs README — `apps/docs/README.md`
