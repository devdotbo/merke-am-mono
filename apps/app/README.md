## merke.am — dApp (App)

The Merke dApp is a production-ready Next.js 15 application that integrates:

- Reown AppKit + Wagmi for wallet connection and onchain UX
- Convex for realtime backend, auth, and serverless functions
- Convex Agents + RAG for AI-assisted workflows powered by OpenAI
- Tailwind 4 + Radix UI + custom `@merke/brand` design tokens

This app lives at `apps/app` and runs on port 3002 in development.

### Highlights

- Wallet connect via Reown AppKit and Wagmi
- Auth foundation via Convex Credentials provider (SIWE-style address linking)
- AI Agent with thread-based chat and semantic context (RAG)
- Extensible schema and HTTP routes using Convex components
- Modern React 19 with the React Compiler enabled

### Tech stack

- Next.js 15 (App Router) and React 19
- Wagmi 2 + `viem`, Reown AppKit (`@reown/appkit`) with `@reown/appkit-adapter-wagmi`
- Convex 1.x with `@convex-dev/agent` and `@convex-dev/rag`
- OpenAI via `@ai-sdk/openai`
- Tailwind CSS v4, Radix UI, Framer Motion

---

### Getting started

1) Install tools

```bash
pnpm -v   # requires pnpm 9+
node -v   # requires Node 18+
pnpm i
```

2) Configure environment

Create `apps/app/.env` with:

```bash
# Reown AppKit (from Reown Cloud project)
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id

# OpenAI (used by Convex Agent + RAG)
OPENAI_API_KEY=sk-...

# Optional Convex settings for deployed environments
# CONVEX_DEPLOYMENT="<team>/<project>"
```

3) Run the app and Convex locally (two terminals)

```bash
# Terminal A – Next.js app (port 3002)
pnpm --filter merke-am-app dev

# Terminal B – Convex dev (hot reload functions)
pnpm --filter merke-am-app convex:dev
```

You can also run all apps from the monorepo root with turbo:

```bash
pnpm dev
```

---

### Scripts

```bash
pnpm run dev            # next dev --turbopack --port 3002
pnpm run build          # next build
pnpm run start          # next start
pnpm run lint           # eslint . --max-warnings 0
pnpm run check-types    # tsc --noEmit

pnpm run convex:dev     # convex dev
pnpm run convex:push    # convex push (after schema changes)
pnpm run convex:deploy  # convex deploy
pnpm run convex:dashboard
```

---

### Architecture

- Convex components are enabled in `convex/convex.config.ts`.
- Auth is scaffolded in `convex/auth.ts` using `ConvexCredentials` (address-based auth).
- Agent and RAG live in:
  - `convex/agent.ts` — thread creation and `askAgent` entrypoint
  - `convex/rag.ts` — `ragAddText` and `ragSearch` helpers
- Data schema in `convex/schema.ts` (`users`, `messages`, plus auth tables)
- HTTP routes exposed via `convex/http.ts` (auth endpoints)

Rough flow:

1. User connects wallet (Reown AppKit + Wagmi)
2. Optionally sign in to link onchain address (Convex Credentials)
3. User asks the Support Agent → `askAgent` searches RAG for context → LLM response
4. Threads and messages can be stored/extended via `messages` table

---

### Working with the Agent and RAG

- Add knowledge:

```ts
// convex/rag.ts
await rag.add(ctx, { namespace: "global", text: "Your docs or snippets" });
```

- Query with semantic context:

```ts
// convex/agent.ts
const { text } = await thread.generateText({
  prompt: `# Context\n\n${context.text}\n\n---\n\n# Question\n\n"""${prompt}"""`
});
```

Namespaces can be per-user for private knowledge, or `global` for shared.

---

### 0G integration (planned)

This app is designed to integrate 0G in upcoming iterations. Planned touch points:

- Provider/SDK wiring alongside Wagmi (if EVM-compatible) or via a dedicated client
- Agent tool/function to read/write 0G state within Convex actions
- RAG ingestion of 0G-hosted data as a namespace

Implementation will land behind feature flags and environment variables.

---

### Directory layout

```
apps/app
├─ convex/                 # Convex components, schema, actions
├─ public/
└─ src/
   ├─ app/                # Next.js routes
   ├─ components/         # UI, wallet connect, etc.
   └─ lib/
```

Notable files:

- `src/components/ConnectButton.tsx` — AppKit + Wagmi connect UI
- `convex/agent.ts` — Support Agent + `askAgent` action
- `convex/rag.ts` — RAG add/search actions

---

### Deployment

- Frontend: Vercel (Next.js 15)
- Backend: Convex Cloud (use `convex deploy`); set envs on both

Ensure `NEXT_PUBLIC_PROJECT_ID` and `OPENAI_API_KEY` are set in your hosting provider.

---

### Related

- Landing site: `../landing` (port 3000)
- Docs app: `../docs` (port 3001)
- Monorepo overview: `../../README.md`

---

### Resources

- Reown — `https://docs.reown.com`
- Wagmi — `https://wagmi.sh`
- Convex — `https://docs.convex.dev`
- Next.js — `https://nextjs.org/docs`
