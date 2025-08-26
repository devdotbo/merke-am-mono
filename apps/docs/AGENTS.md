# AGENTS.md — Docs App (Fumadocs)

This file gives coding agents precise instructions to work on the `apps/docs` package.

## Project overview

- Next.js app using Fumadocs (MDX) for documentation
- Runs on port 3001 in development
- Lives at `apps/docs`

## Setup commands

- Install deps (monorepo root):
  - `pnpm install`
- Install deps (scoped):
  - `pnpm install --filter merke-am-docs`

## Dev and build

- Start dev server (from package dir):
  - `pnpm dev`  → http://localhost:3001
- Start dev server (from repo root):
  - `pnpm --filter merke-am-docs dev`
- Build:
  - `pnpm build`
- Start production server:
  - `pnpm start`

## Testing and checks

- Type checks:
  - `pnpm check-types`
- Lint (fail on warnings):
  - `pnpm lint`
- Turbo (from repo root):
  - `pnpm turbo run check-types --filter merke-am-docs`
  - `pnpm turbo run lint --filter merke-am-docs`

## Code style and conventions

- TypeScript: strict mode enabled (see `@repo/typescript-config/nextjs.json` → strict via base config)
- Use functional React patterns; React 19 with hooks
- Follow shared ESLint config `@repo/eslint-config/next-js` with Next.js and React Hooks rules
- Avoid suppressing lint rules; fix issues to keep CI green

## Content structure

- MDX content under `content/docs/*.mdx`
- App routes and layouts in `app/`
- Search route at `app/api/search/route.ts`
- Source config in `source.config.ts`

## Common tasks

- Add a new doc page:
  - Create `content/docs/<slug>.mdx`
  - Update navigation in `app/layout.config.tsx` if needed
- Add a custom component for MDX:
  - Export in `mdx-components.tsx` and import where required

## Monorepo tips

- Use filters to scope commands:
  - `pnpm --filter merke-am-docs <script>`
- Shared packages: `@merke/brand`, `@repo/*`

## CI expectations

- Before committing or opening PRs, run:
  - `pnpm lint` and `pnpm check-types`
  - Ensure `pnpm build` succeeds locally

## Security and environment

- No secrets required for local dev
- Static-friendly; can deploy to Vercel

## Reference

- AGENTS.md format and examples: `https://agents.md/#examples`


