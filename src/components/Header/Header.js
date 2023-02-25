import "./styles.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

export default function Header({ title }) {
  return (
    <div className="Header__container">
      <div className="Header">
        <div className="Header__title">{title}</div>
        <Breadcrumbs className="Header__breadcrumbs">
          <a href="/">Página Principal</a>
          <Typography color="text.primary">{title}</Typography>
        </Breadcrumbs>
      </div>
    </div>
  );
}
