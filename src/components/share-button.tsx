import { useState } from "react";
import { Check, Share2 } from "lucide-react";

import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";

interface ShareButtonProps extends Omit<ButtonProps, "onClick"> {
  /** URL a compartilhar (default: home do site). */
  url?: string;
  /** Texto curto que acompanha o compartilhamento. */
  text?: string;
  /** Rótulo do botão no estado padrão. */
  label?: string;
}

/**
 * Botão de compartilhar com feedback visível.
 *
 * Em dispositivos com Web Share API (celulares), abre a folha nativa. No
 * desktop, onde `navigator.share` não existe, copia o link e mostra
 * "Link copiado!" por alguns segundos — antes não havia retorno visual, o que
 * fazia o botão parecer quebrado.
 */
export function ShareButton({
  url = SITE.url,
  text = "Conheça as ferramentas gratuitas de tarifas de energia da IM Solar!",
  label = "Compartilhar",
  variant = "secondary",
  ...props
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // 1) Web Share API (mobile / navegadores compatíveis).
    if (navigator.share) {
      try {
        await navigator.share({ title: SITE.name, text, url });
        return;
      } catch {
        // Usuário cancelou ou share falhou → tenta copiar abaixo.
      }
    }
    // 2) Fallback: copiar para a área de transferência, com feedback.
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // 3) Último recurso: abre o WhatsApp Web com o texto + link.
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <Button variant={variant} onClick={handleShare} {...props}>
      {copied ? (
        <>
          <Check className="h-4 w-4" /> Link copiado!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" /> {label}
        </>
      )}
    </Button>
  );
}
