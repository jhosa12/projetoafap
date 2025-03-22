
import { api } from "@/lib/axios/apiClient";
import { MdDelete, MdOutlineAddCircle } from "react-icons/md";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { IoPrint, IoSearchSharp } from "react-icons/io5";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { ModalLancamentosCaixa } from "@/components/modals/caixa/modalLancamentosCaixa";
import { AuthContext } from "@/store/AuthContext";
import {  IoMdOptions } from "react-icons/io";
import RelatorioSintetico from "@/Documents/caixa/RelatorioMovimentacao";
import { Label, Modal, Spinner, Table, TextInput } from "flowbite-react";
import {  HiPencil } from "react-icons/hi2";
import { toast } from "react-toastify";
import { ModalExcluir } from "@/components/modals/modalExcluir";
import { ModalFechamento } from "../../../components/modals/caixa/modalFechamento";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ajustarData } from "@/utils/ajusteData";
import { ScreenCloseCaixa } from "@/components/caixa/screenCloseCaixa";
import { ModalMensalidade } from "@/components/modals/admContrato/historico/modalmensalidade";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlanoContasProps } from "../financeiro";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useReactToPrint } from "react-to-print";
import { SomaProps } from "@/components/tabs/financeiro/caixa/caixa";
import pageStyle from "@/utils/pageStyle";
import { ModalLancamento } from "@/components/modals/caixa/modalLancamento";
import { BiCalendarMinus } from "react-icons/bi";

  

registerLocale('pt', pt)


export interface LancamentosProps{
    lanc_id:number,
    forma_pagamento:string,
    num_seq:number|null,
    valorForma?:string
    valor_restante?:number,
    observacao?:string,
    conta:string,
    ccustos_id:number|null,
    ccustos_desc:string,
    descricao:string,
    conta_n:string,
    data:Date,
    notafiscal:string,
    historico:string,
    tipo:string,
    valor:number|null,
    datalanc:Date,
    usuario:string,
    id_grupo:number|null,
    pix_por:string,
    banco:string,
    empresa:string,
    mensalidade:{ form_pagto:string}
    lancamentoForma:Array<{id_forma?:number,forma:string,valor:number,banco?:string|undefined,observacao?:string|undefined}>|[],
}
interface GrupoPrps{
    id_grupo:number,
    descricao:string
}

export interface MensalidadeBaixaProps{
    id_mensalidade:number,
    id_global:number,
    lancamentoForma:Array<{
        valor:number,
        forma:string,
        banco?:string,
        observacao?:string}>,
    id_mensalidade_global:number,
    aut:string,
    valor_metodo:number,
    recebido_por:string,
    contrato:{situacao:string},
    data_pgto:Date,
    associado:Partial<{
        nome:string,
        endereco:string,
        mensalidade:Array<Partial<{
            id_mensalidade_global:number,
            id_mensalidade:number,
            referencia:string,
            vencimento:Date,
            valor_principal:number,
            n_doc:string,
            status:string
        }>>
    }>,
    id_contrato:number,
    referencia:string,
    status:string,
    valor_principal:number,
    vencimento:Date,
    valor_total:number,
    pix_por:string,
    form_pagto:string,
    banco_dest:string,
    motivo_bonus:string,
    situacao:string
}


interface FormProps{
    startDate:Date,
    endDate:Date,
    descricao:string    
    id_empresa:string
}


export interface FechamentoProps{
    id_conf:number,
                caixaCad:{ pix:number,
                    cedulas:number,
                    cartao:number,
                    transferencia:number},
                data:Date,
                empresa:string,
                usuario:string,
                observacao:string
}

interface ResponseCaixaProps{
    lista:Array<LancamentosProps>|[],
    dif:number|null,
    plano_de_contas:Array<PlanoContasProps>,
    grupo:Array<GrupoPrps>,
    fechamento:FechamentoProps|null,
    valorAnterior:number|null
}


export default function CaixaMovimentar(){
    const [mov,setMov]=useState<Partial<LancamentosProps>>();
    const [saldo,setSaldo]=useState(0);
    const {usuario,permissoes,infoEmpresa} = useContext(AuthContext);
    const [selectRelatorio,setSelectRelatorio] = useState<string|null>(null)
    //const [openModal,setModal] = useState<boolean>(false);
   // const [openModalExc,setModalExc] = useState<boolean>(false);
    const [loading,setLoading] = useState<boolean>(false);
   // const [openFecModal,setFecModal]= useState<boolean>(false)
    const [mensalidade,setMensalidade] = useState<Partial<MensalidadeBaixaProps>>()
    const [modalDados,setModalDados] = useState<boolean>(false)
    const [despesas,setDespesas] = useState<number>(0)
    const currentPage = useRef<RelatorioSintetico>(null)
    const [data,setData] = useState<Partial<ResponseCaixaProps>>()
    const [valorForma,setValorForma] = useState<Record<string, number>>()
    const [openModal,setModal] = useState<{[key:string]:boolean}>({
      lancar:false,
      excluir:false,
      fecharCaixa:false
    })
    const {register,watch,handleSubmit,control}= useForm<FormProps>({
        defaultValues:{
            startDate:new Date(),
            endDate:new Date(),
        }
    })


    useEffect(()=>{
        if(selectRelatorio){
            ImprimirRelatorio();
        }
    },[selectRelatorio])


  const ImprimirRelatorio = useReactToPrint({
      pageStyle:pageStyle,
        content:()=>currentPage.current,
        onAfterPrint:()=>{},
        onBeforeGetContent:()=>{setSelectRelatorio(null)},
      //  removeAfterPrint:false
    })







    useEffect(() => {


        if(modalDados)return
        let currentBarcode = '';
        let timeout: ReturnType<typeof setTimeout>;
        
    
        const handleKeyPress = (event: KeyboardEvent) => {
          //Verifica se a tecla "Enter" foi pressionada
          if (event.key === 'Enter') {
          //setScannedCode(currentBarcode);
         event.preventDefault();
        event.stopPropagation();
          buscarMensalidade(currentBarcode)
            currentBarcode = ''; // Reinicia o código de barras após a leitura
            setModal({lancar:false})
          } else {
            //Acumula os caracteres do código de barras
            currentBarcode += event.key;
          }
    
          //Limpa o buffer se não houver atividade por 300ms
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            currentBarcode = '';
          }, 300);
        };
    
        //Adiciona o ouvinte de eventos para capturar as teclas pressionadas
        document.addEventListener('keydown', handleKeyPress);
    
        //Remove o ouvinte de eventos quando o componente é desmontado
        return () => {
          document.removeEventListener('keydown', handleKeyPress);
        };
      }, [modalDados]);


  /*  useEffect(()=>{



        const handleScanner=(event:KeyboardEvent)=>{

            if(event.key==='F2'){
               if (!watch('id_empresa')) {
                toast.info('Selecione uma empresa')
                return
               }
                setScanner(true)
            }
           
        }

        document.addEventListener('keydown',handleScanner)

        return () => {
            document.removeEventListener('keydown', handleScanner);
        };



    },[])*/


    const buscarMensalidade = useCallback(
        async(n_doc:string)=>{
            setLoading(true)
            try {
             const response = await api.post('/mensalidade/baixaDireta',{
               n_doc,
               id_empresa:infoEmpresa?.id
             })
            
             setMensalidade(response.data)
             setModalDados(true)
            } catch (error:any) {
                console.log('Erro:', error); // Verifique o erro mais claramente
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Ocorreu um erro desconhecido.');
            }
            } 
    
            setLoading(false)
           },[infoEmpresa?.id,mensalidade,modalDados]
    )
    

       useEffect(()=>{

       handleChamarFiltro()
           
       },[infoEmpresa?.id])


 const handleGerirRelatorio = useCallback(()=>{

 
      return data?.lista?.reduce((acumulador, atual) => {
        const valor = Number(atual.valor);
       
  
    if( atual.tipo==='RECEITA' )  switch (atual?.mensalidade?.form_pagto) {
          case 'PIX':
            acumulador.pix += valor;
            break;
          case 'BOLETO':
            acumulador.boleto += valor;
            break;
          case 'CARTAO':
          case 'CARTÃO CREDITO':
          case 'CARTÃO DEBITO':
            acumulador.cartao += valor;
            break;
          case 'DINHEIRO':
          case '':
            acumulador.dinheiro += valor;
            break;
          default:
            break; // Adicione uma ação padrão se necessário
        }
  
        if (atual.tipo === 'DESPESA') {
          acumulador.despesas += valor;
        }
        if(atual.tipo === 'RECEITA'){
          acumulador.total+= valor;
        }
  
        return acumulador;
      }, { pix: 0, boleto: 0, cartao: 0, dinheiro: 0, deposito: 0, total: 0, transferencia: 0,despesas:0 } as SomaProps);
     

    },[selectRelatorio,data?.lista])



  const  handleExcluir=useCallback(async()=>{

    try {
      await toast.promise(
            api.delete(`/caixa/deletar/${infoEmpresa?.id}/${mov?.lanc_id}`),
            {
                error:'Erro ao deletar lancamento',
                pending:'Solicitando exclusão..',
                success:'Deletado com sucesso'
            }
        )   
        const novo = [...(data?.lista||[])]
        const index = novo.findIndex(item=>item.lanc_id===mov?.lanc_id)
        novo.splice(index,1)
        setData({...data,lista:novo})
       // setLancamentos(novo)
       setModal({excluir:false})
        //setModalExc(false)
      
    } catch (error) {
        console.log(error)
    }

  },[mov?.lanc_id,data?.lista,infoEmpresa?.id])
    

  const handleChamarFiltro =()=>{
    listarLancamentos({endDate:watch('endDate'),startDate:watch('startDate'),id_empresa:infoEmpresa?.id??'',descricao:watch('descricao')})
  }
   

   const listarLancamentos:SubmitHandler<FormProps> = useCallback(async(data)=> {

        if(data.startDate>data.endDate){
            toast.info('Data final deve ser maior que a data inicial')
            return
        }

    const {dataIni,dataFim} = ajustarData(data.startDate,data.endDate)
        try{
            setLoading(true)
            const response = await api.post('/listarLancamentos',{
                id_empresa:infoEmpresa?.id,
                dataInicial:dataIni,
                dataFinal:dataFim,
                descricao:data.descricao,
                id_user:usuario?.id
            })

       //console.log(response.data)
           
            setData(response.data)
           // setLancamentos(lista)
           // setPlanos(plano_de_contas)
           // setGrupos(grupos)
           // setFechado(fechamento)
          
        

            
         }catch(err){
            console.log(err)
         }

         setLoading(false)
        
    },[infoEmpresa?.id,usuario?.id])




  


    useEffect(()=>{
      if(data?.lista && data?.lista.length>0) {
       
          const totalPorFormaPagamento =data?.lista?.reduce((acc, lancamento) => {
       if(lancamento.lancamentoForma && typeof lancamento.lancamentoForma === 'object') {    Object?.entries(lancamento?.lancamentoForma)?.forEach(([forma, dados]) => {
            
            lancamento.tipo ==="RECEITA"?  acc[dados.forma] = (acc[dados.forma] || 0) + Number(dados.valor): acc[dados.forma] = (acc[dados.forma] || 0) - Number(dados.valor);
            });}
            return acc;
          }, {} as Record<string, number>);
  
  
  
          setValorForma(totalPorFormaPagamento)
      
            const soma = data.lista?.reduce((total,item)=>{
                    if(item.tipo ==='RECEITA'){ return total=total+Number(item.valor)}
                    else return total=total-Number(item.valor)
                },0)
            setSaldo(soma)
            const somadespesas = data.lista?.reduce((total,item)=>{
                if(item.tipo==='DESPESA'){
                    return total=total+Number(item.valor)
                }
                else{
                    return total
                }
                
                },0)
                setDespesas(somadespesas)
       }else{
        setSaldo(0)
        setDespesas(0)
        setValorForma({})
       }
   

    },[data])

return(
<>

{/*openModal.lancar && <ModalLancamento bancos={infoEmpresa?.bancos??[]} id_empresa={infoEmpresa?.id??''} handleFiltro={handleChamarFiltro}  mov={mov??{}} openModal={openModal.lancar} setOpenModal={()=>setModal({lancar:false})}  planos={data?.plano_de_contas??[]}  grupo={data?.grupo??[]}/>*/}
{openModal.lancar &&<ModalLancamentosCaixa id_empresa={infoEmpresa?.id??''} handleFiltro={handleChamarFiltro} mov={mov??{}} openModal={openModal.lancar} setOpenModal={()=>setModal({lancar:false})}  planos={data?.plano_de_contas??[]}  grupo={data?.grupo??[]}/>}

<ModalExcluir openModal={openModal.excluir} handleExcluir={handleExcluir} setOpenModal={()=>setModal({excluir:false})}/>

{/*<ModalDadosMensalidade  handleChamarFiltro={handleChamarFiltro} setMensalidade={setMensalidade} mensalidade={mensalidade??{}} open={modalDados} setOpen={setModalDados}/>*/}

{<ModalMensalidade
handleAtualizar={()=>listarLancamentos({startDate:watch('startDate'),endDate:watch('endDate'),id_empresa:infoEmpresa?.id??'',descricao:watch('descricao')})}
mensalidade={{
    ...mensalidade,
  
}}
openModal={modalDados}
setOpenModal={setModalDados}

/>}

<Modal size={'sm'} popup show={loading}>
    <Modal.Body>
        <div className=" flex flex-col mt-6 w-full justify-center items-center">
        <Spinner size={'lg'} color={'warning'}/>
        <span>Localizando dados....</span>
        </div>
       
    </Modal.Body>
</Modal>

<div className="flex flex-col  w-full ">
    <div className=" bg-white inline-flex items-end w-full gap-2 ">

       
   
    <form onSubmit={handleSubmit(listarLancamentos)}  className="flex w-full items-end flex-row justify-end p-1 gap-4 text-black pr-2 ">

    <div className="flex flex-col whitespace-nowrap ml-4 bg-gray-50 px-2 py-1 text-[11px] rounded-md ">
        
        <div className="inline-flex items-center gap-4">
            <div>
            <span >SALDO:</span>
            <span > {Number(data?.dif).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
            </div>

            <div>
            <span >DIA ANTERIOR:</span>
            <span > {Number(data?.valorAnterior).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
            </div>

        </div>


        <div className="inline-flex items-center gap-4">
            <div>
            <span >SALDO DIA:</span>
            <span >R$ {saldo.toFixed(2)}</span>
            </div>

            <div>
            <span >DESPESAS:</span>
            <span > {Number(despesas).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
            </div>

            <div>
            <span >RECEITAS:</span>
            <span > {Number(saldo+despesas).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
            </div>
            </div>




            <ul className="inline-flex gap-4">
        {valorForma && Object.entries(valorForma).map(([forma, valor]) => (
          <li key={forma}>
            <strong>{forma}:</strong> {Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </li>
        ))}
      </ul>
        </div>

        <div className="flex items-center gap-2">
    <div >
      
        <Controller
        control={control}
        name="startDate"
        render={({ field:{ onChange, value} }) => (
            <DatePicker selected={value} onChange={e=>e && onChange(e)}  dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full shadow-sm uppercase  z-50 text-[11px] leading-[14px]   border  rounded-sm    border-gray-200 placeholder-gray-400  " />
        )}
        />
      
      </div>

        <BiCalendarMinus size={25} />

      <div >
      
        <Controller
        control={control}
        name="endDate" 
        render={({ field:{ onChange, value} })=>(
                  <DatePicker selected={value} onChange={e=>e && onChange(e)}     dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex shadow-sm w-full uppercase  z-50 text-[11px]   border  rounded-sm    border-gray-200 placeholder-gray-400 leading-[14px] " 
                  
                  
                  />
        )}
        />
 
      </div>

      </div>
      
      <div className="w-1/2" >
        <Input placeholder="Descrição"  className="w-full h-8 text-[11px]" {...register('descricao')}    />
      </div> 
                   
                   <Button variant={'outline'}  size={'sm'} type="submit" ><IoSearchSharp /> Buscar</Button>

                  
                 
                  
                  

                   <DropdownMenu>
  <DropdownMenuTrigger asChild className="focus:outline-none">
  <Button variant={'outline'} disabled={!permissoes.includes('ADM2.1.1')||!!data?.fechamento} color={'success'} size={'sm'}  ><IoMdOptions />Ações</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Ações</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem
      disabled={!permissoes.includes('ADM2.1.1')||!!data?.fechamento}
      onClick={()=>{setMov({conta:'',conta_n:'',ccustos_desc:'',data:undefined,datalanc:new Date(),descricao:'',historico:'',num_seq:null,tipo:'',usuario:'',valor:null,ccustos_id:null,notafiscal:''}),setModal({lancar:true})}}
    >
        <MdOutlineAddCircle />
        Novo Lançamento
    </DropdownMenuItem>
    <DropdownMenuSub>
            <DropdownMenuSubTrigger>Relatorio de Caixa</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={()=>setSelectRelatorio('ANALITICO')}>Analitico</DropdownMenuItem>
                <DropdownMenuItem onClick={()=>setSelectRelatorio('SINTETICO')}>Sintético</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem  onClick={()=>setModal({fecharCaixa:true})}>Fechar Caixa</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

          
        </form>
    </div>
  { !!data?.fechamento ? <ScreenCloseCaixa fechamento={data.fechamento}/> : <div className="flex flex-col border-t-2 bg-white">
    
       
        <div className="overflow-y-auto mt-1 px-2 h-[calc(100vh-144px)] ">
       
        <Table hoverable theme={{root:{shadow:'none'}, body: { cell: { base: "px-2 py-0 text-[10px]" } } }} 
    >
         <Table.Head  className="sticky top-0 bg-white z-5 border-b-2" theme={{ cell: { base: "bg-gray-50 px-2 py-0 text-[11px]" } }} >
        
                <Table.HeadCell  >
                    Nº LANC.
                </Table.HeadCell>
                <Table.HeadCell >
                    DATA
                </Table.HeadCell>
                <Table.HeadCell >
                    CONTA
                </Table.HeadCell>
                <Table.HeadCell >
                    C.CUSTOS
                </Table.HeadCell>
                <Table.HeadCell >
                    DOCUMENTO
                </Table.HeadCell> 
                <Table.HeadCell >
                    HISTÓRICO
                </Table.HeadCell> 
                <Table.HeadCell >
                    TIPO
                </Table.HeadCell>
                <Table.HeadCell >
                    VALOR
                </Table.HeadCell>  
                <Table.HeadCell >
                    AÇÕES
                </Table.HeadCell> 
             
            
            
        </Table.Head>
        <Table.Body className="divide-y">
            {data?.lista?.map((item,index)=>(
            <Table.Row key={item.lanc_id} className=" text-black  ">

<Table.Cell className="whitespace-nowrap   ">
{item.num_seq}
            </Table.Cell>
            <Table.Cell  data-tooltip-id="tooltip-hora" data-tooltip-place="bottom" data-tooltip-content={new Date(item.datalanc).toLocaleTimeString()} >
            {new Date(item.data).toLocaleDateString('pt-BR',{timeZone:'UTC'})}
            </Table.Cell>
            <Table.Cell>{item.conta}</Table.Cell>
            
            
           
            <Table.Cell className="whitespace-nowrap">{item.ccustos_desc  }</Table.Cell>
            <Table.Cell>  {item.notafiscal?item.notafiscal.toUpperCase():item?.descricao?.toUpperCase()}</Table.Cell>
            <Table.Cell> {item.historico}</Table.Cell>
            <Table.Cell className={`font-semibold ${item.tipo==='RECEITA'?"text-green-500":"text-red-500"}`}> {item.tipo}</Table.Cell>
            <Table.Cell className="font-semibold">{Number(item.valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
          
            <Table.Cell className="space-x-4 whitespace-nowrap">
            <button disabled={item.conta==='1.01.002'|| !permissoes.includes('ADM2.1.3')} onClick={(event)=>{
                               event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                               setMov({...item})
                              setModal({lancar:true})
                            }} className="font-medium text-gray-500 hover:text-cyan-600 disabled:cursor-not-allowed">
                    <HiPencil size={14} />
                  </button>
                  <button disabled={item.conta==='1.01.002'|| !permissoes.includes('ADM2.1.4')} onClick={() =>{setMov({lanc_id:item.lanc_id}),setModal({excluir:true}) }} className="font-medium text-gray-500 hover:text-red-600 disabled:cursor-not-allowed">
                    <MdDelete size={16} />
                  </button>
                  </Table.Cell>
          
            </Table.Row>

            ))}
           
           </Table.Body>
    
    </Table>
    </div>
    </div>}


{!data?.fechamento &&    <div className="inline-flex gap-3   text-black w-full bg-white p-2">
       {/*  <button disabled={!permissoes.includes('ADM2.1.5')} onClick={()=>setVisible(!visible)} className="justify-center items-center disabled:hover:cursor-not-allowed">
           {visible? <IoMdEye color="blue" size={20}/>:<IoMdEyeOff color="blue" size={20}/>}
            </button>
   
   <div className="text-black text-xs">

    <span className="inline-flex items-center  rounded-s-lg px-4 py-1 gap-1  font-medium  border-t border-b    bg-gray-100 border-gray-400  ">
   
   {visible?`Saldo:  ${Number(data?.dif).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`:"------"}
   </span>


        <span className={`inline-flex items-center px-4 py-1 gap-1  font-medium  border   focus:z-10 focus:ring-2  bg-gray-100 border-gray-400 ${saldo<0?"text-red-500":""}`}>

   {visible?`Saldo Dia: ${Number(saldo).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`:"------"}
  </span>

  <span className="inline-flex items-center px-4 py-1 gap-1  font-medium  border-t border-b    bg-gray-100 border-gray-400  ">
   
  {visible?`Receitas:  ${Number(saldo+despesas).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`:"------"}
  </span>

  <span className="inline-flex items-center px-4 py-1 gap-1  font-medium  border 0 rounded-e-lg    bg-gray-100 border-gray-400 ">

  {visible?`Despesas: ${Number(despesas).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`:"------"}
  </span>
  </div>*/}

    </div>}

    </div>



{openModal.fecharCaixa && <ModalFechamento listar={()=>listarLancamentos({endDate:watch('endDate'),startDate:watch('startDate'),id_empresa:infoEmpresa?.id??'',descricao:watch('descricao')})} dataCaixaEnd={watch('endDate')} dataCaixa={watch('startDate')}  id_empresa={infoEmpresa?.id??''} lancamentos={data?.lista??[]} id_usuario={usuario?.id??''} openModal={openModal.fecharCaixa} setOpenModal={()=>setModal({fecharCaixa:false})}/>}


{/*openModalPrint && <ModalImpressao array={data?.lista??[]} openModal={openModalPrint} setOpenModal={setPrint} startDate={watch('startDate')} endDate={watch('endDate')} usuario={usuario?.nome??''}/>*/}



<div style={{ display: "none" }}>
        {/* Renderiza o componente de fechamento apenas uma vez */}
       {selectRelatorio &&  <RelatorioSintetico infoEmpresa={infoEmpresa} tipoRelatorio={selectRelatorio} soma={handleGerirRelatorio()??{} as SomaProps} usuario={usuario?.nome??''} startDate={watch('startDate')} endDate={watch('endDate')} array={data?.lista  ??[]} ref={currentPage} />}
      </div>
</>
)

}