/**
 * Core session token logic — sign/verify only, no cookie access. Kept free
 * of `next/headers` and the `mongodb` driver on purpose so this file can be
 * imported from `middleware.ts`, which runs on the Edge runtime and can't
 * use either. Cookie read/write lives in `lib/auth/session-store.ts`
 * (Node-only, used from Server Actions / Server Components).
 */
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET belum diisi. Generate dengan: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\" lalu isi ke .env.local"
    );
  }
  return new TextEncoder().encode(secret);
}

export const SESSION_COOKIE_NAME = "alinea_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari (default)
export const SESSION_MAX_AGE_REMEMBER = 60 * 60 * 24 * 30; // 30 hari ("tetap masuk")

export interface SessionPayload extends JWTPayload {
  userId: string;
  name: string;
  email: string;
}

export async function signSession(
  payload: Pick<SessionPayload, "userId" | "name" | "email">,
  maxAgeSeconds: number
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + maxAgeSeconds)
    .sign(getKey());
}

export async function verifySession(token?: string | null): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    return payload as SessionPayload;
  } catch {
    // Expired, tampered, or signed with an old secret — treat as logged out
    // rather than surfacing an error.
    return null;
  }
}
