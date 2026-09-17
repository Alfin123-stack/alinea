import type { Book } from "@/lib/types";

/**
 * Hardcover adapter — optional source for genuine reader ratings.
 *
 * Google Books' averageRating is missing for most non-mainstream titles, which
 * undercuts the whole point of Alinea ("see what other readers thought"). When
 * HARDCOVER_API_TOKEN is set, ratings are looked up here and take precedence;
 * without it every function no-ops and the app keeps using Google's numbers.
 *
 * Get a token at https://hardcover.app/account/api
 */

const API_URL = "https://api.hardcover.app/v1/graphql";
const TOKEN = process.env.HARDCOVER_API_TOKEN;

export const hardcoverEnabled = Boolean(TOKEN);

export interface ReaderRating {
  average: number;
  count: number;
  source: "hardcover";
}

interface HardcoverBook {
  title?: string;
  rating?: number | null;
  ratings_count?: number | null;
}

interface HardcoverResponse {
  data?: { books?: HardcoverBook[] };
  errors?: unknown;
}

const SEARCH_QUERY = `
  query BookRating($title: String!) {
    books(where: { title: { _ilike: $title } }, order_by: { ratings_count: desc }, limit: 1) {
      title
      rating
      ratings_count
    }
  }
`;

/**
 * Look up a reader rating by title. Returns null whenever the token is absent,
 * the request fails, or Hardcover has no rating — callers fall back to Google.
 */
export async function getReaderRating(book: Book): Promise<ReaderRating | null> {
  if (!TOKEN || !book.title) return null;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        query: SEARCH_QUERY,
        variables: { title: book.title },
      }),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;

    const json = (await res.json()) as HardcoverResponse;
    const match = json.data?.books?.[0];
    if (!match?.rating) return null;

    return {
      average: Math.round(match.rating * 10) / 10,
      count: match.ratings_count ?? 0,
      source: "hardcover",
    };
  } catch {
    return null;
  }
}

/**
 * Merge a Hardcover rating into a book, preferring it over Google's when
 * available. Safe to call unconditionally.
 */
export async function withReaderRating(book: Book): Promise<Book> {
  const rating = await getReaderRating(book);
  if (!rating) return book;

  return {
    ...book,
    averageRating: rating.average,
    ratingsCount: rating.count || book.ratingsCount,
    ratingSource: "hardcover",
  };
}
