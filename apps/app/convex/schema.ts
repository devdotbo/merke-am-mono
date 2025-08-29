import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// Minimal users table with onchain account address (CAIP-10) for SIWX linking
const users = defineTable({
  address: v.optional(v.string()),
  name: v.optional(v.string()),
  image: v.optional(v.string()),
  createdAt: v.number(),
}).index("by_address", ["address"]);

// Basic messages table to store simple agent demo outputs if desired
const messages = defineTable({
  userId: v.optional(v.id("users")),
  threadId: v.optional(v.string()),
  role: v.string(),
  content: v.string(),
  // Optional client identity for labeling in UIs without auth
  clientId: v.optional(v.string()),
  username: v.optional(v.string()),
  createdAt: v.number(),
}).index("by_thread", ["threadId", "createdAt"]);

// Realtime presence for collaborative canvas and cursors
// Rows are ephemeral; clients should refresh "updatedAt" periodically.
const presence = defineTable({
  roomId: v.string(),
  clientId: v.string(),
  username: v.string(),
  color: v.string(),
  x: v.number(),
  y: v.number(),
  updatedAt: v.number(),
}).index("by_room_and_client", ["roomId", "clientId"]).index(
  "by_room_and_updatedAt",
  ["roomId", "updatedAt"],
);

// Persistent canvas nodes with world coordinates (room-scoped)
const canvas_nodes = defineTable({
  roomId: v.string(),
  kind: v.string(), // e.g. "data" | "rag" | "inference" | "generic"
  label: v.string(),
  x: v.number(),
  y: v.number(),
  createdAt: v.number(),
}).index("by_room", ["roomId"]).index("by_room_created", ["roomId", "createdAt"]);

// Optional edges between canvas nodes
const canvas_edges = defineTable({
  roomId: v.string(),
  from: v.id("canvas_nodes"),
  to: v.id("canvas_nodes"),
  createdAt: v.number(),
}).index("by_room", ["roomId"]);

const schema = defineSchema({
  ...authTables,
  users,
  messages,
  presence,
  canvas_nodes,
  canvas_edges,
});

export default schema;


