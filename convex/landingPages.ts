import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  vLanding,
  vLandingWithSections,
  requireIdentity,
  requirePageOwnership,
  getPageBySlug,
  listSectionsByPageId,
  listPages,
  revalidateSlug,
  assignIfDefined,
} from "./_utils";


export const getPages = query({
  args: {},
  returns: v.array(vLanding),
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    return await listPages(ctx, identity.subject);
  },
});


export const getPage = query({
  args: { landingPageId: v.id("landingPages") },
  returns: vLanding,
  handler: async (ctx, args) => {
    const page = await requirePageOwnership(ctx, args.landingPageId);
    return page;
  },
});


export const create = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    styling: v.optional(v.any()),
    settings: v.any(),
    customDomain: v.union(v.string(), v.null()),
  },
  returns: v.id("landingPages"),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);

    const existingSlug = await getPageBySlug(ctx, args.slug);
    if (existingSlug) throw new Error("Slug already in use");

    const now = Date.now();
    const landingPageId = await ctx.db.insert("landingPages", {
      userId: identity.subject,
      slug: args.slug,
      title: args.title,
      styling: args.styling ?? {},
      settings: args.settings,
      customDomain: args.customDomain,
      createdAt: now,
    });
    await revalidateSlug(ctx, args.slug);
    return landingPageId;
  },
});


export const update = mutation({
  args: {
    landingPageId: v.id("landingPages"),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    styling: v.optional(v.any()),
    settings: v.optional(v.any()),
    customDomain: v.optional(v.union(v.string(), v.null())),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const page = await requirePageOwnership(ctx, args.landingPageId);

    if (typeof args.slug !== "undefined" && args.slug !== page.slug) {
      const existingSlug = await getPageBySlug(ctx, args.slug);
      if (existingSlug && existingSlug._id !== args.landingPageId) {
        throw new Error("Slug already in use");
      }
    }

    const updates: Record<string, unknown> = {};
    assignIfDefined(updates, "slug", args.slug);
    assignIfDefined(updates, "title", args.title);
    assignIfDefined(updates, "styling", args.styling);
    assignIfDefined(updates, "settings", args.settings);
    assignIfDefined(updates, "customDomain", args.customDomain);

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.landingPageId, updates);
    }
    const finalSlug = typeof args.slug !== "undefined" ? args.slug : page.slug;
    await revalidateSlug(ctx, finalSlug);
    return null;
  },
});


export const remove = mutation({
  args: { landingPageId: v.id("landingPages") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const page = await requirePageOwnership(ctx, args.landingPageId);

    const sections = await listSectionsByPageId(ctx, args.landingPageId);
    for (const section of sections) {
      await ctx.db.delete(section._id);
    }
    await ctx.db.delete(args.landingPageId);
    await revalidateSlug(ctx, page.slug);
    return null;
  },
});


export const getLandingPage = query({
  args: { slug: v.string() },
  returns: v.union(vLandingWithSections, v.null()),
  handler: async (ctx, args) => {
    const landing = await getPageBySlug(ctx, args.slug);
    if (!landing) return null;

    const sections = await listSectionsByPageId(ctx, landing._id);

    return { landingPage: landing, sections };
  },
});


