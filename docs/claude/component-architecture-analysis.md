# Component Architecture Analysis

## Executive Summary

This analysis examines the front-end component architecture of the merke.am React/Next.js application, a Web3-enabled collaborative platform featuring real-time canvas collaboration, chat functionality, and blockchain integration. The application demonstrates modern patterns but shows opportunities for architectural improvements in component organization, state management, and code reusability.

## 1. Component Hierarchy and Organization

### Current Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page with dual-pane layout
├── components/
│   ├── ui/                # Reusable UI primitives
│   │   ├── button.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── input.tsx
│   ├── CanvasCollab.tsx  # Canvas collaboration component (325 lines)
│   ├── ChatBox.tsx       # Chat component (76 lines)
│   ├── AppHeader.tsx     # Application header with wallet connection
│   ├── AppShowcase.tsx   # Landing/demo component (372 lines)
│   ├── ActionButtonList.tsx
│   ├── ConnectButton.tsx
│   ├── InfoList.tsx
│   ├── mode-toggle.tsx
│   └── theme-provider.tsx
├── context/
│   ├── index.tsx          # Main context provider wrapper
│   └── AuthBridge.tsx     # Authentication synchronization
├── hooks/
│   └── useClientMount.ts  # Custom hook for client-side mounting
└── lib/
    └── utils.ts           # Utility functions (cn for classnames)
```

### Strengths
- Clear separation between pages, components, and utilities
- UI primitives properly isolated in `/ui` subdirectory
- Context providers centralized in dedicated folder
- Follows Next.js 15 App Router conventions

### Weaknesses
- **Large monolithic components**: `CanvasCollab.tsx` (325 lines) and `AppShowcase.tsx` (372 lines) violate single responsibility principle
- **Mixed abstraction levels**: Business logic mixed with presentation in major components
- **Inconsistent naming**: Mix of PascalCase and kebab-case files (`mode-toggle.tsx` vs `ModeToggle.tsx`)
- **No feature-based organization**: Components grouped by type rather than feature/domain

### Recommendations
1. Adopt feature-based folder structure:
```
src/
├── features/
│   ├── canvas/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── chat/
│   └── wallet/
```
2. Standardize file naming convention (prefer PascalCase for components)
3. Extract business logic into custom hooks or services

## 2. Component Reusability and Composition Patterns

### Current Patterns

#### Compound Components
The application uses basic composition but lacks sophisticated compound component patterns:

```tsx
// Current: Simple composition in page.tsx
<div className="grid lg:grid-cols-2 gap-6">
  <div>
    <ChatBox />
  </div>
  <div>
    <CanvasCollab />
  </div>
</div>
```

#### UI Primitives
Well-implemented variant-based components using class-variance-authority:

```tsx
// Good pattern in button.tsx
const buttonVariants = cva(
  "inline-flex items-center...",
  {
    variants: {
      variant: { default, outline, ghost, link },
      size: { default, sm, lg, icon }
    }
  }
);
```

### Weaknesses
- **Limited component reusability**: Major components (`CanvasCollab`, `ChatBox`) are tightly coupled to specific use cases
- **Duplicate code patterns**: Similar cursor/presence logic appears in multiple places
- **No shared component library**: Despite monorepo structure, limited shared components between apps

### Recommendations
1. Create more granular, reusable components:
```tsx
// Extract reusable Canvas primitive
interface CanvasProps {
  children: ReactNode;
  onNodeUpdate?: (nodes: Node[]) => void;
  viewControls?: boolean;
}

// Extract Cursor component
interface CursorProps {
  position: { x: number; y: number };
  user: { name: string; color: string };
  isLocal?: boolean;
}
```

2. Implement compound component pattern for complex UIs:
```tsx
<Canvas>
  <Canvas.Viewport>
    <Canvas.Nodes />
    <Canvas.Connections />
  </Canvas.Viewport>
  <Canvas.Controls />
  <Canvas.Cursors />
</Canvas>
```

## 3. Props Drilling vs Context Usage

### Current State Management

#### Context Usage
- **ConvexAuthProvider**: Authentication state
- **WagmiProvider**: Web3 wallet state
- **ThemeProvider**: Theme management
- **QueryClientProvider**: React Query for server state

#### Props Drilling Issues
Minimal props drilling due to heavy reliance on hooks, but this creates other issues:

```tsx
// CanvasCollab.tsx - Everything is self-contained
export function CanvasCollab({ roomId = "home" }: { roomId?: string }) {
  // 20+ useState hooks
  // Direct Convex mutations
  // All logic contained within component
}
```

### Weaknesses
- **Over-reliance on component-level state**: Complex state logic embedded in components
- **No application-level state management**: Missing global state for UI concerns
- **Tight coupling to data layer**: Components directly call Convex APIs

### Recommendations
1. Introduce Zustand or Jotai for UI state management
2. Create data access layer abstraction:
```tsx
// features/canvas/hooks/useCanvasData.ts
export function useCanvasData(roomId: string) {
  const nodes = useQuery(api.canvas.listNodes, { roomId });
  const updateNode = useMutation(api.canvas.upsertNode);
  
  return {
    nodes,
    updateNode: useCallback((node) => {...}, []),
    // Other canvas operations
  };
}
```

## 4. Component Splitting Strategies

### Current Issues

#### CanvasCollab.tsx Analysis
The component handles multiple responsibilities:
- Node management (CRUD operations)
- View controls (pan, zoom)
- Cursor tracking and presence
- Drag and drop
- User preferences (username, color)
- Network synchronization

```tsx
// Current: 325 lines of mixed concerns
export function CanvasCollab({ roomId = "home" }) {
  // 15+ state variables
  // 10+ event handlers
  // 5+ useEffect hooks
  // Direct DOM manipulation
  // Business logic
  // Presentation logic
}
```

### Recommendations

1. **Split by responsibility**:
```tsx
// components/Canvas/index.tsx
export function Canvas({ roomId }) {
  return (
    <CanvasProvider roomId={roomId}>
      <CanvasViewport />
      <CanvasNodes />
      <CanvasControls />
      <CanvasCursors />
    </CanvasProvider>
  );
}

// components/Canvas/hooks/useCanvasState.ts
export function useCanvasState() {
  const { nodes, updateNode } = useCanvasData();
  const { view, pan, zoom } = useViewportControls();
  return { nodes, updateNode, view, pan, zoom };
}
```

2. **Extract presentation from logic**:
```tsx
// Presentational component
function NodeRenderer({ node, isSelected, onSelect }) {
  return (
    <motion.div className={styles.node} onClick={onSelect}>
      {node.icon}
      <span>{node.label}</span>
    </motion.div>
  );
}

// Container component with logic
function NodeContainer({ nodeId }) {
  const node = useNode(nodeId);
  const [isSelected, select] = useNodeSelection(nodeId);
  return <NodeRenderer node={node} isSelected={isSelected} onSelect={select} />;
}
```

## 5. Custom Hooks Implementation

### Current Custom Hooks

#### useClientMount.ts
Simple but effective pattern for SSR safety:
```tsx
export function useClientMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
```

### Missing Custom Hooks

The codebase would benefit from extracting repeated patterns:

1. **useLocalStorage** - Currently implemented inline multiple times:
```tsx
// Repeated pattern in CanvasCollab and ChatBox
const [username, setUsername] = useState("guest");
useEffect(() => {
  const stored = window.localStorage.getItem("canvas.username");
  if (stored) setUsername(stored);
}, []);
```

2. **usePresence** - Complex cursor/presence logic repeated:
```tsx
// Should be extracted from CanvasCollab
export function usePresence(roomId: string) {
  const updatePresence = useMutation(api.collab.updatePresence);
  const presences = useQuery(api.collab.listPresence, { roomId });
  // Heartbeat logic
  // Cursor tracking
  return { presences, updatePresence };
}
```

3. **useCanvasGestures** - Pan, zoom, drag logic:
```tsx
export function useCanvasGestures(containerRef: RefObject<HTMLElement>) {
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  // Pan handling
  // Zoom handling
  // Drag handling
  return { view, handlers };
}
```

### Recommendations
1. Create a comprehensive hooks library:
```
src/hooks/
├── useLocalStorage.ts
├── useSessionStorage.ts
├── usePresence.ts
├── useCanvasGestures.ts
├── useDebounce.ts
└── useThrottle.ts
```

## 6. Component Naming Conventions

### Current Inconsistencies

- **File naming**: Mixed conventions (`mode-toggle.tsx` vs `ModeToggle.tsx`)
- **Component exports**: Mix of default and named exports
- **Props interfaces**: Inconsistent naming (some use `Props` suffix, others don't)

### Recommendations

1. **Standardize naming conventions**:
```tsx
// File: ComponentName.tsx
export interface ComponentNameProps {
  // props
}

export function ComponentName(props: ComponentNameProps) {
  // implementation
}
```

2. **Consistent file structure**:
```
ComponentName/
├── index.tsx        # Main component
├── types.ts         # TypeScript types
├── styles.module.css # Component styles
└── utils.ts         # Component-specific utilities
```

## 7. Folder Structure Effectiveness

### Current Structure Analysis

**Strengths:**
- Clear separation of concerns at top level
- Proper use of Next.js App Router conventions
- Dedicated folders for context and hooks

**Weaknesses:**
- Flat component structure leads to poor discoverability
- No clear feature boundaries
- Missing tests directory structure
- No storybook or component documentation

### Recommended Structure

```
src/
├── features/           # Feature-based modules
│   ├── canvas/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── chat/
│   ├── wallet/
│   └── shared/
├── components/        # Shared UI components
│   ├── ui/           # Primitive components
│   └── layout/       # Layout components
├── hooks/            # Global hooks
├── lib/              # Utilities and helpers
├── styles/           # Global styles
└── types/            # Global TypeScript types
```

## Specific Code Examples from Codebase

### Issue 1: Monolithic Component State Management

**Current (CanvasCollab.tsx lines 34-68):**
```tsx
const [cursor, setCursor] = useState({ x: 120, y: 120 });
const [username, setUsername] = useState("guest");
const [color, setColor] = useState(palette[0]);
const [nodes, setNodes] = useState<Array<NodeItem>>([]);
const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
const [draggingId, setDraggingId] = useState(null);
const [panning, setPanning] = useState(false);
// ... continues with more state
```

**Recommended Refactor:**
```tsx
// hooks/useCanvasState.ts
export function useCanvasState(roomId: string) {
  const user = useUserPreferences();
  const viewport = useViewport();
  const nodes = useNodesManager(roomId);
  const interaction = useInteractionState();
  
  return { user, viewport, nodes, interaction };
}
```

### Issue 2: Inline Business Logic

**Current (ChatBox.tsx lines 38-47):**
```tsx
async function handleSend() {
  const text = message.trim();
  if (!text) return;
  setMessage("");
  if (!isAuthenticated) {
    alert("Please sign in with your wallet to chat.");
    return;
  }
  await send({ threadId, content: text, clientId, username });
}
```

**Recommended Refactor:**
```tsx
// features/chat/hooks/useChatActions.ts
export function useChatActions() {
  const { isAuthenticated } = useAuth();
  const send = useMutation(api.chat.send);
  
  const sendMessage = useCallback(async (content: string) => {
    if (!isAuthenticated) {
      throw new ChatError("Authentication required");
    }
    return send({ content, ...metadata });
  }, [isAuthenticated, send]);
  
  return { sendMessage };
}
```

### Issue 3: Duplicate Authentication Pattern

**Current (Multiple components check authentication similarly):**
```tsx
// AppHeader.tsx
const { address, isConnected } = useAppKitAccount();

// ChatBox.tsx
const { isAuthenticated } = useConvexAuth();

// AppShowcase.tsx
const mounted = useClientMounted();
const canAsk = mounted && isConnected;
```

**Recommended Refactor:**
```tsx
// hooks/useAuthState.ts
export function useAuthState() {
  const { address, isConnected } = useAppKitAccount();
  const { isAuthenticated } = useConvexAuth();
  const mounted = useClientMounted();
  
  return {
    isWalletConnected: mounted && isConnected,
    isAuthenticated: mounted && isAuthenticated,
    address,
    canInteract: mounted && isConnected && isAuthenticated
  };
}
```

## Refactoring Opportunities

### Priority 1: Component Decomposition
1. Break down `CanvasCollab.tsx` into 5-7 smaller components
2. Split `AppShowcase.tsx` into presentation and container components
3. Extract repeated patterns into shared components

### Priority 2: State Management
1. Implement Zustand for UI state management
2. Create custom hooks for complex state logic
3. Abstract data layer interactions

### Priority 3: Code Organization
1. Migrate to feature-based folder structure
2. Standardize naming conventions
3. Create shared component library in monorepo

### Priority 4: Type Safety
1. Create proper TypeScript types for all props
2. Use discriminated unions for component variants
3. Implement strict type checking for API responses

## Conclusion

The merke.am application demonstrates modern React patterns and good use of Next.js 15 features. However, the architecture would benefit from:

1. **Component decomposition** to improve maintainability
2. **Better state management** patterns to reduce component complexity
3. **Consistent conventions** for naming and organization
4. **Feature-based architecture** for better scalability
5. **More custom hooks** to encapsulate reusable logic

These improvements would enhance code maintainability, testability, and developer experience while maintaining the application's current functionality.