import DeclaracaoExclusao from "@/Documents/dependentes/DeclaracaoExclusao";
import { pageStyle } from "@/utils/pageStyle";
import { useContext, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { DependentesProps } from "../../_types/dependentes";
import { toast } from "sonner";
import { api } from "@/lib/axios/apiClient";
import { AssociadoProps } from "../../_types/associado";
import { UserProps } from "@/types/user";
import { AuthContext } from "@/store/AuthContext";
import { SubmitHandler, useForm } from "react-hook-form";


interface ActionsProps {

  imprimirDeclaracao: () => void
  excluirDep: (motivo: string) => Promise<void>
  componentRef: React.RefObject<DeclaracaoExclusao>
  addDependente: (dados: DependentesProps) => Promise<void>
  atualizarDependente: (dados: DependentesProps) => Promise<void>

}

interface UseActionsProps {

  dadosassociado: Partial<AssociadoProps>
  usuario: UserProps
  setarDadosAssociado: (dados: Partial<AssociadoProps>) => void
  setModalAdd: (open: boolean) => void
  data: Partial<DependentesProps>
}

const useActionsDependentes = ( {dadosassociado, usuario, setarDadosAssociado, setModalAdd, data }:Partial<UseActionsProps>): ActionsProps => {

  const { carregarDados } = useContext(AuthContext)
  const [dadosDep, setDadosDep] = useState<Partial<DependentesProps>>({})
  const componentRef = useRef<DeclaracaoExclusao>(null)
  
  const [modal, setModal] = useState<{ [key: string]: boolean }>({
    dependente: false,
    excluir: false,
    print: false
  })


  const { reset } = useForm<DependentesProps>({
    defaultValues: data
  })


  const imprimirDeclaracao = useReactToPrint({
    pageStyle: pageStyle,
    documentTitle: 'DECLARAÇÃO DE EXCLUSÃO DEPENDENTE',
    content: () => componentRef.current,
    onBeforeGetContent: () => setModal({ print: false })

  })

  async function addDependente(dados: DependentesProps) {
    try {

      if (!setModalAdd) {
        toast.error("Dados não encontrados para esta operação.");
        return;
      }


      toast.promise(
        api.post('/novoDependente', {
          id_global: dadosassociado?.id_global,
          id_contrato_global: dadosassociado?.contrato?.id_contrato_global,
          id_contrato: dadosassociado?.contrato?.id_contrato,
          id_associado: dadosassociado?.id_associado,
          nome: dados.nome.toUpperCase(),
          data_nasc: dados.data_nasc,
          grau_parentesco: dados.grau_parentesco,
          data_adesao: dados.data_adesao,
          cad_usu: usuario?.nome,
          cad_dh: new Date(),
          carencia: dados.carencia,
          sexo: dados.sexo
        }),
        {
          loading: 'Cadastrando Dependente...',
          success: async (res) => {
            dadosassociado?.id_global && await carregarDados(dadosassociado?.id_global)
            setModalAdd(false)
            return 'Adicionado com Sucesso!'
          },
          error: async (error) => {
            return error?.response?.data.error ?? 'Erro ao adicionar dependente'
          }
        }
      )
      setModalAdd(false)

    } catch (error: any) {
      toast.error(error?.response?.data.error ?? 'Erro ao salvar dados')
    }
  }

  async function atualizarDependente(dados: DependentesProps) {

    if (!setModalAdd) {
      toast.error("Dados não encontrados para esta operação.");
      return;
    }

    if (!data) {
      toast.error("Dados do dependente não encontrados para a operação.");
      return; // Para a execução da função aqui.
    }
    toast.promise(
      api.put('/atualizarDependente', {
        id_dependente_global: data.id_dependente_global,
        id_dependente: data.id_dependente,
        nome: dados.nome.toUpperCase(),
        data_nasc: dados.data_nasc,
        grau_parentesco: dados.grau_parentesco,
        data_adesao: dados.data_adesao,
        carencia: dados.carencia,
        sexo: dados.sexo
      }),
      {
        error: async (error) => {

          return error?.response?.data.error ?? 'Erro ao atualizar dependente'

        },
        loading: 'Atualizando Dependente....',
        success: async (res) => {
          dadosassociado?.id_global && await carregarDados(dadosassociado?.id_global)
          setModalAdd(false)
          return 'Atualizado com Sucesso!'
        }
      }
    )


    /* const response = await toast.promise(
         api.put('/atualizarDependente',{
           id_dependente_global:data.id_dependente_global,
             id_dependente:data.id_dependente,
             nome:dados.nome.toUpperCase(),
             data_nasc:dados.data_nasc,
             grau_parentesco:dados.grau_parentesco,
             data_adesao:dados.data_adesao,
             carencia:dados.carencia,
             sexo:dados.sexo
         }),
         {
             error:'Erro ao atualizar dependente',
             pending:'Atualizando Dependente',
             success:'Atualizado com Sucesso!'
         }
     )*/
    // dadosassociado?.id_global &&  await carregarDados(dadosassociado?.id_global)
  }

  async function excluirDep(motivo: string) {

    if (!setarDadosAssociado) {
      toast.error("Dados não encontrados para esta operação.");
      return;
    }
    if (dadosDep.excluido) {
      toast.info("Dependente ja excluido")
      return;
    }
    if (!dadosDep.id_dependente) {
      toast.info("Selecione um dependente!")
      return;
    }
    if (!motivo) {
      toast.warning("Informe um motivo!")
      return;
    }

    toast.promise(
      api.put('/excluirDependente', {
        id_dependente_global: dadosDep.id_dependente_global,
        id_dependente: Number(dadosDep.id_dependente),
        excluido: true,
        user_exclusao: usuario?.nome,
        exclusao_motivo: motivo
      }),
      {
        loading: `Efetuando`,
        success: () => {
          const novo = [...(dadosassociado?.dependentes ?? [])]
          const index = novo.findIndex(item => item.id_dependente_global === dadosDep.id_dependente_global)
          novo.splice(index, 1)
          setarDadosAssociado({ ...dadosassociado, dependentes: novo })
          //   await carregarDados()

          // setModalExcDep(false)
          setModal({ excluir: false })


          return `Dependente Exluido`
        },
        error: `Erro ao Excluir`
      }
    )

  }

  return {

    excluirDep,
    imprimirDeclaracao,
    componentRef,
    addDependente,
    atualizarDependente
  }

}


export default useActionsDependentes;