import { MenuLateral } from "@/components/menu";
import { api } from "@/services/apiClient";
import { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
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
    datalanc:Date
}

export default function CaixaMovimentar(){
    const[lancamentos,setLancamentos]=useState<Array<LancamentosProps>>([])
    const[dataInicial,setDataInicial] =useState<Date>(new Date())
    const[dataFinal,setDataFinal] =useState<Date>(new Date())
    const[saldo,setSaldo]=useState(0)

    useEffect(()=>{

        async function listarLancamentos() {
            try{
                const response = await api.get('/listarLancamentos')

                setLancamentos(response.data.lista)
                
                
             }catch(err){
     
             }
            
        }
        
        listarLancamentos()
       

    },[])
    useEffect(()=>{
       
            const soma =   lancamentos.reduce((total,item)=>{
                    if(item.tipo ==='RECEITA'){ return total=total+Number(item.valor)}
                    else return total=total-Number(item.valor)
                },0)
            setSaldo(soma)
       
   

    },[lancamentos])

return(
<>
<MenuLateral/>
<div className="flex w-full justify-center p-4">
<div className="flex flex-col w-11/12 border  rounded-lg shadow  border-gray-700 ">
    <div className="text-gray-300 bg-gray-800 rounded-t-lg inline-flex items-center p-2 justify-between">
    <h1 className=" text-lg  pl-3 font-medium">Movimentação de Caixa</h1>
    <p className="inline-flex gap-28  text-[15px]">
    <span className="text-yellow-300 font-medium">Saldo Inical:</span>
    <span className="text-green-500 font-medium">Saldo do Dia: R${saldo}</span>
    <span className="text-green-500 font-medium">Receitas:</span>
    <span className="text-green-500 font-medium">Despesas: </span>
    </p>
    </div>
    <div className="flex flex-col">
        <div className="flex flex-row p-2 gap-2">
        <div>
          <label  className="block mb-1 text-sm font-medium  text-white">DATA INICIAL</label>
          <DatePicker selected={dataInicial} onChange={e=>e && setDataInicial(e)}  dateFormat={"dd/MM/yyyy"} locale={"pt"}   required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div>
          <label  className="block mb-1 text-sm font-medium  text-white">DATA FINAL</label>
          <DatePicker selected={dataFinal} onChange={e=>e && setDataFinal(e)}  dateFormat={"dd/MM/yyyy"} locale={"pt"}  required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="flex flex-col w-1/3">
          <label  className="block mb-1 text-sm font-medium  text-white">BUSCAR LANÇAMENTO</label>
          <input className="block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-sm bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"></input>
                   </div>
                   <div className="flex items-end">
                   <button type="button" className="inline-flex h-8 justify-center items-center bg-blue-600 rounded-lg p-2 gap-2 text-white"><IoSearchSharp size={20}/> Buscar</button>
                   </div>
                  
       
        </div>
      
        <table 
     className="block p-2 overflow-y-auto overflow-x-auto text-xs text-left rtl:text-center border-collapse rounded-lg text-gray-400">
        <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
        <tr>
                <th scope="col" className=" px-2 py-1 whitespace-nowrap">
                    Nº LANC.
                </th>
                <th scope="col" className="px-8 py-1">
                    DATA
                </th>
                <th scope="col" className="px-8 py-1">
                    CONTA
                </th>
                <th scope="col" className="px-8 py-1">
                    C.CUSTOS
                </th>
                <th scope="col" className="px-8 py-1">
                    DOCUMENTO
                </th> 
                <th scope="col" className="px-8 py-1">
                    HISTÓRICO
                </th> 
                <th scope="col" className="px-8 py-1">
                    TIPO
                </th>
                <th scope="col" className="px-8 py-1">
                    VALOR
                </th>  
                <th scope="col" className="px-8 py-1">
                    AÇÕES
                </th> 
             
            </tr>
            
        </thead>
        <tbody className="text-white">
            {lancamentos.map((item,index)=>(
            <tr className="border-b border-gray-400">
            <th scope="row"  className="px-6 py-1 font-medium  whitespace-nowrap">
                   {item.num_seq}
            </th>
            <td className="px-6 py-1">
            {new Date(item.data).toLocaleDateString()}
            </td>
            <td className="px-6 py-1">
            {item.conta}
           
            </td>
            <td className="px-6 py-1">
            {item.ccustos_desc  }
            </td>
            <td className="px-6 py-1">
               {item.notafiscal}
            </td>
            <td className="px-6 py-1">
               {item.historico}
            </td>
            <td className="px-6 py-1">
               {item.tipo}
            </td>
            <td className="px-6 py-1">
               {item.valor}
            </td>
           
            
            <td className="px-4 py-1 text-right">
                <button onClick={(event)=>{
                               event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                            }} className="font-medium  text-blue-500 hover:underline">Edit</button>
            </td>
           </tr>

            ))}
           
        </tbody>
    
    </table>
    </div>
</div>
</div>



</>
)




}