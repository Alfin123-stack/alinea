import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session-store";

export async function GET() {
  const session = await getSessionUser();
  return NextResponse.json({
    user: session ? { name: session.name, email: session.email } : null,
  });
}
