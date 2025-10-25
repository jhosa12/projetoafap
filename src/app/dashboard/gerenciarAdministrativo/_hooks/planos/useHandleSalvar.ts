import ListarObitos from "@/app/dashboard/servicos/listarObitos/page";
import { PlanosProps } from "@/types/planos";
import { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";


interface ActionsProps {
  onSave: SubmitHandler<PlanosProps>
  limparDados: () => void
  setOpen: (value: boolean) => void
  listar: () => Promise<void>
}

export const useHandleSalvar = ({
  onSave,
  limparDados,
  setOpen,
  listar
}: ActionsProps) => {

  const handleSubmit: SubmitHandler<PlanosProps> = async (data) => {
    try {
      const resultado = await onSave(data);

      if (resultado === true) {
        limparDados();
        setOpen(false);
        await listar();
      }

    } catch (error: any) {

      toast.error("Erro ao salvar o plano.");

      return;
    }
  };

  return handleSubmit

}



