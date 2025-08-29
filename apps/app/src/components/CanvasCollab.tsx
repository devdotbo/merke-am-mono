"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useEdgesState,
  useNodesState,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from "reactflow";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import TextNode from "@/components/flow/TextNode";
import ChatNode from "@/components/flow/ChatNode";

type RFNodeData = { label: string; kind: string; roomId: string };

// Define nodeTypes outside of component to prevent React Flow warnings
const nodeTypes = { text: TextNode, chat: ChatNode } as const;
type RFNode = Node<RFNodeData>;
// edges use default type, no explicit alias needed

export default function CanvasCollab({ roomId = "home" }: { roomId?: string }) {
  return (
    <div className="h-full w-full overflow-hidden">
      <ReactFlowProvider>
        <CanvasCollabInner roomId={roomId} />
      </ReactFlowProvider>
    </div>
  );
}

function CanvasCollabInner({ roomId }: { roomId: string }) {
  const dbNodes = useQuery(api.canvas.listNodes, { roomId });
  const upsertNode = useMutation(api.canvas.upsertNode);
  const deleteNode = useMutation(api.canvas.deleteNode);

  // Map Convex nodes to React Flow nodes
  const initialNodes: Array<RFNode> = useMemo(() => {
    if (!dbNodes) return [];
    return dbNodes.map((n) => ({
      id: n._id as unknown as string,
      position: { x: n.x, y: n.y },
      data: { label: n.label, kind: n.kind, roomId },
      type: n.kind === "text" ? "text" : n.kind === "chat" ? "chat" : "default",
    }));
  }, [dbNodes]);

  const [nodes, setNodes] = useNodesState<RFNodeData>(initialNodes);
  const [edges, setEdges] = useEdgesState([]);

  const { project } = useReactFlow();

  // Keep local nodes in sync when dbNodes change
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((current) => applyNodeChanges(changes, current));
  }, [setNodes]);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((current) => applyEdgeChanges(changes, current));
  }, [setEdges]);

  const onConnect: OnConnect = useCallback((connection) => {
    setEdges((current) => addEdge(connection, current));
  }, [setEdges]);

  // Persist node positions to Convex on drag stop events from change set
  useEffect(() => {
    // no-op here; we persist in onNodeDragStop below
  }, []);

  const onNodeDragStop = useCallback((_: React.MouseEvent, node: RFNode) => {
    const id = node.id as unknown as Id<"canvas_nodes">;
    void upsertNode({
      id,
      roomId,
      kind: node.data?.kind ?? "generic",
      label: node.data?.label ?? "Node",
      x: node.position.x,
      y: node.position.y,
    });
  }, [roomId, upsertNode]);

  const onNodesDelete = useCallback((deleted: RFNode[]) => {
    void Promise.all(
      deleted.map((n) => deleteNode({ id: n.id as unknown as Id<"canvas_nodes"> }))
    );
  }, [deleteNode]);

  // Seed defaults if empty
  useEffect(() => {
    if (!dbNodes || dbNodes.length > 0) return;
    const seed = async () => {
      await upsertNode({ roomId, kind: "data", label: "Data Sources", x: 140, y: 120 });
      await upsertNode({ roomId, kind: "rag", label: "RAG Pipeline", x: 380, y: 90 });
      await upsertNode({ roomId, kind: "inference", label: "AI Inference", x: 600, y: 120 });
    };
    void seed();
  }, [dbNodes, roomId, upsertNode]);

  const addNodeAtCenter = useCallback(async (kind: string, label: string) => {
    const x = typeof window !== "undefined" ? window.innerWidth / 2 : 400;
    const y = typeof window !== "undefined" ? window.innerHeight / 2 : 300;
    const pos = project({ x, y });
    await upsertNode({ roomId, kind, label, x: pos.x, y: pos.y });
  }, [project, roomId, upsertNode]);

  const addText = useCallback(() => { void addNodeAtCenter("text", "Note"); }, [addNodeAtCenter]);
  const addChat = useCallback(() => { void addNodeAtCenter("chat", "Chat"); }, [addNodeAtCenter]);

  return (
    <div className="h-full w-full overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        fitView
      >
        <div className="absolute bottom-4 right-4 z-20">
          <div className="rounded-lg border border-border bg-background/80 backdrop-blur shadow p-2 flex flex-col gap-2">
            <Button size="sm" variant="outline" onClick={addText}>Add Text</Button>
            <Button size="sm" variant="outline" onClick={addChat}>Add Chat</Button>
          </div>
        </div>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}


