import "server-only";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
  SESSION_MAX_AGE_REMEMBER,
  signSession,
  verifySession,
  type SessionPayload,
} from "@/lib/session";

export async function createSessionCookie(
  user: { id: string; name: string; email: string },
  remember: boolean
) {
  const maxAge = remember ? SESSION_MAX_AGE_REMEMBER : SESSION_MAX_AGE;
  const token = await signSession({ userId: user.id, name: user.name, email: user.email }, maxAge);
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
}

/** Reads and verifies the current session from the request cookie. */
export async function getSessionUser(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE_NAME)?.value);
}

export async function deleteSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}
