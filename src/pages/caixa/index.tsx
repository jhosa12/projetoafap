import { BiTransfer } from "react-icons/bi";
import { api } from "@/services/apiClient";
import { MdOutlineAddCircle } from "react-icons/md";
import { use, useContext, useEffect, useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { ModalLancamentosCaixa } from "@/components/caixa/modalLancamentosCaixa";
import { Tooltip } from "react-tooltip";
import { AuthContext } from "@/contexts/AuthContext";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Button, Label, Modal, Select, Spinner, Table, TextInput } from "flowbite-react";
import { HiOutlineTrash, HiPencil } from "react-icons/hi2";
import { toast } from "react-toastify";
import { ModalExcluir } from "@/components/modalExcluir";
import { ModalFechamento } from "../../components/caixa/modalFechamento";
import  Fechamento  from "@/Documents/caixa/Fechamento";
import { useReactToPrint } from "react-to-print";
import { Scanner } from "@/components/admContrato/historicoMensalidade/modalScanner";
import { ModalDadosMensalidade } from "@/components/caixa/modalDadosMensalidade";
import { SubmitHandler, useForm } from "react-hook-form";


registerLocale('pt', pt)



export interface LancamentosProps{
    lanc_id:number,
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
    empresa:string,
    mensalidade:{ form_pagto:string}
}
interface GrupoPrps{
    id_grupo:number,
    descricao:string
}

export interface MensalidadeProps{
    id_mensalidade:number,
    associado:{
        nome:string,
        endereco:string,
        mensalidade:Array<{
            id_mensalidade:number,
            referencia:string,
            vencimento:Date,
            valor_principal:number,
            n_doc:string
        }>
    },
    id_contrato:number,
    referencia:string,
    status:string,
    valor_principal:number,
    vencimento:Date,
    valor_total:number,
    form_pagto:string,
    banco_dest:string,
    motivo_bonus:string
}

interface FormProps{
    startDate:Date,
    endDate:Date,
    id_empresa:string,
    descricao:string
}


export default function CaixaMovimentar(){
    const[lancamentos,setLancamentos]=useState<Array<LancamentosProps>>([]);
    const[mov,setMov]=useState<Partial<LancamentosProps>>();
    const[saldo,setSaldo]=useState(0);
    const[grupos,setGrupos] = useState<Array<GrupoPrps>>([])
    const[despesas,setDespesas]=useState(0);
    const [empresaApi,setApiEmpresa] = useState('')
    const [planos,setPlanos]=useState([]);
    const {usuario,permissoes,empresas} =useContext(AuthContext);
    const[visible,setVisible] = useState(false);
    const [openModal,setModal] = useState<boolean>(false);
    const [openModalExc,setModalExc] = useState<boolean>(false);
    const [loading,setLoading] = useState<boolean>(false);
    const [openFecModal,setFecModal]= useState<boolean>(false)
    const [scanner,setScanner] = useState<boolean>(false)
    const [mensalidade,setMensalidade] = useState<Partial<MensalidadeProps>>()
    const [modalDados,setModalDados] = useState<boolean>(false)
    const {register,watch,setValue,handleSubmit}= useForm<FormProps>({
        defaultValues:{
            startDate:new Date(),
            endDate:new Date(),
            id_empresa:empresas[1]?.id,
        }
    })


    const currentePage = useRef<Fechamento>(null)
    




    useEffect(()=>{



        const handleScanner=(event:KeyboardEvent)=>{

            if(event.key==='F2'){
                setScanner(true)
            }
           
        }

        document.addEventListener('keydown',handleScanner)

        return () => {
            document.removeEventListener('keydown', handleScanner);
        };



    },[])

    const imprimir = useReactToPrint({
        content:()=>currentePage.current,

    })



    const buscarMensalidade = async(n_doc:string)=>{
        setLoading(true)
        try {
         const response = await api.post('/mensalidade/baixaDireta',{
           n_doc
         })
         setMensalidade({...response.data,valor_total:response.data.valor_principal})
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
       }
       
  

       useEffect(()=>{

        listarLancamentos()
           
       },[])






  const  handleExcluir=async()=>{

    try {
      await toast.promise(
            api.delete(`/caixa/deletar/${empresaApi}/${mov?.lanc_id}`),
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
    

   

   const listarLancamentos = async()=> {
        try{
            setLoading(true)
            const response = await api.post('/listarLancamentos',{
                empresa:watch('id_empresa'),
                dataInicial:watch('startDate'),
                dataFinal:watch('endDate'),
                descricao:  watch('descricao'),
                id_user:usuario?.id
          
            })

            setLancamentos(response.data.lista)
            setPlanos(response.data.plano_de_contas)
            setGrupos(response.data.grupos)
            setApiEmpresa(response.data.empresa)
          
            setLoading(false)
            
         }catch(err){
            console.log(err)
         }
        
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
<div style={{display:'none'}}>
<Fechamento dataFim={watch('endDate')} dataInicio={watch('startDate')} usuario={usuario?.nome??''}  ref={currentePage}/>
</div>

<ModalLancamentosCaixa empresas={empresas} listarLancamentos={listarLancamentos}  empresaAPI={empresaApi} arrayLanc={lancamentos} setLancamentos={setLancamentos}  mov={mov??{}} openModal={openModal} setOpenModal={setModal}  planos={planos}  grupo={grupos}/>

<ModalExcluir openModal={openModalExc} handleExcluir={handleExcluir} setOpenModal={setModalExc}/>

<ModalDadosMensalidade setMensalidade={setMensalidade} mensalidade={mensalidade??{}} open={modalDados} setOpen={setModalDados}/>

<Modal size={'sm'} popup show={loading}>
    <Modal.Body>
        <div className=" flex flex-col mt-6 w-full justify-center items-center">
        <Spinner size={'lg'} color={'warning'}/>
        <span>Localizando dados....</span>
        </div>
       
    </Modal.Body>
</Modal>

<div className="flex flex-col px-2 w-full mt-1  max-h-[89vh] overflow-y-auto">
    <div className="text-gray-600 bg-gray-50 rounded-t-lg inline-flex items-center w-full justify-between">
   
    <form  className="flex w-full flex-row justify-end p-1 gap-4 text-black font-semibold">



    <div >
        <div className=" block">
          <Label value="Empresa" />
        </div>
     <Select {...register('id_empresa')}  className="flex w-full uppercase  z-50 text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  "   sizing={'sm'}>
        <option value={''}>Selecione a empresa</option>
        {empresas?.map(item=>(
            <option key={item.id} value={item.id}>{item.nome}</option>
        ))}
     </Select>
      </div>


    <div >
        <div className=" block">
          <Label  value="Data inicial" />
        </div>
       <DatePicker selected={watch('startDate')} onChange={e=>e && setValue('startDate',e)}  dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase  z-50 text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
      </div>



      <div >
        <div className=" block">
          <Label  value="Data final" />
        </div>
       <DatePicker selected={watch('endDate')} onChange={e=>e && setValue('endDate',e)}     dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase  z-50 text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
      </div>
      
      <div className="w-1/4" >
        <div className=" block">
          <Label  value="Buscar" />
        </div>
        <TextInput {...register('descricao')}   sizing={'sm'}  />
      </div> 
         
                   <div className="flex items-end gap-4">
                   <Button isProcessing={loading}  size={'sm'} onClick={listarLancamentos} ><IoSearchSharp size={20}/> Buscar</Button>

                   <Button onClick={()=>setScanner(true)} size={'sm'} color={'warning'} >{`Receber ( F2 )`}</Button>
                   </div>
                   <div className="flex   items-end justify-end pr-2 ">
                   <Button disabled={!permissoes.includes('ADM2.1.1')} color={'success'} size={'sm'} onClick={()=>{setMov({conta:'',conta_n:'',ccustos_desc:'',data:undefined,datalanc:new Date(),descricao:'',historico:'',num_seq:null,tipo:'',usuario:'',valor:null,ccustos_id:null,notafiscal:''}),setModal(true)}} ><MdOutlineAddCircle size={20}/> Novo</Button>

                 
                   </div>
                   
        </form>
    </div>
    <div className="flex flex-col border-t-2 bg-white">
    
       
        <div className="overflow-y-auto mt-1 px-2 h-[72vh] max-h-[72vh] ">
       
        <Table hoverable theme={{ body: { cell: { base: " px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs text-black" } } }} 
    >
        <Table.Head >
        
                <Table.HeadCell >
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
                               setMov({...item,empresa:empresaApi})
                              setModal(true)
                            }} className="font-medium text-gray-500 hover:text-cyan-600 disabled:cursor-not-allowed">
                    <HiPencil size={18} />
                  </button>
                  <button disabled={item.conta==='1.01.002'|| !permissoes.includes('ADM2.1.4')} onClick={() =>{setMov({lanc_id:item.lanc_id}), setModalExc(true)}} className="font-medium text-gray-500 hover:text-red-600 disabled:cursor-not-allowed">
                    <HiOutlineTrash size={20} />
                  </button>
            
                  </Table.Cell>
          
            </Table.Row>

            ))}
           
           </Table.Body>
    
    </Table>
    </div>
    </div>

   

    <div className="inline-flex gap-2  rounded-b-lg text-black w-full bg-white p-2">
        <button onClick={()=>setVisible(!visible)} className="justify-center items-center">
           {visible? <IoMdEye size={20}/>:<IoMdEyeOff color="blue" size={20}/>}
            </button>
   
    <div className="text-black">
        <span className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border  rounded-s-lg  focus:z-10 focus:ring-2  bg-gray-300 border-gray-400 " >

   {visible?`Saldo: ${Number(saldo).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`:"------"}
  </span>
  <span className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border-t border-b    bg-gray-300 border-gray-400  ">
   
  {visible?`Receitas:  ${Number(saldo+despesas).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`:"------"}
  </span>
  <span className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border 0 rounded-e-lg    bg-gray-300 border-gray-400 ">

  {visible?`Despesas: ${Number(despesas).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`:"------"}
  </span>
  </div>


  <Button onClick={()=>imprimir()} className="ml-auto" size={'sm'}>Imprimir Caixa</Button>
  <Button onClick={()=>setFecModal(true)} className="ml-auto" size={'sm'}>Fechar Caixa</Button>
    </div>

    </div>



<ModalFechamento lancamentos={lancamentos} id_usuario={usuario?.id??''} openModal={openFecModal} setOpenModal={setFecModal}/>

{scanner && <Scanner openModal={scanner} setModal={setScanner} verficarTicket={buscarMensalidade}/>}
<Tooltip id="tooltip-hora"/>
</>
)

}