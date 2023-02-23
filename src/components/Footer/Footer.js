import React from "react";
import "./styles.css";

export default function Footer() {
  return (
    <div className="footer section">
      <div className="footer-copyright">
        © {new Date().getFullYear()} Copyright IM Solar.{" "}
        <br id="linebreak-footer" />
        Todos os direitos reservados.
      </div>
      <div className="footer-links">
        <a href="https://imsolar.com.br" target="__blank">
          IM Solar
        </a>
        <a href="https://github.com" target="__blank">
          GitHub
        </a>
        <a href="/termos-de-uso">Termos de Uso</a>
      </div>
    </div>
  );
}
