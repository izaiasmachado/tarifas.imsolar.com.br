import "./styles.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

export default function Header() {
  return (
    <div className="toolbar-container section">
      <div className="toolbar">
        <div className="title-toolbar">Tarifas de Energia Sem Impostos</div>
        <Breadcrumbs className="Header__breadcrumbs">
          <a href="/">Página Principal</a>
          <Typography color="text.primary">
            Tarifas de Energia Sem Impostos
          </Typography>
        </Breadcrumbs>
      </div>
    </div>
  );
}
