"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function PasswordInput({
  id,
  name,
  placeholder,
  autoComplete,
  defaultValue,
  invalid,
  showLabel,
  hideLabel,
  describedBy,
}: {
  id: string;
  name: string;
  placeholder?: string;
  autoComplete?: string;
  defaultValue?: string;
  invalid?: boolean;
  showLabel: string;
  hideLabel: string;
  describedBy?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn(
          "focus-ring-inset w-full rounded-2xl border bg-paper px-4 py-3.5 pr-12 type-body text-ink placeholder:text-stone/60 outline-none transition-colors focus-visible:outline-none",
          invalid ? "border-red-400/70 focus:border-red-400" : "border-ink/10 focus:border-ink/30"
        )}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? hideLabel : showLabel}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone transition-colors hover:text-ink"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
