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
  createdAt: v.number(),
}).index("by_thread", ["threadId", "createdAt"]);

const schema = defineSchema({
  ...authTables,
  users,
  messages,
});

export default schema;


