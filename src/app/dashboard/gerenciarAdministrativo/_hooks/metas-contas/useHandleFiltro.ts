import { FormFiltro } from "./useActionsMetas";
import { ajustarData } from "@/utils/ajusteData";

export function useFiltroMetas(postData: (payload: FormFiltro) => Promise<void>, id_grupo: number | undefined, startDate: Date | undefined, endDate: Date | undefined) {
  const handleFiltro = async () => {
    const { dataFim, dataIni } = ajustarData(startDate, endDate);

    const payload: FormFiltro = {
      startDate: dataIni,
      endDate: dataFim,
      id_grupo,
    };
    await postData(payload);
  };

  return { handleFiltro };
}