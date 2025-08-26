## merke.am — Landing (Marketing Site)

The Landing app is the marketing front page for Merke. It is a Next.js 15 site styled with Tailwind 4 and our shared `@merke/brand` tokens. It lives at `apps/landing` and runs on port 3000 in development.

### Features

- Lightweight marketing site, optimized for performance
- Shared brand tokens via `@merke/brand`
- Dark mode via `next-themes`
- Radix UI primitives and Framer Motion accents

### Getting started

```bash
pnpm i
pnpm --filter merke-am-landing dev  # http://localhost:3000
```

From the repo root you can also run:

```bash
pnpm dev
```

### Directory layout

```
apps/landing
├─ src/
│  ├─ app/           # routes and layout
│  └─ components/    # hero, sections, nav
└─ public/
```

### Editing content

- Update copy and sections in `src/app/page.tsx` and related components.
- Global styles are provided by `@merke/brand`; override tokens as needed.

### Deployment

- Recommended: Vercel. Set any required environment variables there.

### Related

- dApp: `../app` (port 3002)
- Docs: `../docs` (port 3001)
