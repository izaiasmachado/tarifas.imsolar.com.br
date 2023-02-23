import React from "react";
import { Routes, Route } from "react-router-dom";

import TarifasEnergiaSemImposto from "../pages/TarifasEnergiaSemImposto/TarifasEnergiaSemImposto";
import Home from "../pages/Home/Home";
import Terms from "../pages/Terms/Terms";

function AppRoutes() {
  return (
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="/termos-de-uso" element={<Terms />} />
      <Route
        exact
        path="/sem-impostos"
        element={<TarifasEnergiaSemImposto />}
      />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default AppRoutes;
