import { listacheckida, listacheckvolta } from './../../_mock/dados-checklist';
import { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { ObitoProps } from "../../_types/obito";

interface ActionsProps {
  onSave: SubmitHandler<ObitoProps>
  limparDados: () => void
  setOpenOs: (value: boolean) => void
  listar: () => Promise<void>
}

export const useHandleSalvarObito = ({
  onSave,
  limparDados,
  setOpenOs,
  listar,
}: ActionsProps) => {

  const handleSalvar: SubmitHandler<ObitoProps> = async (data) => {
    try {

      const checklistIdaCompleto = listacheckida.map((item, idx) => ({
        ...item,
        status: data.listacheckida?.[idx]?.status ?? false
      }));

      // Monta o array completo para volta
      const checklistVoltaCompleto = listacheckvolta.map((item, idx) => ({
        ...item,
        status: data.listacheckvolta?.[idx]?.status ?? false
      }));

      const resultado = await onSave({
        ...data,
        listacheckida: checklistIdaCompleto,
        listacheckvolta: checklistVoltaCompleto,
      });

      if (resultado === true) {
        limparDados();
        setOpenOs(false);
        await listar();
      }

    } catch (error: any) {

      toast.error("Erro ao salvar óbito.");

      return;
    }
  };

  return handleSalvar

}



