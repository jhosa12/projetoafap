import { api } from "@/lib/axios/apiClient"
import { AuthContext } from "@/store/AuthContext"
import { useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import { AssociadoProps } from "../_types/associado"
import { SubmitHandler, useForm } from "react-hook-form"

interface ActionsProps {

  inativarAtivarContrato: () => Promise<void>
  handleAtualizarDados: SubmitHandler<AssociadoProps>

}

interface UseActionsProps {

  setModal: (open: boolean) => void
  dataForm: Partial<AssociadoProps>

}

const useActionsAssociado = ({

  setModal,


}: Partial<UseActionsProps>): ActionsProps => {

  const { usuario, dadosassociado, setarDadosAssociado } = useContext(AuthContext)
  const [descMotivo, setDescMotivo] = useState('')

  const [motivo, setMotivo] = useState<{ [key: string]: boolean }>({
    financeiro: false,
    nLocalizado: false,
    desagrado: false
  })

  async function inativarAtivarContrato() {

    if (!setModal) {
      toast.error("Dados não encontrados para esta operação.");
      return;
    }

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


  const handleAtualizarDados: SubmitHandler<AssociadoProps> = async (data) => {

    const dataAtual = new Date();
    dataAtual.setTime(dataAtual.getTime() - dataAtual.getTimezoneOffset() * 60 * 1000);
    toast.promise(
      api.post('/atualizarAssociado', {
        id_global: data.id_global,
        nome: data.nome,
        cep: data.cep,
        cpfcnpj: data.cpfcnpj,
        endereco: data.endereco,
        bairro: data.bairro,
        numero: data.numero ? Number(data.numero) : undefined,
        cidade: data.cidade,
        uf: data.uf,
        guia_rua: data.guia_rua,
        email: data.email,
        data_nasc: data.data_nasc,
        celular1: data.celular1,
        celular2: data.celular2,
        telefone: data.telefone,
        edi_usu: usuario?.nome,
        edi_dh: dataAtual,
        profissao: data.profissao,
        sexo: data.sexo,
        contrato: data.contrato
      }),
      {
        error: 'Erro ao atualizar dados',
        loading: 'Realizando Alteração....',
        success: (response) => {
          setarDadosAssociado({ ...dadosassociado, ...response.data })
          return 'Alteração realizada com sucesso'
        }
      }
    )


  }

  return {

    inativarAtivarContrato,
    handleAtualizarDados
  }
}
export default useActionsAssociado