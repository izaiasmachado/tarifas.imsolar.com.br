import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

/** Layout global: navbar fixa, conteúdo da rota e rodapé. */
export function Layout() {
  const { pathname } = useLocation();

  // Rola para o topo a cada navegação.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
