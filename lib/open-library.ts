import type { Book } from "@/lib/types";

/**
 * Open Library adapter.
 *
 * Used purely as a fallback for Google Books: no API key, no quota, so when
 * Google starts returning 429s the site keeps serving results instead of going
 * blank. Coverage is thinner for very new releases, which is why it is second
 * in line rather than the primary source.
 */

const SEARCH_URL = "https://openlibrary.org/search.json";
const COVER_URL = "https://covers.openlibrary.org/b/id";

// Open Library asks API clients to identify themselves; a generic/missing
// User-Agent is more likely to get rate-limited.
const HEADERS = { "User-Agent": "Alinea/1.0 (contact: hello@alinea.app)" };

interface OpenLibraryDoc {
  key?: string;
  title?: string;
  subtitle?: string;
  author_name?: string[];
  first_sentence?: string[];
  subject?: string[];
  ratings_average?: number;
  ratings_count?: number;
  cover_i?: number;
  first_publish_year?: number;
  publisher?: string[];
  number_of_pages_median?: number;
  language?: string[];
}

interface OpenLibraryResponse {
  numFound?: number;
  docs?: OpenLibraryDoc[];
}

interface OpenLibraryWork {
  title?: string;
  description?: string | { value?: string };
  subjects?: string[];
  covers?: number[];
  authors?: { author?: { key?: string } }[];
  // Present when this work id has been merged into another one — Open
  // Library keeps the old id resolvable but redirects it via these fields
  // instead of a normal 3xx, so a plain fetch().ok check doesn't catch it.
  type?: { key?: string };
  location?: string;
}

/** Open Library work keys look like "/works/OL123W" — prefix them so the id namespace can't collide with Google's. */
function toId(key?: string): string {
  const raw = key?.replace("/works/", "") ?? "";
  return `ol:${raw}`;
}

/** Strip the "ol:" namespace back off for API calls. */
export function isOpenLibraryId(id: string): boolean {
  return id.startsWith("ol:");
}

function mapDoc(doc: OpenLibraryDoc): Book {
  return {
    id: toId(doc.key),
    title: doc.title ?? "Untitled",
    subtitle: doc.subtitle,
    authors: doc.author_name ?? [],
    description: doc.first_sentence?.[0] ?? "",
    categories: (doc.subject ?? []).slice(0, 5),
    averageRating: doc.ratings_average
      ? Math.round(doc.ratings_average * 10) / 10
      : undefined,
    ratingsCount: doc.ratings_count,
    thumbnail: doc.cover_i ? `${COVER_URL}/${doc.cover_i}-L.jpg` : undefined,
    publishedDate: doc.first_publish_year ? String(doc.first_publish_year) : undefined,
    publisher: doc.publisher?.[0],
    pageCount: doc.number_of_pages_median,
    language: doc.language?.[0],
    infoLink: doc.key ? `https://openlibrary.org${doc.key}` : undefined,
  };
}

/**
 * Open Library's search syntax differs from Google's, so translate the bits
 * this app actually uses (`subject:` prefixes) and drop the rest as free text.
 */
function normaliseQuery(query: string): string {
  return query.replace(/subject:/gi, "subject:").replace(/\s+OR\s+/gi, " ");
}

/** Fetch with one retry on transient failure — a network blip shouldn't 404 a real page. */
async function fetchWithRetry(url: string, attempts = 2): Promise<Response | null> {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: HEADERS,
        next: { revalidate: 3600 },
      });
      if (res.ok) return res;
      // A real 404 (book doesn't exist) won't fix itself — don't waste a retry on it.
      if (res.status === 404) return res;
    } catch {
      // fall through to retry
    }
  }
  return null;
}

export async function searchOpenLibrary(
  query: string,
  { maxResults = 12 }: { maxResults?: number } = {}
): Promise<{ books: Book[]; totalItems: number }> {
  if (!query.trim()) return { books: [], totalItems: 0 };

  const params = new URLSearchParams({
    q: normaliseQuery(query),
    limit: String(Math.min(maxResults, 100)),
    fields:
      "key,title,subtitle,author_name,first_sentence,subject,ratings_average,ratings_count,cover_i,first_publish_year,publisher,number_of_pages_median,language",
  });

  const res = await fetchWithRetry(`${SEARCH_URL}?${params.toString()}`);
  if (!res || !res.ok) return { books: [], totalItems: 0 };

  try {
    const data = (await res.json()) as OpenLibraryResponse;
    const books = (data.docs ?? []).filter((d) => d.cover_i).map(mapDoc);
    return { books, totalItems: data.numFound ?? books.length };
  } catch {
    return { books: [], totalItems: 0 };
  }
}

/** Resolve author names from the work's author keys — the work record itself only lists keys. */
async function resolveAuthorNames(work: OpenLibraryWork): Promise<string[]> {
  const keys = (work.authors ?? [])
    .map((a) => a.author?.key)
    .filter((k): k is string => Boolean(k));
  if (!keys.length) return [];

  const names = await Promise.all(
    keys.slice(0, 3).map(async (key) => {
      const res = await fetchWithRetry(`https://openlibrary.org${key}.json`);
      if (!res || !res.ok) return null;
      try {
        const author = (await res.json()) as { name?: string };
        return author.name ?? null;
      } catch {
        return null;
      }
    })
  );

  return names.filter((n): n is string => Boolean(n));
}

export async function getOpenLibraryBook(id: string, _hop = 0): Promise<Book | null> {
  const workKey = id.replace(/^ol:/, "");
  if (!workKey) return null;

  const res = await fetchWithRetry(`https://openlibrary.org/works/${workKey}.json`);
  if (!res || !res.ok) {
    console.error(`[getOpenLibraryBook] ${res?.status ?? "network error"} for id="${id}"`);
    return null;
  }

  try {
    const work = (await res.json()) as OpenLibraryWork;

    // A merged work: Open Library resolves the old id with 200 + a
    // `type: redirect` / `location` body instead of a normal 3xx. Follow it
    // once so a book that legitimately still exists doesn't 404 just because
    // it got merged into a newer work id.
    if (!work.title) {
      if (work.location && _hop === 0) {
        console.error(`[getOpenLibraryBook] "${id}" merged -> "${work.location}", following`);
        return getOpenLibraryBook(`ol:${work.location.replace(/^\/works\//, "")}`, _hop + 1);
      }
      console.error(`[getOpenLibraryBook] no title for id="${id}" (deleted or malformed record)`);
      return null;
    }

    const authors = await resolveAuthorNames(work);

    return {
      id,
      title: work.title,
      authors,
      description:
        typeof work.description === "string"
          ? work.description
          : work.description?.value ?? "",
      categories: (work.subjects ?? []).slice(0, 5),
      thumbnail: work.covers?.[0] ? `${COVER_URL}/${work.covers[0]}-L.jpg` : undefined,
      infoLink: `https://openlibrary.org/works/${workKey}`,
    };
  } catch {
    return null;
  }
}
