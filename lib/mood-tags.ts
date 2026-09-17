import type { Book } from "@/lib/types";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

/**
 * Mood tags, StoryGraph-style.
 *
 * Google Books only gives coarse BISAC-ish categories, so these are derived
 * rather than crowd-sourced: category keywords map to a reading "feel", and
 * page count maps to a pace. Deliberately conservative — a book with no
 * recognised category gets no tags rather than a wrong one.
 */

const CATEGORY_MOODS: { match: RegExp; mood: TranslationKey }[] = [
  { match: /self-?help|personal growth|motivational|inspiration/i, mood: "mood.inspiring" },
  { match: /philosoph|essay|memoir|literary criticism/i, mood: "mood.reflective" },
  { match: /thriller|suspense|crime|mystery|detective/i, mood: "mood.tense" },
  { match: /horror|gothic|dark/i, mood: "mood.dark" },
  { match: /humor|comic|graphic novel|juvenile/i, mood: "mood.light" },
  { match: /romance|love stories/i, mood: "mood.emotional" },
  { match: /adventure|action|fantasy|science fiction/i, mood: "mood.adventurous" },
  { match: /science|history|business|technology|education|reference/i, mood: "mood.informative" },
  { match: /biography|autobiography|social science/i, mood: "mood.reflective" },
  { match: /fiction/i, mood: "mood.emotional" },
];

/** Roughly where a book stops feeling like a quick read. */
const FAST_PACE_MAX_PAGES = 300;
const SLOW_PACE_MIN_PAGES = 500;

export function getMoodTags(book: Book, limit = 2): TranslationKey[] {
  const tags: TranslationKey[] = [];
  const haystack = book.categories.join(" ");

  for (const { match, mood } of CATEGORY_MOODS) {
    if (match.test(haystack) && !tags.includes(mood)) {
      tags.push(mood);
      if (tags.length >= limit) break;
    }
  }

  if (tags.length < limit && book.pageCount) {
    if (book.pageCount <= FAST_PACE_MAX_PAGES) tags.push("mood.fastPaced");
    else if (book.pageCount >= SLOW_PACE_MIN_PAGES) tags.push("mood.slowPaced");
  }

  return tags.slice(0, limit);
}

/**
 * Estimated reading time from page count, at roughly 270 words per page and
 * 250 words per minute — the usual rule of thumb for adult trade paperbacks.
 */
export function estimateReadingMinutes(pageCount?: number): number | null {
  if (!pageCount || pageCount < 10) return null;
  return Math.round((pageCount * 270) / 250);
}
