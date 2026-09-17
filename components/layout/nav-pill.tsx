"use client";

import Link from "next/link";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { LogoMark } from "@/components/ui/logo-mark";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { NavDropdown, NavDropdownLink } from "@/components/layout/nav-dropdown";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { useT } from "@/lib/i18n/context";
import { collections, exploreGenres } from "@/lib/collections";
import { useSession } from "@/lib/auth/use-session";

export function NavPill() {
  const t = useT();
  const { user, loading } = useSession();

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      className="sticky top-4 z-50 px-4 md:px-6"
    >
      {/* z-10 (+ relative) is load-bearing: `backdrop-blur-sm` below makes this
          row its own stacking context, so ThemeToggle's z-50 dropdown only
          outranks things *inside* this pill. Without an explicit z-index
          here, the mobile search bar in the second row below — later in the
          DOM, unpositioned — would still paint on top of the whole pill
          (dropdown included), since raw DOM order wins between two
          z-index:auto layers. */}
      <div className="relative z-10 mx-auto flex max-w-6xl items-center gap-3 rounded-full border border-ink/10 bg-paper/90 px-3 py-2 backdrop-blur-sm md:gap-6 md:px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 pl-2 text-ink">
          <LogoMark size={16} />
          <span className="type-subheading font-medium">alinea</span>
        </Link>

        <MobileNav />

        <nav className="hidden shrink-0 items-center gap-5 lg:flex">
          <NavDropdown label={t("nav.explore")} href="/explore">
            <p className="type-caption px-3 pb-1.5 pt-1 text-pebble">{t("nav.exploreByGenre")}</p>
            <div className="grid grid-cols-2 gap-0.5">
              {exploreGenres.slice(0, 8).map((genre) => (
                <NavDropdownLink key={genre} href={`/explore?q=${encodeURIComponent(`subject:${genre}`)}`}>
                  {genre}
                </NavDropdownLink>
              ))}
            </div>
          </NavDropdown>

          <NavDropdown label={t("nav.collections")} href="/explore#koleksi">
            <p className="type-caption px-3 pb-1.5 pt-1 text-pebble">{t("nav.curatedForYou")}</p>
            {collections.map((col) => (
              <NavDropdownLink key={col.slug} href={`/explore?q=${encodeURIComponent(col.query)}`}>
                {t(col.titleKey)}
              </NavDropdownLink>
            ))}
          </NavDropdown>

          <Link
            href="/#cara-kerja"
            className="type-caption text-stone transition-colors hover:text-ink"
          >
            {t("nav.how")}
          </Link>
        </nav>

        <div className="hidden flex-1 md:block">
          <Suspense fallback={<div className="h-10 w-full rounded-2xl bg-ink/5" />}>
            <SearchInput size="sm" shortcutHint />
          </Suspense>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 md:gap-2">
          <LanguageToggle />
          <ThemeToggle />
          {!loading && user ? (
            <div className="hidden md:inline-flex">
              <UserMenu name={user.name} email={user.email} />
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden type-caption text-stone transition-colors hover:text-ink lg:inline"
            >
              {t("nav.signin")}
            </Link>
          )}
          {/* Logo + hamburger + language + theme toggle alone already fill
              most of a phone-width pill; adding this button's natural width
              on top of that overflows the pill on narrow screens (it has no
              wrap/shrink fallback). Below `sm` it's dropped — the mobile
              menu's own "Jelajah" link is an equivalent entry point — and it
              reappears once there's room. */}
          <Button
            href="/explore"
            className="hidden px-4 py-2 type-caption sm:inline-flex md:px-5 md:py-2.5"
          >
            {t("nav.cta")}
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-2 max-w-6xl md:hidden">
        <Suspense fallback={<div className="h-10 w-full rounded-2xl bg-ink/5" />}>
          <SearchInput size="sm" />
        </Suspense>
      </div>
    </motion.header>
  );
}
