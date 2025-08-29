import React from 'react';
import { BaseEdge, getBezierPath, type EdgeProps } from 'reactflow';

export default function TurboEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY } = props;
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd="url(#edge-circle)" style={{ stroke: 'url(#edge-gradient)', strokeWidth: 2 }} />
    </>
  );
}


