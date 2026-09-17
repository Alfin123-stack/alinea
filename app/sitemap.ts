import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { collections, exploreGenres } from "@/lib/collections";

/**
 * File-convention sitemap — Next.js serves this at /sitemap.xml automatically.
 *
 * Book detail pages (/book/[id]) are deliberately left out: their IDs come
 * from Google Books/Open Library, not a catalogue Alinea owns, so there's no
 * finite, stable list to enumerate. They're still fully indexable — Google
 * reaches them by crawling the links on /explore and /book/[id]'s related
 * books, they just don't need a sitemap entry to be found.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl.toString().replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/explore`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${base}/explore?q=${encodeURIComponent(c.query)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const genreRoutes: MetadataRoute.Sitemap = exploreGenres.map((genre) => ({
    url: `${base}/explore?q=${encodeURIComponent(`subject:${genre}`)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...collectionRoutes, ...genreRoutes];
}
