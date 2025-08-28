"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Database, Zap, Brain, Plus, ZoomIn, ZoomOut, RotateCcw, X } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Id } from "@convex/_generated/dataModel";

type NodeItem = {
  id: Id<"canvas_nodes">;
  label: string;
  kind: string;
  icon: React.ReactNode;
  x: number;
  y: number;
};

function getClientId(): string {
  if (typeof window === "undefined") return "ssr";
  const key = "canvas.clientId";
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.sessionStorage.setItem(key, id);
  return id;
}

const palette = ["#FF6B6B", "#4ECDC4", "#FFD166", "#7C6FF9", "#06D6A0"] as const;

export function CanvasCollab({ roomId = "home" }: { roomId?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number }>({ x: 120, y: 120 });
  // Use deterministic defaults for SSR and initial client render to avoid hydration mismatches.
  const [username, setUsername] = useState<string>("guest");
  const [color, setColor] = useState<string>(palette[0]);

  // After mount, hydrate username from localStorage (client-only).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedName = window.localStorage.getItem("canvas.username");
    if (storedName) setUsername(storedName);
  }, []);

  // After mount, hydrate color from localStorage or generate and persist one (client-only).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("canvas.color");
    if (saved) {
      setColor(saved);
      return;
    }
    const c = palette[Math.floor(Math.random() * palette.length)] ?? palette[0];
    window.localStorage.setItem("canvas.color", c);
    setColor(c);
  }, []);
  const clientId = useMemo(() => getClientId(), []);

  const [nodes, setNodes] = useState<Array<NodeItem>>([]);

  const [view, setView] = useState<{ x: number; y: number; scale: number }>({ x: 0, y: 0, scale: 1 });
  const [draggingId, setDraggingId] = useState<Id<"canvas_nodes"> | null>(null);
  const dragOffset = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const [panning, setPanning] = useState<boolean>(false);
  const panStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Convex: load and persist nodes
  const dbNodes = useQuery(api.canvas.listNodes, { roomId });
  const upsertNode = useMutation(api.canvas.upsertNode);
  const deleteNodeMutation = useMutation(api.canvas.deleteNode);

  // Map db nodes to local state with icons
  useEffect(() => {
    if (!dbNodes) return;
    const withIcons: Array<NodeItem> = dbNodes.map((n) => ({
      id: n._id,
      label: n.label,
      kind: n.kind,
      x: n.x,
      y: n.y,
      icon:
        n.kind === "data" ? (
          <Database className="w-6 h-6" />
        ) : n.kind === "inference" ? (
          <Brain className="w-6 h-6" />
        ) : (
          <Zap className="w-6 h-6" />
        ),
    }));
    setNodes(withIcons);
  }, [dbNodes]);

  // Seed defaults if empty
  useEffect(() => {
    // Only seed once data has loaded and there are no nodes
    if (!dbNodes || dbNodes.length > 0) return;
    const seed = async () => {
      await upsertNode({ roomId, kind: "data", label: "Data Sources", x: 140, y: 120 });
      await upsertNode({ roomId, kind: "rag", label: "RAG Pipeline", x: 380, y: 90 });
      await upsertNode({ roomId, kind: "inference", label: "AI Inference", x: 600, y: 120 });
    };
    void seed();
  }, [dbNodes, roomId, upsertNode]);

  const toWorld = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    const x = (clientX - rect.left - view.x) / view.scale;
    const y = (clientY - rect.top - view.y) / view.scale;
    return { x, y };
  }, [view.x, view.y, view.scale]);

  const updatePresence = useMutation(api.collab.updatePresence);
  const presences = useQuery(api.collab.listPresence, { roomId }) || [];

  // Send heartbeat every 10s
  useEffect(() => {
    let stop = false;
    const tick = async () => {
      try {
        await updatePresence({
          roomId,
          clientId,
          username,
          color,
          x: cursor.x,
          y: cursor.y,
        });
      } catch (error) {
        // Always report and surface the error
        console.error("Presence heartbeat failed", error);
        throw error;
      }
      if (!stop) setTimeout(() => { void tick(); }, 10_000);
    };
    void tick();
    return () => {
      stop = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, clientId, username, color]);

  const handlePointerMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    setCursor({ x, y });
    void updatePresence({ roomId, clientId, username, color, x, y });

    if (draggingId) {
      const world = toWorld(e.clientX, e.clientY);
      setNodes((prev) => prev.map((n) => n.id === draggingId ? { ...n, x: world.x - dragOffset.current.dx, y: world.y - dragOffset.current.dy } : n));
    } else if (panning) {
      setView((v) => ({ ...v, x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y }));
    }
  }, [roomId, clientId, username, color, updatePresence, draggingId, panning, toWorld]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { clientX, clientY, deltaY } = e;
    const direction = deltaY > 0 ? -1 : 1;
    const factor = 1 + direction * 0.12;
    setView((v) => {
      const el = containerRef.current;
      if (!el) return v;
      const rect = el.getBoundingClientRect();
      const cx = clientX - rect.left;
      const cy = clientY - rect.top;
      const newScale = Math.min(2.5, Math.max(0.4, v.scale * factor));
      const sx = cx - (cx - v.x) * (newScale / v.scale);
      const sy = cy - (cy - v.y) * (newScale / v.scale);
      return { x: sx, y: sy, scale: newScale };
    });
  }, []);

  const startPan = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setPanning(true);
    panStart.current = { x: e.clientX - view.x, y: e.clientY - view.y };
  }, [view.x, view.y]);

  const endPanOrDrag = useCallback(() => {
    setPanning(false);
    if (draggingId) {
      const moved = nodes.find((n) => n.id === draggingId);
      if (moved) {
        void upsertNode({ roomId, id: moved.id, kind: moved.kind, label: moved.label, x: moved.x, y: moved.y });
      }
    }
    setDraggingId(null);
  }, [draggingId, nodes, roomId, upsertNode]);

  const addNode = useCallback(() => {
    const el = containerRef.current;
    let wx = 200, wy = 140;
    if (el) {
      const rect = el.getBoundingClientRect();
      const cx = rect.width / 2; const cy = rect.height / 2;
      const world = { x: (cx - view.x) / view.scale, y: (cy - view.y) / view.scale };
      wx = world.x; wy = world.y;
    }
    void upsertNode({ roomId, kind: "generic", label: "Node", x: wx, y: wy });
  }, [roomId, upsertNode, view.x, view.y, view.scale]);

  const resetView = useCallback(() => {
    setView({ x: 0, y: 0, scale: 1 });
  }, []);

  const onNodeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, id: Id<"canvas_nodes">) => {
    e.stopPropagation();
    const world = toWorld(e.clientX, e.clientY);
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    dragOffset.current = { dx: world.x - node.x, dy: world.y - node.y };
    setDraggingId(id);
  }, [nodes, toWorld]);

  const removeNode = useCallback((id: Id<"canvas_nodes">) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    void deleteNodeMutation({ id });
  }, [deleteNodeMutation]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onMouseDown={startPan}
      onMouseUp={endPanOrDrag}
      onMouseLeave={endPanOrDrag}
      onWheel={handleWheel}
      className={cn("relative w-full h-full rounded-xl border border-border/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden select-none")}
      style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)/0.08) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
    >
      <div
        className="absolute inset-0"
        style={{ transform: `translate(${String(view.x)}px, ${String(view.y)}px) scale(${String(view.scale)})`, transformOrigin: "0 0" }}
      >
        <svg className="absolute inset-0 w-full h-full">
          {nodes.map((node, i) => {
            const next = nodes[i + 1];
            if (!next) return null;
            return (
              <line
                key={`${node.id}-${next.id}`}
                x1={node.x}
                y1={node.y}
                x2={next.x}
                y2={next.y}
                stroke="hsl(var(--foreground))"
                strokeWidth={1.4}
                strokeDasharray="5,5"
                opacity={0.25}
              />
            );
          })}
        </svg>
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            className="absolute"
            style={{ left: node.x - 60, top: node.y - 40 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            onMouseDown={(e) => onNodeMouseDown(e, node.id)}
          >
            <div className="relative w-24 h-24 rounded-2xl bg-background border border-border flex items-center justify-center shadow-sm">
              <button
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-foreground/70 hover:text-foreground"
                onClick={(e) => { e.stopPropagation(); removeNode(node.id); }}
                aria-label="Remove node"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="text-foreground">{node.icon}</div>
            </div>
            <div className="text-center mt-2 text-sm font-medium text-foreground font-brand-sans">{node.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={addNode}>
          <Plus className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={() => setView((v) => ({ ...v, scale: Math.min(2.5, v.scale * 1.15) }))}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={() => setView((v) => ({ ...v, scale: Math.max(0.4, v.scale / 1.15) }))}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={resetView}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {presences.map((p) => (
        <div key={p._id} className="absolute pointer-events-none" style={{ transform: `translate(${String(p.x)}px, ${String(p.y)}px)` }}>
          <div className="relative" style={{ zIndex: 10 }}>
            <div className="w-4 h-4 rounded-full shadow" style={{ backgroundColor: p.color }} />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs px-2 py-0.5 rounded text-primary-foreground shadow" style={{ backgroundColor: p.color }}>
              {p.username}
            </div>
          </div>
        </div>
      ))}

      <div className="absolute pointer-events-none" style={{ transform: `translate(${String(cursor.x)}px, ${String(cursor.y)}px)` }}>
        <div className="relative" style={{ zIndex: 20 }}>
          <div className="w-4 h-4 rounded-full shadow" style={{ backgroundColor: color }} />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs px-2 py-0.5 rounded text-primary-foreground shadow" style={{ backgroundColor: color }}>
            {username}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CanvasCollab;
