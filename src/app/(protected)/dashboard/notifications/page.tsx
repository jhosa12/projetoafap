'use client';

import { api } from "@/lib/axios/apiClient";
import { useContext, useEffect, useState } from "react";


import { AuthContext } from "@/store/AuthContext";
import { Alert } from "flowbite-react";
import { HiEye, HiInformationCircle } from "react-icons/hi2";
import { toast } from "sonner";

interface NotifyProps{
    id_notificacao: number,
    titulo:string,
    descricao:string,
    //id_usuario: number,
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
              //  id_destino:String(usuario?.id)
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
            
          
          
            toast.promise(

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
                        loading:'Realizando Lançamento',
                        success:async(lancamento)=>{
                          if(lancamento){
                            await api.put("/notification/update",
                            {
                                id_notificacao
                            }
                            )
                        }
                        listarNotificacoes()
                          
                          return 'Lançado com sucesso!'}
                    }
                )
             
          
     
   
        
     }


    return(
        <>
        <div className="flex flex-col w-full pl-10 pr-10 pt-4">
            <h1 className="flex w-full p-2 border-b-[1px] text-gray-300 font-semibold text-2xl border-gray-600">Notificações/Tarefas</h1>
            <div className="flex flex-col gap-3 w-full max-h-[83vh] overflow-y-auto p-4">
                {notificacoes.map((item,index)=>{
                    return(
                        <Alert
                        additionalContent={<ExampleAdditionalContent item={item}/>}
                        color="warning"
                        icon={HiInformationCircle}
                        onDismiss={() => alert('Alert dismissed!')}
                        rounded
                      >
                        <span className="font-medium">{item.status}!</span>{item.titulo}
                      </Alert>
                    )
                })}
            </div>
        </div>
        </>
    )
}



function ExampleAdditionalContent({item}:{item:NotifyProps}) {
    return (
      <>
        <div className="mb-4 mt-2 text-sm text-cyan-700 dark:text-cyan-800">
        {item.descricao}
        </div>
        <div className="flex">
          <button
            type="button"
            className="mr-2 inline-flex items-center rounded-lg bg-cyan-700 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-cyan-800 focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-800 dark:hover:bg-cyan-900"
          >
            <HiEye className="-ml-0.5 mr-2 h-4 w-4" />
            View more
          </button>
          <button
            type="button"
            className="rounded-lg border border-cyan-700 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-cyan-700 hover:bg-cyan-800 hover:text-white focus:ring-4 focus:ring-cyan-300 dark:border-cyan-800 dark:text-cyan-800 dark:hover:text-white"
          >
            Dismiss
          </button>
        </div>
      </>
    );
  }