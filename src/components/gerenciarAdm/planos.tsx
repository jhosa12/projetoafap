import { api } from "@/services/apiClient"
import { useState } from "react"
import { toast } from "react-toastify"
import { MdDelete } from "react-icons/md";
import { RiSaveFill } from "react-icons/ri";
import { IoMdAddCircle } from "react-icons/io";
import InputMask from 'react-input-mask'

interface PlanoContas{
    conta: string,
    id_grupo: number,
    descricao: string,
    tipo: string,
    saldo: number,
    perm_lanc: string,
    data: Date,
    hora: Date,
    usuario: string,
    contaf: string
}
interface GruposProps{
    id_grupo:number,
    descricao:string
}
interface DadosProps{
    carregarDados:()=>Promise<void>
    arrayPlanoContas:Array<PlanoContas>,
    arraygrupos:Array<GruposProps>
    setarDados:(planoContas:Array<PlanoContas>,grupos:Array<GruposProps>)=>void

}

export function PlanoContas({carregarDados,arrayPlanoContas,arraygrupos,setarDados}:DadosProps){
    const [descricaoGrupo,setDescricaoGrupo] =useState('')
    const [conta,setConta]=useState('')
    const [descricaoPlanoContas,setDescricaoPlanoC]=useState('')
    const [tipo,setTipo]=useState<string>()
 


    const handleTipoChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPlanoContas = [...arrayPlanoContas];
        newPlanoContas[index].tipo = event.target.value;
        setarDados(newPlanoContas,arraygrupos);
    };

    const handleDescricaoChange=(index:number,event:React.ChangeEvent<HTMLInputElement>)=>{
        const newPlanoContas = [...arrayPlanoContas];
        newPlanoContas[index].descricao =event.target.value;
        setarDados(newPlanoContas,arraygrupos)
    }
    const handleGrupoChange=(index:number,event:React.ChangeEvent<HTMLInputElement>)=>{
        const newgrupo = [...arraygrupos];
        newgrupo[index].descricao =event.target.value;
        setarDados(arrayPlanoContas,newgrupo)
    }

    const editarPlanoConta = async(index:number)=>{
        const conta = arrayPlanoContas[index]
        await toast.promise(
            api.put('/gerenciarAdministrativo/editarplanoconta',{
                conta:conta.conta,
                id_grupo: conta.id_grupo,
                descricao: conta.descricao,
                tipo: conta.tipo,
                perm_lanc:conta.perm_lanc,
                data: conta.data, 

            }),
            {
                error:'Erro ao editar plano de conta',
                pending:'Editando',
                success:'Editado com sucesso'
            }
        )
carregarDados()
    }

const deletarPlanoConta = async(conta:string)=>{
    await toast.promise(
        api.delete('/gerenciarAdministrativo/deletarplanoconta',{
            data:{
                conta,
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



const editarGrupo = async(index:number)=>{
    const grupo = arraygrupos[index]
    await toast.promise(
        api.put('/gerenciarAdministrativo/editarGrupo',{
           
            id_grupo: grupo.id_grupo,
            descricao: grupo.descricao,
        

        }),
        {
            error:'Erro ao editar setor',
            pending:'Editando',
            success:'Editado com sucesso'
        }
    )
carregarDados()
}

const deletarGrupo = async(id_grupo:number)=>{
await toast.promise(
    api.delete('/gerenciarAdministrativo/deletarGrupo',{
        data:{
            id_grupo,
        }
    }),
    {
        error:'Erro ao deletar setor',
        pending:'Deletando',
        success:'Deletado com sucesso!'
    }
)
carregarDados()
}
const adicionarGrupo = async()=>{
    if(!descricaoGrupo){
        toast.info('Preencha todos os campos!')
        return;
    }
    try{
        await toast.promise(
            api.post('/gerenciarAdministrativo/adicionarGrupo',{
               
                    descricao:descricaoGrupo.toUpperCase()
                
            }),
            {
                error:'Erro ao adicionar setor',
                pending:'Adicionando...',
                success:'Adicionado com sucesso!'
            }
        )

    }catch(erro:any){
        toast.error(erro.response.data.error)

    }

    carregarDados()

}

const adicionarPlanoContas = async()=>{
    if(!conta||!tipo||!descricaoPlanoContas){
        toast.info('Preencha todos os campos!')
        return;
    }
    try{
        await toast.promise(
            api.post('/gerenciarAdministrativo/adicionarPlanoContas',{
                    conta,
                    descricao:descricaoPlanoContas.toUpperCase(),
                    tipo
                
            }),
            {
                error:'Erro ao adicionar Conta',
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
        <div className="flex flex-col rounded-lg p-2 max-w-[600px] h-full bg-slate-600  shadow-md sm:rounded-lg">
        <h1 className="flex w-full text-gray-400 font-medium">SETORES</h1>
            <div className="flex flex-row p-2 gap-2">
          
         
          <input  onChange={e=>setDescricaoGrupo(e.target.value)} placeholder="Novo Setor" autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          <button onClick={()=>adicionarGrupo()}  className="font-semibold rounded-lg bg-blue-600 px-2 py-1 text-white hover:underline"><IoMdAddCircle size={20}/></button>
            </div>
        <table 
         className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
            <thead className="sticky top-0 text-xs  uppercase bg-gray-700 text-gray-400">
                <tr>
                    <th scope="col" className=" px-2 py-1">
                        ID_SETOR
                    </th>
               
                    <th scope="col" className="px-4 py-1">
                        DESCRIÇÃO
                    </th>
                    <th scope="col" className="px-10 py-1">
                        <span >AÇÕES</span>
                    </th>
                </tr> 
            </thead>
            <tbody>
                {arraygrupos?.map((item,index)=>(
               <tr key={index}  className={ `border-b bg-gray-800 border-gray-700  hover:bg-gray-600`}>
                  <td className="px-2 py-1">
                {item.id_grupo}
                </td> 
                <th scope="row"  className="px-2 py-1 font-medium  whitespace-nowrap">
                <input onChange={(event)=>handleGrupoChange(index,event)} value={item.descricao} className="flex bg-transparent w-full " type="text" />
                </th>
                  
                
                <td className="px-10 py-1 inline-flex text-right gap-2">
                    <button onClick={()=>editarGrupo(index)} className="font-semibold rounded-lg bg-blue-600 px-2 py-1 text-white hover:underline"><RiSaveFill size={17}/></button>
                    <button onClick={()=>deletarGrupo(item.id_grupo)} className=" rounded-lg bg-red-600 px-1 py-1 text-white hover:underline"><MdDelete size={17}/></button>
                </td>
               
               </tr>
               ))}
    
                
               
            </tbody>
        
        </table>
    
        </div>
        <div className="flex bg-slate-600 flex-col rounded-lg  p-2 max-w-[700px] w-full  shadow-md sm:rounded-lg">
        <h1 className="flex w-full text-gray-400 font-medium">PLANO DE CONTAS</h1>
            <div className="flex flex-row p-2 gap-2">
          
            <InputMask mask={'9.99.999'}  onChange={e=>setConta(e.target.value)} placeholder="CONTA" autoComplete="off" type="text" required className=" uppercase w-1/6 pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          <input  onChange={e=>setDescricaoPlanoC(e.target.value)} placeholder="Descrição" autoComplete="off" type="text" required className=" uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          <select value={tipo} onChange={e=>setTipo(e.target.value)} className=" uppercase w-1/4 pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white ">
            <option value={''}>TIPO</option>
            <option value={'DESPESA'}>DESPESA</option>
            <option value={'RECEITA'}>RECEITA</option>
          </select>
          <button onClick={()=>adicionarPlanoContas()} className="font-semibold rounded-lg bg-blue-600 px-2 py-1 text-white hover:underline"><IoMdAddCircle size={20}/></button>
            </div>
        <table 
         className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
            <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
                <tr>
                    <th scope="col" className=" px-4 py-1">
                        CONTA
                    </th>
               
                    <th scope="col" className="px-10 py-1">
                        DESCRIÇÃO
                    </th>
                    <th scope="col" className="px-10 py-1">
                        TIPO
                    </th> 
                    <th scope="col" className="px-10 py-1">
                        AÇÕES
                    </th>
                </tr> 
            </thead>
            <tbody>
                {arrayPlanoContas?.map((item,index)=>(
               <tr key={index}  className={ `border-b bg-gray-800 border-gray-700 w-full hover:bg-gray-600`}>
                <th scope="row"  className="px-5 py-1 font-medium  whitespace-nowrap">
                       {item.conta}
                </th>
                <td className="px-10 py-1 w-full whitespace-nowrap">
                    <input onChange={(event)=>handleDescricaoChange(index,event)} value={item.descricao} className="flex bg-transparent w-full " type="text" />
                </td>   
                <td className="px-10 py-1">
                    <select className="bg-transparent" value={item.tipo} onChange={(event) => handleTipoChange(index, event)} name="TIPO" >
                        <option className="bg-transparent" value="RECEITA">RECEITA</option>
                        <option className="bg-transparent" value={"DESPESA"}>DESPESA</option>
                    </select>
                   
                </td>
               
                <td className="px-10 py-1 inline-flex text-right gap-2">
                    <button onClick={()=>editarPlanoConta(index)} className="font-semibold rounded-lg bg-blue-600 px-2 py-1 text-white hover:underline"><RiSaveFill size={17}/></button>
                    <button onClick={()=>deletarPlanoConta(item.conta)} className=" rounded-lg bg-red-600 px-1 py-1 text-white hover:underline"><MdDelete size={17}/></button>
                </td>
               </tr>
               ))}
    
                
               
            </tbody>
        
        </table>
    
        </div>
        </div>

    )
}