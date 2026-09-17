"use client";

import { stripHtml } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";
import { Reveal } from "@/components/ui/reveal";
import { LockedTeaser } from "@/components/auth/locked-teaser";

export function Synopsis({
  description,
  locked,
}: {
  description: string;
  locked?: boolean;
}) {
  const t = useT();
  const text = stripHtml(description);

  const body = text ? (
    <div className="type-body mt-4 whitespace-pre-line text-stone">{text}</div>
  ) : (
    <p className="type-body mt-4 text-pebble">{t("book.noSynopsis")}</p>
  );

  return (
    <section className="px-4 py-14 md:px-6">
      <Reveal className="mx-auto max-w-2xl">
        <h2 className="type-heading text-ink">{t("book.synopsis")}</h2>
        {locked && text ? <LockedTeaser maxHeight={180}>{body}</LockedTeaser> : body}
      </Reveal>
    </section>
  );
}
