import { PlanoContas } from "@/components/gerenciarAdm/planoContas";
import { MenuLateral } from "@/components/menu"
import { api } from "@/services/apiClient"
import Head from "next/head"
import React, { useEffect, useState } from "react"

import { MdDelete } from "react-icons/md";
import { RiSaveFill } from "react-icons/ri";
import { toast } from "react-toastify";



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
interface PlanosProps{
    
}


export default function gerenciarAdministrativo(){
    const [PlanosContas,setPlanosContas] =useState(true)
    const [Planos,setPlanos] = useState(false)
    const [Convalescencia,setConv] =useState(false)
    const [arrayPlanoContas,setArrayPlanoContas] = useState<Array<PlanoContas>>([])
    const [arraygrupos,setArrayGrupos] = useState<Array<GruposProps>>([])
    const [tipo,setTipo]=useState('')

const setarDados =(planoContas:Array<PlanoContas>,grupos:Array<GruposProps>)=>{
    setArrayPlanoContas(planoContas)
    setArrayGrupos(grupos)
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
    setarDados(response.data.plano_contas,response.data.grupos)
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
 {PlanosContas && <PlanoContas carregarDados={carregarDados} arrayPlanoContas={arrayPlanoContas} arraygrupos={arraygrupos} setarDados={setarDados}/>}
</div>
</div>
</>
    )
}