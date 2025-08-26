"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function getClientId(): string {
  if (typeof window === "undefined") return "ssr";
  const key = "chat.clientId";
  const exist = window.sessionStorage.getItem(key);
  if (exist) return exist;
  const id = crypto.randomUUID();
  window.sessionStorage.setItem(key, id);
  return id;
}

export default function ChatBox({ defaultThreadId = "home" }: { defaultThreadId?: string }) {
  const [threadId] = useState<string>(defaultThreadId);
  const [message, setMessage] = useState("");
  const { isAuthenticated } = useConvexAuth();
  const list = useQuery(api.chat.list, isAuthenticated ? { threadId } : "skip") ?? [];
  const send = useMutation(api.chat.send);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const clientId = useMemo(() => getClientId(), []);
  const [username] = useState<string>(() => {
    if (typeof window === "undefined") return "guest";
    const stored = window.localStorage.getItem("canvas.username");
    return stored || "guest";
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [list.length]);

  async function handleSend() {
    const text = message.trim();
    if (!text) return;
    setMessage("");
    if (!isAuthenticated) {
      alert("Please sign in with your wallet to chat.");
      return;
    }
    await send({ threadId, content: text, clientId, username });
  }

  return (
    <div className="w-full h-full rounded-xl border border-border/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4 space-y-3 h-[calc(100%-58px)] overflow-y-auto">
        {list.map((m) => {
          const label = m.role === "assistant" ? "AI" : m.clientId && m.clientId === clientId ? "You" : m.username || "User";
          return (
            <div key={m._id} className="text-sm">
              <span className="font-medium text-foreground/80">{label}:</span> {m.content}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-border/60 flex gap-2 sticky bottom-0 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Say something…" onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void handleSend();
          }
        }} />
        <Button onClick={() => void handleSend()} disabled={!isAuthenticated} variant="outline">Send</Button>
      </div>
    </div>
  );
}


