import { cn } from "@/lib/utils";

interface InfoSectionProps {
  /** Título da seção (vira um <h2>, bom para SEO). */
  title: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Bloco de conteúdo explicativo/didático ao pé das ferramentas. Texto real e
 * indexável (h2 + prose) que ajuda o usuário e o ranqueamento das páginas.
 */
export function InfoSection({ title, className, children }: InfoSectionProps) {
  return (
    <section
      className={cn(
        "prose-tarifas mx-auto max-w-3xl space-y-3 text-sm leading-relaxed text-muted-foreground",
        className
      )}
    >
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Pergunta + resposta para blocos de FAQ embutidos (também viram JSON-LD). */
export interface QA {
  q: string;
  a: string;
}

/** Renderiza uma lista de perguntas frequentes como conteúdo textual. */
export function FaqBlock({ items }: { items: QA[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.q}>
          <h3 className="font-semibold text-foreground">{item.q}</h3>
          <p className="mt-1">{item.a}</p>
        </div>
      ))}
    </div>
  );
}

/** Monta o JSON-LD (FAQPage) a partir de uma lista de perguntas. */
export function faqJsonLd(items: QA[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
