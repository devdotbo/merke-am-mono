"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Wallet } from "lucide-react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import Image from "next/image";
import { useEnsAvatar, useEnsName } from "wagmi";

export default function AppHeader() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const { data: ensName } = useEnsName({
    address: address as `0x${string}` | undefined,
    chainId: 1,
    query: { enabled: Boolean(address) },
  });
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ?? undefined,
    chainId: 1,
    query: { enabled: Boolean(ensName) },
  });

  const shorten = (addr?: string) => (addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "");

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="text-2xl font-semibold text-foreground brand-underline">merke.am</div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        {isConnected ? (
          <Button
            variant="outline"
            onClick={() => open()}
            className="flex items-center gap-2 border-border/60"
          >
            {ensAvatar ? (
              <span className="w-5 h-5 rounded-full overflow-hidden inline-flex items-center justify-center bg-muted">
                <Image src={ensAvatar} alt="ENS avatar" width={20} height={20} />
              </span>
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            <span className="text-sm">{ensName || shorten(address)}</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => open()}
            className="flex items-center gap-2 border-border/60"
          >
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </Button>
        )}
      </div>
    </div>
  );
}


