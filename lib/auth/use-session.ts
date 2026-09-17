"use client";

import { useEffect, useState } from "react";

export interface SessionUser {
  name: string;
  email: string;
}

/**
 * Client-side session lookup for chrome that renders outside the request
 * lifecycle (NavPill/MobileNav are client components rendered the same way
 * on every route, with no server-fetched props passed in). Mirrors the
 * existing `/api/search` pattern of a small internal endpoint backing a
 * client component, rather than threading session state through every page
 * that renders the navbar.
 */
export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/session")
      .then((res) => res.json())
      .then((data: { user: SessionUser | null }) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading };
}
