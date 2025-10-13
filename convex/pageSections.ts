import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Tables, vSection, requirePageOwnership, listSectionsByPageId, assignIfDefined } from "./_utils";

type ImageMeta = { fileName: string; size: number };

function extractStorageId(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  try {
    const { pathname } = new URL(url);
    const last = pathname.split("/").filter(Boolean).pop();
    if (!last) return null;
    return last.split("?")[0];
  } catch {
    return null;
  }
}

async function enrichImageMeta(ctx: any, content: any): Promise<any> {
  const clone = JSON.parse(JSON.stringify(content ?? {}));

  async function walk(node: any): Promise<void> {
    if (Array.isArray(node)) {
      for (const item of node) await walk(item);
      return;
    }
    if (node && typeof node === "object") {
      for (const [k, v] of Object.entries(node)) {
        if (v && typeof v === "object") {
          await walk(v);
          continue;
        }
        const keyLower = String(k).toLowerCase();
        const isImageKey = ["bild", "image", "img", "logo"].some((p) => keyLower.includes(p));
        if (!isImageKey) continue;

        const url: string | null = typeof v === "string" ? v : null;
        if (!url) continue;
        const storageId = extractStorageId(url);
        if (!storageId) continue;

        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const row = await ctx.db
          .query("files")
          .withIndex("by_userId_and_fileId", (q: any) => q.eq("userId", identity.subject).eq("fileId", storageId))
          .unique();
        if (!row) continue;
        
        (node as any)[k] = { url, meta: { fileName: row.fileName, size: row.size } as ImageMeta };
      }
    }
  }

  await walk(clone);
  return clone;
}

export const create = mutation({
  args: {
    landingPageId: v.id("landingPages"),
    type: v.string(),
    content: v.any(),
    orderIndex: v.optional(v.number()),
  },
  returns: v.id("pageSections"),
  handler: async (ctx, args) => {
    await requirePageOwnership(ctx, args.landingPageId);

    let nextOrder = args.orderIndex;
    if (typeof nextOrder === "undefined") {
      const rows = await (ctx.db as any)
        .query(Tables.pageSections)
        .withIndex("by_landingPageId_and_orderIndex", (q: any) =>
          q.eq("landingPageId", args.landingPageId),
        )
        .order("desc")
        .take(1);
      nextOrder = rows.length > 0 ? rows[0].orderIndex + 1 : 1;
    }

    const enriched = await enrichImageMeta(ctx, args.content);

    const sectionId = await ctx.db.insert(Tables.pageSections, {
      landingPageId: args.landingPageId,
      type: args.type,
      content: enriched,
      orderIndex: nextOrder!,
    });
    const page = await ctx.db.get(args.landingPageId);
    if (page) await ctx.scheduler.runAfter(0, (internal as any).revalidate.bySlug, { slug: page.slug });
    return sectionId;
  },
});

export const update = mutation({
  args: {
    sectionId: v.id("pageSections"),
    type: v.optional(v.string()),
    content: v.optional(v.any()),
    orderIndex: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const section = await ctx.db.get(args.sectionId);
    if (!section) throw new Error("Section not found");
    await requirePageOwnership(ctx, section.landingPageId);
    const updates: Record<string, unknown> = {};
    assignIfDefined(updates, "type", args.type);
    if (typeof args.content !== "undefined") {
      updates["content"] = await enrichImageMeta(ctx, args.content);
    }
    assignIfDefined(updates, "orderIndex", args.orderIndex);
    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.sectionId, updates);
    }
    const page = await ctx.db.get(section.landingPageId);
    if (page) await ctx.scheduler.runAfter(0, (internal as any).revalidate.bySlug, { slug: page.slug });
    return null;
  },
});

export const remove = mutation({
  args: { sectionId: v.id("pageSections") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const section = await ctx.db.get(args.sectionId);
    if (!section) throw new Error("Section not found");
    await requirePageOwnership(ctx, section.landingPageId);
    await ctx.db.delete(args.sectionId);
    const page = await ctx.db.get(section.landingPageId);
    if (page) await ctx.scheduler.runAfter(0, (internal as any).revalidate.bySlug, { slug: page.slug });
    return null;
  },
});

export const reorder = mutation({
  args: {
    landingPageId: v.id("landingPages"),
    ordered: v.array(
      v.object({ sectionId: v.id("pageSections"), orderIndex: v.number() }),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requirePageOwnership(ctx, args.landingPageId);

    for (const { sectionId, orderIndex } of args.ordered) {
      const s = await ctx.db.get(sectionId);
      if (!s) continue;
      if (s.landingPageId !== args.landingPageId) continue;
      await ctx.db.patch(sectionId, { orderIndex });
    }

    const page = await ctx.db.get(args.landingPageId);
    if (page) await ctx.scheduler.runAfter(0, (internal as any).revalidate.bySlug, { slug: page.slug });
    return null;
  },
});

export const getSections = query({
  args: { landingPageId: v.id("landingPages") },
  returns: v.array(vSection),
  handler: async (ctx, args) => {
    await requirePageOwnership(ctx, args.landingPageId);
    return await listSectionsByPageId(ctx, args.landingPageId);
  },
});

export const getSection = query({
  args: { sectionId: v.id("pageSections") },
  returns: vSection,
  handler: async (ctx, args) => {
    const section = await ctx.db.get(args.sectionId);
    if (!section) throw new Error("Section not found");
    await requirePageOwnership(ctx, section.landingPageId);
    return section as any;
  },
});


