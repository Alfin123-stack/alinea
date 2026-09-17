import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/ui/logo-mark";
import { searchBooks } from "@/lib/google-books";

/**
 * Right-hand visual panel. Uses real book covers (grayscale, like Spotlight)
 * instead of stock/testimonial photography — Alinea's whole premise is book
 * discovery, so the panel stays on-brand and needs no placeholder assets.
 */
async function CoverCollage({ quote }: { quote: string }) {
  const books = await searchBooks("bestseller fiction 2024", { maxResults: 9 }).catch(() => []);
  const covers = books.filter((b) => b.thumbnail).slice(0, 9);

  return (
    <section className="relative hidden overflow-hidden rounded-2xl bg-ink md:block">
      <div className="absolute inset-0 grid grid-cols-3 gap-2 p-2 opacity-90">
        {covers.map((book, i) => (
          <div key={book.id} className={i % 5 === 2 ? "col-span-1 row-span-2" : ""}>
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <Image
                src={book.thumbnail!}
                alt=""
                fill
                sizes="220px"
                className="scale-105 object-cover grayscale"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />

      <div className="relative flex h-full flex-col justify-end p-10">
        <p className="type-heading-sm max-w-xs text-paper">{quote}</p>
      </div>
    </section>
  );
}

export function AuthSplitShell({
  eyebrow,
  quote,
  children,
}: {
  eyebrow: string;
  quote: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-full flex-1 px-4 py-4 md:px-6">
      <div className="mx-auto grid min-h-[calc(100dvh-2rem)] max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
        <section className="flex flex-col">
          <Link href="/" className="flex items-center gap-2 py-4 text-ink">
            <LogoMark size={16} />
            <span className="type-subheading font-medium">alinea</span>
          </Link>
          <div className="flex flex-1 items-center py-8">
            <div className="w-full max-w-sm">
              <p className="eyebrow mb-3 text-stone">{eyebrow}</p>
              {children}
            </div>
          </div>
        </section>

        <CoverCollage quote={quote} />
      </div>
    </div>
  );
}
