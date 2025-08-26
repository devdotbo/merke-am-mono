import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// Minimal users table with onchain address for SIWE-style linking
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

const schema = defineSchema({
  ...authTables,
  users,
  messages,
  presence,
});

export default schema;


