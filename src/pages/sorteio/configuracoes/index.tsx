import { useEffect, useState } from "react"
import  CadastroPremio  from "../../../components/sorteios/configuracoes/cadastroPremio"
import { api } from "@/services/apiClient"
import { toast } from "react-toastify"
import  ConsultarGanhadores  from "../../../components/sorteios/configuracoes/consultar"
import ConfigParams from "../../../components/sorteios/configuracoes/configParams"
import { Tabs } from "flowbite-react"
import { PiListBulletsFill } from "react-icons/pi"
import { GiPodiumWinner } from "react-icons/gi"

export interface PremioProps{
    id_premio:number,
    status:string,
    ordem:number,
    id_conveniados:number,
    conveniado:string,
    id_empresa:string,
    descricao:string,
    data:Date,
    conveniados:{filename:string}
  }
interface GanhadoresProps{
    id_contrato:number,
    titular:string,
    endereco:string,
    bairro:string,
    numero:number,
    premio:string,
    data_sorteio:Date,
    status:string
}






export default function ConfigSort(){
    
  
   
return(
    <div className="flex flex-col  w-full text-white">
    <Tabs theme={{base: 'bg-white rounded-b-lg',tabpanel:'bg-white rounded-b-lg h-[calc(100vh-105px)]',tablist:{tabitem:{base: "flex items-center  justify-center rounded-t-lg px-4 py-3 text-sm font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",variant:{underline:{active:{
        on:"active rounded-t-lg border-b-2 border-blue-600 text-blue-500 ",
        off:"border-b-2 border-transparent text-black hover:border-gray-700 hover:text-gray-600 "
      }}}}}}}  variant="underline">
    <Tabs.Item active title="Prêmios" icon={PiListBulletsFill}>
            <CadastroPremio/>    
    </Tabs.Item>
    <Tabs.Item title="Ganhadores" icon={GiPodiumWinner}>
        <ConsultarGanhadores  />
    </Tabs.Item>
  </Tabs>
  </div>

)

}

