import { api } from "@/lib/axios/apiClient"
import { AuthContext } from "@/store/AuthContext"
import { PlanosProps } from "@/types/planos"
import { useContext, useEffect, useState } from "react"
import { SubmitHandler } from "react-hook-form"
import { toast } from "sonner"

const useActionsPlanos = () => {

  const { usuario, signOut, infoEmpresa } = useContext(AuthContext)
  const [listaPlanos, setListaPlanos] = useState<PlanosProps[]>([])
  const [plano, setPlano] = useState<PlanosProps | null>(null)
  const [loading, setLoading] = useState(true)



  async function listar() {
    try {
      const response = await api.get("/planos");

      if (response.data) {

        const planos = response.data
        setListaPlanos(planos)

      }


    } catch (err) {

      toast.error("Não foi possível carregar os registros.");
    }
  }

  useEffect(() => {
    if (!usuario) return signOut();
    listar();
  }, [usuario]);

  const editarPlano = async (data: PlanosProps) => {

    return toast.promise(
      api.put('/plano/editar', {
        id_plano: data.id_plano,
        descricao: data.descricao,
        limite_dep: data.limite_dep,
        valor: data.valor,
        acrescimo: data.acrescimo,
        informacoes_plano: data.informacoes_plano

      }),
      {
        error: (err) => err.response?.data?.message || 'Erro ao atualizar os dados',
        loading: 'Editando',
        success: 'Editado com sucesso'
      }
    )

  }

  const deletarPlano = async (id_plano: number) => {


    toast.promise(
      api.delete('/plano/deletar', {
        data: {
          id_plano,
        }
      }),
      {
        error: 'Erro ao deletar plano de conta',
        loading: 'Deletando...',
        success: () => {
          listar()
          return 'Deletado com sucesso!'
        }
      }
    )
  }

  async function adicionarPlano(data: PlanosProps) {

    if (!data.descricao && !data.limite_dep
      && !data.valor && !data.acrescimo) {
      toast.error("Preencha todos os campos")
      return false
    }

    if (!infoEmpresa?.id) {
      console.log("Info Empresa:", infoEmpresa)
      toast.error("Empresa não selecionada")
      return false
    }

    const payload = {
      id_empresa: infoEmpresa.id,
      limite_dep: Number(data.limite_dep),
      descricao: data.descricao.toUpperCase(),
      valor: Number(data.valor),
      acrescimo: Number(data.acrescimo),
      informacoes_plano: data.informacoes_plano
    }

    console.log("Dados para a api:", payload)
    toast.promise(
      api.post('/plano/adicionar', payload),
      {
        error: (error) => error.response?.data?.error || 'Erro ao adicionar plano',
        loading: 'Adicionando...',
        success: 'Adicionado com sucesso!'
      }
    )

    listar()

  }

  const onSave: SubmitHandler<PlanosProps> = async (data) => {
    if (!data.descricao || !data.limite_dep || !data.valor) {
      toast.error('Preencha todos os campos!')
      return;
    }

    try {
      if (data.id_plano) {

        await editarPlano(data as PlanosProps)
        await listar()
        return true

      } else {

        await adicionarPlano(data as PlanosProps)
        await listar()
        return true

      }
    } catch (error) {

      throw error

    }
  }

  return {

    onSave,
    deletarPlano,
    editarPlano,
    listar,
    listaPlanos,
    loading,
    setListaPlanos,
    plano,
    setPlano



  }
}

export default useActionsPlanos