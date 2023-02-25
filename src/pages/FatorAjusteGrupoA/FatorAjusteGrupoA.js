import React, { useState } from "react";
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
    default: 0,
    unit: {
      name: "R$",
      position: "left",
    },
    format: (value) => Number(value).toFixed(2).toLocaleString("pt-BR"),
  },
  {
    key: "totalTEPonta",
    name: "TE Ponta",
    default: 0,
    unit: {
      name: "R$",
      position: "left",
    },
    format: (value) => Number(value).toFixed(2).toLocaleString("pt-BR"),
  },
  {
    key: "fatorAjuste",
    name: "Fator de Ajuste",
    default: 0,
    unit: {
      name: "",
    },
    format: (value) => Number(value).toFixed(5).toLocaleString("pt-BR"),
  },
  {
    key: "ajustadaConsumoPonta",
    name: "Geração ajustada para compensar consumo Ponta",
    default: 0,
    unit: {
      name: "kWh",
      position: "right",
    },
    format: (value) => Number(value).toFixed(2).toLocaleString("pt-BR"),
  },
  {
    key: "ajustadaConsumoForaPonta",
    name: "Geração total necessária para compensar todo o consumo",
    default: 0,
    unit: {
      name: "kWh",
      position: "right",
    },
    format: (value) => Number(value).toFixed(2).toLocaleString("pt-BR"),
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
  const [consumoForaPonta, setConsumoForaPonta] = useState("");
  const [consumoPonta, setConsumoPonta] = useState("");

  const ajuste = getFatorAjuste();
  const { handleChangeState, clearFilters, filters } =
    useFilter(initialFilters);

  const filtersController = new FilterController(filters);

  const handleClearFilters = () => {
    clearFilters();
  };

  const data = filtersController.applyAllFilters(ajuste);
  const combinedFilters = filtersController.getCombinedFilters(ajuste);

  const selectedRow = data.length === 1 ? data[0] : undefined;

  if (selectedRow) {
    selectedRow.ajustadaConsumoPonta =
      typeof consumoPonta === "number"
        ? consumoPonta / selectedRow.fatorAjuste
        : 0;
    selectedRow.ajustadaConsumoForaPonta =
      typeof consumoForaPonta === "number"
        ? selectedRow.ajustadaConsumoPonta + consumoForaPonta
        : 0;
  }

  const outputValues = outputFields.map((field) => {
    const value =
      selectedRow && selectedRow.hasOwnProperty(field.key)
        ? selectedRow[field.key]
        : field.default;

    field.value = field.format(value);
    return field;
  });

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
                value={consumoPonta}
                placeholder="0"
                onChange={(event) =>
                  setConsumoPonta(Number(event.target.value))
                }
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
                value={consumoForaPonta}
                placeholder="0"
                onChange={(event) =>
                  setConsumoForaPonta(Number(event.target.value))
                }
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
            {(outputValues || []).map((field) => {
              const UnitTag = () => (
                <div className="calc-result-unit">{field.unit.name}</div>
              );
              const NumberTag = () => (
                <div className="calc-result-number">{field.value}</div>
              );

              return (
                <div className="calc" key={field.key}>
                  <div className="calc-label">{field.name}</div>
                  <div className="calc-result">
                    {field.unit.position === "right" ? (
                      <>
                        <NumberTag />
                        <UnitTag />
                      </>
                    ) : (
                      <>
                        <UnitTag />
                        <NumberTag />
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* <div className="calc">
              <div className="calc-label">TE Fora Ponta</div>
              <div className="calc-result">
                <div className="calc-result-unit">R$</div>
                <div className="calc-result-number">
                  {outputValues[0].value}
                </div>
              </div>
            </div>
            <div className="calc">
              <div className="calc-label">TE Ponta</div>
              <div className="calc-result">
                <div className="calc-result-unit">R$</div>
                <div className="calc-result-number">
                  {outputValues[1].value}
                </div>
              </div>
            </div>
            <div className="calc">
              <div className="calc-label">Fator de Ajuste</div>
              <div className="calc-result">
                <div className="calc-result-unit"></div>
                <div className="calc-result-number">
                  {outputValues[2].value}
                </div>
              </div>
            </div>
            <div className="calc">
              <div className="calc-label">
                Geração ajustada para compensar consumo Ponta
              </div>
              <div className="calc-result">
                <div className="calc-result-number">
                  {outputValues[3].value}
                </div>
                <div className="calc-result-unit">kWh</div>
              </div>
            </div>

            <div className="calc">
              <div className="calc-label">
                Geração total necessária para compensar todo o consumo
              </div>
              <div className="calc-result">
                <div className="calc-result-number">
                  {outputValues[4].value}
                </div>
                <div className="calc-result-unit">kWh</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
