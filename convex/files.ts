import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = action({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const url = await ctx.storage.generateUploadUrl();
    return url;
  },
});

export const saveFile = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    contentType: v.string(),
    size: v.number(),
  },
  returns: v.id("files"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const fileDocId = await ctx.db.insert("files", {
      userId: identity.subject,
      fileId: args.storageId,
      fileName: args.fileName,
      contentType: args.contentType,
      size: args.size,
      isPublic: false,
      createdAt: Date.now(),
    });
    return fileDocId;
  },
});

export const listUserFiles = query({
  args: {},
  returns: v.array(
    v.object({
      name: v.string(),
      url: v.string(),
      isPublic: v.boolean(),
      created_at: v.string(),
    }),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const rows = await ctx.db
      .query("files")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    const result: Array<{ name: string; url: string; isPublic: boolean; created_at: string }> = [];
    for (const row of rows) {
      const url = await ctx.storage.getUrl(row.fileId);
      if (!url) continue;
      result.push({
        name: row.fileName,
        url,
        isPublic: row.isPublic,
        created_at: new Date(row.createdAt).toISOString(),
      });
    }
    return result;
  },
});