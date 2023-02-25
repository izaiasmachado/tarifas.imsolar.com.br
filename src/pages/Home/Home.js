import React from "react";
import "./styles.css";
import BoltIcon from "@mui/icons-material/Bolt";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Link } from "react-router-dom";
import { RWebShare } from "react-web-share";
import TocIcon from "@mui/icons-material/Toc";
import TableViewIcon from "@mui/icons-material/TableView";

export default function Home() {
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
          <Link
            to="/sem-impostos"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div className="Home__content-card">
              <div className="Home__content-card-body">
                <TocIcon className="Home__content-card-icon" />

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
            </div>
          </Link>

          <Link
            to="/fator-ajuste-grupo-a"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div className="Home__content-card">
              <div className="Home__content-card-body">
                <TableViewIcon className="Home__content-card-icon" />

                <div className="Home__content-card-text">
                  <div className="Home__content-card-title">
                    <h3>Calculadora Fator de Ajuste TE - Grupo A</h3>
                  </div>
                  <div className="Home__content-card-subtitle">
                    <h4>
                      Calculadora de energia fora ponta necessária para
                      compensar o consumo da hora ponta, em clientes Grupo A com
                      tarifação binômia.
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <RWebShare
            data={{
              text: "Conheça ferramentas informativas sobre as tarifas de energia de todo o Brasil!",
              url: "https://tarifas.imsolar.com.br",
              title: "Compartilhe o Tarifas de Energia",
            }}
          >
            <div className="Home__content-card">
              <div className="Home__content-card-body">
                <WhatsAppIcon className="Home__content-card-icon Home__content-card-icon-whatsapp" />

                <div className="Home__content-card-text">
                  <div className="Home__content-card-title">
                    <h3>Ajude Compartilhando Nossas Ferramentas</h3>
                  </div>
                  <div className="Home__content-card-subtitle">
                    <h4>
                      Compartilhe com seus amigos pelo WhatsApp nossas
                      ferramentas informativas sobre as tarifas de energia de
                      todo o Brasil!
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </RWebShare>
        </div>
      </div>
    </div>
  );
}
