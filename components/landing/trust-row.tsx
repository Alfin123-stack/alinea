"use client";

import { useT } from "@/lib/i18n/context";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

// Text wordmarks by design (see README) — avoids reproducing real platform
// logos/marks while still reading clearly as "where people find these books".
const rowA = ["TikTok", "Goodreads", "YouTube", "Instagram"];
const rowB = ["Threads", "X", "Instagram", "TikTok"];

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  // Duplicated so the track can loop seamlessly at -50% translate.
  const loop = [...items, ...items];

  return (
    <div className="group/row relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className={cn(
          "flex w-max items-center gap-10 py-2",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          "group-hover/row:[animation-play-state:paused]"
        )}
      >
        {loop.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="type-heading-sm shrink-0 cursor-default text-ink/25 transition-all duration-300 hover:scale-110 hover:text-ink"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TrustRow() {
  const t = useT();

  return (
    <section className="overflow-hidden px-6 py-16 md:py-20">
      <Reveal className="mx-auto max-w-4xl text-center">
        <p className="type-subheading text-stone">{t("trust.title")}</p>
        <div className="mt-8 flex flex-col gap-3">
          <MarqueeRow items={rowA} />
          <MarqueeRow items={rowB} reverse />
        </div>
      </Reveal>
    </section>
  );
}
