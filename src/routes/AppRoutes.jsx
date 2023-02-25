import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { generateJSONSiteMap } from "../pages/sitemap";

function AppRoutes() {
  const sitemap = generateJSONSiteMap();
  const pages = sitemap.pages || [];
  return (
    <Routes>
      {pages.map((page) => (
        <Route
          key={page.path}
          exact
          path={page.path}
          element={page.component}
        />
      ))}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
