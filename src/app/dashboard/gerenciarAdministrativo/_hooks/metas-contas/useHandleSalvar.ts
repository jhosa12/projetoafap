import { SubmitHandler } from "react-hook-form";
import { MetaProps } from "../../_types/types";
import { toast } from "sonner";


export function useHandleSalvar(
  onSave: SubmitHandler<MetaProps>,
  limparDados: () => void,
  setOpenOs: (open: boolean) => void,
  listarMetas: () => void,
  setLinhaSelecionada: (open: boolean) => void
) {

  const handleSalvar: SubmitHandler<MetaProps> = async (data) => {
    try {
      const resultado = await onSave(data);

      if (resultado === true) {
        limparDados();
        setOpenOs(false);
        listarMetas()
        setLinhaSelecionada(false)

      }
    } catch (error: any) {
      toast.error("Erro ao salvar meta. Por favor, tente novamente!");
    }
  };

  return { handleSalvar };
}
