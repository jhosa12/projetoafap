import { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { PlanoContasProps } from "@/app/dashboard/financeiro/_types/plano-contas";


export function useHandleSalvarPC(
  onSave: SubmitHandler<PlanoContasProps>,
  setOpenModal: (open: boolean) => void,
  listarPlanoContas: () => void,

) {

  const handleSalvar: SubmitHandler<PlanoContasProps> = async (data) => {
    try {
      const resultado = await onSave(data);

      if (resultado === true) {
        setOpenModal(false);
        listarPlanoContas()

      }
    } catch (error: any) {
      toast.error("Erro ao salvar meta. Por favor, tente novamente!");
    }
  };

  return { handleSalvar };
}
