import { GerenciarConvalescenca } from "@/components/gerenciarAdm/convalescencia";
import { GerenciarMetas } from "@/components/gerenciarAdm/metas";
import { PlanoContas } from "@/components/gerenciarAdm/planoContas";
import { GerenciarPlanos } from "@/components/gerenciarAdm/planos";
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient"
import Head from "next/head"
import React, {useContext, useEffect, useState } from "react"
import { toast } from "react-toastify";

interface MetasProps{
    id_meta:number,
    id_conta:string,
    id_grupo :number,
    descricao:string,
    valor:number,
    date:Date,
    grupo:GruposProps
}

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
interface PlanosProps{
id_plano:number,
descricao:string,
limite_dep:number,
valor:number,
acrescimo:number
    
}

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


export default function gerenciarAdministrativo(){
    const [PlanosContas,setPlanosContas] =useState(true)
    const [metas,setMetas]=useState(false)
    const [Planos,setPlanos] = useState(false)
    const [Convalescencia,setConv] =useState(false)
    const [arrayPlanoContas,setArrayPlanoContas] = useState<Array<PlanoContas>>([])
    const [arraygrupos,setArrayGrupos] = useState<Array<GruposProps>>([])
    const [arrayPlanos,setArrayPlanos]= useState<Array<PlanosProps>>([])
    const [arrayConv,setArrayConv]= useState<Array<ConvProps>>([])
    const [arrayMetas,setArrayMetas]=useState<Array<MetasProps>>([])
    const [tipo,setTipo]=useState('')
    const {usuario,signOut} = useContext(AuthContext)




const setarDados =(planoContas:Array<PlanoContas>,grupos:Array<GruposProps>)=>{
    setArrayPlanoContas(planoContas)
    setArrayGrupos(grupos)
}
const setarPlanos =(planos:Array<PlanosProps>)=>{
    setArrayPlanos(planos)

}
const setarConv =(conv:Array<ConvProps>)=>{
    setArrayConv(conv)

}
const setarMetas = (met:Array<MetasProps>)=>{
    setArrayMetas(met)

}
   
useEffect(() => {
    const user = !!usuario
    if(!user){ 
       signOut()
       return;
   }
  
    try {
        carregarDados();
    } catch (err) {
        toast.error('Erro ao Carregar Dados')
    }
    
}, [usuario]);






async function carregarDados() {
    const response= await api.get('/gerenciarAdministrativo')
    setarDados(response.data.plano_contas,response.data.grupos)
    setArrayPlanos(response.data.planos)
    setArrayConv(response.data.convalescenca)
    setArrayMetas(response.data.metas)
}

    return(
<>
<Head>
    <title>Gerenciar setor Administrativo</title>
</Head>


<div className="flex-col w-full  mt-1 p-2 justify-center  rounded-lg shadow  ">
    <ul className="flex flex-wrap text-sm font-medium text-center  border-b  rounded-t-lg  border-gray-700 text-gray-400 "  >
        <li className="me-2">
            <button  type="button" onClick={()=>{setPlanos(false);setPlanosContas(true),setConv(false),setMetas(false)}}    className={`inline-block p-2  rounded-t-lg hover:bg-gray-700 ${PlanosContas && "text-blue-500"} hover:text-gray-300  `}>Plano de Contas</button>
        </li>
        <li className="me-2">
            <button  type="button" onClick={()=>{setPlanos(false);setPlanosContas(false),setConv(false),setMetas(true)}}    className={`inline-block p-2  rounded-t-lg hover:bg-gray-700 ${metas && "text-blue-500"} hover:text-gray-300  `}>Metas</button>
        </li>
        <li className="me-2">
            <button type="button"  onClick={()=>{setPlanos(true);setPlanosContas(false),setConv(false),setMetas(false)}}   className={`inline-block p-2  rounded-t-lg hover:bg-gray-700 ${Planos && "text-blue-500"} hover:text-gray-300  `}>Planos</button>
        </li>
        <li className="me-2">
            <button type="button"  onClick={()=>{setPlanos(false);setPlanosContas(false),setConv(true),setMetas(false)}}  className={`inline-block p-2  rounded-t-lg hover:bg-gray-700 ${Convalescencia && "text-blue-500"} hover:text-gray-300  `}>Convalescencia</button>
        </li>

    </ul>

 {PlanosContas && <PlanoContas carregarDados={carregarDados} arrayPlanoContas={arrayPlanoContas} arraygrupos={arraygrupos} setarDados={setarDados}/>}
 {Planos && <GerenciarPlanos carregarDados={carregarDados}  setarPlanos={setarPlanos} arrayPlanos={arrayPlanos}/>}
 {Convalescencia && <GerenciarConvalescenca carregarDados={carregarDados}  setarConv={setarConv} arrayConv={arrayConv}/>}
 {metas && <GerenciarMetas carregarDados={carregarDados} setarMetas={setarMetas} arrayMetas={arrayMetas} arraygrupos={arraygrupos} arrayPlanoContas={arrayPlanoContas}/>}
</div>

</>)
}