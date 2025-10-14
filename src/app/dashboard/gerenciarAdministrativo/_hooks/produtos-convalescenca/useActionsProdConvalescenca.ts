import { api } from "@/lib/axios/apiClient"
import { AuthContext } from "@/store/AuthContext"
import { ProdutosProps } from "@/types/produtos"
import { useContext, useEffect, useState } from "react"
import { SubmitHandler } from "react-hook-form"
import { toast } from "sonner"

const useActionsProdConvalescenca = () => {

  const { usuario, signOut } = useContext(AuthContext)
  const [listaProdutos, setListaProdutos] = useState<ProdutosProps[]>([])
    const [produto, setProduto] = useState<ProdutosProps | null>(null)

  async function listarProdutos() {

    try {

      const response = await api.post("/produtos/listar", {tipo: "P"})

      const produtos = response.data
      setListaProdutos(produtos)

      console.log("Dados da API:", produtos)

    } catch (error) {

      toast.error("Erro ao listar produtos!")

    }
  }

  useEffect(() => {
    if (!usuario) return signOut()
    listarProdutos()

  }, [])

  const adicionarProduto = async (data: ProdutosProps) => {

    const payload = {

      descricao: data.descricao,
      unidade: data.unidade,
      valor_custo: data.valor_custo,
      valor_venda: data.valor_venda,
      quantidade: data.quantidade,
      margem_lucro: data.margem_lucro,
      tipo: data.tipo || "P"
    }

    toast.promise(
      api.post("/produtos/adicionar", payload),
      {
        error: 'Erro ao adicionar produto',
        loading: 'Adicionando...',
        success: 'Adicionado com sucesso!'

      }
    )

    listarProdutos()
  }
  const editarProduto = async (data: ProdutosProps) => {

    const payload = {

      descricao: data.descricao,
      unidade: data.unidade,
      valor_custo: data.valor_custo,
      valor_venda: data.valor_venda,
      quantidade: data.quantidade,
      margem_lucro: data.margem_lucro,
      tipo: data.tipo || "P"
    }

    toast.promise(
      api.put("/produtos/editar", payload),
      {
        error: 'Erro ao adicionar produto',
        loading: 'Adicionando...',
        success: 'Adicionado com sucesso!'

      }
    )
  }

  const deletarProduto = async (id_produto: number) => {

    toast.promise(api.put("/produtos/deletar", {
      data: {
        id_produto
      }
    }),
      { 
        error: "Erro ao deletar produto",
        loading: "Carregando produtos...",
        success: "Deletado com sucesso!"
      })
    
    listarProdutos()
  }

   const onSave: SubmitHandler<ProdutosProps> = async (data) => {
      if (!data.descricao || !data.tipo) {
        toast.error('Preencha todos os campos!')
        return;
      }
  
      try {
        if (data.id_produto) {
  
          await editarProduto(data as ProdutosProps)
          await listarProdutos()
          return true
  
        } else {
  
          await adicionarProduto(data as ProdutosProps)
          await listarProdutos()
          return true
  
        }
      } catch (error) {
  
        throw error
  
      }
    }

  return {

    adicionarProduto,
    editarProduto,
    deletarProduto,
    listarProdutos,
    produto,
    setProduto,
    listaProdutos,
    onSave

  }
}

export default useActionsProdConvalescenca;