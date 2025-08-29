"use client";

import React from "react";
import type { NodeProps } from "reactflow";

type Data = { label: string };

export default function TextNode({ data }: NodeProps<Data>) {
  return (
    <div className="rounded-lg border border-border bg-background/80 backdrop-blur px-3 py-2 shadow-sm">
      <div className="text-sm font-medium">{data.label}</div>
    </div>
  );
}


