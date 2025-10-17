import { ProdutosProps } from "@/types/produtos"
import { toast } from "sonner"

interface ExcluirProps {
  deletarProduto: (produto: ProdutosProps) => Promise<void>
  listarProdutos: () => Promise<void>
}


export function useHandleExcluirProdutoConv({ deletarProduto, listarProdutos }: ExcluirProps) {

  const confirmarExclusao = async (produto: any) => {

    try {

      await deletarProduto(produto)
      await listarProdutos()

      toast.success("Produto excluído com sucesso!")

    } catch (error) {

      toast.error("Erro ao excluir produto.")

    }

  }
  return { confirmarExclusao }
}