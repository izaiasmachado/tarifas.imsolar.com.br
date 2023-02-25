import React from "react";
import "./styles.css";

import Header from "../../components/Header/Header";
import Filter from "../../components/Filter/Filter";
import TableTarifas from "../../components/TableTarifas/TableTarifas";

import getTarifas from "../../services/tarifas";
import FilterController from "../../services/filter";
import useFilter from "../../services/useFilter";

const DEFAULT_SELECT_TEXT = "Mostrar Todos";
const initialFilters = [
  {
    key: "concessionaria",
    name: "Concessionária",
    default: DEFAULT_SELECT_TEXT,
  },
  {
    key: "subgrupo",
    name: "Subgrupo",
    default: DEFAULT_SELECT_TEXT,
  },
  {
    key: "modalidade",
    name: "Modalidade",
    default: DEFAULT_SELECT_TEXT,
  },
];

export default function TarifasEnergiaSemImposto() {
  const tarifas = getTarifas();
  const clearPage = () => {};

  const { handleChangeState, clearFilters, filters } =
    useFilter(initialFilters);
  const filtersController = new FilterController(filters);

  const handleClearFilters = () => {
    clearFilters();
    clearPage();
  };

  const data = filtersController.applyAllFilters(tarifas);
  const combinedFilters = filtersController.getCombinedFilters(tarifas);

  return (
    <div className="container-tarifas">
      <div className="tarifas">
        <Header title={"Tarifas de Energia Sem Impostos"} />
        <Filter
          filters={combinedFilters}
          handleChangeState={handleChangeState}
          handleClearFilters={handleClearFilters}
        />
        <TableTarifas data={data} clearPage={clearPage} />
      </div>
    </div>
  );
}
