
import { api } from "@/services/apiClient";
import { MdDelete, MdOutlineAddCircle } from "react-icons/md";
import { useCallback, useContext, useEffect, useState } from "react";
import { IoPrint, IoSearchSharp } from "react-icons/io5";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { ModalLancamentosCaixa } from "@/components/caixa/modalLancamentosCaixa";
import { AuthContext } from "@/contexts/AuthContext";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Button, Label, Modal, Spinner, Table, TextInput } from "flowbite-react";
import {  HiPencil } from "react-icons/hi2";
import { toast } from "react-toastify";
import { ModalExcluir } from "@/components/modalExcluir";
import { ModalFechamento } from "../../components/caixa/modalFechamento";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ModalImpressao } from "@/components/caixa/modalImpressao";
import { ajustarData } from "@/utils/ajusteData";
import { ScreenCloseCaixa } from "@/components/caixa/screenCloseCaixa";
import { ModalMensalidade } from "@/components/admContrato/historicoMensalidade/modalmensalidade";


registerLocale('pt', pt)


export interface LancamentosProps{
    lanc_id:number,
    forma_pagamento:string,
    num_seq:number|null,
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
}
interface GrupoPrps{
    id_grupo:number,
    descricao:string
}

export interface MensalidadeBaixaProps{
    id_mensalidade:number,
    id_global:number,
    id_mensalidade_global:number,
    aut:string,
    valor_metodo:number,
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


export default function CaixaMovimentar(){
    const [lancamentos,setLancamentos]=useState<Array<LancamentosProps>>([]);
    const [mov,setMov]=useState<Partial<LancamentosProps>>();
    const [saldo,setSaldo]=useState(0);
    const [grupos,setGrupos] = useState<Array<GrupoPrps>>([])
    const [despesas,setDespesas]=useState(0);
    const [openModalPrint,setPrint] = useState<boolean>(false);
    const [planos,setPlanos]=useState([]);
    const {usuario,permissoes,selectEmp} = useContext(AuthContext);
    const [visible,setVisible] = useState(false);
    const [openModal,setModal] = useState<boolean>(false);
    const [openModalExc,setModalExc] = useState<boolean>(false);
    const [loading,setLoading] = useState<boolean>(false);
    const [openFecModal,setFecModal]= useState<boolean>(false)
   const [fechado,setFechado] = useState<FechamentoProps|null>(null)
    const [mensalidade,setMensalidade] = useState<Partial<MensalidadeBaixaProps>>()
    const [modalDados,setModalDados] = useState<boolean>(false)
    const {register,watch,handleSubmit,control}= useForm<FormProps>({
        defaultValues:{
            startDate:new Date(),
            endDate:new Date(),
        }
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
            setModal(false)
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
      }, [modalDados,selectEmp]);



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
               id_empresa:selectEmp
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
           },[selectEmp,mensalidade,modalDados]
    )
    
    
    
    
    
       
  

       useEffect(()=>{

        listarLancamentos({endDate:new Date(),startDate:new Date(),id_empresa:selectEmp,descricao:''})
           
       },[])






  const  handleExcluir=async()=>{

    try {
      await toast.promise(
            api.delete(`/caixa/deletar/${selectEmp}/${mov?.lanc_id}`),
            {
                error:'Erro ao deletar lancamento',
                pending:'Solicitando exclusão..',
                success:'Deletado com sucesso'
            }
        )   
        const novo = [...lancamentos]
        const index = novo.findIndex(item=>item.lanc_id===mov?.lanc_id)
        novo.splice(index,1)
        setLancamentos(novo)
        setModalExc(false)
      
    } catch (error) {
        console.log(error)
    }

  }
    

  const handleChamarFiltro =()=>{
    listarLancamentos({endDate:watch('endDate'),startDate:watch('startDate'),id_empresa:selectEmp,descricao:watch('descricao')})
  }
   

   const listarLancamentos:SubmitHandler<FormProps> = async(data)=> {

        if(data.startDate>data.endDate){
            toast.info('Data final deve ser maior que a data inicial')
            return
        }

    const {dataIni,dataFim} = ajustarData(data.startDate,data.endDate)
        try{
            setLoading(true)
            const response = await api.post('/listarLancamentos',{
                id_empresa:selectEmp,
                dataInicial:dataIni,
                dataFinal:dataFim,
                descricao:data.descricao,
                id_user:usuario?.id
            })

       console.log(response.data)
            const {lista,plano_de_contas,grupos,fechamento} = response.data

            setLancamentos(lista)
            setPlanos(plano_de_contas)
            setGrupos(grupos)
            setFechado(fechamento)
          
        

            
         }catch(err){
            console.log(err)
         }

         setLoading(false)
        
    }


    useEffect(()=>{
      if(lancamentos?.length>0) {
            const soma =   lancamentos?.reduce((total,item)=>{
                    if(item.tipo ==='RECEITA'){ return total=total+Number(item.valor)}
                    else return total=total-Number(item.valor)
                },0)
            setSaldo(soma)
            const somadespesas = lancamentos?.reduce((total,item)=>{
                if(item.tipo==='DESPESA'){
                    return total=total+Number(item.valor)
                }
                else{
                    return total
                }
                
                },0)
                setDespesas(somadespesas)
       }
   

    },[lancamentos])

return(
<>


{openModal&&<ModalLancamentosCaixa id_empresa={selectEmp} handleFiltro={handleChamarFiltro}    arrayLanc={lancamentos} setLancamentos={setLancamentos}  mov={mov??{}} openModal={openModal} setOpenModal={setModal}  planos={planos}  grupo={grupos}/>}

<ModalExcluir openModal={openModalExc} handleExcluir={handleExcluir} setOpenModal={setModalExc}/>

{/*<ModalDadosMensalidade  handleChamarFiltro={handleChamarFiltro} setMensalidade={setMensalidade} mensalidade={mensalidade??{}} open={modalDados} setOpen={setModalDados}/>*/}

{<ModalMensalidade
handleAtualizar={()=>listarLancamentos({startDate:watch('startDate'),endDate:watch('endDate'),id_empresa:selectEmp,descricao:watch('descricao')})}
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
    <div className=" bg-white inline-flex items-center w-full justify-between">
   
    <form onSubmit={handleSubmit(listarLancamentos)}  className="flex w-full flex-row justify-end p-1 gap-4 text-black font-semibold">

    <div >
        <div className=" block">
          <Label className="text-xs"  value="Data inicial" />
        </div>
        <Controller
        control={control}
        name="startDate"
        render={({ field:{ onChange, value} }) => (
            <DatePicker selected={value} onChange={e=>e && onChange(e)}  dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase  z-50 text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
        )}
        />
      
      </div>



      <div >
        <div className=" block">
          <Label className="text-xs" value="Data final" />
        </div>
        <Controller
        control={control}
        name="endDate" 
        render={({ field:{ onChange, value} })=>(
                  <DatePicker selected={value} onChange={e=>e && onChange(e)}     dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase  z-50 text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
        )}
        />
 
      </div>
      
      <div className="w-1/4" >
        <div className=" block">
          <Label className="text-xs" value="Buscar" />
        </div>
        <TextInput {...register('descricao')}   sizing={'sm'}  />
      </div> 
         
                   <div className="flex items-end gap-4">
                   <Button isProcessing={loading}  size={'sm'} type="submit" ><IoSearchSharp className="mr-2 h-5 w-5"/> Buscar</Button>

                  
                   </div>
                   <div className="flex   items-end justify-end pr-2 ">
                   <Button disabled={!permissoes.includes('ADM2.1.1')||!!fechado} color={'success'} size={'sm'} onClick={()=>{setMov({conta:'',conta_n:'',ccustos_desc:'',data:undefined,datalanc:new Date(),descricao:'',historico:'',num_seq:null,tipo:'',usuario:'',valor:null,ccustos_id:null,notafiscal:''}),setModal(true)}} ><MdOutlineAddCircle className="mr-2 h-5 w-5"/> Novo</Button>
                   </div>
                   
        </form>
    </div>
  { !!fechado ? <ScreenCloseCaixa fechamento={fechado}/> : <div className="flex flex-col border-t-2 bg-white">
    
       
        <div className="overflow-y-auto mt-1 px-2 h-[calc(100vh-174px)] ">
       
        <Table hoverable theme={{root:{shadow:'none'}, body: { cell: { base: "px-4 py-1 text-xs" } } }} 
    >
        <Table.Head theme={{cell:{base:"bg-gray-50 px-4 py-1 "}}} >
        
                <Table.HeadCell className="whitespace-nowrap" >
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
            {lancamentos?.map((item,index)=>(
            <Table.Row className=" text-black font-semibold ">

<Table.Cell className="whitespace-nowrap   ">
{item.num_seq}
            </Table.Cell>
            <Table.Cell  data-tooltip-id="tooltip-hora" data-tooltip-place="bottom" data-tooltip-content={new Date(item.datalanc).toLocaleTimeString()} >
            {new Date(item.datalanc).toLocaleDateString('pt-BR',{timeZone:'UTC'})}
            </Table.Cell>
            <Table.Cell>{item.conta}</Table.Cell>
            
            
           
            <Table.Cell className="whitespace-nowrap">{item.ccustos_desc  }</Table.Cell>
            <Table.Cell>  {item.notafiscal?item.notafiscal.toUpperCase():item?.descricao?.toUpperCase()}</Table.Cell>
            <Table.Cell> {item.historico}</Table.Cell>
            <Table.Cell className={`font-semibold ${item.tipo==='RECEITA'?"text-green-500":"text-red-500"}`}> {item.tipo}</Table.Cell>
            <Table.Cell>{Number(item.valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
          
            <Table.Cell className="space-x-4 whitespace-nowrap">
            <button disabled={item.conta==='1.01.002'||!permissoes.includes('ADM2.1.3')} onClick={(event)=>{
                               event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                               setMov({...item})
                              setModal(true)
                            }} className="font-medium text-gray-500 hover:text-cyan-600 disabled:cursor-not-allowed">
                    <HiPencil size={14} />
                  </button>
                  <button disabled={item.conta==='1.01.002'|| !permissoes.includes('ADM2.1.4')} onClick={() =>{setMov({lanc_id:item.lanc_id}), setModalExc(true)}} className="font-medium text-gray-500 hover:text-red-600 disabled:cursor-not-allowed">
                    <MdDelete size={16} />
                  </button>
            
                  </Table.Cell>
          
            </Table.Row>

            ))}
           
           </Table.Body>
    
    </Table>
    </div>
    </div>}


{!fechado &&    <div className="inline-flex gap-2   text-black w-full bg-white p-2">
        <button disabled={!permissoes.includes('ADM2.1.5')} onClick={()=>setVisible(!visible)} className="justify-center items-center disabled:hover:cursor-not-allowed">
           {visible? <IoMdEye color="blue" size={20}/>:<IoMdEyeOff color="blue" size={20}/>}
            </button>
   
    <div className="text{-black">
        <span className={`inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border  rounded-s-lg  focus:z-10 focus:ring-2  bg-gray-100 border-gray-400 ${saldo<0?"text-red-500":""}`}>

   {visible?`Saldo: ${Number(saldo).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`:"------"}
  </span>
  <span className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border-t border-b    bg-gray-100 border-gray-400  ">
   
  {visible?`Receitas:  ${Number(saldo+despesas).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`:"------"}
  </span>
  <span className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border 0 rounded-e-lg    bg-gray-100 border-gray-400 ">

  {visible?`Despesas: ${Number(despesas).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`:"------"}
  </span>
  </div>


  <Button onClick={()=>setPrint(true)} className="ml-auto" size={'xs'}><IoPrint className="mr-2 h-4 w-4" /> Imprimir Caixa</Button>
  <Button onClick={()=>setFecModal(true)} className="ml-auto" size={'xs'}>Fechar Caixa</Button>
    </div>}

    </div>



<ModalFechamento listar={()=>listarLancamentos({endDate:watch('endDate'),startDate:watch('startDate'),id_empresa:selectEmp,descricao:watch('descricao')})} dataCaixaEnd={watch('endDate')} dataCaixa={watch('startDate')}  id_empresa={selectEmp} lancamentos={lancamentos} id_usuario={usuario?.id??''} openModal={openFecModal} setOpenModal={setFecModal}/>


{openModalPrint && <ModalImpressao array={lancamentos} openModal={openModalPrint} setOpenModal={setPrint} startDate={watch('startDate')} endDate={watch('endDate')} usuario={usuario?.nome??''}/>}


</>
)

}