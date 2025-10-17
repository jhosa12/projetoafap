import { startOfYear, endOfYear, startOfMonth, endOfMonth } from "date-fns";

export function useFiltroDatas(
  setStartDate: (date: Date | undefined) => void,
  setEndDate: (date: Date | undefined) => void,
  anoSelecionado: number | undefined,
  setAnoSelecionado: (ano: number | undefined) => void,
  mesSelecionado: number | undefined,
  setMesSelecionado: (mes: number | undefined) => void
) {


  function handleAnoChange(ano: number | undefined) {
    setAnoSelecionado(ano);
    if (ano !== undefined) {
      setStartDate(startOfYear(new Date(ano, 0, 1)));
      setEndDate(endOfYear(new Date(ano, 0, 1)));
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }

  function handleMesChange(mes: number | undefined) {
    setMesSelecionado(mes);
    if (anoSelecionado !== undefined && mes !== undefined) {
      setStartDate(startOfMonth(new Date(anoSelecionado, mes, 1)));
      setEndDate(endOfMonth(new Date(anoSelecionado, mes, 1)));
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }

  return { handleAnoChange, handleMesChange }

}