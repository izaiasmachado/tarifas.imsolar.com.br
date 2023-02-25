import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import TarifasEnergiaSemImposto from "../pages/TarifasEnergiaSemImpostos/TarifasEnergiaSemImpostos";
import Home from "../pages/Home/Home";
import Terms from "../pages/Terms/Terms";
import FatorAjusteGrupoA from "../pages/FatorAjusteGrupoA/FatorAjusteGrupoA";

function AppRoutes() {
  return (
    <Routes>
      <Route exact path="" element={<Home />} />
      <Route exact path="/termos-de-uso" element={<Terms />} />
      <Route
        exact
        path="/sem-impostos"
        element={<TarifasEnergiaSemImposto />}
      />
      <Route
        exact
        path="/fator-ajuste-grupo-a"
        element={<FatorAjusteGrupoA />}
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
