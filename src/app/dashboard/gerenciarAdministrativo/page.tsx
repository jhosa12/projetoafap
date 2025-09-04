'use client';

import { GerenciarConvalescenca } from "@/components/gerenciarAdm/convalescencia/convalescencia";
import { GerenciarMetas } from "@/components/gerenciarAdm/metas/metas";
import { PlanoContas } from "@/components/gerenciarAdm/planoContas/planoContas";
import { GerenciarPlanos } from "@/components/gerenciarAdm/planos/planos";
import { AuthContext } from "@/store/AuthContext";
import { api } from "@/lib/axios/apiClient"
import { Tabs } from "flowbite-react";
import Head from "next/head"
import React, {useContext, useEffect, useState } from "react"
import { BiSolidInjection } from "react-icons/bi";
import { FaCalendarAlt } from "react-icons/fa";
import { HiClipboardList } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import { PlanoContasProps } from "../financeiro/page";
import { Veiculos } from "@/components/gerenciarAdm/veiculos/veiculos";
import { toast } from "sonner";

interface MetasProps{
    id_meta:number,
    id_conta:string,
    id_grupo :number,
    descricao:string,
    valor:number,
    date:Date,
    grupo:GruposProps
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
   
    const [arrayPlanoContas,setArrayPlanoContas] = useState<Array<PlanoContasProps>>([])
    const [arraygrupos,setArrayGrupos] = useState<Array<GruposProps>>([])
    const [arrayPlanos,setArrayPlanos]= useState<Array<PlanosProps>>([])
    const [arrayConv,setArrayConv]= useState<Array<ConvProps>>([])
    const [arrayMetas,setArrayMetas]=useState<Array<MetasProps>>([])
    const {usuario,signOut,selectEmp,empresas} = useContext(AuthContext)




const setarDados =(planoContas:Array<PlanoContasProps>,grupos:Array<GruposProps>)=>{
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

  <Tabs theme={{base: 'bg-white rounded-b-lg',tabpanel:'bg-white rounded-b-lg h-[calc(100vh-70px)]',tablist:{tabitem:{base: "flex items-center  justify-center rounded-t-lg px-4 py-3 text-xs font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",variant:{underline:{active:{
        on:"active rounded-t-lg border-b-2 border-blue-600 text-blue-500 ",
        off:"border-b-2 border-transparent text-black hover:border-gray-700 hover:text-gray-600 "
      }}}}}}}  variant="underline">

<Tabs.Item  active title="PLANO DE CONTAS" icon={()=><FaCalendarAlt className="mr-2 h-4 w-4"/>}>

<PlanoContas carregarDados={carregarDados} arrayPlanoContas={arrayPlanoContas} arraygrupos={arraygrupos} setarDados={setarDados}/>
     
      </Tabs.Item>
      <Tabs.Item title="PLANOS" icon={()=><HiClipboardList className="mr-2 h-4 w-4"/>}>
      <GerenciarPlanos carregarDados={carregarDados}  setarPlanos={setarPlanos} arrayPlanos={arrayPlanos}/>
      </Tabs.Item>
      <Tabs.Item title="CONVALESCENTES" icon={()=><BiSolidInjection className="mr-2 h-4 w-4"/>}>
      <GerenciarConvalescenca carregarDados={carregarDados}  setarConv={setarConv} arrayConv={arrayConv}/>
      </Tabs.Item>
      <Tabs.Item  icon={()=><IoMdSettings className="mr-2 h-4 w-4"/>}  title="METAS CONTAS">
      <GerenciarMetas planoContas={arrayPlanoContas} empresas={empresas} id_empresa={selectEmp} setores={arraygrupos} />
      </Tabs.Item>
      <Tabs.Item  icon={()=><IoMdSettings className="mr-2 h-4 w-4"/>}  title="VEICULOS">
      <Veiculos empresas={empresas} id_empresa={selectEmp}  />
      </Tabs.Item>
    </Tabs>



</>)
}