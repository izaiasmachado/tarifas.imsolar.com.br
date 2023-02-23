import "./styles.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export default function Header() {
  return (
    <div className="toolbar-container section">
      <div className="toolbar">
        <div className="title-toolbar">Tarifas de Energia Sem Impostos</div>
        <Breadcrumbs className="Header__breadcrumbs">
          <Link underline="hover" color="inherit" href="/">
            Página Principal
          </Link>
          <Typography color="text.primary">
            Tarifas de Energia Sem Impostos
          </Typography>
        </Breadcrumbs>
      </div>
    </div>
  );
}
