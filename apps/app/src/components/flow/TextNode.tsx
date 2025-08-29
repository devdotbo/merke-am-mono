"use client";

import React from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";

type Data = { label: string };

export default function TextNode({ data }: NodeProps<Data>) {
  return (
    <div className="rounded-md border border-border bg-background/80 backdrop-blur px-3 py-2 shadow-sm min-w-[140px] max-w-[260px] cursor-grab active:cursor-grabbing select-none">
      <div className="text-sm font-medium leading-snug text-foreground">{data.label}</div>
      <Handle type="target" position={Position.Left} className="!w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2" />
    </div>
  );
}


