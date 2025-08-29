"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useAuthActions } from "@convex-dev/auth/react";

function getClientId(): string {
  if (typeof window === "undefined") return "ssr";
  const key = "chat.clientId";
  const exist = window.sessionStorage.getItem(key);
  if (exist) return exist;
  const id = crypto.randomUUID();
  window.sessionStorage.setItem(key, id);
  return id;
}

export default function ChatBox({ defaultThreadId = "home", variant = "card" }: { defaultThreadId?: string; variant?: "card" | "plain" }) {
  const [threadId] = useState<string>(defaultThreadId);
  const [message, setMessage] = useState("");
  const { isAuthenticated, isLoading } = useConvexAuth();
  const list = useQuery(api.chat.list, isAuthenticated ? { threadId } : "skip") ?? [];
  const send = useMutation(api.chat.send);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const clientId = useMemo(() => getClientId(), []);
  const { open } = useAppKit();
  const { address } = useAppKitAccount();
  const { signIn } = useAuthActions();
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
    if (!text && isAuthenticated) return;
    
    // Check authentication before attempting to send
    if (!isAuthenticated) {
      // If wallet is connected but not authenticated, try to sign in
      if (address) {
        try {
          await signIn("wallet", { address: address.toLowerCase() });
          // After successful sign-in, send the message if there was one
          if (text) {
            await send({ threadId, content: text, clientId, username });
            setMessage("");
          }
        } catch (err) {
          console.error("Sign-in failed:", err);
          toast("Authentication failed", {
            description: "Please try connecting your wallet again.",
            action: {
              label: "Open wallet",
              onClick: () => void open(),
            },
            duration: 5000,
          });
        }
      } else {
        // No wallet connected, open wallet modal
        toast("Connect wallet to chat", {
          description: "Please sign in with your wallet to send messages.",
          action: {
            label: "Connect wallet",
            onClick: () => void open(),
          },
          duration: 5000,
        });
      }
      return;
    }
    
    try {
      await send({ threadId, content: text, clientId, username });
      setMessage("");
    } catch (err) {
      toast.error("Failed to send message. See console for details.");
      console.error(err);
    }
  }

  const containerBase = "w-full h-full flex flex-col";
  const containerClass = variant === "plain"
    ? `${containerBase} bg-background`
    : `${containerBase} rounded-xl border border-border/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60`;

  return (
    <div className={containerClass}>
      <div className="p-4 space-y-3 flex-1 min-h-0 overflow-y-auto">
        {!isAuthenticated && !isLoading && (
          <div className="text-sm text-muted-foreground italic">
            Connect your wallet to start chatting
          </div>
        )}
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
      <div className="p-3 border-t border-border flex gap-2 sticky bottom-0 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Input 
          className="border-2" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder={isAuthenticated ? "Say something…" : "Connect wallet to chat…"} 
          disabled={!isAuthenticated}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }} 
        />
        <Button 
          className="border-2" 
          onClick={() => void handleSend()} 
          disabled={message.trim().length === 0 || isLoading || !isAuthenticated} 
          variant="outline"
        >
          {isAuthenticated ? "Send" : "Connect"}
        </Button>
      </div>
    </div>
  );
}


