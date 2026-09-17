import type { Metadata } from "next";
import { AuthSplitShell } from "@/components/auth/auth-split-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Daftar",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthSplitShell eyebrow="Alinea" quote="Bukan toko buku — cuma tempat mengenal ceritanya dulu.">
      <RegisterForm next={next} />
    </AuthSplitShell>
  );
}
