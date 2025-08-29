"use client";

import React, { useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type OnConnect,
} from "reactflow";

import TurboNode from "@/components/flow/TurboNode";
import TurboEdge from "@/components/flow/TurboEdge";

type TurboData = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
};

const initialNodes: Node<TurboData>[] = [
  { id: "1", position: { x: 0, y: 0 }, data: { title: "Data Sources", subtitle: "convex" }, type: "turbo" },
  { id: "2", position: { x: 260, y: 0 }, data: { title: "RAG Pipeline", subtitle: "embed + recall" }, type: "turbo" },
  { id: "3", position: { x: 520, y: 120 }, data: { title: "AI Inference", subtitle: "OpenAI" }, type: "turbo" },
  { id: "4", position: { x: 260, y: 240 }, data: { title: "Data Storage", subtitle: "vector + cache" }, type: "turbo" },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e2-4", source: "2", target: "4" },
];

const nodeTypes = { turbo: TurboNode } as const;
const edgeTypes = { turbo: TurboEdge } as const;

const defaultEdgeOptions = { type: "turbo", markerEnd: "edge-circle" } as const;

export default function StudioCanvas({ variant = "card" }: { variant?: "card" | "plain" }) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), [setEdges]);

  const wrapper = variant === "plain" ? "h-full" : "h-full rounded-md border border-border overflow-hidden";
  return (
    <div className={wrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
      >
        <Controls showInteractive={false} />
        <Background />
        <svg>
          <defs>
            <linearGradient id="edge-gradient">
              <stop offset="0%" stopColor="#ae53ba" />
              <stop offset="100%" stopColor="#2a8af6" />
            </linearGradient>
            <marker id="edge-circle" viewBox="-5 -5 10 10" refX="0" refY="0" markerUnits="strokeWidth" markerWidth="10" markerHeight="10" orient="auto">
              <circle stroke="#2a8af6" strokeOpacity="0.75" r="2" cx="0" cy="0" />
            </marker>
          </defs>
        </svg>
      </ReactFlow>
    </div>
  );
}


