import { Route, Routes } from "react-router-dom";

import { Layout } from "@/components/layout/layout";
import { HomePage } from "@/pages/home";
import { SemImpostosPage } from "@/pages/sem-impostos";
import { FatorAjustePage } from "@/pages/fator-ajuste";
import { DuvidasPage } from "@/pages/duvidas";
import { ReportarPage } from "@/pages/reportar";
import { TermosPage } from "@/pages/termos";
import { NotFoundPage } from "@/pages/not-found";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/sem-impostos" element={<SemImpostosPage />} />
        <Route path="/fator-ajuste-grupo-a" element={<FatorAjustePage />} />
        <Route path="/duvidas" element={<DuvidasPage />} />
        <Route path="/reportar" element={<ReportarPage />} />
        <Route path="/termos-de-uso" element={<TermosPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
