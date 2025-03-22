import { api } from "@/lib/axios/apiClient"
import { useState } from "react"
import { toast } from "react-toastify"
import { MdDelete } from "react-icons/md";
import { RiSaveFill } from "react-icons/ri";
import { IoMdAddCircle } from "react-icons/io";

interface ConvProps{
    id_conv: number,
    id_produto: number,
    descricao: string,
    unidade: number,
    grupo: number,
    data: Date,
    data_dev: Date,
    quantidade: number,
    valor:number,
    desconto: number,
    total: number,
    cortesia:string,
    retornavel: string,
    status: string
    }
interface DadosProps{
    carregarDados:()=>Promise<void>
    arrayConv:Array<ConvProps>,
    setarConv:(Convalescenca:Array<ConvProps>)=>void
}
export function GerenciarConvalescenca({carregarDados,arrayConv,setarConv}:DadosProps){
    const [descricao,setDescricao] =useState('')
    const [limite,setLimite]=useState<number>()
    const [valor,setValor]=useState<number>()


const handleDescricao=(index:number,event:React.ChangeEvent<HTMLInputElement>)=>{
    const novoArray = [...arrayConv]
    novoArray[index].descricao = event.target.value
    setarConv(novoArray)

}
const handleLimite=(index:number,event:React.ChangeEvent<HTMLInputElement>)=>{
    const novoArray = [...arrayConv]
    //novoArray[index].limite_dep = Number(event.target.value)
    setarConv(novoArray)

}
const handleValor=(index:number,event:React.ChangeEvent<HTMLInputElement>)=>{
    const novoArray = [...arrayConv]
    novoArray[index].valor = Number(event.target.value)
    setarConv(novoArray)

}

    const editarPlano = async(index:number)=>{
        const plano = arrayConv[index]
        await toast.promise(
            api.put('/gerenciarAdministrativo/editarplano',{
               // id_plano:plano.id_plano,
               // descricao:plano.descricao,
               // limite_dep:plano.limite_dep,
              //  valor:plano.valor

            }),
            {
                error:'Erro ao editar plano',
                pending:'Editando',
                success:'Editado com sucesso'
            }
        )
carregarDados()
    }

const deletarPlano = async(id_plano:number)=>{
    await toast.promise(
        api.delete('/gerenciarAdministrativo/deletarplano',{
            data:{
                id_plano,
            }
        }),
        {
            error:'Erro ao deletar plano de conta',
            pending:'Deletando',
            success:'Deletado com sucesso!'
        }
    )
carregarDados()
    

}



const adicionarPlano = async()=>{
    if(!descricao||!limite||!valor){
        toast.info('Preencha todos os campos!')
        return;
    }
    try{
        await toast.promise(
            api.post('/gerenciarAdministrativo/adicionarPlano',{
                    limite_dep:limite,
                    descricao:descricao.toUpperCase(),
                    valor  
            }),
            {
                error:'Erro ao adicionar Plano',
                pending:'Adicionando...',
                success:'Adicionado com sucesso!'
            }
        )

    }catch(erro:any){
        toast.warn(erro.response.data.error)

    }

    carregarDados()

}









    return(
        <div className="inline-flex justify-between pl-6 pt-2 pr-6 w-full max-h-[calc(100vh-150px)]   gap-4">
     
        <div className="flex bg-slate-600 flex-col rounded-lg  p-2 max-w-[900px] w-full  shadow-md sm:rounded-lg">
        <h1 className="flex w-full text-gray-400 font-medium">CONVALESCENÇA</h1>
            <div className="flex flex-row p-2 gap-2">
          
           
          <input value={descricao} onChange={e=>setDescricao(e.target.value)} placeholder="Descrição" autoComplete="off" type="text" required className=" uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          <input value={limite!=0?limite:''} onChange={e=>setLimite(Number(e.target.value))} placeholder="Limite" autoComplete="off" type="number" required className=" uppercase w-1/4 pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          <input value={valor!=0?valor:''} onChange={e=>setValor(Number(e.target.value))} placeholder="valor" autoComplete="off" type="number" required className=" uppercase w-1/4 pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          <button onClick={()=>adicionarPlano()} className="font-semibold rounded-lg bg-blue-600 px-2 py-1 text-white hover:underline"><IoMdAddCircle size={20}/></button>
            </div>
        <table 
         className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
            <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
                <tr>
                    <th scope="col" className=" px-4 py-1">
                        ID PLANO
                    </th>
               
                    <th scope="col" className="px-10 py-1">
                        DESCRIÇÃO
                    </th>
                    <th scope="col" className="px-10 py-1  whitespace-nowrap">
                        Limite Dep.
                    </th> 
                    <th scope="col" className="px-12 py-1 whitespace-nowrap">
                        VALOR R$
                    </th> 
                    <th scope="col" className="px-10 py-1">
                        AÇÕES
                    </th>
                </tr> 
            </thead>
            <tbody>
                {arrayConv?.map((item,index)=>(
               <tr key={index}  className={ `border-b bg-gray-800 border-gray-700 w-full hover:bg-gray-600`}>
                <th scope="row"  className="px-5 py-1 font-medium  whitespace-nowrap">
                       {item.id_conv}
                </th>
                <td className="px-10 py-1 w-full whitespace-nowrap">
                    <input onChange={(event)=>handleDescricao(index,event)}  value={item.descricao} className="flex bg-transparent w-full " type="text" />
                </td>   
                <td className="px-10 py-1 w-full ">
                <input onChange={(event)=>handleLimite(index,event)}  value={item.unidade} className="flex bg-transparent w-full pl-2" type="text" />
                   
                </td>
                <td className="px-12 py-1 w-full ">
                    <span className="inline-flex">R$<input onChange={(event)=>handleValor(index,event)}  value={item.valor} className="flex bg-transparent w-full"/></span>
                </td>
                <td className="px-10 py-1 inline-flex text-right gap-2">
                    <button onClick={()=>editarPlano(index)} className="font-semibold rounded-lg bg-blue-600 px-2 py-1 text-white hover:underline"><RiSaveFill size={17}/></button>
                    <button onClick={()=>deletarPlano(item.id_conv)} className=" rounded-lg bg-red-600 px-1 py-1 text-white hover:underline"><MdDelete size={17}/></button>
                </td>
               </tr>
               ))}
    
                
               
            </tbody>
        
        </table>
    
        </div>
        </div>

    )
}
