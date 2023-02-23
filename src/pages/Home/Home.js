import React from "react";
import { useNavigate } from "react-router-dom";

import "./styles.css";
import BoltIcon from "@mui/icons-material/Bolt";
import { Button } from "@mui/material";
export default function Home() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="container-home">
      <div className="home">
        <div className="Home__hero">
          <div className="Home__hero-title">
            <h1>Tarifas de Energia</h1>
          </div>
          <div className="Home__hero-subtitle">
            <h2>
              Conheça as tarifas de
              <br id="Home__hero-subtitle-breakpoint" /> Energia Elétrica do
              Brasil
            </h2>
          </div>
        </div>

        <div className="Home__content">
          <div className="Home__content-card">
            <div className="Home__content-card-body">
              <BoltIcon className="Home__content-card-icon" />

              <div className="Home__content-card-text">
                <div className="Home__content-card-title">
                  <h3>Tarifas de Energia Sem Impostos</h3>
                </div>
                <div className="Home__content-card-subtitle">
                  <h4>
                    Tabela com tarifas de energia elétrica sem impostos,
                    separado por concessionária de energia e com filtros
                    relevantes.
                  </h4>
                </div>
              </div>
            </div>

            <div className="Home__content-card-button">
              <Button
                size="small"
                color="primary"
                onClick={() => handleNavigate("/sem-impostos")}
              >
                Ver tarifas
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
