"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";
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
      {pending ? "Membuat akun…" : "Buat akun"}
    </button>
  );
}

export function RegisterForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(registerAction, initialAuthState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <h1 className="type-heading text-ink">Buat akun</h1>
        <p className="type-body mt-2 text-stone">Simpan buku favorit dan lanjutkan menjelajah.</p>
      </div>

      {next && <input type="hidden" name="next" value={next} />}

      {state.formError && (
        <p role="alert" className="type-caption rounded-xl bg-red-500/10 px-4 py-3 text-red-500">
          {state.formError}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <TextField
          id="name"
          name="name"
          label="Nama"
          placeholder="Nama kamu"
          autoComplete="name"
          defaultValue={state.values?.name}
          invalid={!!state.errors.name}
          errorId="name-error"
          autoFocus
        />
        <FieldError id="name-error" messages={state.errors.name} />
      </div>

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
          placeholder="Minimal 8 karakter, ada huruf & angka"
          autoComplete="new-password"
          invalid={!!state.errors.password}
          showLabel="Tampilkan password"
          hideLabel="Sembunyikan password"
          describedBy="password-error"
        />
        <FieldError id="password-error" messages={state.errors.password} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmPassword" className="type-caption font-medium text-stone">
          Konfirmasi password
        </label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Ulangi password kamu"
          autoComplete="new-password"
          invalid={!!state.errors.confirmPassword}
          showLabel="Tampilkan password"
          hideLabel="Sembunyikan password"
          describedBy="confirmPassword-error"
        />
        <FieldError id="confirmPassword-error" messages={state.errors.confirmPassword} />
      </div>

      <SubmitButton />

      <p className="type-caption text-center text-stone">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-ink underline underline-offset-2">
          Masuk
        </Link>
      </p>
    </form>
  );
}
