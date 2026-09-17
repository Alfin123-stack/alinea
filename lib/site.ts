/**
 * Single source of truth for site-wide SEO values. Everything that needs an
 * absolute URL (metadataBase, canonical tags, sitemap, robots.txt, JSON-LD)
 * reads from here so there's exactly one place to update on launch.
 *
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://alinea.app) — without
 * it, metadataBase falls back to localhost and every canonical/OG URL Next.js
 * generates would silently point at the wrong host.
 */
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = new URL(
  rawSiteUrl && rawSiteUrl.length > 0 ? rawSiteUrl : "http://localhost:3000"
);

export const siteName = "Alinea";

export const siteDescription =
  "Alinea membantu kamu mengenal sinopsis, genre, dan rating sebuah buku sebelum memutuskan untuk membacanya — pas untuk rekomendasi yang kamu temukan di media sosial.";

/** Absolute URL default OG/Twitter card — used when a page has no cover image of its own. */
export const defaultOgImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: siteName,
};
