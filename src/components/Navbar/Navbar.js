import "./styles.css";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo-alternative">
            Ferramentas de Energia Solar
          </Link>
        <nav>
          <ul className="navbar-items-list">
            <li>
                <Link href="/" className="navbar-item">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/tools" className="navbar-item">
                  Ferramentas
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="navbar-item">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="navbar-item">
                  Contato
                </Link>
              </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
