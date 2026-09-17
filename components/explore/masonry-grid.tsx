import type { Book } from "@/lib/types";
import { BookCard } from "@/components/explore/book-card";
import { RevealItem } from "@/components/ui/reveal";

// CSS Grid, not CSS multi-column: `columns-N` balances items into as few
// columns as needed to minimize height, which can leave a trailing column
// completely empty when the item count doesn't divide evenly (e.g. 8 items
// in a 5-column row) — a real, visible gap, not a cosmetic quirk. Grid
// always fills left-to-right, row by row, so the only ever-partial row is
// the last one, same as any normal card grid.
// Row spacing comes from BookCard's own `mb-4` (see book-card.tsx), so this
// only sets the horizontal gap — a `gap-y` here would double up with it.
export function MasonryGrid({ books }: { books: Book[] }) {
  if (!books.length) return null;

  return (
    <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {books.map((book, i) => (
        <RevealItem key={book.id} index={i}>
          <BookCard book={book} />
        </RevealItem>
      ))}
    </div>
  );
}
