
import { api } from "@/services/apiClient"
import { useState } from "react"
import { toast } from "react-toastify"
import { MdDelete } from "react-icons/md";
import { RiSaveFill } from "react-icons/ri";
import { IoMdAddCircle } from "react-icons/io";


interface MetasProps{
    id_meta:number,
    id_conta:string,
    id_grupo :number,
    descricao:string,
    valor:number,
    date:Date,
    grupo:{
        id_grupo:number,
        descricao:string
    }
    }
    interface PlanosProps{
        conta: string,
        id_grupo: number,
        descricao: string,
        tipo: string,
        saldo: number,
        perm_lanc: string,
        data: Date,
        hora: Date,
        usuario: string,
        contaf: string,
    }        
interface DadosProps{
    carregarDados:()=>Promise<void>
    arrayMetas:Array<MetasProps>,
    setarMetas:(planoContas:Array<MetasProps>)=>void
    arraygrupos:Array<{descricao:string,id_grupo:number}>
    arrayPlanoContas:Array<PlanosProps>
}

export function GerenciarMetas({carregarDados,arrayMetas,setarMetas,arraygrupos,arrayPlanoContas}:DadosProps){
   
    const [setor,setSetor]=useState<number>()
    const [valor,setValor]=useState<number>()
   
    const [id_conta,setIdConta] =useState<string>()


const handleDescricao=(index:number,event:React.ChangeEvent<HTMLInputElement>)=>{
    const novoArray = [...arrayMetas]
    novoArray[index].descricao = event.target.value
    
    setarMetas(novoArray)

}
const handleValor=(index:number,event:React.ChangeEvent<HTMLInputElement>)=>{
    const novoArray = [...arrayMetas]
    novoArray[index].valor = Number(event.target.value)
    setarMetas(novoArray)

}

const handleDate=(index:number,event:React.ChangeEvent<HTMLInputElement>)=>{
    const novoArray = [...arrayMetas]
    novoArray[index].date = new Date(event.target.value)
    setarMetas(novoArray)

}
const handleGrupo=(index:number,event:React.ChangeEvent<HTMLSelectElement>)=>{
    const novoArray = [...arrayMetas]
    const item = arraygrupos.find(element=>element.id_grupo===Number(event.target.value))
    novoArray[index].grupo.descricao = item?.descricao ??''
    setarMetas(novoArray)
}

  /* const editarPlano = async(index:number)=>{
        const plano = arrayMetas[index]
       await toast.promise(
        api.put('/gerenciarAdministrativo/editarplano',{
                id_plano:plano.id_plano,
                descricao:plano.descricao,
                limite_dep:plano.limite_dep,
                valor:plano.valor

            }),
            {
                error:'Erro ao editar plano',
                pending:'Editando',
                success:'Editado com sucesso'
            }
        )
carregarDados()
    }*/

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



const adicionarMeta = async()=>{
    if(!id_conta||!setor||!valor){
        toast.info('Preencha todos os campos!')
        return;
    }
    const nomeConta= arrayPlanoContas.find(element=>element.conta===id_conta)
    
    try{
        await toast.promise(
            api.post('/gerenciarAdministrativo/adicionarMeta',{
                descricao:nomeConta?.descricao,
                id_conta:id_conta,
                id_grupo:setor,
                valor :Number(valor),
                date:new Date()
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
     
        <div className="flex bg-slate-600 flex-col rounded-lg  p-2 h-full w-full  shadow-md sm:rounded-lg">
        <h1 className="flex w-full text-gray-400 font-medium">METAS</h1>
            <div className="flex flex-row p-2 gap-2">
            
            <select className=" uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white" defaultValue={id_conta} onChange={(event) => {setIdConta(event.target.value)}} name="DESCRIÇÃO" >
                     <option  value={''}>SELECIONE UM PLANO</option>
                     
                      {arrayPlanoContas.map((item,index)=>{
                        return(
                                <option key={index} className="bg-transparent" value={item.conta}>{item.descricao}</option> 
                        )
                      }) }
                    </select>
                    <select className=" uppercase w-1/4 pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white " value={setor} onChange={(event) => {setSetor(Number(event.target.value))}} name="SETOR" >
                     <option  value={''}>SETOR</option>
                      {arraygrupos.map((item,index)=>{
                        return(
                                <option  key={index} className="bg-transparent" value={item.id_grupo}>{item.descricao}</option> 
                        )
                      }) }
                    </select>
          <input value={valor!=0?valor:''} onChange={e=>setValor(Number(e.target.value))} placeholder="valor" autoComplete="off" type="number" required className=" uppercase w-1/4 pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          <button onClick={()=>adicionarMeta()} className="font-semibold rounded-lg bg-blue-600 px-2 py-1 text-white hover:underline"><IoMdAddCircle size={20}/></button>
            </div>
        <table 
         className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
            <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
                <tr>
                    <th scope="col" className=" px-4 py-1">
                        ID CONTA
                    </th>
               
                    <th scope="col" className="px-12 py-1">
                        DESCRIÇÃO
                    </th>
                    <th scope="col" className="px-11 py-1">
                        SETOR
                    </th>
                    <th scope="col" className="px-10 py-1  whitespace-nowrap">
                        DATA
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
                {arrayMetas?.map((item,index)=>(
               <tr key={index}  className={ `border-b bg-gray-800 border-gray-700 w-full `}>
                <th scope="row"  className="px-5 py-1 font-medium  whitespace-nowrap">
                       {item.id_conta}
                </th>
                <td className="px-10 py-1 w-full ">
                <input onChange={(event)=>handleDescricao(index,event)}  value={item.descricao} className="inline-flex bg-transparent  pl-2" type="text" />  
                </td>
                <td className="px-10 py-1 w-full whitespace-nowrap">
                <select className="bg-gray-800" defaultValue={item.grupo.descricao} onChange={(event) => handleGrupo(index, event)} name="DESCRIÇÃO" >
                      {arraygrupos.map((item,index)=>{
                        return(
                      
                                <option className="bg-transparent" value={item.id_grupo}>{item.descricao}</option>
                           
                        )
                      }) }
                    </select>
                </td>   
                <td className=" px-10 py-1 w-full ">
                <input onChange={(event)=>handleDate(index,event)}  value={item.date? new Date(item.date).toLocaleDateString():''} className="inline-flex  bg-transparent " type="text" />
                   
                </td>
                <td className="px-12 py-1 w-full ">
                    <span className="inline-flex">R$<input onChange={(event)=>handleValor(index,event)}  value={item.valor} className="flex bg-transparent w-full"/></span>
                </td>
                <td className="px-10 py-1 inline-flex text-right gap-2">
                    <button onClick={()=>{}} className="font-semibold rounded-lg bg-blue-600 px-2 py-1 text-white hover:underline"><RiSaveFill size={17}/></button>
                    <button onClick={()=>deletarPlano(item.id_meta)} className=" rounded-lg bg-red-600 px-1 py-1 text-white hover:underline"><MdDelete size={17}/></button>
                </td>
               </tr>
               ))}
    
            </tbody>
        
        </table>
    
        </div>
        </div>

    )
}