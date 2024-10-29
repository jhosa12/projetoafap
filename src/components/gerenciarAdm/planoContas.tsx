import { api } from "@/services/apiClient"
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { MdDelete } from "react-icons/md";
import { RiSaveFill } from "react-icons/ri";
import { IoMdAddCircle } from "react-icons/io";
import InputMask from 'react-input-mask'
import { AuthContext } from "@/contexts/AuthContext";
import { Card, Select, TextInput } from "flowbite-react";


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
    contaf: string,
  
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
      const response =   await toast.promise(
            api.post('/gerenciarAdministrativo/adicionarGrupo',{
               
                    descricao:descricaoGrupo.toUpperCase(),
                    userId:3
                
            }),
            {
                error:'Erro ao adicionar setor',
                pending:'Adicionando...',
                success:'Adicionado com sucesso!'
            }
        )

        setarDados(arrayPlanoContas,[...arraygrupos,response.data])

    }catch(erro:any){
        toast.error(erro.response.data.error)

    }
    
}

const adicionarPlanoContas = async()=>{
    if(!conta||!tipo||!descricaoPlanoContas){
        toast.info('Preencha todos os campos!')
        return;
    }
    try{
       const response =  await toast.promise(
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

        setarDados([...arrayPlanoContas,response.data],arraygrupos)

    }catch(erro:any){
        toast.warn(erro.response.data.error)

    }

  



}






    return(
        <div className="inline-flex rounded-lg gap-2 bg-white justify-between p-2 w-full max-h-[calc(100vh-120px)]  ">
        <Card className="w-full text-black font-semibold" theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
        <h1 className="flex w-full text-gray-800 font-medium">SETORES</h1>
            <div className="flex flex-row p-2 gap-2">
          
          <TextInput className="w-full" sizing={'sm'} onChange={e=>setDescricaoGrupo(e.target.value)} placeholder="Novo Setor" autoComplete="off" type="text" required />
          <button onClick={()=>adicionarGrupo()}  className="font-semibold rounded-lg bg-blue-600 px-2 py-1 text-white hover:underline"><IoMdAddCircle size={20}/></button>
            </div>
        <table 
         className="table-auto  w-full overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-black">
            <thead className="sticky w-full top-0 text-xs  uppercase bg-gray-300 text-gray-600">
                <tr>
                    <th scope="col" className=" px-2 py-2">
                        ID_SETOR
                    </th>
               
                    <th scope="col" className="px-4 py-2">
                        DESCRIÇÃO
                    </th>
                    <th scope="col" className="px-4 py-2">
                        <span >AÇÕES</span>
                    </th>
                </tr> 
            </thead>
            <tbody className="bg-gray-100">
                {arraygrupos?.map((item,index)=>(
               <tr key={index}  className={ `border-b font-semibold  border-gray-300  `}>
                  <td className="px-2 py-1">
                {item.id_grupo}
                </td> 
                <td scope="row"  className="px-2 py-1   whitespace-nowrap">
                <TextInput sizing={'sm'} onChange={(event)=>handleGrupoChange(index,event)} value={item.descricao} className="flex bg-transparent w-full " type="text" />
                </td>
                  
                
                <td className="px-4 py-2 inline-flex text-gray-500  text-right gap-2 ">
                    <button onClick={()=>editarGrupo(index)} className="font-semibold  px-2 py-1 hover:text-blue-600 hover:underline"><RiSaveFill size={17}/></button>
                    <button onClick={()=>deletarGrupo(item.id_grupo)} className="   px-1 py-1 hover:text-red-600 hover:underline"><MdDelete size={17}/></button>
                </td>
               
               </tr>
               ))}
    
                
               
            </tbody>
        
        </table>
    
        </Card>
        <Card className="w-full text-black font-semibold" theme={{root:{children:"flex h-full flex-col w-full gap-2 p-4"}}}>
        <h1 className="flex w-full text-gray-800 font-medium">PLANO DE CONTAS</h1>
            <div className="flex flex-row p-2 gap-2">
          
            <InputMask mask={'9.99.999'}  onChange={e=>setConta(e.target.value)} placeholder="CONTA" autoComplete="off" type="text" required className=" uppercase w-1/6 pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg  bg-gray-50 border-gray-300 placeholder-gray-400  "/>
          <TextInput className="w-1/2" value={descricaoPlanoContas} sizing={'sm'}  onChange={e=>setDescricaoPlanoC(e.target.value.toUpperCase())} placeholder="DESCRICÃO" autoComplete="off" type="text" required/>
          <Select sizing={'sm'} value={tipo} onChange={e=>setTipo(e.target.value)} className="  w-1/4  ">
            <option value={''}>TIPO</option>
            <option value={'DESPESA'}>DESPESA</option>
            <option value={'RECEITA'}>RECEITA</option>
          </Select>
          <button onClick={()=>adicionarPlanoContas()} className="font-semibold rounded-lg bg-blue-600 px-2 py-1 text-white hover:underline"><IoMdAddCircle size={20}/></button>
            </div>

        <table 
         className=" block  w-full  max-h-[calc(100vh-150px)]  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center  text-black">
            <thead className=" sticky top-0 z-10 w-full text-xs uppercase bg-gray-300 ">
                <tr>
                    <th scope="col" className=" px-4 py-2">
                        CONTA
                    </th>
               
                    <th scope="col" className="px-2 py-2">
                        DESCRIÇÃO
                    </th>
                    <th scope="col" className="px-2 py-2">
                        TIPO
                    </th> 
                    <th scope="col" className="px-2 py-2">
                        AÇÕES
                    </th>
                </tr> 
            </thead>
            <tbody>
                {arrayPlanoContas?.map((item,index)=>(
               <tr key={index}  className={ `border-b bg-gray-200 border-gray-300 w-full `}>
                <th scope="row"  className="px-5 py-1 font-medium  whitespace-nowrap">
                       {item.conta}
                </th>
                <td className="px-2 py-1 w-full whitespace-nowrap">
                    <TextInput sizing={'sm'} onChange={(event)=>handleDescricaoChange(index,event)} value={item.descricao} className="flex bg-transparent w-full " type="text" />
                </td>   
                <td className="px-2 py-1 w-full whitespace-nowrap">
                    <Select sizing={'sm'} className="flex min-w-[100px] bg-transparent" value={item.tipo} onChange={(event) => handleTipoChange(index, event)} name="TIPO" >
                        <option className="bg-transparent" value="RECEITA">RECEITA</option>
                        <option className="bg-transparent" value={"DESPESA"}>DESPESA</option>
                    </Select>
                </td>
             
                <td className="px-2 py-2 inline-flex text-right gap-2 text-gray-500">
                    <button onClick={()=>editarPlanoConta(index)} className="font-semibold rounded-lg  px-2 py-1 hover:text-blue-600"><RiSaveFill size={17}/></button>
                    <button onClick={()=>deletarPlanoConta(item.conta)} className=" rounded-lg  px-1 py-1  hover:text-red-600"><MdDelete size={17}/></button>
                </td>
               </tr>
               ))}
    
                
               
            </tbody>
        
        </table>
    
        </Card>
        </div>

    )
}