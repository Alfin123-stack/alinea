"use client";

import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo-mark";
import { useT } from "@/lib/i18n/context";
import { RevealItem } from "@/components/ui/reveal";

export function CtaSection() {
  const t = useT();

  return (
    <section className="mx-4 mb-4 overflow-hidden rounded-2xl bg-ink px-6 py-20 text-center md:mx-6 md:py-28">
      <RevealItem index={0}>
        <p className="type-subheading text-paper/60">{t("cta.eyebrow")}</p>
        <h2 className="type-display mt-4 text-paper">{t("cta.title")}</h2>
      </RevealItem>
      <RevealItem index={1} className="mt-8 flex justify-center">
        <Button href="/explore" className="bg-paper text-ink hover:bg-paper/85">
          {t("cta.button")}
        </Button>
      </RevealItem>

      <RevealItem index={2} className="mt-16 flex items-center justify-center gap-3 text-paper md:mt-24">
        <LogoMark size={40} />
        <span className="type-display-xl">alinea</span>
      </RevealItem>
    </section>
  );
}
