import { HelpCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { GLOSSARY, type GlossaryKey } from "@/lib/glossary";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoHintProps {
  /** Chave do glossário (ex.: "tusd") OU texto livre via `content`. */
  term?: GlossaryKey;
  content?: string;
  className?: string;
  /** Rótulo acessível quando não há termo do glossário. */
  label?: string;
}

/**
 * Ícone "(?)" que abre um tooltip explicativo. Passe `term` para puxar a
 * definição curta do glossário central, ou `content` para um texto livre.
 */
export function InfoHint({ term, content, className, label }: InfoHintProps) {
  const text = content ?? (term ? GLOSSARY[term].short : "");
  const accessibleLabel =
    label ?? (term ? `O que é ${GLOSSARY[term].term}?` : "Mais informações");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={accessibleLabel}
          className={cn(
            "inline-flex text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground",
            className
          )}
        >
          <HelpCircle className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
}

interface LabelWithHintProps {
  htmlFor?: string;
  children: React.ReactNode;
  term?: GlossaryKey;
  content?: string;
  className?: string;
}

/** Rótulo de formulário com um "(?)" ao lado, ligado ao glossário. */
export function LabelWithHint({
  htmlFor,
  children,
  term,
  content,
  className,
}: LabelWithHintProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {children}
      </label>
      {(term || content) && <InfoHint term={term} content={content} />}
    </div>
  );
}
