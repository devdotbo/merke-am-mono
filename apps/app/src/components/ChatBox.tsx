"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatBox({ defaultThreadId = "home" }: { defaultThreadId?: string }) {
  const [threadId] = useState<string>(defaultThreadId);
  const [message, setMessage] = useState("");
  const list = useQuery(api.chat.list, { threadId }) || [];
  const send = useMutation(api.chat.send);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [list.length]);

  async function handleSend() {
    const text = message.trim();
    if (!text) return;
    setMessage("");
    await send({ threadId, content: text });
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-border bg-background">
      <div className="p-4 space-y-3 h-64 overflow-y-auto">
        {list.map((m) => (
          <div key={m._id} className="text-sm">
            <span className="font-medium text-foreground/80">{m.role === "assistant" ? "AI" : "You"}:</span> {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-border flex gap-2">
        <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Say something…" onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void handleSend();
          }
        }} />
        <Button onClick={() => void handleSend()}>Send</Button>
      </div>
    </div>
  );
}


