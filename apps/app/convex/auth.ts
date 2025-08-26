import { convexAuth } from "@convex-dev/auth/server";
import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
	providers: [
		ConvexCredentials({
			id: "wallet",
			authorize: async (credentials: any, ctx: any) => {
				const addressRaw = (credentials as any)?.address as string | undefined;
				const address = addressRaw?.toLowerCase();
				if (!address) return null as any;

				// Upsert user by wallet address
				const existing = await ctx.db
					.query("users")
					.withIndex("by_address", (q: any) => q.eq("address", address))
					.unique();
				const now = Date.now();
				if (existing) {
					await ctx.db.patch(existing._id, { address: existing.address ?? address, createdAt: existing.createdAt ?? now });
					return { userId: existing._id } as any;
				}
				const userId = await ctx.db.insert("users", { address, createdAt: now });
				return { userId } as any;
			},
		}),
	],
});


