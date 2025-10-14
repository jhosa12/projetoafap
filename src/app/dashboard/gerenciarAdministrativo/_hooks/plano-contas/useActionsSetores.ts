import { api } from "@/lib/axios/apiClient"
import { SetoresProps } from "@/types/setores"
import { useState } from "react"
import { toast } from "sonner"

export const useActionsSetores = () => {

  const [arraySetores, setArraySetores] = useState<SetoresProps[]>([])



  const editarSetor = async (index: number) => {
    const grupo = arraySetores[index]

    toast.promise(
      api.put('/setores/editar', {

        id_grupo: grupo.id_grupo,
        descricao: grupo.descricao,



      }),
      {
        loading: 'Editando',
        success: 'Editado com sucesso!',
        error: 'Erro ao editar setor'
      }
    )
  }

  const deletarSetor = async (id_grupo: number) => {

    toast.promise(
      api.delete('/setores/deletar', {
        data: {
          id_grupo,
        }
      }), {
      loading: 'Deletando',
      success: 'Dados editado com sucesso!',
      error: 'Erro ao deletar setor'
    }
    )

  }
  const adicionarSetor = async (data: SetoresProps) => {
    if (!data.descricao) {
      toast.info('Preencha todos os campos!')
      return;
    }

    toast.promise(
      api.post('/setores/adicionar', {

        descricao: data.descricao.toUpperCase(),
        userId: 3

      }), {
      loading: 'Adicionando....',
      success: (response) => {
        setArraySetores(response.data)
        return 'Adicionado com sucesso'
      }

    }
    )


  }

  return {

  }
}