import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import GlobalLayout from "./layouts/GlobalLayout";

function App() {
  return (
    <BrowserRouter>
      <GlobalLayout>
        <AppRoutes />
      </GlobalLayout>
    </BrowserRouter>
  );
}

export default App;
