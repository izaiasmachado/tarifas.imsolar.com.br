import * as React from "react";

import { cn } from "@/lib/utils";
import type { GlossaryKey } from "@/lib/glossary";
import { LabelWithHint } from "@/components/info-hint";

interface FieldProps {
  /** id do controle; liga o <label> ao input. */
  htmlFor?: string;
  label: React.ReactNode;
  /** Chave do glossário para exibir um "(?)" ao lado do rótulo. */
  hint?: GlossaryKey;
  /** Texto livre de ajuda (alternativa a `hint`). */
  hintText?: string;
  /** Texto auxiliar abaixo do campo. */
  description?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/**
 * Campo de formulário padrão: rótulo (com (?) opcional) + controle + descrição.
 * Padroniza o layout que passou a ser usado em todas as ferramentas.
 */
export function Field({
  htmlFor,
  label,
  hint,
  hintText,
  description,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <LabelWithHint htmlFor={htmlFor} term={hint} content={hintText}>
        {label}
      </LabelWithHint>
      {children}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

interface InputWithUnitProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Unidade exibida à direita do campo (ex.: "kWh", "R$", "%"). */
  unit?: string;
}

/** Campo numérico com a unidade fixada à direita (kWh, R$, %, …). */
export const InputWithUnit = React.forwardRef<
  HTMLInputElement,
  InputWithUnitProps
>(({ unit, className, ...props }, ref) => (
  <div className="relative">
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm",
        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        unit && "pr-12",
        className
      )}
      {...props}
    />
    {unit && (
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        {unit}
      </span>
    )}
  </div>
));
InputWithUnit.displayName = "InputWithUnit";
