# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Run Next.js dev server (port 3002) and Convex backend in parallel
pnpm dev

# Or run separately:
pnpm --filter merke-am-app dev        # Next.js app
pnpm --filter merke-am-app convex:dev  # Convex backend
```

### Build and Type Checking
```bash
pnpm run build          # Build all apps in monorepo
pnpm run check-types    # TypeScript type checking
pnpm run lint          # ESLint with max-warnings 0
```

### Convex Backend
```bash
pnpm run convex:dev       # Local development with hot reload
pnpm run convex:push      # Push schema changes
pnpm run convex:deploy    # Deploy to production
pnpm run convex:dashboard # Open Convex dashboard
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, React Compiler enabled
- **Styling**: Tailwind CSS v4, Radix UI components, custom `@merke/brand` design tokens
- **Backend**: Convex for realtime database, auth, and serverless functions
- **AI**: Convex Agent + RAG with OpenAI integration
- **Web3**: Reown AppKit + Wagmi for wallet connectivity

### Project Structure
- **Monorepo**: Turborepo with pnpm workspaces
- **Main app**: Located at `apps/app/` (this directory)
- **Convex backend**: `convex/` directory with components, schema, and actions
- **UI Components**: `src/components/` with React Flow for canvas features
- **Shared packages**: `@repo/ui`, `@merke/brand` workspace dependencies

### Key Convex Components
- **Agent & RAG**: `convex/agent.ts` and `convex/rag.ts` - AI chat with semantic search
- **Auth**: `convex/auth.ts` - ConvexCredentials for address-based authentication
- **Canvas**: `convex/canvas.ts` and `convex/collab.ts` - Realtime collaborative features
- **Schema**: `convex/schema.ts` - Database tables including users, messages, presence, canvas_nodes

### Path Aliases
- `@/*` and `@app/*`: Maps to `./src/*`
- `@convex/*`: Maps to `./convex/*`

### Environment Variables
Required in `.env`:
- `NEXT_PUBLIC_PROJECT_ID`: Reown Cloud project ID
- `OPENAI_API_KEY`: For Convex Agent/RAG functionality

### Important Configuration
- React Compiler is enabled in `next.config.ts`
- Workspace packages (`@repo/ui`, `@merke/brand`) are transpiled
- Convex components (agent, rag) are configured in `convex/convex.config.ts`