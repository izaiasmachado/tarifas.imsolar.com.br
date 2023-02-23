import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";

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
        <a
          href="https://github.com/izaiasmachado/tarifas.imsolar.com.br"
          target="__blank"
        >
          GitHub
        </a>
        <Link to="/termos-de-uso">Termos de Uso</Link>
      </div>
    </div>
  );
}
