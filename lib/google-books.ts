import type { Book } from "./types";
import {
  getOpenLibraryBook,
  isOpenLibraryId,
  searchOpenLibrary,
} from "./open-library";

const API_BASE = "https://www.googleapis.com/books/v1/volumes";

// Optional: set GOOGLE_BOOKS_API_KEY in your environment for a higher
// request quota. The app works without it for moderate traffic.
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

interface GoogleVolumeInfo {
  title?: string;
  subtitle?: string;
  authors?: string[];
  description?: string;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    extraLarge?: string;
  };
  publishedDate?: string;
  publisher?: string;
  pageCount?: number;
  language?: string;
  previewLink?: string;
  infoLink?: string;
}

interface GoogleVolume {
  id: string;
  volumeInfo?: GoogleVolumeInfo;
}

interface GoogleVolumesResponse {
  totalItems?: number;
  items?: GoogleVolume[];
}

// Google Books' search endpoint almost always only populates `thumbnail`
// (zoom=1, ~128px wide) even though the content API supports much larger
// crops via the same URL. Force https, drop the curl-page edge effect, and
// bump zoom up to 3 (~800px) so covers stay sharp at hero/spotlight size
// instead of the pixelated default used across the masonry grid.
function upgradeThumbnail(url?: string, zoom: 2 | 3 = 3): string | undefined {
  if (!url) return undefined;
  let upgraded = url.replace(/^http:/, "https:").replace(/&edge=curl/g, "");
  upgraded = /[?&]zoom=\d+/.test(upgraded)
    ? upgraded.replace(/([?&]zoom=)\d+/, `$1${zoom}`)
    : `${upgraded}${upgraded.includes("?") ? "&" : "?"}zoom=${zoom}`;
  return upgraded;
}

function mapVolume(volume: GoogleVolume): Book {
  const info = volume.volumeInfo ?? {};
  return {
    id: volume.id,
    title: info.title ?? "Tanpa judul",
    subtitle: info.subtitle,
    authors: info.authors ?? [],
    description: info.description ?? "",
    categories: info.categories ?? [],
    averageRating: info.averageRating,
    ratingsCount: info.ratingsCount,
    thumbnail: upgradeThumbnail(
      info.imageLinks?.large ??
        info.imageLinks?.medium ??
        info.imageLinks?.small ??
        info.imageLinks?.thumbnail ??
        info.imageLinks?.smallThumbnail
    ),
    publishedDate: info.publishedDate,
    publisher: info.publisher,
    pageCount: info.pageCount,
    language: info.language,
    previewLink: info.previewLink,
    infoLink: info.infoLink,
  };
}

function withKey(params: URLSearchParams) {
  if (API_KEY) params.set("key", API_KEY);
  return params;
}

/**
 * Raw Google Books search. Returns null (rather than an empty result) when the
 * request itself failed — quota exhaustion, network error, 5xx — so callers can
 * tell "Google is unavailable" apart from "Google found nothing" and only fall
 * back to Open Library in the first case.
 */
async function googleSearch(
  query: string,
  { maxResults = 12, orderBy }: { maxResults?: number; orderBy?: "relevance" | "newest" } = {}
): Promise<{ books: Book[]; totalItems: number } | null> {
  const params = withKey(
    new URLSearchParams({
      q: query,
      maxResults: String(Math.min(maxResults, 40)),
      ...(orderBy ? { orderBy } : {}),
    })
  );

  try {
    const res = await fetch(`${API_BASE}?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    // 429 = daily quota gone, 403 = key/quota rejected — both mean "try the fallback".
    if (!res.ok) return null;

    const data = (await res.json()) as GoogleVolumesResponse;
    const books = (data.items ?? [])
      .filter((v) => v.volumeInfo?.imageLinks)
      .map(mapVolume);
    return { books, totalItems: data.totalItems ?? books.length };
  } catch {
    return null;
  }
}

/**
 * Search books by free-text query (title, author, subject, etc), with an
 * automatic Open Library fallback. Returns an empty array only when both
 * sources come up empty, so pages can render an empty state instead of
 * crashing or going blank during a Google Books outage.
 */
export async function searchBooks(
  query: string,
  options: { maxResults?: number; orderBy?: "relevance" | "newest" } = {}
): Promise<Book[]> {
  const { books } = await searchBooksWithCount(query, options);
  return books;
}

/**
 * Same as searchBooks, but also returns the source's reported total match
 * count — used by curated collection cards to show "· N buku".
 */
export async function searchBooksWithCount(
  query: string,
  { maxResults = 12, orderBy }: { maxResults?: number; orderBy?: "relevance" | "newest" } = {}
): Promise<{ books: Book[]; totalItems: number }> {
  if (!query.trim()) return { books: [], totalItems: 0 };

  const google = await googleSearch(query, { maxResults, orderBy });

  // Google answered and had results — done.
  if (google && google.books.length) return google;

  // Google failed outright, or answered with nothing usable. Open Library has
  // no key and no quota, so it can absorb the traffic either way.
  const fallback = await searchOpenLibrary(query, { maxResults });
  if (fallback.books.length) return fallback;

  return google ?? { books: [], totalItems: 0 };
}

/**
 * Fetch a single book by id, from whichever source the id belongs to.
 *
 * Unlike `searchBooksWithCount`, this has no cross-source fallback: an id is
 * only meaningful to the source namespace it came from (a Google volume id
 * doesn't exist in Open Library's index and vice versa), so there's no
 * "other source" to retry against without the title in hand. What we *can*
 * do is not give up on the first transient hiccup, and log the real reason
 * (quota vs a genuine 404) instead of collapsing everything into a silent
 * `null` that's indistinguishable from "book doesn't exist".
 */
export async function getBookById(rawId: string): Promise<Book | null> {
  // Defensive: a route param sometimes arrives still percent-encoded (e.g.
  // "ol%3AOL123W" instead of "ol:OL123W"), which makes the "ol:" prefix
  // check below silently fail and sends an Open Library id to Google Books
  // as if it were one of theirs. decodeURIComponent on an already-decoded
  // string (no "%" present) is a no-op, so this is safe for normal Google
  // Books ids too.
  const id = decodeURIComponent(rawId);
  if (isOpenLibraryId(id)) return getOpenLibraryBook(id);

  const url = `${API_BASE}/${id}?${withKey(new URLSearchParams()).toString()}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) {
        // 429 = daily quota gone, 403 = key/quota rejected, 404 = genuinely
        // doesn't exist. Worth telling apart in the logs — a page that's
        // "not found" for everyone because of 429 looks identical to a real
        // 404 unless this is logged.
        console.error(`[getBookById] Google Books ${res.status} for id="${id}"`);
        if (res.status === 404) return null;
        continue; // 429/403/5xx — worth one retry before giving up
      }
      const data = (await res.json()) as GoogleVolume;
      if (!data.id) return null;
      return mapVolume(data);
    } catch (err) {
      console.error(`[getBookById] fetch failed for id="${id}"`, err);
    }
  }

  return null;
}

/** Fetch several search queries in parallel — used for collections. */
export async function searchMany(
  queries: { query: string; maxResults?: number }[]
): Promise<Book[][]> {
  return Promise.all(
    queries.map((q) => searchBooks(q.query, { maxResults: q.maxResults }))
  );
}

/** Fetch several search queries in parallel, each with its totalItems count. */
export async function searchManyWithCount(
  queries: { query: string; maxResults?: number }[]
): Promise<{ books: Book[]; totalItems: number }[]> {
  return Promise.all(
    queries.map((q) => searchBooksWithCount(q.query, { maxResults: q.maxResults }))
  );
}
