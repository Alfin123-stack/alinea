import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CommonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
  onClick?: never;
  type?: never;
};

type ButtonAsButton = CommonProps & {
  href?: never;
  external?: never;
  onClick?: () => void;
  type?: "button" | "submit";
};

type ButtonProps = ButtonAsLink | ButtonAsButton;

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 type-body font-medium transition-[color,background-color,border-color,transform] duration-300 active:scale-[0.97]";

const variants = {
  primary: "bg-ink text-paper hover:bg-ink/85",
  secondary: "bg-paper text-ink border border-ink/15 hover:border-ink/30",
};

export function Button({ children, variant = "primary", className, href, external, onClick, type }: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
