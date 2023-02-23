import React from "react";
import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import GlobalLayout from "./layouts/GlobalLayout";

function App() {
  return (
    <GlobalLayout>
      <AppRoutes />
    </GlobalLayout>
  );
}

export default App;
