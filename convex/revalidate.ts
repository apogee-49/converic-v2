import { internalAction } from "./_generated/server";
import { v } from "convex/values";

export const bySlug = internalAction({
  args: { slug: v.string() },
  returns: v.null(),

  handler: async (_ctx, { slug }) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const secret = process.env.NEXT_REVALIDATE_SECRET;

    if (!siteUrl || !secret) {
      return null;
    }

    const revalidateUrl = `${siteUrl}/api/revalidate`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    };
    const body = JSON.stringify({ slug });

    await fetch(revalidateUrl, {
      method: "POST",
      headers: headers,
      body: body,
    });

    return null;
  },
});


