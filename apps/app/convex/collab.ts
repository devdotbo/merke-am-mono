import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Update or insert a client's presence in a room.
export const updatePresence = mutation({
  args: {
    roomId: v.string(),
    clientId: v.string(),
    username: v.string(),
    color: v.string(),
    x: v.number(),
    y: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_room_and_client", (q) =>
        q.eq("roomId", args.roomId).eq("clientId", args.clientId),
      )
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, updatedAt: now });
    } else {
      await ctx.db.insert("presence", { ...args, updatedAt: now });
    }
    return null;
  },
});

// List active presences in a room (recently updated only).
export const listPresence = query({
  args: { roomId: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("presence"),
      _creationTime: v.number(),
      roomId: v.string(),
      clientId: v.string(),
      username: v.string(),
      color: v.string(),
      x: v.number(),
      y: v.number(),
      updatedAt: v.number(),
    }),
  ),
  handler: async (ctx, { roomId }) => {
    const fiveMinutes = 5 * 60 * 1000;
    const cutoff = Date.now() - fiveMinutes;
    const rows = await ctx.db
      .query("presence")
      .withIndex("by_room_and_updatedAt", (q) => q.eq("roomId", roomId))
      .order("desc")
      .collect();
    return rows.filter((r) => r.updatedAt >= cutoff);
  },
});


