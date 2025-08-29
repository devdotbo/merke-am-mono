"use client";

import { useEffect, useRef } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

export default function AuthBridge() {
  const { address, isConnected } = useAppKitAccount();
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();
  const { isAuthenticated } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const lastAddress = useRef<string | null>(null);
  const signingRef = useRef<boolean>(false);

  useEffect(() => {
    // When wallet connects with a new address, sign into Convex using credentials provider
    const resolvedAddress = (wagmiAddress ?? address) || null;
    const anyConnected = Boolean(wagmiConnected || isConnected);

    if (anyConnected && resolvedAddress) {
      const normalized = resolvedAddress.toLowerCase();
      // Already authenticated: sync lastAddress and skip sign-in
      if (isAuthenticated) {
        if (lastAddress.current !== normalized) {
          lastAddress.current = normalized;
        }
        return;
      }
      // Not authenticated: sign in if we haven't tried this address
      if (lastAddress.current !== normalized) {
        if (signingRef.current) return; // prevent concurrent sign-ins
        signingRef.current = true;
        void signIn("wallet", { address: normalized })
          .then(() => {
            lastAddress.current = normalized;
          })
          .catch((err: unknown) => {
            const message = (err as Error)?.message ?? String(err);
            const isReconnect = message.includes("Connection lost while action was in flight");
            if (!isReconnect) {
              toast.error("Convex sign-in failed. Check console for details.");
              console.error("Convex sign-in error:", err);
            }
            lastAddress.current = null;
          })
          .finally(() => {
            signingRef.current = false;
          });
      }
      return;
    }
    // When wallet disconnects, sign out of Convex
    if (!anyConnected && isAuthenticated) {
      void signOut().catch(() => {});
      lastAddress.current = null;
    }
  }, [isConnected, address, wagmiConnected, wagmiAddress, isAuthenticated, signIn, signOut]);

  return null;
}


