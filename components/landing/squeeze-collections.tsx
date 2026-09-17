"use client";

import type { Book, Collection } from "@/lib/types";
import { useT } from "@/lib/i18n/context";
import { Reveal } from "@/components/ui/reveal";
import { SqueezeCarousel, type SqueezeSlide } from "@/components/ui/squeeze-carousel";

export type CollectionPanel = {
  collection: Collection;
  cover?: Book;
};

export function SqueezeCollections({ panels }: { panels: CollectionPanel[] }) {
  const t = useT();

  const defaultIndex = Math.max(
    0,
    panels.findIndex((p) => p.collection.highlight),
  );

  const slides: SqueezeSlide[] = panels.map((panel) => {
    const curator = t(panel.collection.curatorKey);
    const subtitle = panel.collection.subtitleKey ? t(panel.collection.subtitleKey) : undefined;
    const title = t(panel.collection.titleKey);

    return {
      id: panel.collection.slug,
      title,
      // The run-on grey line under the title: curator credit, plus the
      // subtitle when this is the highlighted collection ("Cek yang baru
      // kami tambahkan").
      description: subtitle ? `${curator} \u2713 \u00B7 ${subtitle}` : curator,
      image: panel.cover?.thumbnail,
      imageAlt: title,
      overlay: curator,
      caption: title,
      action: t("bento.action"),
      href: `/explore?q=${encodeURIComponent(panel.collection.query)}`,
    };
  });

  if (!slides.length) return null;

  return (
    <section className="px-6 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="type-display text-ink">{t("bento.title")}</h2>
          <p className="type-subheading mt-4 text-ink">{t("bento.sub")}</p>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 md:mt-16">
          <SqueezeCarousel
            slides={slides}
            defaultIndex={defaultIndex === -1 ? 0 : defaultIndex}
            label={t("bento.title")}
            height="clamp(220px, 32cqi, 340px)"
            autoplay
            interval={5000}
          />
        </Reveal>
      </div>
    </section>
  );
}
