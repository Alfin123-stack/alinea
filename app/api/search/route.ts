import { NextResponse } from "next/server";
import { searchBooks } from "@/lib/google-books";

export const dynamic = "force-dynamic";

/** Backs the ⌘K command palette — the only client-side data fetch in the app. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q) return NextResponse.json({ books: [] });

  const books = await searchBooks(q, { maxResults: 8 });
  return NextResponse.json({ books });
}
