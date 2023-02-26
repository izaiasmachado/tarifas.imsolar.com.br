import tarifasJSON from "../utils/tarifas.json";

const serializeTarifas = (tarifas) => {
  return tarifas.reduce((acc, tarifa, idx) => {
    const allValuesValid = [
      tarifa.concessionaria,
      tarifa.subgrupo,
      tarifa.classe,
      tarifa.subclasse,
      tarifa.detalhe,
      tarifa.posto,
      tarifa.unidade,
      tarifa.acessante,
      tarifa.totalTUSD,
      tarifa.totalTE,
      tarifa.TUSDFioB,
    ].every((value) => !!value);

    if (allValuesValid) acc.push(tarifa);
    return acc;
  }, []);
};

export default function getTarifas() {
  return serializeTarifas(tarifasJSON);
}
