import type { TranslationKey } from "@/lib/i18n/dictionaries";

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  description: string;
  categories: string[];
  averageRating?: number;
  ratingsCount?: number;
  /** Set when the rating came from somewhere other than the primary catalogue. */
  ratingSource?: "hardcover";
  thumbnail?: string;
  publishedDate?: string;
  publisher?: string;
  pageCount?: number;
  language?: string;
  previewLink?: string;
  infoLink?: string;
}

export interface Collection {
  slug: string;
  /** Dictionary key — collection names are UI copy, so they get translated. */
  titleKey: TranslationKey;
  curatorKey: TranslationKey;
  query: string;
  /** Renders this collection as the large promo-style card in the carousel. */
  highlight?: boolean;
  /** Shown under the title for highlight cards, instead of the curator line. */
  subtitleKey?: TranslationKey;
}
