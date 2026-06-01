import { Route, Routes } from "react-router-dom";

import { Layout } from "@/components/layout/layout";
import { HomePage } from "@/pages/home";
import { SemImpostosPage } from "@/pages/sem-impostos";
import { FatorAjustePage } from "@/pages/fator-ajuste";
import { RankingPage } from "@/pages/ranking";
import { CompararPage } from "@/pages/comparar";
import { SimuladorContaPage } from "@/pages/simulador-conta";
import { EconomiaSolarPage } from "@/pages/economia-solar";
import { DimensionarSolarPage } from "@/pages/dimensionar-solar";
import { ConsumoAparelhosPage } from "@/pages/consumo-aparelhos";
import { TarifaBrancaPage } from "@/pages/tarifa-branca";
import { BandeirasPage } from "@/pages/bandeiras";
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
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/comparar" element={<CompararPage />} />
        <Route path="/simulador-conta" element={<SimuladorContaPage />} />
        <Route path="/economia-solar" element={<EconomiaSolarPage />} />
        <Route path="/dimensionar-solar" element={<DimensionarSolarPage />} />
        <Route path="/consumo-aparelhos" element={<ConsumoAparelhosPage />} />
        <Route path="/tarifa-branca" element={<TarifaBrancaPage />} />
        <Route path="/bandeiras" element={<BandeirasPage />} />
        <Route path="/duvidas" element={<DuvidasPage />} />
        <Route path="/reportar" element={<ReportarPage />} />
        <Route path="/termos-de-uso" element={<TermosPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
