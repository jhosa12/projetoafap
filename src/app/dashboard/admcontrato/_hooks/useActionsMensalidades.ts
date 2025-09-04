import { api } from "@/lib/axios/apiClient";
import { MensalidadeProps } from "@/types/financeiro";
import { removerFusoDate } from "@/utils/removerFusoDate";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface ActionsProps {
    excluirMensalidade: () => Promise<void>
    adicionarMensalidade: () => Promise<void>
    toggleSelecionada: (item: MensalidadeProps) => void
    setMensalidade: (mensalidade: MensalidadeProps) => void
    handleEditar: ({actions}: {actions: {success: () => void, error?: () => void}}) => Promise<void>,
    handleEstorno: (motivoEstorno:string,actions:{success:()=>void,error?:()=>void}) => Promise<void>
}

interface Props {
  dadosassociado: any;
  setModal: any;
  carregarDados: any;
  setarDadosAssociado: any;
}

const useActionsMensalidades = ({
  dadosassociado,
  setModal,
  carregarDados,
  setarDadosAssociado,


}: Props): ActionsProps => {

const [mensalidade, setMensalidade] = useState<MensalidadeProps>({} as MensalidadeProps)
const [linhasSelecionadas, setLinhasSelecionadas] = useState<MensalidadeProps[]>([])




  const excluirMensalidade = useCallback(async () => {
    if (!linhasSelecionadas) {
      toast.info("Selecione uma mensalidade");
      return;
    }

    linhasSelecionadas?.map((mensalidade) => {
      if (mensalidade.status === "P") {
        toast.warning("Mensalidade Paga! Para excluir solite ao gerente");
        return;
      }
    });

    const response = await toast.promise(
      api.delete("/mensalidade/delete", {
        data: {
          mensalidades: linhasSelecionadas,
        },
      }),
      {
        loading: `Efetuando`,
        success: () => {
          setModal({ excluir: false });

          return `Excluida com sucesso`;
        },
        error: `Erro ao efetuar exlusão`,
      }
    );

    dadosassociado.id_global && (await carregarDados(dadosassociado.id_global));
    // setarDados({ mensalidade: {} })
    // setarDadosAssociado({mensalidade:mensalidades})
    // setOpenExcluir(false)

    setLinhasSelecionadas([]);
    // setarDados({ acordo: { mensalidade: [], id_acordo: 0 } })
  }, [linhasSelecionadas, dadosassociado.id_global]);


  
      const adicionarMensalidade = useCallback(async () => {
  
  
  
          if (!dadosassociado.id_global) {
              toast.warning('Associado não encontrado')
              return
          }
          const ultimaMensalidade = dadosassociado.mensalidade && dadosassociado?.mensalidade[dadosassociado?.mensalidade?.length - 1]
  
  
          if (!ultimaMensalidade) {
              toast.warning('Não há mensalidades registradas')
          }
  
          const vencimento = new Date(ultimaMensalidade?.vencimento ? ultimaMensalidade?.vencimento : '')
          const proxData = vencimento.setMonth(vencimento.getMonth() + 1)
          const { newDate } = removerFusoDate(new Date(proxData))
  
  
  
          toast.promise(
              api.post('/mensalidade/adicionar', {
                  id_contrato_global: dadosassociado?.contrato?.id_contrato_global,
                  id_global: dadosassociado.id_global,
                  id_contrato: dadosassociado?.contrato?.id_contrato,
                  id_associado: dadosassociado.id_associado,
                  status: 'A',
                  valor_principal: dadosassociado.contrato?.valor_mensalidade,
                  parcela_n: ultimaMensalidade?.parcela_n && ultimaMensalidade?.parcela_n + 1,
                  vencimento: newDate,
                  cobranca: newDate,
                  referencia: new Date(proxData).toLocaleDateString('pt-BR', {
                      month: '2-digit',
                      year: '2-digit'
                  }),
                  id_empresa: dadosassociado?.id_empresa
              }),
              {
                  loading: `Efetuando`,
                  success: (response) => {
                      // carregarDados()
                      setLinhasSelecionadas([])
                      //  setarDados({ acordo: { mensalidade: [], id_acordo: 0 } })
  
                      setarDadosAssociado({ ...dadosassociado, mensalidade: [...(dadosassociado.mensalidade ?? []), response.data] })
  
                      return `Mensalidade Adicionada`
                  },
                  error: `Erro ao gerar mensalidade`
              }
  
          )
      }, [dadosassociado]
      )

          const toggleSelecionada = (item: MensalidadeProps) => {
              const index = linhasSelecionadas.findIndex((linha) => linha.id_mensalidade === item.id_mensalidade);
              if (item.status === 'P') {
                  toast.info('Mensalidade Paga!')
                  return;
              }
              if (item.status === 'E') {
                  toast.info('Mensalidade em acordo!')
                  return;
              }
              if (index === -1) {
                  // Adiciona a linha ao array se não estiver selecionada
                  setLinhasSelecionadas([...linhasSelecionadas, item]);
                  //  setarDados({ acordo: { mensalidade: [...linhasSelecionadas, item] } })
              } else {
                  // Remove a linha do array se já estiver selecionada
                  const novasLinhasSelecionadas = [...linhasSelecionadas];
                  novasLinhasSelecionadas.splice(index, 1);
                  setLinhasSelecionadas(novasLinhasSelecionadas);
                  // setarDados({ acordo: { mensalidade: novasLinhasSelecionadas } })
              }
      
          };

          const handleEditar = async({actions}:{actions:{success:()=>void,error?:()=>void}})=>{
     
            toast.promise(
                api.put('/mensalidade/editar',{
                    id_mensalidade_global: mensalidade.id_mensalidade_global,
                    cobranca:mensalidade.cobranca,
                    vencimento:mensalidade.vencimento,
                    valor_principal: mensalidade.valor_principal,
                }),
                {
                    error: 'Erro na tentativa de edição, consulte o TI',
                    loading: 'Realizando edição.....',
                    success:()=> {
                        //dadosassociado?.id_global && carregarDados(dadosassociado?.id_global)
                        actions.success()
                        return 'Edição efetuada com sucesso!'}
                }
            )
         
      
    }


    const handleEstorno = async (motivoEstorno:string,actions:{success:()=>void,error?:()=>void}) => {
        const novoArray = [...(dadosassociado?.mensalidade || [])]
        const index = novoArray.findIndex(item => item.id_mensalidade === mensalidade.id_mensalidade)
        const mensalidadeProxima = novoArray[index + 1]


        if (mensalidadeProxima && mensalidadeProxima.status === 'P') {
            toast.warning('Impossivel estornar, a próxima mensalidade se encontra paga!')
            return
        }
        if(!motivoEstorno){
            toast.warning('Informe o motivo do estorno')
            return
        }
     
             toast.promise(
                api.put('/mensalidade/estorno', {
                    id_mensalidade: mensalidade.id_mensalidade,
                    id_mensalidade_global: mensalidade.id_mensalidade_global,
                    estorno_motivo: motivoEstorno
                }),

                {
                    error: 'Erro na tentativa de estorno, consulte o TI',
                    loading: 'Realizando estorno.....',
                    success:(response)=>{
                        novoArray[index] = response.data
                        setarDadosAssociado({ mensalidade: novoArray })
                        //setOpenModal(false)
                        actions.success()
                        return 'Estorno efetuado com sucesso!'}
                }

            )
    }

  return {
    excluirMensalidade,
    adicionarMensalidade,
    toggleSelecionada,
    setMensalidade,
    handleEditar,
    handleEstorno
  };
};

export default useActionsMensalidades;
