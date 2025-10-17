import { ProdutosProps } from "@/types/produtos";
import { SubmitHandler } from "react-hook-form";


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

    } catch (error) {

      throw error

    }
  };

  return handleSubmitProduto

}



