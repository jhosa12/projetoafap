
import ImpressaoCarne from '@/Documents/associado/mensalidade/ImpressaoCarne';
import { api } from '@/lib/axios/apiClient';
import { useReactToPrint } from 'react-to-print';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { IoPrint } from 'react-icons/io5';
import { MdDeleteForever } from 'react-icons/md';
import { RiAddCircleFill } from 'react-icons/ri';
import { toast } from 'react-toastify'
import { AuthContext } from '@/store/AuthContext';
import { ModalMensalidade } from '../../../modals/admContrato/historico/modalmensalidade';
//import { Scanner } from './modalScanner';
import { ModalEditarMensalidade } from '../../../modals/admContrato/historico/modalEditarMensalidade';
import { ModalExcluirMens } from '../../../modals/admContrato/historico/modalExcluirMens';
import { AcordoProps, MensalidadeProps } from '@/types/financeiro';
import { ReciboMensalidade } from '@/Documents/associado/mensalidade/Recibo';
import pageStyle from '@/utils/pageStyle';
import { Button, ButtonGroup, Popover, Table } from 'flowbite-react';
import { PopoverVencimento } from './popoverVencimento';
import { PopoverReagendamento } from './popoverReagendamento';
import ModalBaixaMensalidade from '@/pages/dashboard/formasPag';
import { LuArrowDown, LuArrowDownUp, LuArrowUp } from 'react-icons/lu';
import { Input } from '@/components/ui/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import useApiPost from '@/hooks/useApiPost';
import useApiPut from '@/hooks/useApiPut';




export interface SetAssociadoProps {
    mensalidade: Partial<MensalidadeProps>,
    mensalidadeAnt: Partial<MensalidadeProps>,
    id_associado: number,
    closeModalPlano: boolean
}

interface DadosAssociadoGeral {
    nome: string,
    id_empresa: string,
    endereco: string,
    situacao: string,
    plano: string
    bairro: string,
    numero: number,
    cidade: string,
    uf: string,
    id_contrato_global: number | null,
    id_global: number | null,
    id_contrato: number,
    id_associado: number,
    arrayMensalidade: Array<MensalidadeProps>,
    arrayAcordo: Array<AcordoProps>
    valor_mensalidade: number,
    acrescimo:number|null,
    decrescimo:number|null,
    id_plano: number|null

}

interface DadosProps {
    usuario: { id?: string, nome: string }
    carregarDados: (id: number) => Promise<void>
    setarDados: (fields: Partial<SetAssociadoProps>) => void
    dados: SetAssociadoProps
    dadosAssociado: DadosAssociadoGeral
}

export function HistoricoMensalidade({ dadosAssociado, carregarDados, usuario }: DadosProps) {
    const [checkMensal, setCheck] = useState(false)
    const [linhasSelecionadas, setLinhasSelecionadas] = useState<Array<Partial<MensalidadeProps>>>([]);
    const componentRef = useRef<ImpressaoCarne>(null);
    const { setarDadosAssociado, permissoes, infoEmpresa } = useContext(AuthContext)
    const [mensalidadeSelect, setMensalidade] = useState<Partial<MensalidadeProps>>();
    const componentRecibo = useRef<ReciboMensalidade>(null)
    const [mensalidadeRecibo, setMensalidadeRecibo] = useState<Partial<MensalidadeProps>>()
    const [openModal, setModal] = useState<{ [key: string]: boolean }>({
        excluir: false,
        baixar: false,
        editar: false,
        recibo: false
    })



    const imprimirRecibo = useReactToPrint({
        pageStyle: pageStyle,
        documentTitle: 'RECIBO MENSALIDADE',
        content: () => componentRecibo.current,
        onBeforeGetContent: () => setModal({ recibo: true }),  // Ativa antes da impressão
        onAfterPrint: () => setMensalidadeRecibo(undefined),        // Desativa após a impressão

    })


    useEffect(() => {
        mensalidadeRecibo?.id_mensalidade_global && imprimirRecibo()
    }, [mensalidadeRecibo?.id_mensalidade_global])



    const imprimirCarne = useReactToPrint({
        pageStyle: pageStyle,
        documentTitle: 'CARNÊ ASSOCIADO',
        content: () => componentRef.current,
        onBeforeGetContent: () => setModal({ recibo: true }),  // Ativa antes da impressão
        onAfterPrint: () => setModal({ recibo: false }),        // Desativa após a impressão
    })




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

    const excluirMesal = useCallback(async () => {
        if (!linhasSelecionadas) {
            toast.info("Selecione uma mensalidade");
            return;
        }

        linhasSelecionadas?.map((mensalidade) => {
            if (mensalidade.status === 'P') {
                toast.warn('Mensalidade Paga! Para excluir solite ao gerente');
                return;
            }

        })


        try {
            const response = await toast.promise(
                api.delete('/mensalidade/delete', {
                    data: {
                        mensalidades: linhasSelecionadas
                    }
                }),
                {
                    pending: `Efetuando`,
                    success: `Excluida com sucesso`,
                    error: `Erro ao efetuar exlusão`
                }

            )




            dadosAssociado.id_global && await carregarDados(dadosAssociado.id_global)
            // setarDados({ mensalidade: {} })
            // setarDadosAssociado({mensalidade:mensalidades})
            // setOpenExcluir(false)
            setModal({ excluir: false })
            setLinhasSelecionadas([])
            // setarDados({ acordo: { mensalidade: [], id_acordo: 0 } })
        } catch (err) {
            console.log('Erro ao excluir')
        }
    }, [linhasSelecionadas, dadosAssociado.id_global]

    )



    const adicionarMensalidade = useCallback(async () => {
        const ultimaMensalidade = dadosAssociado.arrayMensalidade && dadosAssociado?.arrayMensalidade[dadosAssociado?.arrayMensalidade?.length - 1]
        const vencimento = new Date(ultimaMensalidade?.vencimento ? ultimaMensalidade?.vencimento : '')
        const proxData = vencimento.setMonth(vencimento.getMonth() + 1)
        try {
            const response = await toast.promise(
                api.post('/mensalidade/adicionar', {
                    id_contrato_global: dadosAssociado.id_contrato_global,
                    id_global: dadosAssociado.id_global,
                    id_contrato: dadosAssociado.id_contrato,
                    id_associado: dadosAssociado.id_associado,
                    status: 'A',
                    valor_principal: dadosAssociado.valor_mensalidade,
                    parcela_n: ultimaMensalidade?.parcela_n && ultimaMensalidade?.parcela_n + 1,
                    vencimento: new Date(proxData),
                    cobranca: new Date(proxData),
                    referencia: `${String(new Date(proxData).getMonth() + 1).padStart(2, '0')}/${new Date(proxData).getFullYear() % 100}`,
                    id_empresa: dadosAssociado?.id_empresa
                }),
                {
                    pending: `Efetuando`,
                    success: `Mensalidade Adicionada`,
                    error: `Erro ao gerar mensalidade`
                }

            )
            // carregarDados()
            setLinhasSelecionadas([])
            //  setarDados({ acordo: { mensalidade: [], id_acordo: 0 } })

            setarDadosAssociado({ ...dadosAssociado, mensalidade: [...dadosAssociado.arrayMensalidade, response.data] })

        } catch (err) {
            toast.error('Erro ao Adicionar nova parcela')
            //  console.log(err)
        }

    }, [dadosAssociado]
    )




    return (
        <div className="flex flex-col w-full">




            {mensalidadeRecibo?.id_mensalidade && <div style={{ display: 'none' }} >
                <ReciboMensalidade
                    infoEmpresa={infoEmpresa}
                    ref={componentRecibo}
                    associado={dadosAssociado.nome}
                    contrato={dadosAssociado.id_contrato}
                    n_doc={mensalidadeRecibo?.n_doc ?? ''}
                    referencia={mensalidadeRecibo?.referencia ?? ''}
                    valor={mensalidadeRecibo?.valor_principal ?? 0}
                    vencimento={mensalidadeRecibo?.vencimento ?? null}
                    data_pgto={mensalidadeRecibo?.data_pgto ?? new Date()}
                    referente={`Mensalidade ${mensalidadeRecibo?.n_doc} com referência ${mensalidadeRecibo?.referencia}`}
                />
            </div>}

            {openModal.recibo &&
                <div style={{ display: 'none' }}>
                    <ImpressaoCarne
                        infoEmpresa={infoEmpresa}
                        ref={componentRef}
                        arrayMensalidade={linhasSelecionadas.length > 0 ? linhasSelecionadas : dadosAssociado.arrayMensalidade?.filter((item) => item.status !== 'P')}
                        dadosAssociado={{
                            nome: dadosAssociado.nome,
                            endereco: dadosAssociado.endereco,
                            bairro: dadosAssociado.bairro,
                            cidade: dadosAssociado.cidade,
                            id_contrato: dadosAssociado.id_contrato,
                            numero: Number(dadosAssociado.numero),
                            uf: dadosAssociado.uf,
                            plano: dadosAssociado.plano
                        }}
                    />

                </div>
            }


            {/*openScanner && <Scanner verficarTicket={verificarBaixa} openModal={openScanner} setModal={setOpenScanner}   />*/}

            {openModal.editar && <ModalEditarMensalidade mensalidade={mensalidadeSelect ?? {}} openModal={openModal.editar} setMensalidade={setMensalidade} setOpenModal={() => setModal({ editar: false })} />}

            {openModal.excluir && <ModalExcluirMens openModal={openModal.excluir} setOpenModal={() => setModal({ excluir: false })} handleExcluirMensalidade={excluirMesal} />}

            <div className="flex w-full  gap-2">
                <label className="relative inline-flex w-[130px] justify-center  items-center mb-1 cursor-pointer">
                    <input disabled={!permissoes.includes('ADM1.2.10')} checked={checkMensal} onChange={() => setCheck(!checkMensal)} type="checkbox" value="2" className="sr-only peer disabled:cursor-not-allowed" />
                    <div className="  w-7 h-4 rounded-full peer bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[7px] after:start-[12px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-xs font-medium">Exibir Pagas</span>
                </label>
                <ButtonGroup>
                    <Button disabled={!permissoes.includes('ADM1.2.1')} onClick={adicionarMensalidade} type="button" color='light' size='xs'><RiAddCircleFill className='mr-1 h-4 w-4' /> Adicionar</Button>

                    <PopoverReagendamento setSelecionadas={setLinhasSelecionadas} id_usuario={usuario?.id} mensalidades={linhasSelecionadas} id_global={dadosAssociado.id_global} />

                    <Button type='button' onClick={imprimirCarne} color='light' size='xs'>  <IoPrint className='mr-1 h-4 w-4' /> Imprimir</Button>

                    <PopoverVencimento id_global={dadosAssociado.id_global} />
                    <PopoverAcresDecres
                            permissions={permissoes}
                            acrescimo={dadosAssociado.acrescimo}
                            decrescimo={dadosAssociado.decrescimo}
                            id_global={dadosAssociado.id_global}
                            id_plano={dadosAssociado.id_plano}
                            id_contrato_global={dadosAssociado.id_contrato_global}
                            atualizar={()=>carregarDados(Number(dadosAssociado.id_global))}
                    />

                    <Button disabled={!permissoes.includes('ADM1.2.3')} onClick={() => setModal({ excluir: true })} type="button" color='light' size='xs'><MdDeleteForever className='mr-1 h-4 w-4' /> Excluir</Button>
                </ButtonGroup>



            </div>
            <div className="flex w-full overflow-auto mt-2 px-2 max-h-[calc(100vh-190px)]">
                <table
                    className="block w-full overflow-y-auto overflow-x-auto text-xs text-center rtl:text-center border-collapse  ">
                    <thead className="sticky w-full top-0  text-xs   bg-white ">
                        <tr >
                            <th scope="col" className="px-6 py-1">
                                NP
                            </th>
                            <th scope="col" className=" px-6 py-1">
                                VENC.
                            </th>
                            <th scope="col" className=" px-6 py-1">
                                REF
                            </th>
                            <th scope="col" className="px-6 py-1">
                                COBRANÇA
                            </th>
                            <th scope="col" className="px-6 py-1">
                                VALOR
                            </th>
                            <th scope="col" className="px-6 py-1">
                                STATUS
                            </th>
                            <th scope="col" className=" px-6 py-1">
                                PAG.
                            </th>
                            <th scope="col" className=" px-6 py-1">
                                HR PAG.
                            </th>
                            <th scope="col" className=" px-6 py-1">
                                USUÁRIO
                            </th>
                            <th scope="col" className=" px-6 py-1">
                                VAL. PAGO
                            </th>
                            <th scope="col" className=" px-6 py-1">
                                FORMA
                            </th>
                            <th scope="col" className=" px-6 py-1">
                                ATRASO
                            </th>
                            <th scope="col" className="px-12 py-1">

                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y ' >


                        {Array.isArray(dadosAssociado?.arrayMensalidade) && dadosAssociado?.arrayMensalidade?.map((item, index) => {


                            return (
                                checkMensal ?

                                    (

                                        <tr key={index}
                                            onClick={() => toggleSelecionada(item)}
                                            className={`  text-[10px] font-semibold text-black ${calcularDiferencaEmDias(new Date(), new Date(item.vencimento)) >= 1 && item.status === 'A' && "text-red-600"}  ${linhasSelecionadas.some(linha => linha.id_mensalidade === item.id_mensalidade) ? "bg-gray-300" : ""}  ${item.status === 'P' && "text-blue-600"}   hover:bg-gray-300 hover:text-black hover:cursor-pointer }`}>
                                            <th scope="row" className={`px-5 py-1  `}>
                                                {item.parcela_n}
                                            </th>
                                            <td className={`px-2 py-1 `}>
                                                {item.vencimento && new Date(item.vencimento).toLocaleDateString('pt', { timeZone: 'UTC' })}

                                            </td>
                                            <td className="px-2 py-1">
                                                {item.referencia}
                                            </td>
                                            <td className="px-5 py-1">
                                                {item.cobranca && new Date(item.cobranca).toLocaleDateString('pt', { timeZone: 'UTC' })}
                                            </td>
                                            <td className="px-3 py-1">
                                                {Number(item.valor_principal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </td>
                                            <td className={`px-4 py-1  font-bold ${item.status !== 'P' && "text-red-600"}`}>
                                                {item.status}
                                            </td>
                                            <td className="px-4 py-1">
                                                {item.data_pgto ? new Date(item.data_pgto).toLocaleDateString('pt', { timeZone: 'UTC' }) : ''}
                                            </td>
                                            <td className="px-4 py-1">
                                                {item.hora_pgto}
                                            </td>
                                            <td className="px-6 py-1 whitespace-nowrap">
                                                {item.usuario?.toUpperCase()}
                                            </td>
                                            <td className={`px-6 py-1`}>
                                                {Number(item.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </td>
                                            <td className="px-4 py-1">
                                                {item.form_pagto}
                                            </td>

                                            <td className="px-4 py-1">
                                                {calcularDiferencaEmDias(new Date(), new Date(item.vencimento)) <= 0 ? 0 : calcularDiferencaEmDias(new Date(), new Date(item.vencimento))}
                                            </td>
                                            <td className={`inline-flex items-center px-4 py-1 space-x-2 whitespace-nowrap  ${new Date(item.vencimento) < new Date() && item.status === 'A' ? "text-red-600" : 'text-blue-600'}`}>

                                                <button onClick={(event) => {
                                                    event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                                                    // setOpenEditar(true)
                                                    setModal({ editar: true })
                                                    setMensalidade({ ...item, valor_total: item.status === 'A' ? item.valor_principal : item.valor_total })
                                                }} className={`  hover:underline `}>Editar</button>
                                                {item.status !== 'P' && <button onClick={(event) => {
                                                    event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                                                    if (dadosAssociado.situacao === 'INATIVO') return toast.warning('Contrato inativo, impossível baixar mensalidade')
                                                    // setModalMens(true)
                                                    setModal({ baixar: true })
                                                    setMensalidade({ ...item, valor_total: item.status === 'A' || item.status === 'R' || item.status === 'R' ? item.valor_principal : item.valor_total, data_pgto: item.data_pgto ? item.data_pgto : new Date() })
                                                }} className={`hover:underline`}>Baixar</button>}

                                                <button type="button" className="hover:underline" onClick={(e) => { e.stopPropagation(); setMensalidadeRecibo({ ...item, data_pgto: item.data_pgto ? item.data_pgto : new Date() }) }} >
                                                    Recibo

                                                </button>
                                            </td>
                                        </tr>
                                    ) : item.status !== 'P' && (
                                        <tr key={index}
                                            onClick={() => toggleSelecionada(item)}
                                            className={`font-semibold text-[10px]  text-black ${calcularDiferencaEmDias(new Date(), new Date(item.vencimento)) >= 1 && "text-red-600"}   ${linhasSelecionadas.some(linha => linha.id_mensalidade === item.id_mensalidade) ? "bg-gray-300" : ""}   hover:bg-gray-300 hover:text-black hover:cursor-pointer  }`}>
                                            <td className="px-5 py-1   ">
                                                {item.parcela_n}
                                            </td>
                                            <td className="px-2 py-1">
                                                {new Date(item.vencimento).toLocaleDateString('pt', { timeZone: 'UTC' })}

                                            </td>
                                            <td className="px-2 py-1">
                                                {item.referencia}
                                            </td>
                                            <td className="px-5 py-1">
                                                {new Date(item.cobranca).toLocaleDateString('pt', { timeZone: 'UTC' })}
                                            </td>
                                            <td className="px-3 py-1">
                                                {Number(item.valor_principal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </td>
                                            <td className={`px-4 py-1  font-bold text-red-600`}>
                                                {item.status}
                                            </td>
                                            <td className="px-4 py-1">
                                                {item.data_pgto ? new Date(item.data_pgto).toLocaleDateString('pt', { timeZone: 'UTC' }) : ''}
                                            </td>
                                            <td className="px-4 py-1">
                                                {item.hora_pgto}
                                            </td>
                                            <td className="px-6 py-1 whitespace-nowrap">
                                                {item.usuario?.toUpperCase()}
                                            </td>
                                            <td className={`px-6 py-1`}>
                                                {Number(item.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </td>
                                            <td className="px-4 py-1">
                                                {item.form_pagto}
                                            </td>
                                            <td className="px-4 py-1">
                                                {calcularDiferencaEmDias(new Date(), new Date(item.vencimento)) <= 0 ? 0 : calcularDiferencaEmDias(new Date(), new Date(item.vencimento))}
                                            </td>
                                            <td className={`px-4 py-1 space-x-2 whitespace-nowrap ${new Date(item.vencimento) < new Date() && item.status === 'A' ? "text-red-600" : 'text-blue-600'}`}>
                                                <button onClick={(event) => {
                                                    event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                                                    // setOpenEditar(true),
                                                    setModal({ editar: true })
                                                    setMensalidade({ ...item, valor_total: item.status === 'A' ? item.valor_principal : item.valor_total })
                                                }} className={`hover:underline `}>Editar</button>


                                                {item.status !== 'P' && <button onClick={(event) => {
                                                    event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                                                    if (dadosAssociado.situacao === 'INATIVO') return toast.warning('Contrato inativo, impossível baixar mensalidade')
                                                    //setModalMens(true)
                                                    setModal({ baixar: true })
                                                    setMensalidade({ ...item, valor_total: item.status === 'A' || item.status === 'E' || item.status === 'R' ? item.valor_principal : item.valor_total, data_pgto: item.data_pgto ? item.data_pgto : new Date() })
                                                }} className={`  hover:underline`}>Baixar</button>}

                                                <button type="button" className='hover:underline' onClick={(e) => { e.stopPropagation(); setMensalidadeRecibo({ ...item, data_pgto: item.data_pgto ? item.data_pgto : new Date() }) }} >
                                                    Recibo

                                                </button>
                                            </td>
                                        </tr>

                                    )
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {openModal.baixar && <ModalMensalidade
                mensalidade={{
                    associado: { ...dadosAssociado, mensalidade: dadosAssociado.arrayMensalidade },
                    aut: mensalidadeSelect?.aut,
                    banco_dest: mensalidadeSelect?.banco_dest,
                    contrato: { situacao: dadosAssociado.situacao },
                    data_pgto: mensalidadeSelect?.data_pgto,
                    id_mensalidade_global: mensalidadeSelect?.id_mensalidade_global,
                    form_pagto: mensalidadeSelect?.form_pagto,
                    id_contrato: mensalidadeSelect?.id_contrato,
                    id_mensalidade: mensalidadeSelect?.id_mensalidade,
                    valor_metodo: mensalidadeSelect?.valor_metodo,
                    valor_total: mensalidadeSelect?.valor_total,
                    referencia: mensalidadeSelect?.referencia,
                    vencimento: mensalidadeSelect?.vencimento,
                    status: mensalidadeSelect?.status,
                    valor_principal: mensalidadeSelect?.valor_principal
                }}
                handleAtualizar={async () => { await carregarDados(Number(dadosAssociado.id_global)); setLinhasSelecionadas([]) }}
                openModal={openModal.baixar}
                setOpenModal={() => setModal({ baixar: false })}
            />
            }

            {/*openModal.baixar &&   <ModalBaixaMensalidade

mensalidade={{
    associado:{...dadosAssociado,mensalidade:dadosAssociado.arrayMensalidade},
    aut:mensalidadeSelect?.aut,
    banco_dest:mensalidadeSelect?.banco_dest,
    contrato:{situacao:dadosAssociado.situacao},
    data_pgto:mensalidadeSelect?.data_pgto,
    id_mensalidade_global:mensalidadeSelect?.id_mensalidade_global,
    form_pagto:mensalidadeSelect?.form_pagto,
    id_contrato:mensalidadeSelect?.id_contrato,
    id_mensalidade:mensalidadeSelect?.id_mensalidade,
    valor_metodo:mensalidadeSelect?.valor_metodo,
    valor_total:mensalidadeSelect?.valor_total,
    referencia:mensalidadeSelect?.referencia,
    vencimento:mensalidadeSelect?.vencimento,
    status:mensalidadeSelect?.status,
    valor_principal:mensalidadeSelect?.valor_principal
   }} 
    handleAtualizar={async()=>{ await carregarDados(Number(dadosAssociado.id_global));setLinhasSelecionadas([])}}
    openModal={openModal.baixar}
     setOpenModal={()=>setModal({baixar:false})}
/>*/}



        </div>
    )
}


function calcularDiferencaEmDias(data1: Date, data2: Date) {
    // Convertendo as datas para objetos Date

    const timestamp1 = data1.getTime();
    const timestamp2 = data2.getTime();

    // Calculando a diferença em milissegundos
    const diferencaEmMilissegundos = timestamp1 - timestamp2;

    // Convertendo a diferença em dias (1 dia = 24 horas x 60 minutos x 60 segundos x 1000 milissegundos)
    const diferencaEmDias = Math.ceil(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));

    return diferencaEmDias;
}






interface ReqProps{
    id_plano:number|null,
    id_global:number|null,
    id_contrato_global:number|null,
    acrescimo:number|null,
    decrescimo:number|null,
   
}
interface PopoverProps extends ReqProps{
    atualizar:()=>Promise<void>
    permissions:Array<string>
}




const PopoverAcresDecres = ({
    id_plano,
    id_global,
    id_contrato_global,
    acrescimo,
    decrescimo,
    atualizar,
    permissions
}:PopoverProps)=>{
    const {register,handleSubmit} = useForm<{acrescimo:number|null,decrescimo:number|null}>({
        defaultValues:{acrescimo:acrescimo,decrescimo:decrescimo}
    })
    const {postData} = useApiPut<any,ReqProps>('/mensalidade/acrescimoDecrescimo')


    const onSubmit:SubmitHandler<{acrescimo:number|null,decrescimo:number|null}> = async(data)=>{
        const res = await postData({id_global,id_contrato_global,id_plano,acrescimo:Number(data.acrescimo),decrescimo:Number(data.decrescimo)})

        await atualizar()
     
    }



    return(
        <Popover
    
         id="popover-basic"
         content={(<form
         onSubmit={handleSubmit(onSubmit)}
         className='flex flex-col p-2 w-32 gap-2'
         >
            <div className='inline-flex items-center gap-1'>
            <LuArrowUp color='green' size={20}/>
            <Input className='h-7' type='number' step={0.01} {...register('acrescimo')} />
            </div>

            <div className='inline-flex items-center gap-1'>
            <LuArrowDown color='red' size={20} />
            <Input  className='h-7' {...register('decrescimo')} type='number' step={0.01}/>
            </div>
          

          
            <Button disabled={!permissions.includes('ADM1.2.11')} className='bg-black' size='xs' type='submit'>Aplicar</Button>
         </form>)}
         >
            <Button className="rounded-none border-s-0 border-y"  onClick={() => {}} type="button" color='light' size='xs'><LuArrowDownUp className='mr-1 h-4 w-4' />Acres./Decres.</Button>
        </Popover>
    )
}





