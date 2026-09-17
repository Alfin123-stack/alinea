import { Suspense } from "react";
import type { Metadata } from "next";
import { NavPill } from "@/components/layout/nav-pill";
import { Footer } from "@/components/layout/footer";
import { SearchInput } from "@/components/ui/search-input";
import { GenreTabs } from "@/components/explore/genre-tabs";
import { CollectionCarousel } from "@/components/explore/collection-carousel";
import { MasonryGrid } from "@/components/explore/masonry-grid";
import { EmptyState } from "@/components/explore/empty-state";
import { GateOverlay } from "@/components/auth/gate-overlay";
import { T } from "@/components/i18n/t";
import { searchBooks, searchManyWithCount } from "@/lib/google-books";
import { collections, exploreGenres } from "@/lib/collections";
import { siteName } from "@/lib/site";
import { getSessionUser } from "@/lib/auth/session-store";

export const dynamic = "force-dynamic";

// Books shown in full before the rest of the grid is teased behind a
// login/register gate for logged-out visitors.
const VISIBLE_COUNT = 8;

type SearchParams = { q?: string };

// A query only counts as a "category" (curated collection or genre tab) when
// it matches this fixed, small set — everything else is a free-text search
// typed by a visitor.
function categoryLabel(query: string): string | null {
  const knownGenre = exploreGenres.find(
    (g) => `subject:${g}`.toLowerCase() === query.toLowerCase()
  );
  if (knownGenre) return knownGenre;

  const knownCollection = collections.find(
    (c) => c.query.toLowerCase() === query.toLowerCase()
  );
  if (knownCollection) return knownCollection.query.replace(/^subject:/i, "");

  return null;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();

  if (!query) {
    return {
      title: "Jelajah Buku",
      description:
        "Jelajahi buku berdasarkan genre dan koleksi kurasi, atau cari judul yang kamu temukan di media sosial.",
      alternates: { canonical: "/explore" },
    };
  }

  const category = categoryLabel(query);
  const label = query.replace(/^subject:/i, "");

  if (category) {
    // Bounded set of genre/collection pages — legitimate category pages,
    // safe and useful to index (like a bookstore's genre shelves).
    return {
      title: `${category} — Jelajah Buku`,
      description: `Rekomendasi dan rating buku ${category.toLowerCase()} di ${siteName}.`,
      alternates: { canonical: `/explore?q=${encodeURIComponent(query)}` },
    };
  }

  // Free-text search typed by a visitor — an unbounded number of possible
  // queries with thin, near-duplicate content. Best practice for on-site
  // search results is to keep them out of the index (noindex) while still
  // letting bots follow links from them, and to canonicalize back to the
  // plain listing page so any authority still consolidates there.
  return {
    title: `Hasil pencarian "${label}"`,
    description: `Hasil pencarian buku untuk "${label}" di ${siteName}.`,
    alternates: { canonical: "/explore" },
    robots: { index: false, follow: true },
  };
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();
  const session = await getSessionUser();

  if (query) {
    const results = await searchBooks(query, { maxResults: 24 });
    const label = query.replace(/^subject:/i, "");
    const visible = session ? results : results.slice(0, VISIBLE_COUNT);
    const locked = session ? [] : results.slice(VISIBLE_COUNT);

    return (
      <>
        <NavPill />
        <main className="flex-1 px-4 pb-24 pt-8 md:px-6">
          <div className="mx-auto max-w-6xl">
            <GenreTabs activeQuery={query} />

            <div className="mt-8">
              <T k="explore.resultsFor" as="p" className="type-caption text-stone" />
              <h1 className="type-heading-lg mt-1 text-ink">&ldquo;{label}&rdquo;</h1>
              <p className="type-caption mt-1 text-stone">
                {results.length} <T k="explore.found" />
              </p>
            </div>

            <div className="mt-10">
              {results.length ? (
                <>
                  <MasonryGrid books={visible} />
                  {locked.length > 0 && (
                    <div className="mt-4">
                      <GateOverlay
                        next={`/explore?q=${encodeURIComponent(query)}`}
                        title="Masuk untuk lihat semua hasil"
                        description={`${locked.length} buku lagi menunggu.`}
                      >
                        <MasonryGrid books={locked} />
                      </GateOverlay>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState query={label} />
              )}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const [collectionData, exploreElements] = await Promise.all([
    searchManyWithCount(collections.map((c) => ({ query: c.query, maxResults: 4 }))),
    searchBooks("subject:fiction OR subject:nonfiction", { maxResults: 30 }),
  ]);
  const visibleEverything = session ? exploreElements : exploreElements.slice(0, VISIBLE_COUNT);
  const lockedEverything = session ? [] : exploreElements.slice(VISIBLE_COUNT);

  return (
    <>
      <NavPill />
      <main className="flex-1 px-4 pb-24 pt-8 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-lg">
            <T k="explore.title" as="h1" className="type-heading-lg text-ink" />
            <T k="explore.sub" as="p" className="type-body mt-2 text-stone" />
            <div className="mt-6">
              <Suspense fallback={<div className="h-14 w-full rounded-2xl bg-ink/5" />}>
                <SearchInput size="lg" autoFocus />
              </Suspense>
            </div>
          </div>

          <div className="mt-6">
            <GenreTabs />
          </div>

          <section id="koleksi" className="mt-14 scroll-mt-24">
            <T k="explore.collections" as="h2" className="type-heading text-ink" />
            <div className="mt-6">
              <CollectionCarousel collections={collections} data={collectionData} />
            </div>
          </section>

          <section className="mt-16">
            <T k="explore.everything" as="h2" className="type-heading text-ink" />
            <div className="mt-6">
              {exploreElements.length ? (
                <>
                  <MasonryGrid books={visibleEverything} />
                  {lockedEverything.length > 0 && (
                    <div className="mt-4">
                      <GateOverlay
                        next="/explore"
                        title="Masuk untuk lihat semua buku"
                        description={`${lockedEverything.length} buku lagi menunggu.`}
                      >
                        <MasonryGrid books={lockedEverything} />
                      </GateOverlay>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState />
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
