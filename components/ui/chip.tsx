import { cn } from "@/lib/utils";

export function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-ink/15 bg-paper px-4 py-1.5 type-caption text-stone",
        className
      )}
    >
      {children}
    </span>
  );
}
