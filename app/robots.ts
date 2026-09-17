import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl.toString().replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal endpoint for the command palette, not a page — no reason
      // for a crawler to hit it directly.
      disallow: "/api/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
