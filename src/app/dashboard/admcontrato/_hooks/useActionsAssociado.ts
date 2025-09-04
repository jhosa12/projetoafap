import { api } from "@/lib/axios/apiClient"
import { AuthContext } from "@/store/AuthContext"
import { useContext, useState } from "react"
import { toast } from "sonner"

interface ActionsProps {

  inativarAtivarContrato: () => Promise<void>

}

interface UseActionsProps {

  setModal: (open: boolean) => void
  
}

const useActionsAssociado = ({

  setModal

}: UseActionsProps): ActionsProps => {

  const {dadosassociado, setarDadosAssociado } = useContext(AuthContext)

  const [descMotivo, setDescMotivo] = useState('')

  const [motivo, setMotivo] = useState<{ [key: string]: boolean }>({
    financeiro: false,
    nLocalizado: false,
    desagrado: false
  })


  async function inativarAtivarContrato() {

    const st = dadosassociado?.contrato?.situacao === 'ATIVO' ? 'INATIVO' : 'ATIVO'

    let categoria_inativo = ''
    if (st === 'INATIVO') {
      if (motivo.desagrado) {
        categoria_inativo = 'Desagrado'
      }
      if (motivo.financeiro) {
        categoria_inativo = 'Financeiro'
      }
      if (motivo.nLocalizado) {
        categoria_inativo = 'Nao Localizado'
      }
    }

    if (st === 'INATIVO' && !motivo.desagrado && !motivo.financeiro && !motivo.nLocalizado) {
      toast.warning('Selecione a categoria do motivo')

      return;
    }
    if (st === 'INATIVO' && !descMotivo) {
      toast.warning('Descreva o motivo da Inativação')
      return;
    }

    toast.promise(
      api.put('/contrato/inativar',
        {
          id_contrato: dadosassociado?.contrato?.id_contrato,
          id_contrato_global: dadosassociado?.contrato?.id_contrato_global,
          motivo_inativo: st === 'INATIVO' ? descMotivo : undefined,
          categoria_inativo: st === 'INATIVO' ? categoria_inativo : undefined,
          dt_cancelamento: st === 'INATIVO' ? new Date() : undefined,
          situacao: st
        }
      ),
      {
        error: 'Erro ao Inativar/Ativar Contrato',
        loading: 'Realizando Alteração....',
        success: (response) => {
          setarDadosAssociado({ ...dadosassociado, contrato: { ...dadosassociado?.contrato, ...response.data } })
          setModal(false)

          return 'Alteração realizada com sucesso'
        }

      }
    )
    // await carregarDados()
  }

  return {

    inativarAtivarContrato
  }
}
export default useActionsAssociado