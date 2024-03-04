import { MenuLateral } from "@/components/menu"
import { api } from "@/services/apiClient"
import { useEffect, useState } from "react"

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
    const[lançamentos,setLancamentos]=useState<Array<LancamentosProps>>([])

    useEffect(()=>{

        async function listarLancamentos() {
            try{
                const response = await api.get('/listarLancamentos')

                setLancamentos(response.data)
     
             }catch(err){
     
             }
            
        }
        
        listarLancamentos()

    },[])

return(
<>
<MenuLateral/>
<div className="flex w-full justify-center p-4">
<div className="flex flex-col w-11/12 border  rounded-lg shadow  border-gray-700 ">
    <div className="bg-gray-800 rounded-t-lg">
    <h1 className="text-gray-300 text-lg p-2 pl-3 font-medium">Movimentação de Caixa</h1>
    </div>
    <div className="flex flex-col">
        <div className="flex flex-row p-2">
        <input className="block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-sm bg-gray-800 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"></input>
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
            {lançamentos.map((item,index)=>(
            <tr>
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