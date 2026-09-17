"use client";

import type { Book } from "@/lib/types";
import { BookCard } from "@/components/explore/book-card";
import { useT } from "@/lib/i18n/context";
import { RevealItem } from "@/components/ui/reveal";
import { LockedTeaser } from "@/components/auth/locked-teaser";

export function RelatedBooks({
  books,
  category,
  locked,
}: {
  books: Book[];
  category?: string;
  locked?: boolean;
}) {
  const t = useT();
  if (!books.length) return null;

  const grid = (
    <div className="mt-6 grid grid-cols-2 gap-x-4 sm:grid-cols-3 md:grid-cols-5">
      {books.map((book, i) => (
        <RevealItem key={book.id} index={i}>
          <BookCard book={book} />
        </RevealItem>
      ))}
    </div>
  );

  return (
    <section className="px-4 pb-24 md:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="type-heading text-ink">
          {category ? t("book.relatedIn", { category }) : t("book.relatedGeneric")}
        </h2>
        {locked ? <LockedTeaser maxHeight={340}>{grid}</LockedTeaser> : grid}
      </div>
    </section>
  );
}
