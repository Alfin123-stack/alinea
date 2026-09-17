import type { Metadata } from "next";
import { NavPill } from "@/components/layout/nav-pill";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { T } from "@/components/i18n/t";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <NavPill />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-32 text-center">
        <T k="404.eyebrow" className="eyebrow text-stone" />
        <T k="404.title" as="h1" className="type-heading-lg text-ink" />
        <T k="404.sub" as="p" className="type-body max-w-sm text-stone" />
        <Button href="/explore" className="mt-2">
          <T k="404.cta" />
        </Button>
      </main>
      <Footer />
    </>
  );
}
