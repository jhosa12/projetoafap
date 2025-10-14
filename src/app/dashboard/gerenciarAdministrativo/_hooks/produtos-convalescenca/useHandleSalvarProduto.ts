import ListarObitos from "@/app/dashboard/servicos/listarObitos/page";
import { PlanosProps } from "@/types/planos";
import { ProdutosProps } from "@/types/produtos";
import { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";


interface ActionsProps {
  onSave: SubmitHandler<ProdutosProps>
  limparDados: () => void
  setOpen: (value: boolean) => void
  listarProdutos: () => Promise<void>
}

export const useHandleSalvarProduto = ({

  onSave,
  limparDados,
  setOpen,
  listarProdutos

}: ActionsProps) => {

  const handleSubmitProduto: SubmitHandler<ProdutosProps> = async (data) => {
    try {
      const resultado = await onSave(data);

      if (resultado === true) {
        limparDados();
        setOpen(false);
        await listarProdutos();
      }

    } catch (error: any) {

      toast.error("Erro ao salvar produto.");

      return;
    }
  };

  return handleSubmitProduto

}



