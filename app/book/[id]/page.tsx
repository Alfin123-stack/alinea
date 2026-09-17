import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NavPill } from "@/components/layout/nav-pill";
import { Footer } from "@/components/layout/footer";
import { BookHeader } from "@/components/book/book-header";
import { Synopsis } from "@/components/book/synopsis";
import { RelatedBooks } from "@/components/book/related-books";
import { getBookById, searchBooks } from "@/lib/google-books";
import { withReaderRating } from "@/lib/hardcover";
import { stripHtml } from "@/lib/utils";
import type { Book } from "@/lib/types";
import { siteName, siteUrl } from "@/lib/site";
import { getSessionUser } from "@/lib/auth/session-store";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookById(id);
  // Not found: keep it out of the index instead of letting a dead/removed
  // Google Books ID accumulate as a soft-404 in Search Console.
  if (!book) {
    return {
      title: "Buku tidak ditemukan",
      robots: { index: false, follow: true },
    };
  }

  const description =
    stripHtml(book.description).slice(0, 160) ||
    `${book.title} — sinopsis, genre, dan rating pembaca di ${siteName}.`;
  const authorLine = book.authors[0];

  return {
    // Layout's title.template already appends "— Alinea".
    title: book.title,
    description,
    alternates: { canonical: `/book/${book.id}` },
    openGraph: {
      type: "book",
      title: book.title,
      description,
      url: `/book/${book.id}`,
      ...(authorLine ? { authors: [authorLine] } : {}),
      ...(book.thumbnail
        ? { images: [{ url: book.thumbnail, alt: book.title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description,
      ...(book.thumbnail ? { images: [book.thumbnail] } : {}),
    },
  };
}

/**
 * Related books, weighted rather than a single category lookup: books sharing
 * both the author and the category rank above ones sharing only the category,
 * so the row doesn't devolve into "any other Fiction title".
 */
async function findRelated(book: Book): Promise<Book[]> {
  const category = book.categories[0];
  const author = book.authors[0];

  const [sameCategory, sameAuthor] = await Promise.all([
    category ? searchBooks(`subject:${category}`, { maxResults: 12 }) : Promise.resolve([]),
    author ? searchBooks(`inauthor:${author}`, { maxResults: 6 }) : Promise.resolve([]),
  ]);

  const seen = new Set([book.id]);
  const merged: Book[] = [];

  // Same author first — the strongest signal we can derive without a taste graph.
  for (const candidate of [...sameAuthor, ...sameCategory]) {
    if (seen.has(candidate.id)) continue;
    seen.add(candidate.id);
    merged.push(candidate);
  }

  return merged;
}

function bookJsonLd(book: Book) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    ...(book.authors.length ? { author: book.authors.map((name) => ({ "@type": "Person", name })) } : {}),
    ...(book.description ? { description: stripHtml(book.description).slice(0, 500) } : {}),
    ...(book.thumbnail ? { image: book.thumbnail } : {}),
    ...(book.publisher ? { publisher: { "@type": "Organization", name: book.publisher } } : {}),
    ...(book.publishedDate ? { datePublished: book.publishedDate } : {}),
    ...(book.pageCount ? { numberOfPages: book.pageCount } : {}),
    ...(book.language ? { inLanguage: book.language } : {}),
    ...(book.averageRating && book.ratingsCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: book.averageRating,
            ratingCount: book.ratingsCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

function breadcrumbJsonLd(book: Book) {
  // Google's structured-data validator requires absolute URLs here — unlike
  // the Metadata API fields above, a raw JSON-LD blob isn't resolved against
  // metadataBase, so siteUrl has to be applied by hand.
  const abs = (path: string) => new URL(path, siteUrl).toString();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: abs("/") },
      { "@type": "ListItem", position: 2, name: "Jelajah", item: abs("/explore") },
      { "@type": "ListItem", position: 3, name: book.title, item: abs(`/book/${book.id}`) },
    ],
  };
}

export default async function BookPage({ params }: Props) {
  const { id } = await params;
  const found = await getBookById(id);

  if (!found) notFound();

  // Prefer a genuine reader rating when a Hardcover token is configured.
  const book = await withReaderRating(found);
  const related = await findRelated(book);
  const session = await getSessionUser();
  const locked = !session;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd(book)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(book)) }}
      />
      <NavPill />
      <main className="flex-1">
        <BookHeader book={book} locked={locked} next={`/book/${book.id}`} />
        <Synopsis description={book.description} locked={locked} />
        <RelatedBooks books={related.slice(0, 5)} category={book.categories[0]} locked={locked} />
      </main>
      <Footer />
    </>
  );
}
