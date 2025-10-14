import { PlanoContasProps } from "@/app/dashboard/financeiro/_types/plano-contas"
import { api } from "@/lib/axios/apiClient"
import { useState } from "react"
import { SubmitHandler } from "react-hook-form"
import { toast } from "sonner"

export const useActionsPlanoContas = () => {

  const [listaPlanoContas, setListaPlanoContas] = useState<PlanoContasProps[]>([])

  async function listarPlanoContas(perm_lanc: string = 'all') {
    try {

      const response = await api.get('/planoContas/listar', {
        params: { perm_lanc }
      })

      setListaPlanoContas(response.data)

    } catch (error) {

      toast.error("Não foi possível carregar os registros.");
    }
  }


  const editarPlanoConta = async (data: any) => {

    toast.promise(
      api.put('/planoConta/editar', {
        conta: data.conta,
        descricao: data.descricao,
        tipo: data.tipo,
        perm_lanc: data.perm_lanc,
        data: data.data,


      }),
      {
        loading: 'Editando...',
        error: 'Erro ao editar plano de conta'
      }
    )
  }

  async function deletarPlanoConta(conta: string) {

    try {

      await api.delete('/planoConta/deletar', {
        data: {
          conta,
        }
      })

      toast.success("Conta excluída com sucesso!")

    } catch (error) {
      toast.error("Erro ao excluir conta!")
    }
  }

  const adicionarPlanoContas = async (data: PlanoContasProps) => {
    if (!data.conta || !data.tipo || !data.descricao) {
      toast.info('Preencha todos os campos!')
      return;
    }

    toast.promise(
      api.post('/planoConta/adicionar', {
        conta: data.conta,
        descricao: data?.descricao?.toUpperCase(),
        tipo: data.tipo,
        perm_lanc: data.perm_lanc,
        data: data.data,

      }), {
      loading: 'Adicionando....',
      error: 'Erro ao adicionar Conta'
    }
    )



    // setarDados([...arrayPlanoContas,response.data],arraygrupos)
  }

  const onSave: SubmitHandler<PlanoContasProps> = async (data: PlanoContasProps) => {
    try {

      const exist = listaPlanoContas.some(plano => plano.conta === data.conta)

      if (exist) {

        await editarPlanoConta(data)
        toast.success('Editado com sucesso!')
        await listarPlanoContas()

      } else {

        const dataAtual = new Date();
        const novoData = { ...data, data: dataAtual };

        await adicionarPlanoContas(novoData)
        toast.success('Adicionado com sucesso!')
        await listarPlanoContas()


      }


      return true

    } catch (error) {

      throw error

    }
  }



  return {

    listarPlanoContas,
    adicionarPlanoContas,
    editarPlanoConta,
    deletarPlanoConta,
    listaPlanoContas,
    onSave

  }
}