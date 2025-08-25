import { defineApp } from "convex/server";
import agent from "@convex-dev/agent/convex.config";

const app = defineApp();

// Enable Convex Agent component tables/endpoints
app.use(agent);

export default app;


