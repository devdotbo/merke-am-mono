## merke.am — Docs (Fumadocs)

The Docs app powers the developer and user documentation for Merke using Fumadocs. It lives at `apps/docs` and runs on port 3001 in development.

### Features

- Fumadocs UI + MDX content
- Shared brand via `@merke/brand`
- Content-driven routing with search endpoint

### Getting started

```bash
pnpm i
pnpm --filter merke-am-docs dev  # http://localhost:3001
```

From the repo root you can also run:

```bash
pnpm dev
```

### Directory layout

```
apps/docs
├─ content/          # MDX sources
├─ src/app/docs/     # pages
├─ src/lib/          # source config
└─ app/api/search/   # docs search route
```

### Editing content

- Author docs in `apps/docs/content/docs/*.mdx`.
- Adjust layout and navigation in `apps/docs/app` and `layout.config.tsx`.

### Deployment

- Recommended: Vercel. No database required; static output or SSR.

### Related

- Landing: `../landing` (marketing)
- dApp: `../app` (product)

