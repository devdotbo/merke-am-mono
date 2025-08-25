import { defineApp } from "convex/server";
import agent from "@convex-dev/agent/convex.config";
import rag from "@convex-dev/rag/convex.config";

const app = defineApp();

// Enable Convex Agent component tables/endpoints
app.use(agent);
// Enable Convex RAG component tables/endpoints
app.use(rag);

export default app;


