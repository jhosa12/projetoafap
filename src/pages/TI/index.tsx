import { api } from "@/services/apiClient"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { TbAlertTriangle } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
interface IdeiasProps{
    id_ideia:number,
    descricao:string,
    data_post:Date,
    status:string
}

export default function TiArea(){
    const [arrayIdeias,setIdeias]= useState<Array<IdeiasProps>>([])
    const [descricao,setDescricao]=useState('')
    const [modalExclusao,setModal]=useState<boolean>(true)
   useEffect(()=>{
 
    lista()
        
   },[])
   async function lista() {
    const response = await api.get('/listarIdeias')
    setIdeias(response.data)
}
   async function adiocionar() {
    if(!descricao){
        toast.info('Descreva a sugestão!')
        return;
    }
    const response =await toast.promise(
        api.post('/criarIdeia',{
            descricao:descricao,
            status:"PENDENTE",
            data_post:new Date()
        }),
        {error:'Erro ao Lançar Sugestão',
            pending:'Criando nova Sugestão/Ideia',
            success:'Criado com sucesso!'
        }
    )
    setDescricao('')
    await lista()
    
   }
   async function deletar(id_ideia:number){
    try{
        await toast.promise(
            api.delete('/deletarIdeia',{
                data:{
                    id_ideia
                }
            }),
            {
                error:'Erro ao deletar',
                pending:'Efetuando',
                success:'Deletado com sucesso'
            }
        ) 
    }catch(err){console.log(err)}
        
        await lista()
   }

   async function editar(id_ideia:number){
    try{
        await toast.promise(
            api.put('/editarIdeia',{
               
                    id_ideia,
                  status:'CONCLUIDO'
                
            }),
            {
                error:'Erro ao editar',
                pending:'Efetuando',
                success:'Editado com sucesso'
            }
        ) 
    }catch(err){console.log(err)}
        
        await lista()
   }
   
    return(
        <div className="flex w-full h-screen ml-2 mt-2 gap-2 ">
            <div className="flex flex-col w-1/4 gap-2 ">
            <textarea value={descricao} onChange={e=>setDescricao(e.target.value)} placeholder="Digite aqui as ideias e sugestões!" className=" h-2/3 text-sm p-2 rounded-lg  border-0 bg-gray-800 focus:ring-0 text-white placeholder-gray-400" />
               <button onClick={()=>adiocionar()} className=" p-2  text-white font-semibold rounded-lg bg-blue-600">LANÇAR</button>
            </div>
            <div className="flex flex-row  w-full h-3/4 gap-2 mr-4 ">
            <div className="flex flex-col items-center overflow-y-auto w-full rounded-lg border-[1px] border-gray-400 p-2 bg-gray-700">
                    <h1 className=" text-white uppercase font-semibold">Sugestões/Ideias Pendentes</h1>
                    <ul className="flex flex-col w-full p-2">
                        {arrayIdeias.map((ideia,index)=>(
                          ideia.status==='PENDENTE' &&  (<li className="relative flex flex-col rounded-lg p-4 mb-2 text-white w-full bg-yellow-600" key={index}>
                               <span className="text-xs break-all pt-2">{ideia.descricao}</span>
                               <span className="flex w-full text-sm justify-end">{new Date(ideia.data_post).toLocaleDateString()}</span>
                               <div className="absolute flex top-1 right-1 gap-2">
                               <button onClick={()=>deletar(Number(ideia.id_ideia))} className="text-red-600 hover:text-red-500" ><MdCancel  size={21}/></button>
                               <button onClick={()=>editar(Number(ideia.id_ideia))} className="text-green-500 hover:text-green-400" ><FaCheckCircle  size={20}/></button>
                              
                               </div>
                               
                            </li>)
                        ))}
                    

                    </ul>
            </div>
            <div className=" flex flex-col items-center overflow-y-auto w-full p-2 rounded-lg border-[1px] border-gray-400  bg-gray-700">
            <h1 className=" text-white uppercase font-semibold">Concluídas</h1>
            <ul className="flex flex-col w-full">
                        {arrayIdeias.map((ideia,index)=>(
                          ideia.status==='CONCLUIDO' &&  (<li className="relative flex flex-col rounded-lg p-4 text-white w-full bg-green-600" key={index}>
                              <span className="text-xs break-all pt-2">{ideia.descricao}</span>
                               <span className="flex w-full text-sm justify-end">{new Date(ideia.data_post).toLocaleDateString()}</span>
                               <div className="absolute flex top-1 right-1 gap-2">
                              
                               </div>
                               
                            </li>)
                        ))}
                    

                    </ul>
            </div>
            </div>


        </div>
    )
}