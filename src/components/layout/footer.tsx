import { Link } from "react-router-dom";

import { SITE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground sm:flex-row">
        <p className="text-center sm:text-left">
          © {year} {SITE.company}. Todos os direitos reservados.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a
            href={SITE.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            IM Solar
          </a>
          <a
            href={SITE.dataSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Fonte: ANEEL
          </a>
          <a
            href={SITE.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <Link
            to="/duvidas"
            className="transition-colors hover:text-foreground"
          >
            Dúvidas
          </Link>
          <Link
            to="/reportar"
            className="transition-colors hover:text-foreground"
          >
            Reportar erro
          </Link>
          <Link
            to="/termos-de-uso"
            className="transition-colors hover:text-foreground"
          >
            Termos de uso
          </Link>
        </nav>
      </div>
    </footer>
  );
}
