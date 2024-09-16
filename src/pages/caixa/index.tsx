import { BiTransfer } from "react-icons/bi";
import { api } from "@/services/apiClient";
import { MdOutlineAddCircle } from "react-icons/md";
import { useContext, useEffect, useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { ModalLancamentosCaixa } from "@/components/caixa/modalLancamentosCaixa";
import { Tooltip } from "react-tooltip";
import { AuthContext } from "@/contexts/AuthContext";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Button, Label, Select, Table, TextInput } from "flowbite-react";
import { HiOutlineTrash, HiPencil } from "react-icons/hi2";
import { toast } from "react-toastify";
import { ModalExcluir } from "@/components/modalExcluir";
import { ModalFechamento } from "../../components/caixa/modalFechamento";
import  Fechamento  from "@/Documents/caixa/Fechamento";
import { useReactToPrint } from "react-to-print";


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


export default function CaixaMovimentar(){
    const[lancamentos,setLancamentos]=useState<Array<LancamentosProps>>([]);
    const[mov,setMov]=useState<Partial<LancamentosProps>>();
    const[dataInicial,setDataInicial] =useState<Date>(new Date());
    const[dataFinal,setDataFinal] =useState<Date>(new Date());
    const[descricao,setDescricao] =useState('');
    const[saldo,setSaldo]=useState(0);
    const[grupos,setGrupos] = useState<Array<GrupoPrps>>([])
    const[saldoInicial,setSaldoInicial]=useState(0);
    const[despesas,setDespesas]=useState(0);
    const [empresaApi,setApiEmpresa] = useState('')
    const [selectEmpresa,setSelectEmpresa] = useState('')
    const [planos,setPlanos]=useState([]);
    const {usuario,permissoes} =useContext(AuthContext);
    const[visible,setVisible] = useState(false);
    const [openModal,setModal] = useState<boolean>(false);
    const [openModalExc,setModalExc] = useState<boolean>(false);
    const [loading,setLoading] = useState<boolean>(false);
    const [openFecModal,setFecModal]= useState<boolean>(false)


    const currentePage = useRef<Fechamento>(null)
    

    const imprimir = useReactToPrint({
        content:()=>currentePage.current,

    })





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
    

   

    async function listarLancamentos() {
        try{
            setLoading(true)
            const response = await api.post('/listarLancamentos',{
                empresa:selectEmpresa,
                dataInicial:dataInicial,
                dataFinal:dataFinal,
                descricao:descricao,
                id_user:usuario?.id
          
            })

            setLancamentos(response.data.lista)
            setSaldoInicial(response.data.dif)
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
<Fechamento dataFim={dataFinal} dataInicio={dataInicial} usuario={usuario?.nome??''}  ref={currentePage}/>
</div>

<ModalLancamentosCaixa listarLancamentos={listarLancamentos}  empresaAPI={empresaApi} arrayLanc={lancamentos} setLancamentos={setLancamentos} setMov={setMov} mov={mov??{}} openModal={openModal} setOpenModal={setModal}  planos={planos}  grupo={grupos}/>

<ModalExcluir openModal={openModalExc} handleExcluir={handleExcluir} setOpenModal={setModalExc}/>



<div className="flex flex-col w-full border  rounded-lg shadow  border-gray-600 max-h-[89vh]">
    <div className="text-gray-600 bg-gray-50 rounded-t-lg inline-flex items-center w-full justify-between">
    <h1 className="flex  text-lg items-end pl-3 font-medium whitespace-nowrap">Movimentação de Caixa</h1>
    <div className="flex w-full flex-row justify-end p-1 gap-2">



    <div >
        <div className=" block">
          <Label value="Empresa" />
        </div>
     <Select value={selectEmpresa} onChange={e=>setSelectEmpresa(e.target.value)} sizing={'sm'}>
        <option value={''}></option>
        <option value={'AFAP CEDRO'}>AFAP CEDRO</option>
        <option value={'AFAP LAVRAS'}>AFAP LAVRAS</option>
        <option value={'OTICA FREITAS'}>OTICA FREITAS</option>
        <option value={'AFAP VIVAMAIS'}>AFAP VIVAMAIS</option>
        <option value={'AFAP SAUDE'}>AFAP SAUDE</option>
     </Select>
      </div>


    <div >
        <div className=" block">
          <Label  value="Data inicial" />
        </div>
       <DatePicker selected={new Date(dataInicial)} onChange={e=>e && setDataInicial(new Date(e))}  dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase  z-50 text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
      </div>



      <div >
        <div className=" block">
          <Label  value="Data final" />
        </div>
       <DatePicker selected={new Date(dataFinal)} onChange={e=>e && setDataFinal(new Date(e))}   dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase  z-50 text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
      </div>
      
      <div className="w-1/4" >
        <div className=" block">
          <Label  value="Buscar" />
        </div>
        <TextInput value={descricao} onChange={e=>setDescricao(e.target.value)}   sizing={'sm'}  />
      </div> 
         
                   <div className="flex items-end">
                   <Button isProcessing={loading}  size={'sm'} onClick={()=>listarLancamentos()} ><IoSearchSharp size={20}/> Buscar</Button>
                   </div>
                   <div className="flex   items-end justify-end pr-2 ">
                   <Button disabled={!permissoes.includes('ADM2.1.1')} color={'success'} size={'sm'} onClick={()=>{setMov({conta:'',conta_n:'',ccustos_desc:'',data:undefined,datalanc:new Date(),descricao:'',historico:'',num_seq:null,tipo:'',usuario:'',valor:null,ccustos_id:null,notafiscal:''}),setModal(true)}} ><MdOutlineAddCircle size={20}/> Novo</Button>
                   </div>
        </div>
    </div>
    <div className="flex flex-col border-t-2">
    
       
        <div className="overflow-y-auto mt-1 px-2 max-h-[72vh] ">
        <Tooltip id="tooltip-hora"/>
        <Table hoverable theme={{ body: { cell: { base: "px-4 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-gray-700" } } }} 
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
            <Table.Row className="bg-white  ">

<Table.Cell className="whitespace-nowrap font-medium text-gray-900 ">
{item.num_seq}
            </Table.Cell>
            <Table.Cell  data-tooltip-id="tooltip-hora" data-tooltip-place="bottom" data-tooltip-content={new Date(item.data).toLocaleTimeString()} >
            {new Date(item.data).toLocaleDateString('pt-BR',{timeZone:'UTC'})}
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

   

    <div className="inline-flex gap-2 text-white w-full p-2">
        <button onClick={()=>setVisible(!visible)} className="justify-center items-center">
           {visible? <IoMdEye size={20}/>:<IoMdEyeOff size={20}/>}
            </button>
   
    <div><span className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border  rounded-s-lg  focus:z-10 focus:ring-2  bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">

   {visible?`Saldo: ${Number(saldo).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`:"------"}
  </span>
  <span className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border-t border-b  focus:z-10 focus:ring-2  bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
   
  {visible?`Receitas:  ${Number(saldo+despesas).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`:"------"}
  </span>
  <span className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border 0 rounded-e-lg  focus:z-10 focus:ring-2   bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">

  {visible?`Despesas: ${Number(despesas).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`:"------"}
  </span>
  </div>


  <Button onClick={()=>imprimir()} className="ml-auto" size={'sm'}>Imprimir Caixa</Button>
  <Button onClick={()=>setFecModal(true)} className="ml-auto" size={'sm'}>Fechar Caixa</Button>
    </div>

    </div>



<ModalFechamento lancamentos={lancamentos} id_usuario={usuario?.id??''} openModal={openFecModal} setOpenModal={setFecModal}/>

</>
)




}