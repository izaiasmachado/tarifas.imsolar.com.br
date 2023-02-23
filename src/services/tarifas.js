import tarifasJSON from "../utils/tarifas.json";

const serializeTarifas = (tarifas) => {
  return tarifas.reduce((acc, tarifa, idx) => {
    const allValuesValid = [
      tarifa.subgrupo,
      tarifa.modalidade,
      tarifa.classe,
      tarifa.subclasse,
      tarifa.posto,
      tarifa.unidade,
      tarifa.totaltusd,
      tarifa.totalte,
    ].every((value) => !!value);

    if (allValuesValid && idx !== 0) {
      acc.push(tarifa);
    }

    return acc;
  }, []);
};

export default function getTarifas() {
  return serializeTarifas(tarifasJSON);
}
