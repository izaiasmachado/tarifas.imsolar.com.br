import { Link } from "react-router-dom";
import { Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Seo } from "@/components/seo";

export function NotFoundPage() {
  return (
    <>
      <Seo
        title="Página não encontrada"
        description="A página que você procura não existe."
        path="/404"
      />
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-6xl font-extrabold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-bold">Página não encontrada</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">
            <Home className="h-4 w-4" /> Voltar ao início
          </Link>
        </Button>
      </div>
    </>
  );
}
