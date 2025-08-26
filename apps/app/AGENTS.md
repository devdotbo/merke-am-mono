# AGENTS.md

## Project overview

This package (`apps/app`, name: `merke-am-app`) is a Next.js 15 + React 19 dApp that integrates:
- Reown AppKit + Wagmi for wallet connection
- Convex for realtime backend, auth, and serverless functions
- Convex Agents + RAG for AI-assisted workflows (OpenAI)
- Tailwind CSS v4 + Radix UI

Dev server runs on port 3002.

## Setup commands

```bash
# Require Node >= 18 and pnpm >= 9
pnpm -v
node -v

# Install workspace deps from the monorepo root
pnpm i
```

## Environment variables

Create `apps/app/.env` with at least:

```bash
# Reown AppKit (from Reown Cloud project)
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id

# OpenAI (used by Convex Agent + RAG)
OPENAI_API_KEY=sk-...

# Optional Convex settings for deployed envs
# CONVEX_DEPLOYMENT="<team>/<project>"
```

Never commit secrets. Set them in Vercel (frontend) and Convex (backend) for deployments.

## Common commands

From the monorepo root using filters:

```bash
# Dev (Next.js, port 3002)
pnpm --filter merke-am-app dev

# Convex dev (hot reload functions)
pnpm --filter merke-am-app convex:dev

# Build / Start
pnpm --filter merke-am-app build
pnpm --filter merke-am-app start

# Static checks
pnpm --filter merke-am-app lint           # eslint . --max-warnings 0
pnpm --filter merke-am-app check-types    # tsc --noEmit

# Convex utilities
pnpm --filter merke-am-app convex:push
pnpm --filter merke-am-app convex:deploy
pnpm --filter merke-am-app convex:dashboard
```

From inside `apps/app` you can omit the filter and run the same scripts directly:

```bash
pnpm dev
pnpm convex:dev
pnpm build && pnpm start
pnpm lint && pnpm check-types
```

Run the app and backend locally in two terminals:

```bash
# Terminal A – Next.js app
pnpm --filter merke-am-app dev

# Terminal B – Convex dev
pnpm --filter merke-am-app convex:dev
```

## Code style and conventions

- TypeScript via workspace config (`@repo/typescript-config/nextjs.json`). Treat the codebase as strict: avoid `any`, fix type errors before commit.
- ESLint config comes from `@repo/eslint-config/next-js`. Lint must be clean (no warnings allowed by CI rule `--max-warnings 0`).
- React 19 with the React Compiler enabled globally in `next.config.ts` (`experimental.reactCompiler: true`). Keep global compilation mode; do not switch to annotation mode.
- Prefer functional React patterns; keep components small and typed.
- Follow existing import path aliases: `@/*`, `@app/*`, `@convex/*`.

## Testing and CI expectations

- This package currently has no test runner configured. Use the following gates locally and in CI:
  - Lint: `pnpm --filter merke-am-app lint`
  - Types: `pnpm --filter merke-am-app check-types`
- If you add tests later, expose them via `pnpm test` and document the runner.

## PR instructions

- Title format: `[merke-am-app] <Title>`
- Before committing/pushing:
  - Run `pnpm --filter merke-am-app lint`
  - Run `pnpm --filter merke-am-app check-types`
  - Build if relevant: `pnpm --filter merke-am-app build`
- Update docs (README/AGENTS.md) when changing scripts, envs, or developer flow.

## Security notes

- Do not log or commit secrets (e.g., `OPENAI_API_KEY`).
- When working with Convex deploys, ensure environment variables are present in both Convex and the frontend host.

## Helpful context for agents

- Next.js configuration transpiles workspace packages `@repo/ui` and `@merke/brand`.
- Webpack externals include `pino-pretty`, `lokijs`, `encoding` for server compatibility.
- Convex components live under `apps/app/convex/` (`agent.ts`, `rag.ts`, `auth.ts`, `http.ts`, `schema.ts`).
- UI and routes live under `apps/app/src/`.

## Where to start

- Wallet connect UI: `src/components/ConnectButton.tsx`
- Agent entrypoint: `convex/agent.ts` (`askAgent` / thread-based chat)
- RAG helpers: `convex/rag.ts`
- Schema: `convex/schema.ts`
- HTTP routes: `convex/http.ts`
