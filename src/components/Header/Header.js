import "./styles.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function Header({ title }) {
  return (
    <div className="Header__container">
      <div className="Header">
        <Typography variant="h4" component="h1" className="Header__title">
          {title}
        </Typography>
        <div className="Header__breadcrumbs_container">
          <Breadcrumbs
            className="Header__breadcrumbs"
            separator={<ArrowForwardIosIcon style={{ fontSize: 12 }} />}
          >
            <a className="Header__breadcrumbs__link" href="/">
              <HomeOutlinedIcon />
            </a>

            <a
              className="Header__breadcrumbs__link Header__breadcrumbs__currentLink"
              href={window.location.href}
            >
              <Typography>{title}</Typography>
            </a>
          </Breadcrumbs>
        </div>
      </div>
    </div>
  );
}
