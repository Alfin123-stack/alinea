"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n/context";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const faqKeys = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
] as const;

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <RevealItem index={index}>
      <div className="border-b border-ink/10">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 py-5 text-left"
        >
          <span className="type-subheading text-ink">{q}</span>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink">
            <Plus size={14} className={cn("transition-transform duration-300", open && "rotate-45")} />
          </span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="type-body pb-5 text-stone">{a}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RevealItem>
  );
}

export function Faq() {
  const t = useT();

  return (
    <section className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <h2 className="type-display text-ink">{t("faq.title")}</h2>
        </Reveal>
        <div className="mt-10">
          {faqKeys.map((item, i) => (
            <FaqItem key={item.q} q={t(item.q)} a={t(item.a)} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
