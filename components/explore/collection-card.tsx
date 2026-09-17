"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import type { Book, Collection } from "@/lib/types";
import { useT } from "@/lib/i18n/context";

export function CollectionCard({
  collection,
  books,
  totalItems,
}: {
  collection: Collection;
  books: Book[];
  totalItems: number;
}) {
  const t = useT();
  const covers = books.slice(0, 3);
  const title = t(collection.titleKey);

  if (collection.highlight) {
    const backdrop = covers[0];
    return (
      <Link
        href={`/explore?q=${encodeURIComponent(collection.query)}`}
        className="group flex w-[248px] shrink-0 snap-start flex-col gap-3 sm:w-[300px]"
      >
        <div className="relative flex aspect-[3/2] items-center justify-center overflow-hidden rounded-2xl bg-ink p-4">
          {backdrop?.thumbnail && (
            <Image
              src={backdrop.thumbnail}
              alt=""
              fill
              sizes="320px"
              className="object-cover opacity-50 transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/40" />
          <div className="relative px-4 text-center">
            <span className="type-heading-sm inline-block rounded-full border border-paper/25 bg-paper/10 px-4 py-1.5 text-paper backdrop-blur-sm">
              {title}
            </span>
          </div>
        </div>
        <div>
          <p className="type-subheading text-ink">{title}</p>
          <p className="type-caption text-stone">
            {collection.subtitleKey ? t(collection.subtitleKey) : t(collection.curatorKey)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/explore?q=${encodeURIComponent(collection.query)}`}
      className="group flex w-[248px] shrink-0 snap-start flex-col gap-3 sm:w-[300px]"
    >
      <div className="grid aspect-[3/2] grid-cols-3 gap-1 overflow-hidden rounded-2xl bg-linen p-1">
        {covers.map((book) => (
          <div key={book.id} className="relative overflow-hidden rounded-xl bg-paper">
            {book.thumbnail && (
              <Image
                src={book.thumbnail}
                alt=""
                fill
                sizes="200px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
          </div>
        ))}
      </div>
      <div>
        <p className="type-subheading text-ink">{title}</p>
        <p className="type-caption flex items-center gap-1 text-stone">
          <span>{t(collection.curatorKey)}</span>
          <BadgeCheck size={13} className="shrink-0" />
          <span>
            · {totalItems.toLocaleString()} {t("explore.books")}
          </span>
        </p>
      </div>
    </Link>
  );
}
