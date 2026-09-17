"use client";

import Link from "next/link";
import { LogoMark } from "@/components/ui/logo-mark";
import { useT } from "@/lib/i18n/context";

export function Footer() {
  const t = useT();

  return (
    <footer className="border-t border-ink/10 px-6 py-12 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-2 text-ink">
          <LogoMark size={16} />
          <span className="type-subheading font-medium">alinea</span>
        </div>

        <div className="grid grid-cols-2 gap-8 type-caption text-stone sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <span className="text-ink">{t("footer.explore")}</span>
            <Link href="/explore" className="hover:text-ink">
              {t("footer.allBooks")}
            </Link>
            <Link href="/explore#koleksi" className="hover:text-ink">
              {t("footer.collections")}
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-ink">{t("footer.about")}</span>
            <Link href="/#cara-kerja" className="hover:text-ink">
              {t("footer.how")}
            </Link>
            <Link href="/#sumber" className="hover:text-ink">
              {t("footer.sources")}
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-ink">{t("footer.data")}</span>
            <a
              href="https://developers.google.com/books"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink"
            >
              Google Books API
            </a>
            <a
              href="https://openlibrary.org/developers/api"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink"
            >
              Open Library API
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 type-caption text-stone">
        <span className="text-ink">{t("footer.follow")}</span>
        <span>Instagram</span>
        <span>TikTok</span>
        <span>X</span>
        <span>Substack</span>
      </div>

      <p className="mx-auto mt-10 max-w-6xl type-caption text-pebble">
        {t("footer.disclaimer")}
      </p>

      <div aria-hidden className="mx-auto mt-12 max-w-6xl select-none overflow-hidden">
        <p className="whitespace-nowrap text-center font-medium leading-[0.8] tracking-[-0.04em] text-ink [font-size:clamp(3.5rem,17vw,13rem)]">
          alinea
        </p>
      </div>
    </footer>
  );
}
