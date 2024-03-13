import { PlanoContas } from "@/components/gerenciarAdm/planoContas";
import { GerenciarPlanos } from "@/components/gerenciarAdm/planos";
import { MenuLateral } from "@/components/menu"
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient"
import Head from "next/head"
import React, { useContext, useEffect, useState } from "react"

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
id_plano:number,
descricao:string,
limite_dep:number,
valor:number,
acrescimo:number
    
}


export default function gerenciarAdministrativo(){
    const {signOut} = useContext(AuthContext)
    const [PlanosContas,setPlanosContas] =useState(true)
    const [Planos,setPlanos] = useState(false)
    const [Convalescencia,setConv] =useState(false)
    const [arrayPlanoContas,setArrayPlanoContas] = useState<Array<PlanoContas>>([])
    const [arraygrupos,setArrayGrupos] = useState<Array<GruposProps>>([])
    const [arrayPlanos,setArrayPlanos]= useState<Array<PlanosProps>>([])
    const [tipo,setTipo]=useState('')
    
const setarDados =(planoContas:Array<PlanoContas>,grupos:Array<GruposProps>)=>{
    setArrayPlanoContas(planoContas)
    setArrayGrupos(grupos)
}
const setarPlanos =(planos:Array<PlanosProps>)=>{
    setArrayPlanos(planos)

}
   
useEffect(() => {
    try {
        carregarDados();
    } catch (err) {
        toast.error('Erro ao Carregar Dados')
    }
    
}, []);






async function carregarDados() {
    const response= await api.get('/gerenciarAdministrativo')
    setarDados(response.data.plano_contas,response.data.grupos)
    setArrayPlanos(response.data.planos)
  
    
    
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
 {Planos && <GerenciarPlanos carregarDados={carregarDados}  setarPlanos={setarPlanos} arrayPlanos={arrayPlanos}/>}
</div>
</div>
</>
    )
}