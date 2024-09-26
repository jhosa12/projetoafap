
import { ModalAcordos } from '@/components/modalAcordos';
import ImpressaoCarne from '@/Documents/carne/ImpressaoCarne';
import { api } from '@/services/apiClient';
import { useReactToPrint } from 'react-to-print';
import React, { useContext, useRef, useState } from 'react';
import { FaHandshake } from 'react-icons/fa';
import { IoIosClose } from 'react-icons/io';
import { IoPrint } from 'react-icons/io5';
import { MdDeleteForever, MdReceipt } from 'react-icons/md';
import { RiAddCircleFill } from 'react-icons/ri';
import { TbAlertTriangle } from 'react-icons/tb';
import { toast } from 'react-toastify'
import { AuthContext, MensalidadeProps } from '@/contexts/AuthContext';
import { ModalMensalidade } from './modalmensalidade';
import { Scanner } from './modalScanner';
import { ModalEditarMensalidade } from './modalEditarMensalidade';





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
interface SetAssociadoProps{
mensalidade:Partial<MensalidadeProps>,
mensalidadeAnt:Partial<MensalidadeProps>,
id_associado:number,
acordo:Partial<AcordoProps>,
closeModalPlano:boolean
}

interface DadosAssociadoGeral{
    nome:string,
    endereco:string,
    plano:string
    bairro:string,
    numero:number,
    cidade:string,
    uf:string,
    id_contrato_global:number|null,
    id_global:number|null,
    id_contrato:number,
    id_associado:number,
    arrayMensalidade:Array<MensalidadeProps>,
    arrayAcordo:Array<AcordoProps>
    valor_mensalidade:number

}

interface DadosProps{
    usuario:{id:number,nome:string}
    carregarDados:(id:number)=>Promise<void>
    setarDados:(fields:Partial<SetAssociadoProps>)=>void
    dados:SetAssociadoProps
    dadosAssociado:DadosAssociadoGeral
}
export function HistoricoMensalidade({dadosAssociado,carregarDados,dados,setarDados,usuario}:DadosProps) {
    const [checkMensal, setCheck] = useState(false)
    const [excluir, setExcluir] = useState(false)
    const [linhasSelecionadas, setLinhasSelecionadas] = useState<Array<Partial<MensalidadeProps>>>([]);
    const [openModalAcordo,setModalAcordo]= useState({open:false,visible:false})
    const [showSublinhas, setShowSublinhas] = useState<boolean>(false);
    const componentRef =useRef<ImpressaoCarne>(null);
    const {setarDadosAssociado,permissoes} = useContext(AuthContext)
    const [openModalMens,setModalMens]= useState<boolean>(false)
    const [mensalidadeSelect,setMensalidade] = useState<Partial<MensalidadeProps>>();
    const [openScanner,setOpenScanner] =useState<boolean>(false);
    const [openEditar,setOpenEditar] =useState<boolean>(false);
   

    let currentAcordoId: string;


    const verificarBaixa = (scannedCode:string)=>{
        if (!scannedCode) {
            toast.error('Erro ao escanear');
            return;
        }
            const mensalidadeScan = dadosAssociado?.arrayMensalidade?.find(item =>
                item.n_doc === scannedCode && (item.status === 'A' || item.status === 'E')
            );
            const primeiraAberta = dadosAssociado.arrayMensalidade.find(item=>item.status==='A')
            
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
            
        

    }









    const imprimirCarne =useReactToPrint({
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
        documentTitle:'CARNÊ ASSOCIADO',
        content:()=>componentRef.current

   })

    const setarModalAcordo = (fields:{open:boolean,visible:boolean})=>{
        setModalAcordo((prev:{open:boolean,visible:boolean})=>{
            if(prev){
                return {...prev,...fields}
            }else{
                return {...fields}
            }

        })
    }


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

        linhasSelecionadas.map((mensalidade) => {
            if (mensalidade.status === 'P') {
                toast.warn('Mensalidade Paga! Para excluir solite ao gerente');
                return;
            }

        })

        setExcluir(false)
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

        } catch (err) {
            console.log(err)
        }
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
   

    async function adicionarMensalidade() {
        const ultimaMensalidade =dadosAssociado.arrayMensalidade &&  dadosAssociado.arrayMensalidade[dadosAssociado.arrayMensalidade.length - 1]
        const vencimento = new Date(ultimaMensalidade?.vencimento ? ultimaMensalidade?.vencimento : '')
        const proxData = vencimento.setMonth(vencimento.getMonth() + 1)
        try {
          const response =  await toast.promise(
                api.post('/mensalidade/adicionar', {
                    id_contrato_global:dadosAssociado.id_contrato_global,
                    id_global:dadosAssociado.id_global,
                    id_contrato: dadosAssociado.id_contrato,
                    id_associado: dadosAssociado.id_associado,
                    status: 'A',
                    valor_principal: dadosAssociado.valor_mensalidade,
                    parcela_n: ultimaMensalidade?.parcela_n && ultimaMensalidade?.parcela_n + 1,
                    vencimento: new Date(proxData),
                    cobranca: new Date(proxData),
                    referencia: `${String(new Date(proxData).getMonth() + 1).padStart(2, '0')}/${new Date(proxData).getFullYear() % 100}`
                }),
                {
                    pending: `Efetuando`,
                    success: `Mensalidade Adicionada`,
                    error: `Erro ao gerar mensalidade`
                }

            )
           // carregarDados()

            setarDadosAssociado({...dadosAssociado,mensalidade:[...dadosAssociado.arrayMensalidade,response.data]})

        } catch (err) {
            toast.error('Erro ao Adicionar nova parcela')
            console.log(err)
        }

    }





  return (
    <div className="flex flex-col rounded-lg  max-h-[calc(100vh-220px)]    sm:rounded-lg">
  
                {openModalAcordo.open && (<ModalAcordos
                 acordo={dados?.acordo??{}} 
                 contrato={dadosAssociado?.id_contrato??0}
                  mensalidade={dadosAssociado?.arrayMensalidade??[]}
                   usuario={{nome:usuario?.nome??'',id:Number(usuario?.id)}}
                   closeModal={setarModalAcordo}
                   associado={dadosAssociado?.id_associado??0}
                   carregarDados={carregarDados}
                   openModal={openModalAcordo}
                     />)}




                    
  {openScanner && <Scanner verficarTicket={verificarBaixa} openModal={openScanner} setModal={setOpenScanner}   />}

<ModalEditarMensalidade mensalidade={mensalidadeSelect??{}} openModal={openEditar} setMensalidade={setMensalidade} setOpenModal={setOpenEditar}/>


    <div className="flex w-full  gap-2">
    <div style={{display:'none'}}>
    <ImpressaoCarne
    ref={componentRef}
    arrayMensalidade={linhasSelecionadas.length>0?linhasSelecionadas:dadosAssociado.arrayMensalidade}
    dadosAssociado={{nome:dadosAssociado.nome,
        endereco:dadosAssociado.endereco,
        bairro:dadosAssociado.bairro,
        cidade:dadosAssociado.cidade,
        id_contrato:dadosAssociado.id_contrato,
        numero:Number(dadosAssociado.numero),
        uf:dadosAssociado.uf,
        plano:dadosAssociado.plano
    
    }}
    />

    </div>
        <label  className="relative inline-flex w-[130px] justify-center  items-center mb-1 cursor-pointer">
            <input disabled={!permissoes.includes('ADM1.2.10')} checked={checkMensal} onChange={() => setCheck(!checkMensal)} type="checkbox" value="2" className="sr-only peer disabled:cursor-not-allowed" />
            <div  className="  w-9 h-5 rounded-full peer bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[5px] after:start-[7px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium  text-gray-600">Exibir Pagas</span>
        </label>
        <div className="inline-flex rounded-md shadow-sm" role="group">
            <button disabled={!permissoes.includes('ADM1.2.1')}  onClick={adicionarMensalidade} type="button" className="inline-flex items-center px-4 py-1 gap-1 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm font-medium  border  rounded-s-lg  disabled:text-gray-400   bg-gray-200 border-gray-400 text-gray-600 enable:hover:text-white hover:bg-gray-500 ">
                <RiAddCircleFill size={20} />
                Adicionar
            </button>
            <button disabled={!permissoes.includes('ADM1.2.2')} type="button" onClick={() => setarModalAcordo({open:true,visible:true})} className="inline-flex items-center px-4 py-1 gap-1 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed font-medium border-r border-t border-b disabled:text-gray-400  bg-gray-200 border-gray-400 text-gray-600 hover:text-white hover:bg-gray-400">
                <FaHandshake size={20} />
                Acordo
            </button>
            <button disabled={!permissoes.includes('ADM1.2.2')} type="button" onClick={() => setOpenScanner(true)} className="inline-flex items-center px-4 py-1 gap-1 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed font-medium border-r border-t border-b disabled:text-gray-400  bg-gray-200 border-gray-400 text-gray-600 hover:text-white hover:bg-gray-400">
                <MdReceipt size={20} />
                Baixar
            </button>
            
            <button  type="button"  onClick={imprimirCarne}  className="inline-flex items-center px-4 py-1 gap-1 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed font-medium  border-t border-b disabled:text-gray-400  bg-gray-200 border-gray-400 text-gray-600 hover:text-white hover:bg-gray-400">
            <IoPrint size={20}/>
                Imprimir
            </button>
            
            <button disabled={!permissoes.includes('ADM1.2.3')} onClick={() => setExcluir(!excluir)} type="button" className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium disabled:bg-gray-100 disabled:cursor-not-allowed border 0 rounded-e-lg  focus:z-10 focus:ring-2 disabled:text-gray-400   bg-gray-200 border-gray-400 text-gray-600 enable:hover:text-white hover:bg-gray-400 ">
                <MdDeleteForever size={20} />
                Excluir
            </button>
            {excluir ? (<div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="flex items-center justify-center p-2 w-full h-full">
                    <div className="relative rounded-lg shadow bg-gray-800">
                        <button type="button" onClick={() => setExcluir(!excluir)} className="absolute top-3 end-2.5 text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                            <button type="button" onClick={() => setarDados({ closeModalPlano: false })} className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                                <IoIosClose size={30} />
                            </button>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <div className="flex w-full justify-center items-center">
                                <TbAlertTriangle className='text-gray-400' size={60} />
                            </div>
                            <h3 className="mb-5 text-lg font-normal  text-gray-400">Realmente deseja deletar esssa mensalidade?</h3>

                            <button onClick={excluirMesal} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none  focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                                Sim, tenho certeza
                            </button>
                            <button onClick={() => setExcluir(!excluir)} type="button" className=" focus:ring-4 focus:outline-none  rounded-lg border  text-sm font-medium px-5 py-2.5  focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600">Não, cancelar</button>
                        </div>
                    </div>
                </div>
            </div>) : ''}
        </div>


      

    </div>
<div className="flex w-full p-2 max-h-[calc(100vh-255px)]">
    <table
        className="block  overflow-y-auto overflow-x-auto text-xs text-center rtl:text-center border-collapse rounded-lg text-gray-600">
        <thead className="sticky top-0  text-xs uppercase  bg-gray-100 text-gray-600">
            <tr >
                <th scope="col" className="px-6 py-1">
                    NP
                </th>
                <th scope="col" className=" px-6 py-1">
                    DATA VENC.
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
                    status
                </th>
                <th scope="col" className=" px-6 py-1">
                    Data Pag.
                </th>
                <th scope="col" className=" px-6 py-1">
                    Hr Pag.
                </th>
                <th scope="col" className=" px-6 py-1">
                    usuário
                </th>
                <th scope="col" className=" px-6 py-1">
                    val pago
                </th>
                <th scope="col" className=" px-6 py-1">
                    forma
                </th>
                <th scope="col" className=" px-6 py-1">
                    ATRASO
                </th>
                <th scope="col" className="px-12 py-1">
                    <span>ações</span>
                </th>
            </tr>
        </thead>
        <tbody  >


            {dadosAssociado.arrayMensalidade.map((item, index) => {

                const idAcordoMudou = currentAcordoId !== item.status;
                currentAcordoId = item.status;
                return (idAcordoMudou && item.id_acordo !== null ? (
                    <React.Fragment key={index}>

                        {dadosAssociado.arrayAcordo?.map((i, l) => {
                            return (



                                <React.Fragment key={l}>
                                    <tr onAuxClick={() => setShowSublinhas(!showSublinhas)} className={` ${i.status !== 'A' && "hidden"} cursor-pointer hover:bg-gray-600 font-semibold text-yellow-500 border-b bg-gray-50 border-gray-300`} onClick={() => setShowSublinhas(!showSublinhas)} key={l}>
                                        <td className="px-2 py-1">{/* Renderizar algo aqui */}</td>
                                        <td className="px-2 py-1">ACORDO</td>
                                        <td className="px-2 py-1">VALOR:R${i.total_acordo}</td>
                                        <td className="px-2 py-1">VENC.:{new Date(i.data_fim).toLocaleDateString('pt',{timeZone:'UTC'})}</td>
                                        <td className="px-2 py-1">RESP.:{i.realizado_por}</td>
                                        <td className="px-2 py-1">Método:{i.metodo}</td>
                                        <td className="px-2 py-1">{i.status}</td>
                                        <td className="px-2 py-1">{ }</td>
                                        <td className="px-2 py-1">{ }</td>
                                        <td className="px-2 py-1">{ }</td>
                                        <td className="px-2 py-1">{ }</td>
                                        <td className="px-2 py-1">{ }</td>
                                      
                                        <td className="px-2 py-1">
                                            <button onClick={(event) => {
                                                
                                                event.stopPropagation()

                                                setarDados({
                                                    acordo: {
                                                        mensalidade: i.mensalidade,
                                                        id_acordo: i.id_acordo,
                                                        data_fim: i.data_fim,
                                                        data_inicio: i.data_inicio,
                                                        dt_pgto: i.dt_pgto,
                                                        realizado_por: i.realizado_por,
                                                        status: i.status,
                                                        total_acordo: i.total_acordo,
                                                        descricao: i.descricao,
                                                        visibilidade: true,
                                                        closeAcordo: true,
                                                    }
                                                })
                                                setarModalAcordo({open:true,visible:false})

                                            }} className={`font-medium hover:underline ${item.vencimento && new Date(item.vencimento) < new Date() && item.status === 'A' ? "text-red-500" : 'text-blue-500'}`}>
                                                Baixar/Editar
                                            </button>
                                        </td>
                                    </tr>
                                    {i.mensalidade?.map((ii, ee) => (
                                        <tr className={`border-b font-semibold ${!showSublinhas && "hidden"} ${ii.status !== 'E' && "hidden"} text-yellow-500 border-gray-300  hover:bg-gray-500 hover:text-black `} key={ee}>
                                            <th scope="row" className={`px-5 py-1 font-medium  whitespace-nowrap  `}>
                                                {ii.parcela_n}
                                            </th>
                                            <td className={`px-2 py-1 `}>
                                                {ii.vencimento && new Date(ii.vencimento).toLocaleDateString('pt',{timeZone:'UTC'})}

                                            </td>
                                            <td className="px-2 py-1">
                                                {ii.referencia}
                                            </td>
                                            <td className="px-5 py-1">
                                                {ii.cobranca && new Date(ii.cobranca).toLocaleDateString('pt',{timeZone:'UTC'})}
                                            </td>
                                            <td className="px-3 py-1">
                                                {`R$${ii.valor_principal}`}
                                            </td>
                                            <td className={`px-4 py-1 ${ii.status === 'A' && ii.vencimento && calcularDiferencaEmDias(new Date(), new Date(ii.vencimento)) >= 1 ? "font-bold text-red-600" : item.status == 'P' ? "font-bold text-blue-600" : ''}`}>
                                                {ii.status}
                                            </td>
                                            <td className="px-4 py-1">
                                                {ii.data_pgto ? new Date(ii.data_pgto).toLocaleDateString('pt-BR',{timeZone:'UTC'}) : ''}
                                            </td>
                                            <td className="px-4 py-1">
                                                {ii.hora_pgto}
                                            </td>
                                            <td className="px-6 py-1">
                                                {ii.usuario}
                                            </td>
                                            <td className={`px-6 py-1`}>
                                                {ii.valor_total ? `R$${ii.valor_total}` : ''}
                                            </td>
                                            <td className="px-4 py-1">
                                                {ii.form_pagto}
                                            </td>

                                            <td className="px-4 py-1">
                                                {ii.vencimento && calcularDiferencaEmDias(new Date(), new Date(ii.vencimento)) <= 0 ? 0 : ii.vencimento && calcularDiferencaEmDias(new Date(), new Date(ii.vencimento))}
                                            </td>
                                            <td className="px-4 py-1">

                                            </td>

                                        </tr>
                                    ))}
                                </React.Fragment>
                            )
                        })}
                    </React.Fragment>
                ) :

                    checkMensal && item.status !== 'E' ?

                        (

                            <tr key={index}
                                onClick={() => toggleSelecionada(item)}
                                //className={` border-b ${item.id_mensalidade===data.mensalidade?.id_mensalidade?"bg-gray-600":"bg-gray-800"}  border-gray-700  hover:bg-gray-600  ${new Date(item.vencimento)<new Date()&& item.status==='A'?"text-red-500":item.status==='P'? 'text-blue-500':'text-white'}`}>
                                className={`font-semibold ${calcularDiferencaEmDias(new Date(), new Date(item.vencimento)) >= 1 && item.status === 'A' && "text-red-600"} border-b ${linhasSelecionadas.some(linha => linha.id_mensalidade === item.id_mensalidade) ? "bg-gray-300" : "bg-gray-50"}  ${item.status === 'P' && "text-blue-600"} border-gray-400  hover:bg-gray-300 hover:text-black   ${item.parcela_n === 0 ? "hidden" : ''}`}>
                                <th scope="row" className={`px-5 py-1  `}>
                                    {item.parcela_n}
                                </th>
                                <td className={`px-2 py-1 `}>
                                    {new Date(item.vencimento).toLocaleDateString('pt',{timeZone:'UTC'})}

                                </td>
                                <td className="px-2 py-1">
                                    {item.referencia}
                                </td>
                                <td className="px-5 py-1">
                                    {new Date(item.cobranca).toLocaleDateString('pt',{timeZone:'UTC'})}
                                </td>
                                <td className="px-3 py-1">
                                    {`R$${item.valor_principal}`}
                                </td>
                                <td className={`px-4 py-1  font-bold ${item.status === 'A' && "text-red-600"}`}>
                                    {item.status}
                                </td>
                                <td className="px-4 py-1">
                                    {item.data_pgto ? new Date(item.data_pgto).toLocaleDateString('pt',{timeZone:'UTC'}) : ''}
                                </td>
                                <td className="px-4 py-1">
                                {item.hora_pgto}
                                </td>
                                <td className="px-6 py-1">
                                    {item.usuario}
                                </td>
                                <td className={`px-6 py-1`}>
                                    {item.valor_total ? `R$${item.valor_total}` : ''}
                                </td>
                                <td className="px-4 py-1">
                                    {item.form_pagto}
                                </td>

                                <td className="px-4 py-1">
                                    {calcularDiferencaEmDias(new Date(), new Date(item.vencimento)) <= 0 ? 0 : calcularDiferencaEmDias(new Date(), new Date(item.vencimento))}
                                </td>
                                <td className=" px-4 py-1 ">

                                    <button onClick={(event) => {
                                        event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                                        setOpenEditar(true)
                                        setMensalidade({...item,valor_total:item.status==='A'?item.valor_principal:item.valor_total})
                                    }} className={` ${item.status === 'E' ? "hidden" : ''}  hover:underline ${new Date(item.vencimento) < new Date() && item.status === 'A' ? "text-red-500" : 'text-blue-500'}`}>Editar</button>
                                </td>
                            </tr>
                        ) : item.status === 'A' ? (
                            <tr key={index} //onClick={()=>{setarDados({mensalidade:{
                                // id_mensalidade:item.id_mensalidade,
                                // status:item.status
                                // }})}} className={` border-b ${item.id_mensalidade===data.mensalidade?.id_mensalidade?"bg-gray-600":"bg-gray-800"}  border-gray-700  hover:bg-gray-600 ${new Date(item.vencimento)<new Date()&& item.status==='A'?"text-red-500":'text-white'}`}>
                                onClick={() => toggleSelecionada(item)}
                                className={`font-semibold ${calcularDiferencaEmDias(new Date(), new Date(item.vencimento)) >= 1 && "text-red-600"}  border-b ${linhasSelecionadas.some(linha => linha.id_mensalidade === item.id_mensalidade) ? "bg-gray-300" : "bg-gray-50"}   border-gray-400  hover:bg-gray-300 hover:text-black   ${item.parcela_n === 0 ? "hidden" : ''}`}>
                                <th className="px-5 py-1   ">
                                    {item.parcela_n}
                                </th>
                                <td className="px-2 py-1">
                                    {new Date(item.vencimento).toLocaleDateString('pt',{timeZone:'UTC'})}

                                </td>
                                <td className="px-2 py-1">
                                    {item.referencia}
                                </td>
                                <td className="px-5 py-1">
                                    {new Date(item.cobranca).toLocaleDateString('pt',{timeZone:'UTC'})}
                                </td>
                                <td className="px-3 py-1">
                                    {`R$${item.valor_principal}`}
                                </td>
                                <td className={`px-4 py-1 ${item.status === 'A' && "font-bold text-red-600"}`}>
                                    {item.status}
                                </td>
                                <td className="px-4 py-1">
                                    {item.data_pgto ? new Date(item.data_pgto).toLocaleDateString('pt',{timeZone:'UTC'}) : ''}
                                </td>
                                <td className="px-4 py-1">
                                {item.hora_pgto }
                                </td>
                                <td className="px-6 py-1">
                                    {item.usuario}
                                </td>
                                <td className={`px-6 py-1`}>
                                    {item.valor_total ? `R$${item.valor_total}` : ''}
                                </td>
                                <td className="px-4 py-1">
                                    {item.form_pagto}
                                </td>
                                <td className="px-4 py-1">
                                    {calcularDiferencaEmDias(new Date(), new Date(item.vencimento)) <= 0 ? 0 : calcularDiferencaEmDias(new Date(), new Date(item.vencimento))}
                                </td>
                                <td className=" px-4 py-1 ">
                                    <button onClick={(event) => {
                                        event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                                        setOpenEditar(true),
                                        setMensalidade({...item,valor_total:item.status==='A'?item.valor_principal:item.valor_total})
                                    }} className={`hover:underline ${new Date(item.vencimento) < new Date() && item.status === 'A' ? "text-red-500" : 'text-blue-500'}`}>Editar</button>
                                </td>
                            </tr>

                        ) : ''

                )
            })}
            {/* Encontrar a primeira mensalidade com status 'E' */}


        </tbody>

    </table>
    </div>
  
<ModalMensalidade mensalidade={mensalidadeSelect??{}} setMensalidade={setMensalidade} openModal={openModalMens} setOpenModal={setModalMens}/>
</div>
  )
}
