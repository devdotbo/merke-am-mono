import { convexAuth } from "@convex-dev/auth/server";
import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
	providers: [
		ConvexCredentials({
			id: "wallet",
			profile(params) {
				const address = params.address as string | undefined;
				if (!address) {
					throw new Error("Missing address");
				}
				return {
					address,
					createdAt: Date.now(),
				};
			},
			authorize: async (credentials) => {
				const address = credentials.address as string | undefined;
				if (!address) return null;
				return { address };
			},
		}),
	],
});


