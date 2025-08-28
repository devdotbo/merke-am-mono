'use client';

import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from 'reactflow';

type RFNode = Node<{ label: string }>;
type RFEdge = Edge;

const initialNodes: RFNode[] = [
  { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' }, type: 'default' },
  { id: 'b', position: { x: 200, y: 100 }, data: { label: 'Node B' }, type: 'default' },
];

const initialEdges: RFEdge[] = [];

export default function FlowDemoPage() {
  const [nodes, setNodes] = useState<RFNode[]>(initialNodes);
  const [edges, setEdges] = useState<RFEdge[]>(initialEdges);

  const onNodesChange = useCallback<OnNodesChange>((changes) => {
    setNodes((current) => applyNodeChanges(changes, current));
  }, []);

  const onEdgesChange = useCallback<OnEdgesChange>((changes) => {
    setEdges((current) => applyEdgeChanges(changes, current));
  }, []);

  const onConnect = useCallback<OnConnect>((connection) => {
    setEdges((current) => addEdge(connection, current));
  }, []);

  return (
    <div className="h-[calc(100vh-120px)] rounded-md border border-border overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}


