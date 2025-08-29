"use client";

import React from "react";
import type { NodeProps } from "reactflow";
import ChatBox from "@/components/ChatBox";

type Data = { roomId?: string };

export default function ChatNode({ data }: NodeProps<Data>) {
  return (
    <div className="w-[460px] max-w-[92vw] rounded-xl border border-border overflow-hidden bg-background/80 backdrop-blur">
      <ChatBox defaultThreadId={data.roomId ?? "home"} variant="plain" />
    </div>
  );
}


