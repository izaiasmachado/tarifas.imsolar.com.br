import React from "react";
import "./styles.css";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import CalculateIcon from "@mui/icons-material/Calculate";

export default function FatorAjusteGrupoA() {
  return (
    <div className="container-fator-ajuste">
      <div className="fator-ajuste">
        <div className="container-input-fields">
          <div className="input-title">
            <div className="input-title-icon">
              <BubbleChartIcon />
            </div>
            <div className="input-title-text">Dados de Consumo</div>
          </div>

          <div className="input-fields">
            <div className="select-input input">
              <div className="input-label">Concessionária</div>
              <TextField
                className="select-input fator-field input-field"
                variant="outlined"
                select
              ></TextField>
            </div>

            <div className="select-input input">
              <div className="input-label">Subgrupo</div>
              <TextField
                className="select-input fator-field input-field"
                variant="outlined"
                select
              ></TextField>
            </div>

            <div className="select-input input">
              <div className="input-label">Modalidades</div>
              <TextField
                className="select-input fator-field input-field"
                variant="outlined"
                select
              ></TextField>
            </div>

            <div className="select-input input">
              <div className="input-label">Consumo Fora da Ponta</div>
              <TextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kWh</InputAdornment>
                  ),
                }}
                type="number"
                className="select-input fator-field input-field"
                variant="outlined"
              ></TextField>
            </div>
            <div className="select-input input">
              <div className="input-label">Consumo na Ponta</div>
              <TextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kWh</InputAdornment>
                  ),
                }}
                type="number"
                className="select-input fator-field input-field"
                variant="outlined"
              ></TextField>
            </div>
          </div>
        </div>

        <div className="container-calculations">
          <div className="input-title">
            <div className="input-title-icon">
              <CalculateIcon />
            </div>
            <div className="input-title-text">Fator de Ajuste | Grupo A</div>
          </div>

          <div className="calculations">
            <div className="calc">
              <div className="calc-label">TE Fora Ponta</div>
              <div className="calc-result">
                <div className="calc-result-unit">R$</div>
                <div className="calc-result-number">272,76</div>
              </div>
            </div>
            <div className="calc">
              <div className="calc-label">TE Ponta</div>
              <div className="calc-result">
                <div className="calc-result-unit">R$</div>
                <div className="calc-result-number">456,17</div>
              </div>
            </div>
            <div className="calc">
              <div className="calc-label">Fator de Ajuste</div>
              <div className="calc-result">
                <div className="calc-result-unit"></div>
                <div className="calc-result-number">1000</div>
              </div>
            </div>
            <div className="calc">
              <div className="calc-label">
                Geração ajustada para compensar consumo Ponta
              </div>
              <div className="calc-result">
                <div className="calc-result-number">1000</div>
                <div className="calc-result-unit">kWh</div>
              </div>
            </div>

            <div className="calc">
              <div className="calc-label">
                Geração total necessária para compensar todo o consumo
              </div>
              <div className="calc-result">
                <div className="calc-result-number">1000</div>
                <div className="calc-result-unit">kWh</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
