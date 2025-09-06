import { api } from "@/lib/axios/apiClient"
import { ConsultoresProps } from "@/types/consultores"
import { toast } from "sonner"

type NovoPerfilPayload = {
  nome: string
  funcao: string
}

interface ActionsProps {

  novoPerfil: (data: NovoPerfilPayload) => Promise<void>
  editarPerfil: (data: ConsultoresProps) => Promise<void>
}

interface UseActionsProps {
  id_consultor: string | null
  nome: string | null
  funcao: string | null
  carregarDados: () => Promise<void>;
  close: Function
}

const useActionsPerfil = ({  carregarDados, close }: Partial<Pick<UseActionsProps, "carregarDados" | "close">>): ActionsProps => {

  async function  novoPerfil (data: NovoPerfilPayload) {

    if (!carregarDados || !close) {
      toast.error("Dados não encontrados para esta operação.");
      return;
    }

    toast.promise(

      api.post('/user/novo', {
        nome: data.nome,
        funcao: data.funcao,
      }),
      {
        error: "Erro ao criar novo perfil.",
        success: () => {
          carregarDados()
          close()
          return "Perfil criado com sucesso!"
        }
      }
    )
  }
  async function editarPerfil(data: ConsultoresProps) {

    if (!carregarDados || !close) {
      toast.error("Dados não encontrados para esta operação.");
      return;
    }
    try {
      await toast.promise(
        api.put(`/user/editar`, {
          id_consultor: data.id_consultor,
          nome: data.nome,
          funcao: data.funcao,
        }),
        {
          loading: "Salvando alterações...",

          success: () => {
            carregarDados()
            close()
            return "Perfil atualizado com sucesso!"
          },
          error: "Erro ao atualizar o perfil.",
        }
      )
    } catch (error) {
      console.error("Erro ao editar perfil:", error)
      throw error
    }
  }



  return {
    novoPerfil,
    editarPerfil
  }
}

export default useActionsPerfil;
