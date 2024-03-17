import { api } from "@/services/apiClient"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

interface NotifyProps{
    id_notificacao: number,
    titulo:string,
    descricao:string,
    id_usuario: number,
    data: Date,
    status: string
  }

export default function Notificacoes(){
    const[notificacoes,setNotify] = useState<Array<NotifyProps>>([])

    useEffect(()=>{
        try{
         
           listarNotificacoes()
        }catch(err){
           toast.error('Erro ao Listar Notificações')
        }
     },[])

     async function listarNotificacoes() {
        const response = await api.get('/notification/listar')
        setNotify(response.data)
        console.log(response.data)
     }


    return(
        <>
        <div className="flex flex-col w-full p-4">
            <h1 className="flex w-full p-2 border-b-[1px] text-gray-300 font-semibold text-xl border-gray-600">Notificações</h1>
            <ul className="flex flex-col gap-3 w-full  p-4">
                {notificacoes.map((item,index)=>{
                    return(
                        <li key={index} className="flex justify-between items-center p-2 border-t-[3px] shadow-sm shadow-gray-400 border-red-600 rounded-lg w-full text-white bg-gray-700">
                            <div>
                            <h1 className="uppercase font-bold justify-start pl-2  ">{item.titulo}</h1>
                            <p className="pl-2">{item.descricao}</p>
                                </div>
                                <span>{new Date(item.data).toLocaleDateString()}</span>
                            <span className="flex p-2 bg-yellow-400 rounded-2xl">{item.status}</span>
                            </li>
                    )
                })}
            </ul>
        </div>
        </>
    )
}