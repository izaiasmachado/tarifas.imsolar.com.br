import React from "react";
import Footer from "../components/Footer/Footer";

export default function GlobalLayout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
