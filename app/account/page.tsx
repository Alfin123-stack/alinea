import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NavPill } from "@/components/layout/nav-pill";
import { Footer } from "@/components/layout/footer";
import { getSessionUser } from "@/lib/auth/session-store";
import { logoutAction } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Akun saya",
};

export default async function AccountPage() {
  // middleware.ts already guards this route, but the page re-checks the
  // session itself too — defense in depth, and it's what gives the page the
  // user's data to render in the first place.
  const session = await getSessionUser();
  if (!session) redirect("/login?next=/account");

  const initial = session.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <>
      <NavPill />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 md:px-6">
        <div className="rounded-2xl border border-ink/10 bg-paper p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink type-heading-sm text-paper">
              {initial}
            </div>
            <div>
              <h1 className="type-heading-sm text-ink">{session.name}</h1>
              <p className="type-caption text-stone">{session.email}</p>
            </div>
          </div>

          <form action={logoutAction} className="mt-8">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl border border-ink/15 bg-paper px-6 py-3.5 type-body font-medium text-ink transition-colors hover:border-ink/30"
            >
              Keluar
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
