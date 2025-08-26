import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listNodes = query({
  args: { roomId: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("canvas_nodes"),
      _creationTime: v.number(),
      roomId: v.string(),
      kind: v.string(),
      label: v.string(),
      x: v.number(),
      y: v.number(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, { roomId }) => {
    return await ctx.db
      .query("canvas_nodes")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .order("asc")
      .collect();
  },
});

export const upsertNode = mutation({
  args: {
    roomId: v.string(),
    id: v.optional(v.id("canvas_nodes")),
    kind: v.string(),
    label: v.string(),
    x: v.number(),
    y: v.number(),
  },
  returns: v.id("canvas_nodes"),
  handler: async (ctx, { id, roomId, kind, label, x, y }) => {
    const now = Date.now();
    if (id) {
      await ctx.db.patch(id, { kind, label, x, y });
      return id;
    }
    return await ctx.db.insert("canvas_nodes", { roomId, kind, label, x, y, createdAt: now });
  },
});

export const deleteNode = mutation({
  args: { id: v.id("canvas_nodes") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return null;
  },
});


