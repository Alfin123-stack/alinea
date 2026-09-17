"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import type { ObjectId } from "mongodb";
import { registerSchema, loginSchema } from "@/lib/validation/auth";
import { createUser, findUserByEmail } from "@/lib/models/user";
import { createSessionCookie, deleteSessionCookie } from "@/lib/auth/session-store";
import type { AuthFormState } from "@/lib/actions/auth-state";

const SALT_ROUNDS = 10;

function safePath(path: string | null | undefined, fallback: string) {
  // Only ever redirect within the app — an absolute/external `next` value
  // (open redirect) is ignored in favor of the fallback.
  if (path && path.startsWith("/") && !path.startsWith("//")) return path;
  return fallback;
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      values: { name: raw.name, email: raw.email },
    };
  }

  const { name, email, password } = parsed.data;
  let userId: ObjectId;

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return {
        errors: { email: ["Email ini sudah terdaftar."] },
        values: { name, email },
      };
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    userId = await createUser({ name, email, passwordHash });
  } catch (err: unknown) {
    // 11000 = duplicate key — a second request for the same email raced
    // past the check above and hit the unique index instead.
    if (typeof err === "object" && err !== null && "code" in err && err.code === 11000) {
      return {
        errors: { email: ["Email ini sudah terdaftar."] },
        values: { name, email },
      };
    }
    console.error("registerAction failed:", err);
    return {
      errors: {},
      formError: "Terjadi kesalahan di server. Coba lagi beberapa saat lagi.",
      values: { name, email },
    };
  }

  await createSessionCookie({ id: userId.toString(), name, email }, false);
  redirect(safePath(String(formData.get("next") ?? ""), "/account"));
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  const remember = formData.get("remember") === "on";
  const next = safePath(String(formData.get("next") ?? ""), "/account");

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      values: { email: raw.email },
    };
  }

  try {
    const user = await findUserByEmail(parsed.data.email);
    const passwordOk = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;

    if (!user || !passwordOk) {
      // Deliberately generic: doesn't say whether the email exists or the
      // password was wrong, so the message can't be used to enumerate
      // registered accounts.
      return {
        errors: {},
        formError: "Email atau password salah.",
        values: { email: raw.email },
      };
    }

    await createSessionCookie(
      { id: user._id.toString(), name: user.name, email: user.email },
      remember
    );
  } catch (err) {
    console.error("loginAction failed:", err);
    return {
      errors: {},
      formError: "Terjadi kesalahan di server. Coba lagi beberapa saat lagi.",
      values: { email: raw.email },
    };
  }

  redirect(next);
}

export async function logoutAction() {
  await deleteSessionCookie();
  redirect("/login");
}
