import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const send = mutation({
  args: {
    threadId: v.string(),
    content: v.string(),
    clientId: v.optional(v.string()),
    username: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, { threadId, content, clientId, username }) => {
    const userId = await getAuthUserId(ctx);
    await ctx.db.insert("messages", {
      userId: (userId as any) ?? undefined,
      threadId,
      role: "user",
      content,
      clientId,
      username,
      createdAt: Date.now(),
    });
    // Stub AI echo response for now
    await ctx.db.insert("messages", {
      threadId,
      role: "assistant",
      content: "AI: will be back",
      createdAt: Date.now() + 1,
    });
    return null;
  },
});

export const list = query({
  args: { threadId: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("messages"),
      _creationTime: v.number(),
      userId: v.optional(v.id("users")),
      threadId: v.optional(v.string()),
      role: v.string(),
      content: v.string(),
      clientId: v.optional(v.string()),
      username: v.optional(v.string()),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, { threadId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_thread", (q) => q.eq("threadId", threadId))
      .order("asc")
      .collect();
  },
});


