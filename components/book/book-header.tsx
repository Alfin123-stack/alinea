"use client";

import Image from "next/image";
import { ExternalLink, Clock } from "lucide-react";
import type { Book } from "@/lib/types";
import { StarRating } from "@/components/ui/star-rating";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { GateBar } from "@/components/auth/gate-bar";
import { LockedTeaser } from "@/components/auth/locked-teaser";
import { formatYear } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";
import { estimateReadingMinutes, getMoodTags } from "@/lib/mood-tags";

export function BookHeader({
  book,
  locked,
  next,
}: {
  book: Book;
  locked?: boolean;
  next?: string;
}) {
  const t = useT();
  const year = formatYear(book.publishedDate);
  const minutes = estimateReadingMinutes(book.pageCount);
  const moods = getMoodTags(book, 3);

  const readingTime = minutes
    ? minutes >= 60
      ? `${Math.round(minutes / 60)} ${t("book.hours")} ${t("book.readingTime")}`
      : `${minutes} ${t("book.minutes")} ${t("book.readingTime")}`
    : null;

  const details = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-1 md:items-start">
        <StarRating rating={book.averageRating} count={book.ratingsCount} />
        {book.ratingSource === "hardcover" && (
          <span className="type-caption text-pebble">
            {t("rating.source.hardcover")}
          </span>
        )}
      </div>

      {moods.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 md:justify-start">
          {moods.map((mood) => (
            <span
              key={mood}
              className="type-caption rounded-full bg-ink/5 px-2.5 py-1 text-stone"
            >
              {t(mood)}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 md:justify-start">
        {book.categories.slice(0, 4).map((cat) => (
          <Chip key={cat}>{cat}</Chip>
        ))}
        {year && <Chip>{year}</Chip>}
        {book.pageCount ? (
          <Chip>
            {book.pageCount} {t("book.pages")}
          </Chip>
        ) : null}
        {readingTime && (
          <Chip className="inline-flex items-center gap-1.5">
            <Clock size={13} />
            {readingTime}
          </Chip>
        )}
      </div>

      {book.previewLink && (
        <div className="mt-2 flex justify-center md:justify-start">
          <Button href={book.previewLink} variant="secondary" external>
            {t("book.preview")}
            <ExternalLink size={15} />
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <section className="px-4 pt-8 md:px-6 md:pt-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 md:flex-row">
        <div className="mx-auto w-48 shrink-0 md:mx-0 md:w-64">
          <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-ink/8 bg-paper shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            {book.thumbnail ? (
              <Image
                src={book.thumbnail}
                alt={book.title}
                fill
                sizes="256px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center p-4 text-center type-caption text-pebble">
                {book.title}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 text-center md:text-left">
          {book.categories[0] && (
            <span className="eyebrow text-stone">{book.categories[0]}</span>
          )}
          <h1 className="type-heading-lg text-ink">{book.title}</h1>
          {book.subtitle && (
            <p className="type-subheading -mt-3 text-stone">{book.subtitle}</p>
          )}
          {book.authors.length > 0 && (
            <p className="type-subheading text-stone">
              {t("book.by")} {book.authors.join(", ")}
            </p>
          )}

          {locked ? (
            <>
              <GateBar next={next ?? "/explore"} />
              <LockedTeaser maxHeight={260}>{details}</LockedTeaser>
            </>
          ) : (
            details
          )}
        </div>
      </div>
    </section>
  );
}
