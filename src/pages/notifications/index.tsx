import { api } from "@/services/apiClient";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { AuthContext } from "@/contexts/AuthContext";

interface NotifyProps{
    id_notificacao: number,
    titulo:string,
    descricao:string,
    id_usuario: number,
    data: Date,
    status: string,
    id_destino:string,
    sangria:boolean
  }

export default function Notificacoes(){
    const[notificacoes,setNotify] = useState<Array<NotifyProps>>([])
    const {usuario,signOut}= useContext(AuthContext)

    useEffect(()=>{
        const user = !!usuario
        if(!user){ 
           signOut()
           return;
       }
        try{
         
           listarNotificacoes()
        }catch(err){
           toast.error('Erro ao Listar Notificações')
        }
     },[usuario])

     async function listarNotificacoes() {
        const response = await api.post('/notification/listar',
           { 
                id_destino:String(usuario?.id)
        }
        )
        setNotify(response.data)
        console.log(response.data)
     }


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
                listarNotificacoes()
            }catch(err){
console.log(err)
            }
     
   
        
     }


    return(
        <>
        <div className="flex flex-col w-full pl-10 pr-10 pt-4">
            <h1 className="flex w-full p-2 border-b-[1px] text-gray-300 font-semibold text-2xl border-gray-600">Notificações/Tarefas</h1>
            <ul className="flex flex-col gap-3 w-full  p-4">
                {notificacoes.map((item,index)=>{
                    return(
                        <li key={index} className="flex justify-between items-center p-2 border-t-[3px] shadow-sm shadow-gray-400 border-yellow-600 rounded-lg w-full text-white bg-gray-700">
                            <div className="flex flex-col w-full ">
                            <h1 className="uppercase font-bold justify-start pl-2  ">{item.titulo}</h1>
                            <div className="flex flex-row justify-between w-full">
                            <p className="pl-2">{item.descricao}</p>
                            <span className="flex items-end justify-end h-full">{new Date(item.data).toLocaleDateString()} - {new Date(item.data).toLocaleTimeString()}</span>
                            <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                <span className="w-2 h-2 me-1 bg-yellow-500 rounded-full"></span>
                {item.status}
            </span>
            {item.sangria && item.status==='PENDENTE' && <button onClick={()=>lancarMovimentacao({dados:item.descricao,id_origem:item.id_usuario,id_notificacao:item.id_notificacao})} className=" bg-blue-600 p-1 rounded-lg text-white">ACEITAR</button>}
                            </div>
                            
                                </div>
                               
                            </li>
                    )
                })}
            </ul>
        </div>
        </>
    )
}