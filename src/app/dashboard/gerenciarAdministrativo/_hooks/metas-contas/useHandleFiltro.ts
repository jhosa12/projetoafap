import { FormFiltro } from '@/app/dashboard/gerenciarAdministrativo/metasContas/page';
import { ajustarData } from "@/utils/ajusteData";

export function useFiltroMetas(postData: (payload: FormFiltro) => Promise<void>, id_empresa: string | undefined, startDate: Date, endDate: Date) {
  const handleFiltro = async () => {
    const { dataFim, dataIni } = ajustarData(startDate, endDate);
    if (!id_empresa) return;
    const payload: FormFiltro = {
      startDate: dataIni,
      endDate: dataFim,
      id_empresa,
    };
    await postData(payload);
  };

  return { handleFiltro };
}