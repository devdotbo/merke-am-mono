"use client";

import { useEffect, useRef } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export default function AuthBridge() {
  const { address, isConnected } = useAppKitAccount();
  const { isAuthenticated } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const lastAddress = useRef<string | null>(null);

  useEffect(() => {
    // When wallet connects with a new address, sign into Convex using credentials provider
    if (isConnected && address) {
      const normalized = address.toLowerCase();
      if (!isAuthenticated || lastAddress.current !== normalized) {
        void signIn("wallet", { address: normalized }).catch(() => {
          // no-op: errors are surfaced by hooks/components using auth
        });
        lastAddress.current = normalized;
      }
      return;
    }
    // When wallet disconnects, sign out of Convex
    if (!isConnected && isAuthenticated) {
      void signOut().catch(() => {});
      lastAddress.current = null;
    }
  }, [isConnected, address, isAuthenticated, signIn, signOut]);

  return null;
}


