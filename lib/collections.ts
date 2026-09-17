import type { Collection } from "./types";

export const collections: Collection[] = [
  {
    slug: "lagi-rame",
    titleKey: "col.trending",
    curatorKey: "col.curator",
    query: "subject:fiction bestseller 2024",
    highlight: true,
    subtitleKey: "col.trendingSub",
  },
  {
    slug: "fiksi-ringan",
    titleKey: "col.weekend",
    curatorKey: "col.curator",
    query: "subject:contemporary fiction",
  },
  {
    slug: "pengembangan-diri",
    titleKey: "col.healing",
    curatorKey: "col.curator",
    query: "subject:self-help",
  },
  {
    slug: "klasik",
    titleKey: "col.classic",
    curatorKey: "col.curator",
    query: "subject:classic literature",
  },
];

export const exploreGenres = [
  "Fiction",
  "Romance",
  "Fantasy",
  "Self-Help",
  "Biography",
  "Mystery",
  "Science",
  "History",
];
