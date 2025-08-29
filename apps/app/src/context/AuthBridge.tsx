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

    console.log("[AuthBridge] State:", {
      anyConnected,
      resolvedAddress,
      isAuthenticated,
      lastAddress: lastAddress.current,
      signing: signingRef.current
    });

    if (anyConnected && resolvedAddress) {
      const normalized = resolvedAddress.toLowerCase();
      // Already authenticated with same address: nothing to do
      if (isAuthenticated && lastAddress.current === normalized) {
        return;
      }
      // Not authenticated or address changed: sign in
      if (!isAuthenticated || lastAddress.current !== normalized) {
        if (signingRef.current) return; // prevent concurrent sign-ins
        signingRef.current = true;
        console.log("[AuthBridge] Signing in with address:", normalized);
        void signIn("wallet", { address: normalized })
          .then(() => {
            console.log("[AuthBridge] Sign-in successful");
            lastAddress.current = normalized;
          })
          .catch((err: unknown) => {
            const message = (err as Error)?.message ?? String(err);
            const isReconnect = message.includes("Connection lost while action was in flight");
            if (!isReconnect) {
              toast.error("Convex sign-in failed. Check console for details.");
              console.error("[AuthBridge] Sign-in error:", err);
            }
            // Don't clear lastAddress on error to allow retry
          })
          .finally(() => {
            signingRef.current = false;
          });
      }
      return;
    }
    // When wallet disconnects, sign out of Convex
    if (!anyConnected && isAuthenticated) {
      console.log("[AuthBridge] Wallet disconnected, signing out");
      void signOut().catch(() => {});
      lastAddress.current = null;
    }
  }, [isConnected, address, wagmiConnected, wagmiAddress, isAuthenticated, signIn, signOut]);

  return null;
}


