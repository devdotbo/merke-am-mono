"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Database, Zap, Brain } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { cn } from "@/lib/utils";

type NodeItem = {
  id: string;
  label: string;
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
  const [username] = useState<string>(() => {
    if (typeof window === "undefined") return "guest";
    const name = window.localStorage.getItem("canvas.username");
    return name ? name : "guest";
  });
  const getInitialColor = (): string => {
    if (typeof window === "undefined") return palette[0];
    const saved = window.localStorage.getItem("canvas.color");
    if (saved) return saved;
    const c = palette[Math.floor(Math.random() * palette.length)] ?? palette[0];
    window.localStorage.setItem("canvas.color", c);
    return c;
  };
  const [color] = useState<string>(getInitialColor());
  const clientId = useMemo(() => getClientId(), []);

  const nodes: NodeItem[] = useMemo(
    () => [
      { id: "data", label: "Data Sources", icon: <Database className="w-6 h-6" />, x: 140, y: 120 },
      { id: "rag", label: "RAG Pipeline", icon: <Zap className="w-6 h-6" />, x: 380, y: 90 },
      { id: "inference", label: "AI Inference", icon: <Brain className="w-6 h-6" />, x: 600, y: 120 },
    ],
    [],
  );

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
      if (!stop) setTimeout(tick, 10_000);
    };
    tick();
    return () => {
      stop = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, clientId, username, color]);

  const handlePointer = useCallback(
    (_e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(_e.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(_e.clientY - rect.top, rect.height));
      setCursor({ x, y });
      // fire-and-forget, throttled by React event frequency
      void updatePresence({ roomId, clientId, username, color, x, y });
    },
    [roomId, clientId, username, color, updatePresence],
  );

  return (
    <div ref={containerRef} onMouseMove={handlePointer} className={cn("relative w-full h-96 rounded-2xl border border-border bg-background overflow-hidden")}
      style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)/0.08) 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
      <svg className="absolute inset-0 w-full h-full">
        {nodes.map((node, i) => {
          const next = nodes[i + 1];
          if (!next) return null;
          return <line key={`edge-${i}`} x1={node.x} y1={node.y} x2={next.x} y2={next.y} stroke="hsl(var(--foreground))" strokeWidth={1.4} strokeDasharray="5,5" opacity={0.25} />;
        })}
      </svg>
      {nodes.map((node, index) => (
        <motion.div key={node.id} className="absolute" style={{ left: node.x - 60, top: node.y - 40 }} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
          <div className="w-24 h-24 rounded-2xl bg-background border border-border flex items-center justify-center shadow-sm">
            <div className="text-foreground">{node.icon}</div>
          </div>
          <div className="text-center mt-2 text-sm font-medium text-foreground font-brand-sans">{node.label}</div>
        </motion.div>
      ))}

      {/* Remote cursors */}
      {presences.map((p) => (
        <div key={p._id} className="absolute pointer-events-none" style={{ transform: `translate(${p.x}px, ${p.y}px)` }}>
          <div className="relative" style={{ zIndex: 10 }}>
            <div className="w-4 h-4 rounded-full shadow" style={{ backgroundColor: p.color }} />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs px-2 py-0.5 rounded text-primary-foreground shadow" style={{ backgroundColor: p.color }}>
              {p.username}
            </div>
          </div>
        </div>
      ))}

      {/* Local cursor (on top) */}
      <div className="absolute pointer-events-none" style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}>
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


