import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  landingPages: defineTable({
    userId: v.string(),
    slug: v.string(),
    title: v.string(),
    styling: v.any(),
    settings: v.any(),
    customDomain: v.union(v.string(), v.null()),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"]) 
    .index("by_customDomain", ["customDomain"]) 
    .index("by_userId", ["userId"]),

  pageSections: defineTable({
    landingPageId: v.id("landingPages"),
    type: v.string(),
    content: v.any(),
    orderIndex: v.number(),
  })
    .index("by_landingPageId_and_orderIndex", ["landingPageId", "orderIndex"])
    .index("by_landingPageId", ["landingPageId"]),

  files: defineTable({
    userId: v.string(),
    fileId: v.id("_storage"),
    fileName: v.string(),
    contentType: v.string(),
    size: v.number(),
    isPublic: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_fileId", ["userId", "fileId"]),
});


