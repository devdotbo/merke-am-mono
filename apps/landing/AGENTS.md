# AGENTS.md — Landing

## Project overview

- Next.js 15 marketing site for Merke.
- Lives in `apps/landing`; runs on port 3000 in development.
- Tailwind CSS v4 with shared brand tokens from `@merke/brand`.
- React 19, Radix UI, Framer Motion accents.

## Setup commands

- Install deps (repo root): `pnpm install`
- Start dev (this package, from repo root): `pnpm --filter merke-am-landing dev`
- Start dev (from this directory): `pnpm dev`  
  Dev server: `http://localhost:3000`
- Build (this package): `pnpm --filter merke-am-landing build`
- Start production (this package): `pnpm --filter merke-am-landing start`
- Lint (this package): `pnpm --filter merke-am-landing lint`
- Typecheck (this package): `pnpm --filter merke-am-landing check-types`

## Code style

- TypeScript strict mode is enabled via shared config (`@repo/typescript-config/nextjs.json`).
- ESLint flat config via `@repo/eslint-config/next-js` with React Hooks and Next.js rules.
- Prefer functional React components and hooks; follow `react-hooks` rules.
- Use Tailwind v4 utilities; prefer tokenized styles from `@merke/brand` where possible.
- Client Components only when needed; add `"use client"` at the top when required.
- No `prop-types`; rely on TypeScript types.

## Dev environment tips

- From the repo root, scope commands to this package with `--filter merke-am-landing`.
- Jump to this package with: `pnpm dlx turbo run where merke-am-landing`.
- Add a dependency to this package: `pnpm add <pkg> --filter merke-am-landing`.
- Remove a dependency from this package: `pnpm remove <pkg> --filter merke-am-landing`.

## Testing instructions

- This package currently has no test suite.
- Before commits/PRs, run:  
  `pnpm --filter merke-am-landing lint` and `pnpm --filter merke-am-landing check-types`.

## PR instructions

- Title format: `[landing] <short summary>`
- Always run `pnpm --filter merke-am-landing lint` and `pnpm --filter merke-am-landing check-types` before committing.
- Validate the page renders without console errors in dev: `http://localhost:3000`.

## Security considerations

- This is a static/marketing site; avoid secrets in client code.
- Any public env vars (`NEXT_PUBLIC_*`) are embedded at build time; treat them as non-secret.

## Directory hints

- Routes/layout: `app/`
- UI and sections: `components/`
- Utilities: `lib/`

---

This file follows the open AGENTS.md guidance. See examples at [agents.md — Examples](https://agents.md/#examples).


