import { convexAuth } from "@convex-dev/auth/server";
import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
	providers: [
		ConvexCredentials({
			id: "wallet",
			authorize: async (credentials: any, _ctx: any) => {
				const address = (credentials as any)?.address as string | undefined;
				if (!address) return null as any;
				// TODO: Create or lookup a user and return { userId } (and optional sessionId)
				return null as any;
			},
		}),
	],
});


