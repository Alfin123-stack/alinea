import { NavPill } from "@/components/layout/nav-pill";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { StatsBar } from "@/components/landing/stats-bar";
import { Spotlight } from "@/components/landing/spotlight";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { SqueezeCollections, type CollectionPanel } from "@/components/landing/squeeze-collections";
import { TrendingStrip } from "@/components/landing/trending-strip";
import { TrustRow } from "@/components/landing/trust-row";
import { Faq } from "@/components/landing/faq";
import { CtaSection } from "@/components/landing/cta-section";
import { searchBooks } from "@/lib/google-books";
import { withReaderRating } from "@/lib/hardcover";
import { collections } from "@/lib/collections";
import type { Book } from "@/lib/types";

// Rendered per-request: the page depends on live data from Google Books.
export const dynamic = "force-dynamic";

function topRated(books: Book[], count: number) {
  return [...books]
    .filter((b) => b.averageRating)
    .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
    .slice(0, count);
}

// "Ramai dibahas" = lots of readers weighing in, not necessarily the
// highest score — ratingsCount is the closer proxy for that than
// averageRating (a niche 5-star book with 3 ratings isn't "trending").
function mostDiscussed(books: Book[], count: number) {
  return [...books]
    .filter((b) => b.ratingsCount)
    .sort((a, b) => (b.ratingsCount ?? 0) - (a.ratingsCount ?? 0))
    .slice(0, count);
}

export default async function HomePage() {
  const [heroCovers, fantasyBooks, selfHelpBooks, fictionBooks, collectionCovers] = await Promise.all([
    searchBooks("bestseller fiction 2024", { maxResults: 8 }),
    searchBooks("subject:fantasy", { maxResults: 8 }),
    searchBooks("subject:self-help", { maxResults: 8 }),
    searchBooks("subject:fiction", { maxResults: 20 }),
    Promise.all(collections.map((c) => searchBooks(c.query, { maxResults: 1 }))),
  ]);

  const spotlightBook = heroCovers[0] ?? fictionBooks[0] ?? null;
  const ratedFiction = topRated(fictionBooks, 4);

  // Enrich with real reader ratings where available (see lib/hardcover.ts —
  // no-ops back to Google's numbers when HARDCOVER_API_TOKEN isn't set), then
  // pick the ones with the most ratings for the "lagi ramai dibahas" strip.
  const fictionWithReaderRatings = await Promise.all(fictionBooks.map(withReaderRating));
  const trendingBooks = mostDiscussed(fictionWithReaderRatings, 10);

  const collectionPanels: CollectionPanel[] = collections.map((collection, i) => ({
    collection,
    cover: collectionCovers[i]?.[0],
  }));

  return (
    <>
      <NavPill />
      <main className="flex-1">
        <Hero covers={heroCovers} />
        <StatsBar />
        <Spotlight book={spotlightBook} />
        <TrendingStrip books={trendingBooks} />
        <FeatureGrid
          byGenre={fantasyBooks.slice(0, 4)}
          byMood={selfHelpBooks.slice(0, 3)}
          byRating={ratedFiction.length ? ratedFiction : fictionBooks.slice(0, 4)}
        />
        <SqueezeCollections panels={collectionPanels} />
        <TrustRow />
        <Faq />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
