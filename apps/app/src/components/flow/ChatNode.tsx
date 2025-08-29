"use client";

import React from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import ChatBox from "@/components/ChatBox";

type Data = { roomId?: string };

export default function ChatNode({ data }: NodeProps<Data>) {
  return (
    <div className="w-[460px] max-w-[92vw] rounded-xl border border-border overflow-hidden bg-background/80 backdrop-blur cursor-grab active:cursor-grabbing">
      <ChatBox defaultThreadId={data.roomId ?? "home"} variant="plain" />
      <Handle type="target" position={Position.Left} className="!w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2" />
    </div>
  );
}


