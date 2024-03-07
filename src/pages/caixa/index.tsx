import { MenuLateral } from "@/components/menu";
import { BiTransfer } from "react-icons/bi";
import { api } from "@/services/apiClient";
import { MdOutlineAddCircle } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { ModalLancamentosCaixa } from "@/components/modalLancamentosCaixa";
import { Tooltip } from "react-tooltip";
import { AuthContext } from "@/contexts/AuthContext";
import {decode} from 'jsonwebtoken';
import {destroyCookie,setCookie,parseCookies} from "nookies"

registerLocale('pt', pt)

interface LancamentosProps{
    num_seq:number,
    conta:string,
    ccustos_id:number,
    ccustos_desc:string,
    descricao:string,
    conta_n:string,
    data:Date,
    notafiscal:string,
    historico:string,
    tipo:string,
    valor:number,
    datalanc:Date,
    usuario:string
}


export default function CaixaMovimentar(){
    const[lancamentos,setLancamentos]=useState<Array<LancamentosProps>>([]);
    const[dataInicial,setDataInicial] =useState<Date>(new Date());
    const[dataFinal,setDataFinal] =useState<Date>(new Date());
    const[descricao,setDescricao] =useState('');
    const[saldo,setSaldo]=useState(0);
    const[saldoInicial,setSaldoInicial]=useState(0);
    const[despesas,setDespesas]=useState(0);
    const[IsModalOpen,setIsModalOpen] =useState(false);
    const [planos,setPlanos]=useState([]);
    const {caixaMovimentacao,user,usuario} =useContext(AuthContext);

    const closeModal = ()=>{
        setIsModalOpen(false)
    }

    useEffect(()=>{
      listarLancamentos()
    },[usuario])

    async function listarLancamentos() {
        try{
            const response = await api.post('/listarLancamentos',{
              
                dataInicial:dataInicial,
                dataFinal:dataFinal,
                descricao:descricao,
                ccustos_id:Number(usuario?.id)
          
            })

            setLancamentos(response.data.lista)
            setSaldoInicial(response.data.dif)
            setPlanos(response.data.plano_de_contas)
           console.log(response.data)
            
            
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
{IsModalOpen && <ModalLancamentosCaixa listarLancamentos={listarLancamentos} planos={planos} closeModal={closeModal}/>}
<MenuLateral/>
<div className="flex w-full justify-center p-4">
<div className="flex flex-col w-11/12 border  rounded-lg shadow  border-gray-700 ">
    <div className="text-gray-300 bg-gray-800 rounded-t-lg inline-flex items-center p-2 justify-between">
    <h1 className=" text-lg  pl-3 font-medium">Movimentação de Caixa</h1>
    <p className="inline-flex gap-28  text-[15px]">
    <span className="text-yellow-300 font-medium">Saldo Inical: R$ {saldoInicial}</span>
    <span className="text-green-500 font-medium">Saldo do Dia: R${saldo+saldoInicial}</span>
    <span className="text-green-500 font-medium">Receitas:R${saldo+despesas}</span>
    <span className="text-red-500 font-medium">Despesas:R${despesas} </span>
    </p>
    </div>
    <div className="flex flex-col">
        <div className="flex flex-row w-full p-2 gap-2">
        <div>
          <label  className="block mb-1 text-xs font-medium  text-white">DATA INICIAL</label>
          <DatePicker selected={dataInicial} onChange={e=>e && setDataInicial(e)}  dateFormat={"dd/MM/yyyy"} locale={"pt"}   required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div>
          <label  className="block mb-1 text-xs font-medium  text-white">DATA FINAL</label>
          <DatePicker selected={dataFinal} onChange={e=>e && setDataFinal(e)}  dateFormat={"dd/MM/yyyy"} locale={"pt"}  required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="flex flex-col w-1/3">
          <label  className="block mb-1 text-xs font-medium  text-white">BUSCAR LANÇAMENTO</label>
          <input value={descricao} onChange={e=>setDescricao(e.target.value)} className="uppercase block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-sm bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"></input>
                   </div>
                   <div className="flex items-end">
                   <button onClick={()=>listarLancamentos()} type="button" className="inline-flex h-8 font-semibold justify-center items-center bg-blue-600 rounded-lg p-2 gap-2 text-white"><IoSearchSharp size={20}/> Buscar</button>
                   </div>

                   <div className="flex w-1/3  items-end justify-end pr-2 ">
                   <button onClick={()=>{caixaMovimentacao({conta:'',conta_n:'',ccustos_desc:'',data:new Date(),datalanc:new Date(),descricao:'',historico:'',num_seq:null,tipo:'',usuario:'',valor:null}),setIsModalOpen(!IsModalOpen)}} type="button" className="inline-flex w- h-8 font-semibold justify-center items-center bg-green-600 rounded-lg p-2 gap-2 text-white"><MdOutlineAddCircle size={22}/> Novo</button>
                   </div>
                  
       
        </div>
        <Tooltip id="tooltip-hora"/>
        <div className="p-2">
        <table 
     className="block overflow-y-auto overflow-x-auto text-xs text-left rtl:text-center border-collapse rounded-lg text-gray-400">
        <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
        <tr>
                <th scope="col" className=" px-2 py-1 whitespace-nowrap">
                    Nº LANC.
                </th>
                <th scope="col" className="px-8 py-1">
                    DATA
                </th>
                <th scope="col" className="px-5 py-1">
                    CONTA
                </th>
                <th scope="col" className="px-5 py-1">
                    C.CUSTOS
                </th>
                <th scope="col" className="px-5 py-1">
                    DOCUMENTO
                </th> 
                <th scope="col" className="px-5 py-1">
                    HISTÓRICO
                </th> 
                <th scope="col" className="px-5 py-1">
                    TIPO
                </th>
                <th scope="col" className="px-5 py-1">
                    VALOR
                </th>  
                <th scope="col" className="px-4 py-1">
                    AÇÕES
                </th> 
             
            </tr>
            
        </thead>
        <tbody className="text-white">
            {lancamentos.map((item,index)=>(
            <tr className="border-b border-gray-500">
            <th scope="row"  className="px-2 py-1 font-medium  whitespace-nowrap">
                   {item.num_seq}
            </th>
            <td data-tooltip-id="tooltip-hora" data-tooltip-place="bottom" data-tooltip-content={new Date(item.data).toLocaleTimeString()} className="px-6 py-1">
            {new Date(item.data).toLocaleDateString('pt-BR',{timeZone: 'UTC'})}
            </td>
            <td className="px-5 py-1 ">
            {item.conta}
           
            </td>
            <td className="px-5 py-1 whitespace-nowrap ">
            {item.ccustos_desc  }
            </td>
            <td className="px-5 py-1 whitespace-nowrap ">
               {item.notafiscal?item.notafiscal:item.descricao}
            </td>
            <td className=" px-5 py-1 w-full whitespace-nowrap">
               {item.historico}
            </td>
            <td className={`px-5 py-1  font-semibold ${item.tipo==='RECEITA'?"text-green-500":"text-red-500"}`}>
               {item.tipo}
            </td>
            <td className="px-5 py-1 ">
               R${item.valor}
            </td>
           
            
            <td className="px-4 py-1 text-right">
                <button onClick={(event)=>{
                               event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                               caixaMovimentacao({data:item.data,
                                conta:item.conta,
                                conta_n:item.conta_n,
                                ccustos_desc:item.ccustos_desc,
                                descricao:item.descricao,
                                historico:item.historico,
                                num_seq:item.num_seq,
                                tipo:item.tipo,
                                valor:item.valor,
                                usuario:item.usuario,
                                notafiscal:item.notafiscal
                            })
                               setIsModalOpen(true)
                            }} className="font-medium  text-blue-500 hover:underline">Edit</button>
            </td>
           </tr>

            ))}
           
        </tbody>
    
    </table>
    </div>
    </div>
    <div className="flex  items-end justify-end p-1 ">
                   <button onClick={()=>{caixaMovimentacao({conta:'',conta_n:'',ccustos_desc:'',data:new Date(),datalanc:new Date(),descricao:'',historico:'',num_seq:null,tipo:'',usuario:'',valor:null}),setIsModalOpen(!IsModalOpen)}} type="button" className="inline-flex  font-semibold justify-center items-center bg-yellow-600 rounded-lg p-2 gap-2 text-white"><BiTransfer size={22}/> Transferir</button>
    </div>
</div>
</div>



</>
)




}