import { MenuLateral } from "@/components/menu"
import { api } from "@/services/apiClient"
import Head from "next/head"
import React, { useEffect, useState } from "react"

import { MdDelete } from "react-icons/md";
import { RiSaveFill } from "react-icons/ri";


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



export default function gerenciarAdministrativo(){
    const [PlanosContas,setPlanosContas] =useState(true)
    const [Planos,setPlanos] = useState(false)
    const [Convalescencia,setConv] =useState(false)
    const [arrayPlanoContas,setArrayPlanoContas] = useState<Array<PlanoContas>>([])
    const [arraygrupos,setArrayGrupos] = useState<Array<GruposProps>>([])
    const [tipo,setTipo]=useState('')


    const handleTipoChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPlanoContas = [...arrayPlanoContas];
        newPlanoContas[index].tipo = event.target.value;
        setArrayPlanoContas(newPlanoContas);
    };

    const handleDescricaoChange=(index:number,event:React.ChangeEvent<HTMLInputElement>)=>{
        const newPlanoContas = [...arrayPlanoContas];
        newPlanoContas[index].descricao =event.target.value;
        setArrayPlanoContas(newPlanoContas)
    }



useEffect(()=>{
    try{
carregarDados()
      
    }catch(err){
        console.log(err)

    }
},[])

async function carregarDados() {
    const response= await api.get('/gerenciarAdministrativo')
    setArrayPlanoContas(response.data.plano_contas)
    setArrayGrupos(response.data.grupos)
    console.log(response.data)
    
}

    return(
<>
<Head>
    <title>Gerenciar setor Administrativo</title>
</Head>
<div className="flex flex-col w-full p-2  justify-center">
<MenuLateral/>
<div className="flex-col w-full p-2 mt-2 border  rounded-lg shadow  border-gray-700">
    <ul className="flex flex-wrap text-sm font-medium text-center  border-b  rounded-t-lg  border-gray-700 text-gray-400 "  >
        <li className="me-2">
            <button  type="button" onClick={()=>{setPlanos(false);setPlanosContas(true),setConv(false)}}    className={`inline-block p-2  rounded-t-lg hover:bg-gray-700 ${PlanosContas && "text-blue-500"} hover:text-gray-300  `}>Plano de Contas</button>
        </li>
        <li className="me-2">
            <button type="button"  onClick={()=>{setPlanos(true);setPlanosContas(false),setConv(false)}}   className={`inline-block p-2  rounded-t-lg hover:bg-gray-700 ${Planos && "text-blue-500"} hover:text-gray-300  `}>Planos</button>
        </li>
        <li className="me-2">
            <button type="button"  onClick={()=>{setPlanos(false);setPlanosContas(false),setConv(true)}}  className={`inline-block p-2  rounded-t-lg hover:bg-gray-700 ${Convalescencia && "text-blue-500"} hover:text-gray-300  `}>Convalescencia</button>
        </li>

    </ul>
    <div className="inline-flex w-full max-h-[calc(100vh-150px)]   gap-4">
    <div className="flex flex-col rounded-lg p-2 max-w-[600px]   shadow-md sm:rounded-lg">
    <table 
     className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
        <thead className="sticky top-0  uppercase bg-gray-700 text-gray-400">
            <tr>
                <th scope="col" className=" px-2 py-1">
                    CONTA
                </th>
           
                <th scope="col" className="px-4 py-1">
                    DESCRIÇÃO
                </th>
                <th scope="col" className="px-2 py-1">
                    <span className="sr-only">Edit</span>
                </th>
            </tr> 
        </thead>
        <tbody>
            {arraygrupos?.map((item,index)=>(
           <tr key={index}  className={ `border-b bg-gray-800 border-gray-700  hover:bg-gray-600`}>
            <th scope="row"  className="px-2 py-1 font-medium  whitespace-nowrap">
                   {item.id_grupo}
            </th>
            <td className="px-2 py-1">
            {item.descricao}
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
    <div className="flex flex-col rounded-lg  p-2 max-w-[700px] w-full  shadow-md sm:rounded-lg">
    <table 
     className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
        <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
            <tr>
                <th scope="col" className=" px-5 py-1">
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
                <button onClick={(event)=>{
                               event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                              }} className="font-semibold rounded-lg bg-blue-600 px-2 py-1 text-white hover:underline"><RiSaveFill size={17}/></button>
                               <button onClick={(event)=>{
                               event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                              }} className=" rounded-lg bg-red-600 px-1 py-1 text-white hover:underline"><MdDelete size={17}/></button>
            </td>
           </tr>
           ))}

            
           
        </tbody>
    
    </table>

    </div>
    </div>
</div>
</div>
</>
    )
}