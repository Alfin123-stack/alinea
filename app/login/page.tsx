import type { Metadata } from "next";
import { AuthSplitShell } from "@/components/auth/auth-split-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Masuk",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthSplitShell eyebrow="Alinea" quote="Kenali ceritanya, sebelum kamu membacanya.">
      <LoginForm next={next} />
    </AuthSplitShell>
  );
}
