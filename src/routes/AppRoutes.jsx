import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import Terms from "../pages/Terms/Terms";
import TarifasEnergiaSemImpostos from "../pages/TarifasEnergiaSemImpostos/TarifasEnergiaSemImpostos";
import FatorAjusteGrupoA from "../pages/FatorAjusteGrupoA/FatorAjusteGrupoA";

// import { getSiteMap } from "./RoutesWithMetadata";

import getRoutesWithMetadata from "../helpers/getRoutesWithMetadata";

const routesObject = [
  { path: "/", component: Home },
  { path: "/termos-de-uso", component: Terms },
  { path: "/sem-impostos", component: TarifasEnergiaSemImpostos },
  { path: "/fator-ajuste-grupo-a", component: FatorAjusteGrupoA },
];

function AppRoutes() {
  const pages = getRoutesWithMetadata(routesObject);
  return (
    <Routes>
      {pages.length > 0 && (
        <>
          {pages.map((page) => (
            <Route
              key={page.path}
              exact
              path={page.path}
              element={page.component}
            />
          ))}
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}

export default AppRoutes;
