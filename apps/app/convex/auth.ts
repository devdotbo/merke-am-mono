/* eslint-disable @typescript-eslint/no-explicit-any */
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import type { Id } from "./_generated/dataModel";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
	providers: [
		ConvexCredentials({
			id: "wallet",
			authorize: async (
				credentials,
				ctx,
			): Promise<{ userId: Id<"users"> } | null> => {
				const addressRaw = (credentials as { address?: string } | undefined)?.address;
				const address = addressRaw?.toLowerCase();
				if (!address) return null;

				// Upsert user by wallet address
				const existing = await (ctx as any).db
					.query("users")
					.withIndex("by_address", (q: any) => q.eq("address", address))
					.unique();
				const now = Date.now();
				if (existing) {
					await (ctx as any).db.patch(existing._id, { address: (existing as any).address ?? address, createdAt: (existing as any).createdAt ?? now });
					return { userId: (existing as any)._id as Id<"users"> };
				}
				const userId = (await (ctx as any).db.insert("users", { address, createdAt: now })) as Id<"users">;
				return { userId };
			},
		}),
	],
});


