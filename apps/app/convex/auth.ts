/* eslint-disable @typescript-eslint/no-explicit-any */
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

export const ensureUserByAddress = internalMutation({
	args: { address: v.string() },
	returns: v.id("users"),
	handler: async (ctx, { address }) => {
		const existing = await ctx.db
			.query("users")
			.withIndex("by_address", (q) => q.eq("address", address))
			.unique();
		const now = Date.now();
		if (existing) {
			await ctx.db.patch(existing._id, {
				address: existing.address ?? address,
				createdAt: (existing as any).createdAt ?? now,
			});
			return existing._id;
		}
		const userId = await ctx.db.insert("users", { address, createdAt: now });
		return userId;
	},
});

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
				// signIn is an action; call an internal mutation for DB access
				const userId: Id<"users"> = await (ctx as any).runMutation(internal.auth.ensureUserByAddress, { address });
				return { userId };
			},
		}),
	],
});


