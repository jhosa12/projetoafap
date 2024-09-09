import { BiTransfer } from "react-icons/bi";
import { api } from "@/services/apiClient";
import { MdOutlineAddCircle } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { ModalLancamentosCaixa } from "@/components/caixa/modalLancamentosCaixa";
import { Tooltip } from "react-tooltip";
import { AuthContext } from "@/contexts/AuthContext";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Button, Label, Table, TextInput } from "flowbite-react";


registerLocale('pt', pt)



export interface LancamentosProps{
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
    id_grupo:number|null
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
    
    const [planos,setPlanos]=useState([]);
    const {usuario,signOut} =useContext(AuthContext);
    const[visible,setVisible] = useState(false)
    const [openModal,setModal] = useState<boolean>(false)
   

    

    useEffect(()=>{
       
     
      listarLancamentos()
    },[])

    async function listarLancamentos() {
        try{
            const response = await api.post('/listarLancamentos',{
              
                dataInicial:dataInicial,
                dataFinal:dataFinal,
                descricao:descricao,
                id_user:usuario?.id
          
            })

            setLancamentos(response.data.lista)
            setSaldoInicial(response.data.dif)
            setPlanos(response.data.plano_de_contas)
            setGrupos(response.data.grupos)
          
            
            
         }catch(err){
 
         }
        
    }


    useEffect(()=>{
       
            const soma =   lancamentos.reduce((total,item)=>{
                    if(item.tipo ==='RECEITA'){ return total=total+Number(item.valor)}
                    else return total=total-Number(item.valor)
                },0)
            setSaldo(soma)
            const somadespesas = lancamentos.reduce((total,item)=>{
                if(item.tipo==='DESPESA'){
                    return total=total+Number(item.valor)
                }
                else{
                    return total
                }
                
                },0)
                setDespesas(somadespesas)
       
   

    },[lancamentos])

return(
<>

<ModalLancamentosCaixa setMov={setMov} mov={mov??{}} openModal={openModal} setOpenModal={setModal} listarLancamentos={listarLancamentos} planos={planos}  grupo={grupos}/>


<div className="flex w-full justify-center p-4">
<div className="flex flex-col w-full border  rounded-lg shadow  border-gray-700 ">
    <div className="text-gray-600 bg-gray-50 rounded-t-lg inline-flex items-center p-2 justify-between">
    <h1 className="flex  text-lg items-end pl-3 font-medium">Movimentação de Caixa</h1>
    <div className="flex flex-row justify-end p-2 gap-2">

    <div >
        <div className=" block">
          <Label  value="Data inicial" />
        </div>
       <DatePicker selected={dataInicial} onChange={e=>e && setDataInicial(e)}  dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase  z-50 text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
      </div>



      <div >
        <div className=" block">
          <Label  value="Data final" />
        </div>
       <DatePicker selected={dataFinal} onChange={e=>e && setDataFinal(e)}   dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase  z-50 text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
      </div>
      
      <div className="w-1/2" >
        <div className=" block">
          <Label  value="Buscar" />
        </div>
        <TextInput value={descricao} onChange={e=>setDescricao(e.target.value)}  disabled sizing={'sm'}  />
      </div> 
         
                   <div className="flex items-end">
                   <Button size={'sm'} onClick={()=>listarLancamentos()} ><IoSearchSharp size={20}/> Buscar</Button>
                   </div>
                   <div className="flex   items-end justify-end pr-2 ">
                   <Button color={'success'} size={'sm'} onClick={()=>{setMov({conta:'',conta_n:'',ccustos_desc:'',data:undefined,datalanc:new Date(),descricao:'',historico:'',num_seq:null,tipo:'',usuario:'',valor:null,ccustos_id:null,notafiscal:''}),setModal(true)}} ><MdOutlineAddCircle size={20}/> Novo</Button>
                   </div>
        </div>
    </div>
    <div className="flex flex-col border-t-2">
    
        <Tooltip id="tooltip-hora"/>
        <div className="overflow-y-auto p-2">
        <Table  hoverable theme={{ body: { cell: { base: "px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg" } } }} 
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
            {lancamentos.map((item,index)=>(
            <Table.Row className="bg-white  ">

<Table.Cell className="whitespace-nowrap font-medium text-gray-900 ">
{item.num_seq}
            </Table.Cell>
            <Table.Cell  data-tooltip-id="tooltip-hora" data-tooltip-place="bottom" data-tooltip-content={new Date(item.data).toLocaleTimeString()} >
            {new Date(item.data).toLocaleDateString('pt-BR',{timeZone: 'UTC'})}
            </Table.Cell>
            <Table.Cell>{item.conta}</Table.Cell>
            
            
           
            <Table.Cell>{item.ccustos_desc  }</Table.Cell>
            <Table.Cell>  {item.notafiscal?item.notafiscal.toUpperCase():item.descricao.toUpperCase()}</Table.Cell>
            <Table.Cell> {item.historico}</Table.Cell>
            <Table.Cell className={`font-semibold ${item.tipo==='RECEITA'?"text-green-500":"text-red-500"}`}> {item.tipo}</Table.Cell>
            <Table.Cell>{Number(item.valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
          
            <Table.Cell> <button onClick={(event)=>{
                               event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                               setMov({...item})
                              setModal(true)
                            }} className="font-medium  text-blue-500 hover:underline">Edit</button></Table.Cell>
            
          
            </Table.Row>

            ))}
           
           </Table.Body>
    
    </Table>
    </div>
    </div>

    <div className="flex  items-end justify-between p-2 ">

    <div className="inline-flex gap-2 text-white">
        <button onClick={()=>setVisible(!visible)} className="justify-center items-center">
           {visible? <IoMdEye size={20}/>:<IoMdEyeOff size={20}/>}
            </button>
   
    <div><span className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border  rounded-s-lg  focus:z-10 focus:ring-2  bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">

   {visible?`Saldo: R$ ${saldo}`:"------"}
  </span>
  <span className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border-t border-b  focus:z-10 focus:ring-2  bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
   
  {visible?`Receitas: R$ ${saldo+despesas}`:"------"}
  </span>
  <span className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border 0 rounded-e-lg  focus:z-10 focus:ring-2   bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">

  {visible?`Despesas: R$ ${despesas}`:"------"}
  </span>
  </div>
    </div>
    <button onClick={()=>{setMov({conta:'1.02.003',conta_n:'',ccustos_desc:'',data:new Date(),datalanc:new Date(),descricao:'SANGRIA',historico:'',num_seq:null,tipo:'DESPESA',usuario:'',valor:null,ccustos_id:null,notafiscal:''}),setModal(true)}} type="button" className="inline-flex  font-semibold justify-center items-center bg-yellow-600 rounded-lg p-2 gap-2 text-white"><BiTransfer size={22}/>Sangria</button>
    </div>
</div>
</div>



</>
)




}