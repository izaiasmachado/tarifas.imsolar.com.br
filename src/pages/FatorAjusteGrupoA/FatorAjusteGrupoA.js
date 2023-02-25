import React from "react";
import "./styles.css";

import { MenuItem } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import CalculateIcon from "@mui/icons-material/Calculate";

import getFatorAjuste from "../../services/fatorAjuste";

import useFilter from "../../services/useFilter";
import FilterController from "../../services/filter";

const initialFilters = [
  {
    key: "concessionaria",
    name: "Concessionária",
    default: "Escolha uma Concessionária",
  },
  {
    key: "subgrupo",
    name: "Subgrupo",
    default: "Escolha um Subgrupo",
  },
  {
    key: "modalidade",
    name: "Modalidade",
    default: "Escolha uma Modalidade",
  },
];

const outputFields = [
  {
    key: "totalTEForaPonta",
    name: "TE Fora Ponta",
    default: "0",
    unit: "R$",
    format: (value) => value.toFixed(2).toLocaleString("pt-BR"),
  },
  {
    key: "totalTEPonta",
    name: "TE Ponta",
    default: "0",
    unit: "R$",
    format: (value) => value.toFixed(2).toLocaleString("pt-BR"),
  },
  {
    key: "fatorAjuste",
    name: "Fator de Ajuste",
    default: "0",
    unit: "",
    format: (value) => value.toFixed(5).toLocaleString("pt-BR"),
  },
  {
    key: "ajustadaConsumoPonta",
    name: "Geração ajustada para compensar consumo Ponta",
    default: "0",
    unit: "kWh",
    format: (value) => value.toFixed(2).toLocaleString("pt-BR"),
  },
  {
    key: "ajustadaConsumoForaPonta",
    name: "Geração total necessária para compensar todo o consumo",
    default: "0",
    unit: "kWh",
    format: (value) => value.toFixed(2).toLocaleString("pt-BR"),
  },
];

const SelectInput = ({ filter, handleChangeState }) => {
  return (
    <div className="select-input input">
      <div className="input-label">{filter.name}</div>
      <TextField
        className="select-input fator-field input-field"
        variant="outlined"
        onChange={(event) => handleChangeState(event, { id: filter.key })}
        value={filter.value}
        select
      >
        {(filter.available || []).map((item) => (
          <MenuItem key={`${filter.key}_${item}`} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default function FatorAjusteGrupoA() {
  const fatorAjuste = getFatorAjuste();
  const { handleChangeState, clearFilters, filters } =
    useFilter(initialFilters);

  const filtersController = new FilterController(filters);

  const handleClearFilters = () => {
    clearFilters();
  };

  // const data = filtersController.applyAllFilters(fatorAjuste);
  const combinedFilters = filtersController.getCombinedFilters(fatorAjuste);

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
            {(combinedFilters || []).map((filter) => (
              <SelectInput
                key={filter.key}
                filter={filter}
                handleChangeState={handleChangeState}
              />
            ))}

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

            <div className="input clear-fields">
              <button onClick={handleClearFilters}>Limpar Campos</button>
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
