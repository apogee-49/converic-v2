import { v } from "convex/values";
import { internal } from "./_generated/api";

export const Tables = {
  landingPages: "landingPages",
  pageSections: "pageSections",
} as const;

export const Indices = {
  landingPages: {
    bySlug: "by_slug",
    byCustomDomain: "by_customDomain",
    byUserId: "by_userId",
  },
  pageSections: {
    byLandingAndOrder: "by_landingPageId_and_orderIndex",
    byLanding: "by_landingPageId",
  },
} as const;


export const vLanding = v.object({
  _id: v.id(Tables.landingPages),
  _creationTime: v.number(),
  userId: v.string(),
  slug: v.string(),
  title: v.string(),
  styling: v.any(),
  settings: v.any(),
  customDomain: v.union(v.string(), v.null()),
  createdAt: v.number(),
});


export const vSection = v.object({
  _id: v.id(Tables.pageSections),
  _creationTime: v.number(),
  landingPageId: v.id(Tables.landingPages),
  type: v.string(),
  content: v.any(),
  orderIndex: v.number(),
});


export const vLandingWithSections = v.object({
  landingPage: vLanding,
  sections: v.array(vSection),
});


export const requireIdentity = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  return identity;
};


export const requirePageOwnership = async (ctx: any, landingPageId: string) => {
  const landing = await ctx.db.get(landingPageId);
  if (!landing) throw new Error("Landing page not found");
  const identity = await requireIdentity(ctx);
  if (landing.userId !== identity.subject) throw new Error("Forbidden");
  return landing;
};


export const getPageBySlug = async (ctx: any, slug: string) => {
  return await (ctx.db as any)
    .query(Tables.landingPages)
    .withIndex(Indices.landingPages.bySlug, (q: any) => q.eq("slug", slug))
    .unique();
};


export const listSectionsByPageId = async (ctx: any, pageId: string) => {
  return await (ctx.db as any)
    .query(Tables.pageSections)
    .withIndex(Indices.pageSections.byLandingAndOrder, (q: any) =>
      q.eq("landingPageId", pageId),
    )
    .order("asc")
    .collect();
};


export const listPages = async (ctx: any, userId: string) => {
  return await (ctx.db as any)
    .query(Tables.landingPages)
    .withIndex(Indices.landingPages.byUserId, (q: any) => q.eq("userId", userId))
    .collect();
};


export const revalidateSlug = async (ctx: any, slug: string) => {
  await ctx.scheduler.runAfter(0, (internal as any).revalidate.bySlug, { slug });
};


export const assignIfDefined = (
  target: Record<string, unknown>,
  key: string,
  value: unknown | undefined,
) => {
  if (typeof value !== "undefined") target[key] = value;
};

