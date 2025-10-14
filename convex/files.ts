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
      fileName: v.string(),
      url: v.string(),
      storageId: v.id("_storage"),
      isPublic: v.boolean(),
      created_at: v.string(),
      size: v.number(),
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

    const filePromises = rows.map(async (row) => {
      const url = await ctx.storage.getUrl(row.fileId);
      if (!url) return null;

      return {
        fileName: row.fileName,
        url,
        storageId: row.fileId,
        isPublic: row.isPublic,
        created_at: new Date(row.createdAt).toISOString(),
        size: row.size,
      };
    });

    const results = await Promise.all(filePromises);
    return results.filter((result) => result !== null);
  },
});