import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();

// Expose Convex Auth routes (JWKS, OAuth, etc.)
auth.addHttpRoutes(http);

export default http;


