
import { api } from "@/services/apiClient";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/AuthContext";
import { IoMdSearch } from "react-icons/io";




export default function GerarOS(){
    
    const {usuario}= useContext(AuthContext)

    useEffect(()=>{
        try{
         
          
        }catch(err){
           toast.error('Erro ao Listar Notificações')
        }
     },[])




        async function lancarMovimentacao({dados,id_origem,id_notificacao}:{dados:string,id_origem:number,id_notificacao:number}) {
        
            const array  = dados.split('-')
            const descricao= array[1].split(':')[1]
            const nome= array[2].split(':')[1]
            const valor = array[3].split(':')[1]
            console.log(Number(valor))
            try{
             const lancamento = await toast.promise(

                    api.post('/novoLancamento',{
                    id_usuario:Number(id_origem),
                    datalanc:new Date(),
                    conta:'1.02.003',
                    conta_n:'1.02.003',
                    descricao:'SANGRIA',
                    historico:descricao,
                    valor:Number(valor),
                    usuario:nome,
                    data:new Date(),
                    tipo:'DESPESA'
                    }),
                    {
                        error:'Erro realizar Lançamento',
                        pending:'Realizando Lançamento',
                        success:'Lançado com sucesso!'
                    }
                )
                if(lancamento){
                    await api.put("/notification/update",
                    {
                        id_notificacao
                    }
                    )
                }
     
            }catch(err){
console.log(err)
            }
     
   
        
     }


    return(
        <>
        <div className="flex flex-col w-full pl-10 pr-10 pt-4">
            <div className="flex flex-row p-2 border-b-[1px] border-gray-600">
            <h1 className="flex w-full  text-gray-300 font-semibold text-2xl ">Gerar Ordem de Serviço</h1>
            <div className="flex flex-row gap-8">
            <div className="flex items-center ">
    <input  type="checkbox" value="" className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600"/>
    <label  className="ms-2 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-300">PARTICULAR</label>
</div>
            <button onClick={()=>{}} type="button" className=" border font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center focus:ring-gray-600 bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
        <IoMdSearch size={20}/>
        Buscar
    </button> 
    </div>

            </div>
            <ul className="flex flex-wrap text-sm font-medium text-center  border-b mt-2  rounded-t-lg  border-gray-700 text-gray-400 bg-gray-800"  role="tablist">
        <li className="me-2">
            <button  type="button" onClick={()=>{}}   className="inline-block p-4 font-semibold rounded-ss-lg  bg-gray-800 hover:bg-gray-700 text-blue-500">Falecido</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{}}    className="inline-block p-4  hover:bg-gray-700 hover:text-gray-300">Declarante</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Dados do Óbito</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Produtos e Serviços</button>
        </li>
     
    </ul>
            

        </div>
        </>
    )
}