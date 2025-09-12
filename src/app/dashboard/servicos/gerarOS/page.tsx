'use client';


import { api } from "@/lib/axios/apiClient";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/store/AuthContext";
import { IoMdSearch, IoMdSettings } from "react-icons/io";
import { MdAccessTimeFilled } from "react-icons/md";
import { HiClipboardList } from "react-icons/hi";
import { ModalBusca } from "@/components/modals/modalBusca/modalBusca";
import "react-datepicker/dist/react-datepicker.css";
import { DadosPlano } from "@/app/dashboard/servicos/_components/obitos/dadosPlano";
import { DadosFalecido } from "@/app/dashboard/servicos/_components/obitos/dadosFalecido";
import { DadosDeclarante } from "@/app/dashboard/servicos/_components/obitos/dadosDeclarante";
import { DadosObito } from "@/app/dashboard/servicos/_components/obitos/dadosObito";
import { ProdutosServicos } from "@/app/dashboard/servicos/_components/obitos/produtosServicos";
import { ItensUsados } from "@/app/dashboard/servicos/_components/obitos/itensUsados";
import { DadosVelorio } from "@/app/dashboard/servicos/_components/obitos/dadosVelorio";
import DocumentacaoOS from "@/app/dashboard/servicos/_components/obitos/documentacao";
import { ModalDependente } from "@/app/dashboard/servicos/_components/obitos/modalDependentes";
import { FaCalendarAlt } from "react-icons/fa";
import { toast } from "sonner";
import { ObitoProps } from "../_types/obito";
import { DadosCadastroProps } from "../../admcontrato/_types/dados-cadastro";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  } from "@/components/ui/tabs"
  import { Button } from "@/components/ui/button"
  import { Checkbox } from "@/components/ui/checkbox"



interface EstoqueProps {
    id_produto: number,
    id_estoque: number,
    data: Date,
    estado: string,
    produto: string,
    total: number
    fornecedor: string
}

interface ArrayProps {
    id_produto: number | null,
    descricao_item: string;
    valor_unit: number | null,
    quantidade: number | null,
    desconto: number | null,
    acrescimo: number | null,
    valor_total: number | null
}

interface ListaProdutos {

    id_produto: number,
    descricao: string,
    unidade: string,
    valor_custo: number,
    valor_venda: number,
    quantidade: number,
    margem_lucro: number,
    valor_aluguel: number,
    est_inicial: number,
    est_entradas: number,
    est_saidas: number,
    est_saldo: number,
    situacao: string,
    data_inc: Date,
    grupo: string,
    tipo: string,
    taxa_conval: number,
    estoque: Array<EstoqueProps>
}


export default function GerarOS() {

    const { usuario, signOut, dadosassociado, limparDados, carregarDados } = useContext(AuthContext)
    const [listaProduto, setListaProdutos] = useState<Partial<ArrayProps>>({ descricao_item: "" });
    const [selectProdutos, setselectProdutos] = useState<Array<ListaProdutos>>([]);
    const [total, setTotal] = useState<number>();
    const [titular, setTitular] = useState(false);
    const [dependente, setDependente] = useState(false);
    const [modalDependente, setModalDependente] = useState(false);
    const [componenteMounted, setMounted] = useState(false);
    const [particular, setParticular] = useState(false);
    const [indexTab, setIndex] = useState<number>(0)
    const [visible, setVisible] = useState(false)
    const [servico, setarServico] = useState<Partial<ObitoProps>>({ hr_sepultamento: new Date(), end_hora_falecimento: new Date(), end_hora_informaram: new Date() });
    const [cadastro, setCadastro] = useState<Partial<DadosCadastroProps>>({});

    const handleCheckParticular = () => {
        if (!particular) {
            limparDados()
            setarServico({
                id_contrato: undefined,
                id_titular: undefined
            })
            setParticular(true)
            setTitular(false)
            setDependente(false)
        } else {
            setParticular(false)
        }

    }
    const handleCheckDependente = () => {
        if (!dependente) {
            if (!dadosassociado?.contrato?.id_contrato) {
                toast.info('Realize a busca pelo associado')
                return;
            } else {
                setDependente(true)
                setTitular(false)
                setParticular(false)
                setModalDependente(true)
            }
        } else {
            setDependente(false)
        }

    }


    useEffect(() => {
        limparDados()
    }, [])

    function setarProdutos(fields: Partial<ArrayProps>) {
        setListaProdutos((prev: Partial<ArrayProps>) => {
            if (prev) {
                return { ...prev, ...fields }
            }
            else {
                return { ...fields }
            }

        })

    }
    const handleCheckTitular = () => {
        if (!titular) {
            if (!dadosassociado?.contrato?.id_contrato) {
                toast.info('Realize a busca pelo associado!');

                return
            }
            else {
                setTitular(true)
                setDependente(false)
                setarServico({
                    nome_falecido: dadosassociado?.nome,
                    data_nascimento: dadosassociado?.data_nasc,
                    end_rua: dadosassociado?.endereco,
                    end_bairro: dadosassociado?.bairro,
                    end_numero: String(dadosassociado?.numero),
                    end_cidade: dadosassociado?.cidade,
                    id_contrato: dadosassociado.contrato?.id_contrato,
                    id_titular: dadosassociado.id_associado
                })
            }

        } else setTitular(false)
    }


    function setarFalecidoDependente({ nome, data_nasc }: { nome: string, data_nasc: Date | null }) {
        setarServico({
            nome_falecido: nome,
            data_nascimento: data_nasc,
            id_contrato: dadosassociado?.contrato?.id_contrato
        });
        setModalDependente(false);

    }

    useEffect(() => {
        componenteMounted && dadosassociado?.id_associado && carregarDados(dadosassociado.id_associado);
        setParticular(false);
        setMounted(true)
    }, [cadastro.id_associado])





    useEffect(() => {
        setListaProdutos({ acrescimo: null, desconto: null, descricao_item: "", quantidade: 1, valor_total: null, valor_unit: null })
        const Total = servico.obito_itens?.reduce((total, item) => total = total + Number(item.valor_total), 0)
        setTotal(Total)

    }, [servico.obito_itens])

    useEffect(() => {
        const user = !!usuario
        if (!user) {
            signOut()
            return;
        }
        //   hr_velorio:new Date().toLocaleTimeString('pt-BR',{timeZone:'America/Fortaleza'})
        try {
            listarProdutos()
            if (!servico.id_obitos) {
                carregarCheckList()
            }
        } catch (err) {
            toast.error('Erro ao Listar CheckList')
        }
    }, [usuario])

    async function listarProdutos() {
        const response = await api.get("/estoque/listar")

        setselectProdutos(response.data.produtos)
       
    }

    async function cadastrarObito() {
        const [hours, minutes] = (servico.hr_velorio ?? '').split(':');
        const newDate = new Date();
        newDate.setHours(parseInt(hours));
        newDate.setMinutes(parseInt(minutes));
        if (!servico.nome_falecido || !servico.rd_nome) {
            toast.info("Preencha todos os campos obrigatórios");
            return;
        }

        toast.promise(
            api.post("/obitos/adicionarObito", {
                ...servico, hr_velorio: newDate, obito_itens: servico.obito_itens, tipo_atendimento: particular ? 'PARTICULAR' : 'ASSOCIADO', falecido: titular ? 'TITULAR' : dependente ? 'DEPENDENTE' : undefined,
                status: servico.listacheckida?.find(item => item.status === false) || servico.listacheckvolta?.find(item => item.status === false) ? 'PENDENTE' : 'FECHADO'
            }),
            {
                error: 'Erro ao Realizar Cadastro',
                loading: 'Cadastrando óbito',
                success: (response) => {
                    setarServico({ ...servico, id_obitos: response.data })
                    return 'Cadastrado com sucesso!'
                }
            }
        )

    }




    async function editarObito() {
        toast.promise(
            api.put('/obitos/editarObito', {
                ...servico,
                status: servico.listacheckida?.find(item => item.status === false) || servico.listacheckvolta?.find(item => item.status === false) ? 'PENDENTE' : 'FECHADO'

            }),
            {
                error: 'Erro ao atualizar os dados',
                loading: 'Atualizando dados',
                success: 'Dados atualizados com sucesso'
            }
        )

    }





    async function carregarCheckList() {
        const response = await api.get("/obitos/listarCheckList")
        setarServico({ ...servico, listacheckida: response.data })
        setarServico({ ...servico, listacheckvolta: response.data })
    }
    function deletarProduto(id_ob_itens: number) {


        toast.promise(
            api.delete(`/obitoItens/deletar/${String(id_ob_itens)}`),
            {
                error: 'Erro ao deletar dado',
                success: 'Dado deletado',
                loading: 'Deletando dado....'

            }
        )

    }

    function alterCheckListIda(index: number) {
        if (servico.listacheckida) {
            const novoArra = [...servico.listacheckida];
            novoArra[index].status = !novoArra[index].status;
            setarServico({ ...servico, listacheckida: novoArra })
        }

    }


    function alterCheckListVolta(index: number) {
        if (servico.listacheckvolta) {
            const novoArray = [...servico.listacheckvolta];
            novoArray[index].status = !novoArray[index].status
            setarServico({ ...servico, listacheckvolta: novoArray })
        }

    }




    useEffect(() => {
        if (listaProduto.valor_unit && listaProduto.quantidade) {
            setarProdutos({ valor_total: listaProduto.valor_unit * listaProduto.quantidade })
        }
        if (listaProduto.valor_unit && listaProduto.quantidade) {
            setarProdutos({ valor_total: listaProduto.valor_unit * listaProduto.quantidade + (listaProduto.acrescimo ?? 0) - (listaProduto.desconto ?? 0) })
        }
    }, [listaProduto.quantidade, listaProduto.valor_unit, listaProduto.acrescimo, listaProduto.desconto])

    async function lancarCaixa() {
        const descricoes = servico?.obito_itens?.map(item => `${item.descricao_item} QUANT.: ${item.quantidade}  VALOR: R$${item.valor_total}`);
        const descricaoCompleta = descricoes?.join(' / ')
        toast.promise(
            api.post("/obitos/lancarCaixa", {
                conta: "1.03.006",
                data: new Date(),
                datalanc: new Date(),
                conta_n: "1.03.006",
                descricao: "ENTRADAS DE OUTRAS AGENCIAS AFAP",
                historico: `REFERENTE A COMPRA DE: ${descricaoCompleta}`,
                tipo: 'RECEITA',
                usuario: usuario?.nome,
                valor: total,
                ccustos_id: 2
            }),
            {
                error: 'Erro ao Confirmar Pagamento',
                loading: 'Realizando Recebimento em Caixa',
                success: 'Recebido com sucesso'
            }
        )




    }
    return (
        
      
              <>
                <ModalDependente
                  openModal={modalDependente}
                  setOpenModal={setModalDependente}
                  setarFalecidoDependente={setarFalecidoDependente}
                />
          
                <div className="flex flex-col w-full pl-10 pr-10 pt-2">
                  {/* Header */}
                  <div className="flex flex-row p-1 border-b  border-gray-600">
                    <h1 className="flex w-full font-semibold text-2xl">
                      Gerar Ordem de Serviço
                    </h1>
          
                    <div className="flex flex-row gap-8">
                      <div className="flex items-center">
                        <Checkbox
                          checked={particular}
                          onCheckedChange={handleCheckParticular}
                          className="mr-2"
                        />
                        <label className="text-sm font-medium whitespace-nowrap text-black">
                          PARTICULAR
                        </label>
                      </div>
          
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCadastro({ closeModalPlano: true })}
                      >
                        <IoMdSearch size={20} className="mr-2" />
                        Buscar
                      </Button>
                    </div>
                  </div>
          
                  {/* Tabs */}
                  <div className="flex-col w-full border mt-1 rounded-lg shadow border-gray-700">
                    <Tabs defaultValue="plano" className="w-full">
                      <TabsList className="flex flex-row overflow-x-auto">
                        <TabsTrigger value="plano" className="flex gap-2">
                          <FaCalendarAlt /> Plano
                        </TabsTrigger>
                        <TabsTrigger value="falecido" className="flex gap-2">
                          <MdAccessTimeFilled /> Falecido
                        </TabsTrigger>
                        <TabsTrigger value="declarante" className="flex gap-2">
                          <HiClipboardList /> Declarante
                        </TabsTrigger>
                        <TabsTrigger value="obito" className="flex gap-2">
                          <IoMdSettings /> Dados Óbito
                        </TabsTrigger>
                        <TabsTrigger value="produtos" className="flex gap-2">
                          <IoMdSettings /> Produtos e Serviços
                        </TabsTrigger>
                        <TabsTrigger value="velorio" className="flex gap-2">
                          <IoMdSettings /> Velório
                        </TabsTrigger>
                        <TabsTrigger value="checklist" className="flex gap-2">
                          <IoMdSettings /> CheckList
                        </TabsTrigger>
                        <TabsTrigger value="itens" className="flex gap-2">
                          <IoMdSettings /> Itens Usados
                        </TabsTrigger>
                        <TabsTrigger value="documentacao" className="flex gap-2">
                          <IoMdSettings /> Documentação
                        </TabsTrigger>
                      </TabsList>
          
                      {/* Conteúdo das Tabs */}
                      <TabsContent value="plano">
                        <DadosPlano
                          dados={{
                            nome: dadosassociado?.nome,
                            categoria: dadosassociado?.contrato?.plano,
                            id_associado: dadosassociado?.id_associado,
                            id_contrato: dadosassociado?.contrato?.id_contrato,
                            situacao: dadosassociado?.contrato?.situacao,
                          }}
                        />
                      </TabsContent>
          
                      <TabsContent value="falecido">
                        {!particular && (
                          <div className="inline-flex gap-8 pl-4 pt-1">
                            <div className="flex items-center">
                              <Checkbox
                                checked={titular}
                                onCheckedChange={handleCheckTitular}
                                className="mr-2"
                              />
                              <label className="text-sm font-medium whitespace-nowrap text-gray-600">
                                TITULAR
                              </label>
                            </div>
                            <div className="flex items-center">
                              <Checkbox
                                checked={dependente}
                                onCheckedChange={handleCheckDependente}
                                className="mr-2"
                              />
                              <label className="text-sm font-medium whitespace-nowrap text-gray-600">
                                DEPENDENTE
                              </label>
                            </div>
                          </div>
                        )}
                        <DadosFalecido
                          servico={servico}
                          setarServico={setarServico}
                          check={particular || titular || dependente ? false : true}
                        />
                      </TabsContent>
          
                      <TabsContent value="declarante">
                        <DadosDeclarante servico={servico} setarServico={setarServico} />
                      </TabsContent>
          
                      <TabsContent value="obito">
                        <DadosObito servico={servico} setarServico={setarServico} />
                      </TabsContent>
          
                      <TabsContent value="produtos">
                        <ProdutosServicos
                          deletarProduto={deletarProduto}
                          lancarCaixa={lancarCaixa}
                          listaProduto={listaProduto}
                          obito_itens={servico.obito_itens ?? []}
                          selectProdutos={selectProdutos}
                          setarProdutos={setarProdutos}
                          setarServico={setarServico}
                          total={total ?? 0}
                          id_obito={servico.id_obitos ?? 0}
                        />
                      </TabsContent>
          
                      <TabsContent value="velorio">
                        <DadosVelorio servico={servico} setarServico={setarServico} />
                      </TabsContent>
          
                      <TabsContent value="checklist">
                        {/* Aqui você mantém a estrutura dos checklists, só substituindo os checkboxes pelo de shadcn */}
                        <div className="flex flex-row w-full justify-around rounded-lg p-2 gap-6">
                          <div className="flex flex-col overflow-y-auto w-1/3 text-white p-2 gap-2 rounded-md bg-gray-600 mt-1 mb-1 max-h-[calc(100vh-250px)]">
                            <h1 className="border-b border-gray-500">Checklist Saída</h1>
                            <ul className="flex flex-col gap-2">
                              {servico.listacheckida?.map((it, index) => (
                                <li key={index} className="flex items-center">
                                  <Checkbox
                                    checked={it.status}
                                    onCheckedChange={() => alterCheckListIda(index)}
                                    className="mr-2"
                                  />
                                  <label className="text-sm font-medium whitespace-nowrap text-gray-300">
                                    {it.descricao}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
          
                          <div className="flex flex-col overflow-y-auto w-1/3 text-white p-2 gap-2 rounded-md bg-gray-600 mt-1 mb-1 max-h-[calc(100vh-250px)]">
                            <h1 className="border-b border-gray-500">Checklist Retorno</h1>
                            <ul className="flex flex-col gap-2">
                              {servico.listacheckvolta?.map((item, i) => (
                                <li key={i} className="flex items-center">
                                  <Checkbox
                                    checked={item.status}
                                    onCheckedChange={() => alterCheckListVolta(i)}
                                    className="mr-2"
                                  />
                                  <label className="text-sm font-medium whitespace-nowrap text-gray-300">
                                    {item.descricao}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </TabsContent>
          
                      <TabsContent value="itens">
                        <ItensUsados
                          selectProdutos={selectProdutos}
                          id_obito={Number(servico.id_obitos)}
                          obito_itens={servico.obito_itens ?? []}
                          setarServico={setarServico}
                          atualizarProdutos={listarProdutos}
                        />
                      </TabsContent>
          
                      <TabsContent value="documentacao">
                        <DocumentacaoOS servico={servico} />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </>
            )
          }
          
