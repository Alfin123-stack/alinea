import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Plain text/email input, styled to match PasswordInput and the rest of the theme. */
export function TextField({
  id,
  name,
  type = "text",
  label,
  placeholder,
  autoComplete,
  defaultValue,
  invalid,
  errorId,
  autoFocus,
}: {
  id: string;
  name: string;
  type?: "text" | "email";
  label: string;
  placeholder?: string;
  autoComplete?: string;
  defaultValue?: string;
  invalid?: boolean;
  errorId?: string;
  autoFocus?: boolean;
}) {
  return (
    <FieldShell id={id} label={label}>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        aria-invalid={invalid || undefined}
        aria-describedby={errorId}
        className={cn(
          "focus-ring-inset w-full rounded-2xl border bg-paper px-4 py-3.5 type-body text-ink placeholder:text-stone/60 outline-none transition-colors focus-visible:outline-none",
          invalid ? "border-red-400/70 focus:border-red-400" : "border-ink/10 focus:border-ink/30"
        )}
      />
    </FieldShell>
  );
}

/** Wraps a custom input (e.g. PasswordInput) with the same label treatment. */
export function FieldShell({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-caption font-medium text-stone">
        {label}
      </label>
      {children}
    </div>
  );
}

export function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  if (!messages || messages.length === 0) return null;
  return (
    <p id={id} role="alert" className="type-caption text-red-500">
      {messages[0]}
    </p>
  );
}
