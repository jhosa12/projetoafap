
import { ModalAcordos } from '@/components/admContrato/historicoMensalidade/modalAcordos';
import ImpressaoCarne from '@/Documents/mensalidade/ImpressaoCarne';
import { api } from '@/services/apiClient';
import { useReactToPrint } from 'react-to-print';
import React, {  useContext, useEffect, useRef, useState } from 'react';
import {  IoPrint } from 'react-icons/io5';
import { MdDeleteForever} from 'react-icons/md';
import { RiAddCircleFill } from 'react-icons/ri';
import { toast } from 'react-toastify'
import { AuthContext } from '@/contexts/AuthContext';
import { ModalMensalidade } from './modalmensalidade';
//import { Scanner } from './modalScanner';
import { ModalEditarMensalidade } from './modalEditarMensalidade';
import { ModalExcluirMens } from './modalExcluirMens';
import { MensalidadeProps } from '@/types/financeiro';
import { ReciboMensalidade } from '@/Documents/mensalidade/Recibo';
import pageStyle from '@/utils/pageStyle';
import { Button, ButtonGroup } from 'flowbite-react';
import { PopoverVencimento } from './popoverVencimento';
import { PopoverReagendamento } from './popoverReagendamento';



interface AcordoProps {
    total_acordo: number,
    data_inicio: Date,
    data_fim: Date,
    realizado_por: string,
    dt_pgto: Date,
    mensalidade: Array<Partial<MensalidadeProps>>,
    status: string,
    descricao: string,
    metodo: string
    closeAcordo: boolean,
    id_acordo: number,
    visibilidade: boolean
}
export interface SetAssociadoProps {
    mensalidade: Partial<MensalidadeProps>,
    mensalidadeAnt: Partial<MensalidadeProps>,
    id_associado: number,
    acordo: Partial<AcordoProps>,
    closeModalPlano: boolean
}

interface DadosAssociadoGeral {
    nome: string,
    id_empresa: string,
    endereco: string,
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
    valor_mensalidade: number

}

interface DadosProps {
    usuario: { id?: string, nome: string }
    carregarDados: (id: number) => Promise<void>
    setarDados: (fields: Partial<SetAssociadoProps>) => void
    dados: SetAssociadoProps
    dadosAssociado: DadosAssociadoGeral
}
export function HistoricoMensalidade({ dadosAssociado, carregarDados, dados, setarDados, usuario }: DadosProps) {
    const [checkMensal, setCheck] = useState(false)
    const [openExcluir, setOpenExcluir] = useState(false)
    const [linhasSelecionadas, setLinhasSelecionadas] = useState<Array<Partial<MensalidadeProps>>>([]);
    const [openModalAcordo, setModalAcordo] = useState({ open: false, visible: false })
    const componentRef = useRef<ImpressaoCarne>(null);
    const { setarDadosAssociado, permissoes } = useContext(AuthContext)
    const [openModalMens, setModalMens] = useState<boolean>(false)
    const [mensalidadeSelect, setMensalidade] = useState<Partial<MensalidadeProps>>();
    //const [openScanner,setOpenScanner] =useState<boolean>(false);
    const [openEditar, setOpenEditar] = useState<boolean>(false);
    //  const [abertos, setAbertos] = useState<{ [key: number]: boolean }>({});
    // const [arrayMensal,setArrayMensal] = useState<Array<MensalidadeProps>>([]);
    const [isPrinting, setIsPrinting] = useState(false);
    const componentRecibo = useRef<ReciboMensalidade>(null)
    const [mensalidadeRecibo, setMensalidadeRecibo] = useState<Partial<MensalidadeProps>>()
   



    /*  const TratarArrayMensal = useCallback(
          () => {
            const tratado = dadosAssociado.arrayMensalidade.reduce((acumulador, atual) => {
              const exists = acumulador.some(
                (item) => item.status === 'E' && item.id_acordo === atual.id_acordo && atual.id_acordo!==null
              );
              if (!exists) {
                acumulador.push(atual);
              }
              return acumulador;
            }, [] as Array<MensalidadeProps>);
        
         
           setArrayMensal(tratado);
          },
          [dadosAssociado.arrayMensalidade]
        );
  
        useEffect(()=>{
          TratarArrayMensal()
        },[dadosAssociado.arrayMensalidade])
        */

    {/*  const toogleAberto = (index: number) => {
        setAbertos((prev: { [key: number]: boolean }) => ({
          ...Object.keys(prev).reduce((acc, key) => {
            acc[Number(key)] = false;
            return acc;
          }, {} as { [key: number]: boolean }),
          [index]: !prev[index]
        }));
      };*/
    }




    /*  const verificarBaixa = (scannedCode:string)=>{
          if (!scannedCode) {
              toast.error('Erro ao escanear');
              return;
          }
     
              const mensalidadeScan = dadosAssociado?.arrayMensalidade?.find(item =>
                  item.n_doc === scannedCode && (item.status === 'A' || item.status === 'E'||item.status==='R')
              );
              const primeiraAberta = dadosAssociado.arrayMensalidade.find(item=>item.status==='A'||item.status==='E'||item.status==='R')
              
              if (!mensalidadeScan) {
                  toast.error('Mensalidade inexistente ou já baixada!');
                  return 
              }
              if(primeiraAberta?.id_mensalidade!==mensalidadeScan.id_mensalidade){
                  toast.error('Referencia incorreta')
                  return
              }
  
  
  
  
                  setMensalidade({...mensalidadeScan,valor_total:mensalidadeScan.valor_principal})
                  setModalMens(true)
              
          
  
      }*/


    const imprimirRecibo = useReactToPrint({
        pageStyle: `
            @page {
                margin: 1rem;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                }
                @page {
                    size: auto;
                    margin: 1rem;
                }
                @page {
                    @top-center {
                        content: none;
                    }
                    @bottom-center {
                        content: none;
                    }
                }
            }
        `,
        documentTitle: 'RECIBO MENSALIDADE',
        content: () => componentRecibo.current,
        onBeforeGetContent: () => setIsPrinting(true),  // Ativa antes da impressão
        onAfterPrint: () => setMensalidadeRecibo(undefined),        // Desativa após a impressão

    })


    useEffect(() => {
        mensalidadeRecibo?.id_mensalidade_global && imprimirRecibo()
    }, [mensalidadeRecibo?.id_mensalidade_global])



    const imprimirCarne = useReactToPrint({
        pageStyle:pageStyle,
        documentTitle: 'CARNÊ ASSOCIADO',
        content: () => componentRef.current,
        onBeforeGetContent: () => setIsPrinting(true),  // Ativa antes da impressão
        onAfterPrint: () => setIsPrinting(false),        // Desativa após a impressão
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
            setarDados({ acordo: { mensalidade: [...linhasSelecionadas, item] } })
        } else {
            // Remove a linha do array se já estiver selecionada
            const novasLinhasSelecionadas = [...linhasSelecionadas];
            novasLinhasSelecionadas.splice(index, 1);
            setLinhasSelecionadas(novasLinhasSelecionadas);
            setarDados({ acordo: { mensalidade: novasLinhasSelecionadas } })
        }

    };

    async function excluirMesal() {
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
            setOpenExcluir(false)
            setLinhasSelecionadas([])
            setarDados({ acordo: { mensalidade: [], id_acordo: 0 } })
        } catch (err) {
            console.log(err)
        }
    }





    async function adicionarMensalidade() {
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
                    id_empresa:dadosAssociado?.id_empresa
                }),
                {
                    pending: `Efetuando`,
                    success: `Mensalidade Adicionada`,
                    error: `Erro ao gerar mensalidade`
                }

            )
            // carregarDados()
            setLinhasSelecionadas([])
            setarDados({ acordo: { mensalidade: [], id_acordo: 0 } })

            setarDadosAssociado({ ...dadosAssociado, mensalidade: [...dadosAssociado.arrayMensalidade, response.data] })

        } catch (err) {
            toast.error('Erro ao Adicionar nova parcela')
            console.log(err)
        }

    }





    return (
        <div className="flex flex-col rounded-lg  max-h-[calc(100vh-190px)]    sm:rounded-lg">

            {openModalAcordo.open && (<ModalAcordos
                acordo={dados?.acordo ?? {}}
                contrato={dadosAssociado?.id_contrato ?? 0}
                mensalidade={dadosAssociado?.arrayMensalidade ?? []}
                usuario={{ nome: usuario?.nome ?? '', id: Number(usuario?.id) }}
                closeModal={setModalAcordo}
                associado={dadosAssociado?.id_associado ?? 0}
                carregarDados={carregarDados}
                openModal={openModalAcordo}
                id_contrato_global={dadosAssociado?.id_contrato_global ?? 0}
                id_global={dadosAssociado?.id_global ?? 0}
            />)}


            {mensalidadeRecibo?.id_mensalidade && <div style={{ display: 'none' }} >
                <ReciboMensalidade
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

            {isPrinting &&
                <div style={{ display: 'none' }}>
                    <ImpressaoCarne
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

            {openEditar && <ModalEditarMensalidade mensalidade={mensalidadeSelect ?? {}} openModal={openEditar} setMensalidade={setMensalidade} setOpenModal={setOpenEditar} />}

            {openExcluir && <ModalExcluirMens openModal={openExcluir} setOpenModal={setOpenExcluir} handleExcluirMensalidade={excluirMesal} />}



      

            <div className="flex w-full  gap-2">
                <label className="relative inline-flex w-[130px] justify-center  items-center mb-1 cursor-pointer">
                    <input disabled={!permissoes.includes('ADM1.2.10')} checked={checkMensal} onChange={() => setCheck(!checkMensal)} type="checkbox" value="2" className="sr-only peer disabled:cursor-not-allowed" />
                    <div className="  w-7 h-4 rounded-full peer bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[7px] after:start-[17px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-xs font-medium">Exibir Pagas</span>
                </label>
                <ButtonGroup>
                <Button disabled={!permissoes.includes('ADM1.2.1')} onClick={adicionarMensalidade} type="button" color='light' size='xs'><RiAddCircleFill className='mr-1 h-4 w-4' /> Adicionar</Button>

               <PopoverReagendamento setSelecionadas={setLinhasSelecionadas} id_usuario={usuario?.id} mensalidades={linhasSelecionadas} id_global={dadosAssociado.id_global}/>

                <Button type='button' onClick={imprimirCarne} color='light' size='xs'>  <IoPrint className='mr-1 h-4 w-4' /> Imprimir</Button>
              
                <PopoverVencimento  id_global={dadosAssociado.id_global}  />
             
               
                <Button disabled={!permissoes.includes('ADM1.2.3')} onClick={() => setOpenExcluir(!openExcluir)} type="button" color='light' size='xs'><MdDeleteForever className='mr-1 h-4 w-4' /> Excluir</Button>
            </ButtonGroup>

            </div>
            <div className="flex w-full p-2 max-h-[calc(100vh-205px)]">
                <table
                    className="block w-full overflow-y-auto overflow-x-auto text-xs text-center rtl:text-center border-collapse  text-gray-600">
                    <thead className="sticky w-full top-0  text-xs   bg-gray-100 text-gray-600">
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
                                DATA AGEND.
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
                                <span>AÇÕES</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody  >


                        {Array.isArray(dadosAssociado?.arrayMensalidade) && dadosAssociado?.arrayMensalidade?.map((item, index) => {


                            return (

                                checkMensal ?

                                    (

                                        <tr  key={index}
                                            onClick={() => toggleSelecionada(item)}
                                            className={`font-semibold divide-y text-black ${calcularDiferencaEmDias(new Date(), new Date(item.vencimento)) >= 1 && item.status === 'A' && "text-red-600"}  ${linhasSelecionadas.some(linha => linha.id_mensalidade === item.id_mensalidade) ? "bg-gray-300" : "bg-gray-50"}  ${item.status === 'P' && "text-blue-600"}   hover:bg-gray-300 hover:text-black  }`}>
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
                                            <td className={`inline-flex items-centerpx-4 py-1 space-x-2 whitespace-nowrap`}>

                                                <button onClick={(event) => {
                                                    event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                                                    setOpenEditar(true)
                                                    setMensalidade({ ...item, valor_total: item.status === 'A' ? item.valor_principal : item.valor_total })
                                                }} className={`  hover:underline ${new Date(item.vencimento) < new Date() && item.status === 'A' ? "text-red-500" : 'text-blue-600'}`}>Editar</button>
                                                <button onClick={(event) => {
                                                    event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                                                    setModalMens(true)
                                                    setMensalidade({ ...item, valor_total: item.status === 'A' || item.status === 'R' || item.status === 'R' ? item.valor_principal : item.valor_total, data_pgto: item.data_pgto ? item.data_pgto : new Date() })
                                                }} className={`   hover:underline ${new Date(item.vencimento) < new Date() && item.status === 'A' ? "text-red-500" : 'text-blue-600'}`}>Baixar</button>

                                                <button type="button" className='text-blue-600 hover:underline' onClick={(e) => { e.stopPropagation(); setMensalidadeRecibo({ ...item, data_pgto: item.data_pgto ? item.data_pgto : new Date() }) }} >
                                                    Recibo

                                                </button>
                                            </td>
                                        </tr>
                                    ) : item.status !== 'P' && (
                                        <tr key={index}
                                            onClick={() => toggleSelecionada(item)}
                                            className={`font-semibold  divide-y text-black ${calcularDiferencaEmDias(new Date(), new Date(item.vencimento)) >= 1 && "text-red-600"}   ${linhasSelecionadas.some(linha => linha.id_mensalidade === item.id_mensalidade) ? "bg-gray-300" : ""}   hover:bg-gray-300 hover:text-black  }`}>
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
                                            <td className=" px-4 py-1 space-x-2 whitespace-nowrap">
                                                <button onClick={(event) => {
                                                    event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                                                    setOpenEditar(true),
                                                        setMensalidade({ ...item, valor_total: item.status === 'A' ? item.valor_principal : item.valor_total })
                                                }} className={`hover:underline ${new Date(item.vencimento) < new Date() && item.status === 'A' ? "text-red-600" : 'text-blue-600'}`}>Editar</button>


                                                <button onClick={(event) => {
                                                    event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                                                    setModalMens(true)
                                                    setMensalidade({ ...item, valor_total: item.status === 'A' || item.status === 'E' || item.status === 'R' ? item.valor_principal : item.valor_total, data_pgto: item.data_pgto ? item.data_pgto : new Date() })
                                                }} className={`  hover:underline ${new Date(item.vencimento) < new Date() && item.status === 'A' ? "text-red-600" : 'text-blue-600'}`}>Baixar</button>



                                                
<button type="button" className='text-blue-600 hover:underline' onClick={(e) => { e.stopPropagation(); setMensalidadeRecibo({ ...item, data_pgto: item.data_pgto ? item.data_pgto : new Date() }) }} >
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

            {openModalMens && <ModalMensalidade 
           mensalidade={{
            associado:{...dadosAssociado,mensalidade:dadosAssociado.arrayMensalidade},
            aut:mensalidadeSelect?.aut,
            banco_dest:mensalidadeSelect?.banco_dest,
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
            handleAtualizar={()=>carregarDados(Number(dadosAssociado.id_global))}
            openModal={openModalMens}
             setOpenModal={setModalMens}
              />
             }
        
        
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


