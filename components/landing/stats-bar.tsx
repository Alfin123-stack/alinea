"use client";

import { useT } from "@/lib/i18n/context";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { Counter } from "@/components/ui/counter";

const stats: { to: number; suffix: string; labelKey: "stats.books" | "stats.sources" | "stats.genres" | "stats.languages" }[] = [
  { to: 12000, suffix: "+", labelKey: "stats.books" },
  { to: 3, suffix: "", labelKey: "stats.sources" },
  { to: 20, suffix: "+", labelKey: "stats.genres" },
  { to: 2, suffix: "", labelKey: "stats.languages" },
];

export function StatsBar() {
  const t = useT();

  return (
    <section className="px-6 pb-4">
      <Reveal className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-6 rounded-2xl border border-ink/10 bg-paper/60 px-6 py-8 sm:grid-cols-4 md:px-10 md:py-10">
          {stats.map((stat, i) => (
            <RevealItem key={stat.labelKey} index={i} className="text-center">
              <p className="type-display text-ink">
                <Counter to={stat.to} suffix={stat.suffix} />
              </p>
              <p className="type-caption mt-1 text-stone">{t(stat.labelKey)}</p>
            </RevealItem>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
