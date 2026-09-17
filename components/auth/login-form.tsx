"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { initialAuthState } from "@/lib/actions/auth-state";
import { TextField, FieldError } from "@/components/auth/form-field";
import { PasswordInput } from "@/components/auth/password-input";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-6 py-4 type-body font-medium text-paper transition-[background-color,transform] duration-300 hover:bg-ink/85 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Memproses…" : "Masuk"}
    </button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(loginAction, initialAuthState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <h1 className="type-heading text-ink">Selamat datang kembali</h1>
        <p className="type-body mt-2 text-stone">Masuk untuk melanjutkan menjelajah buku.</p>
      </div>

      {next && <input type="hidden" name="next" value={next} />}

      {state.formError && (
        <p role="alert" className="type-caption rounded-xl bg-red-500/10 px-4 py-3 text-red-500">
          {state.formError}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <TextField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="nama@email.com"
          autoComplete="email"
          defaultValue={state.values?.email}
          invalid={!!state.errors.email}
          errorId="email-error"
          autoFocus
        />
        <FieldError id="email-error" messages={state.errors.email} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="type-caption font-medium text-stone">
          Password
        </label>
        <PasswordInput
          id="password"
          name="password"
          placeholder="Password kamu"
          autoComplete="current-password"
          invalid={!!state.errors.password}
          showLabel="Tampilkan password"
          hideLabel="Sembunyikan password"
          describedBy="password-error"
        />
        <FieldError id="password-error" messages={state.errors.password} />
      </div>

      <label className="flex items-center gap-2.5 type-caption text-stone">
        <input
          type="checkbox"
          name="remember"
          className="h-4 w-4 rounded border-ink/20 text-ink accent-[var(--color-ink)]"
        />
        Tetap masuk selama 30 hari
      </label>

      <SubmitButton />

      <p className="type-caption text-center text-stone">
        Belum punya akun?{" "}
        <Link href="/register" className="text-ink underline underline-offset-2">
          Daftar
        </Link>
      </p>
    </form>
  );
}
