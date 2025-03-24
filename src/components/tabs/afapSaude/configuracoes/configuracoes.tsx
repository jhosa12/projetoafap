import { Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList } from "react-icons/hi";
import { HiUserCircle } from "react-icons/hi2";
import {MdMedicalServices } from "react-icons/md";
import { AddEditExames } from "./addEditExames";
import AdmMedico from "./administrarMedicos/admMedico";
import { ExamesProps, MedicoProps } from "@/types/afapSaude";


interface DataProps{
    exames:Array<ExamesProps>
    setExames:(array:Array<ExamesProps>)=>void
    medicos:Array<MedicoProps>
    setMedicos:(arr:Array<MedicoProps>)=>void
}

export default function Configuracoes({exames,setExames,medicos,setMedicos}:DataProps){


    return(
        <div className="overflow-x-auto">
      <Tabs
     theme={{tablist:{tabitem:{base:"flex z-0 items-center justify-center rounded-t-lg p-2 text-xs font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-600 ",variant:{fullWidth:{active:{off:'bg-gray-50 text-black',on:'bg-gray-300 text-black'}}}}}}} aria-label="Full width tabs" variant="fullWidth">
      
     
        <Tabs.Item active title="Exames" icon={()=><HiUserCircle  className="mr-2 h-3 w-3"/>}>
         <AddEditExames exames={exames} setExames={setExames}/>
        </Tabs.Item>
        <Tabs.Item title="Administrar Médicos" icon={()=><MdMedicalServices className="mr-2 h-3 w-3"/>}>
         <AdmMedico medicos={medicos} setArray={setMedicos}/>
        </Tabs.Item>
        <Tabs.Item title="Settings" icon={()=><HiAdjustments className="mr-2 h-3 w-3"/>}>
          This is <span className="font-medium text-white">Settings tab's associated content</span>.
          Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
          control the content visibility and styling.
        </Tabs.Item>
        <Tabs.Item title="Contacts" icon={()=><HiClipboardList className="mr-2 h-3 w-3"/>}>
          This is <span className="font-medium text-white">Contacts tab's associated content</span>.
          Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
          control the content visibility and styling.
        </Tabs.Item>
      
      </Tabs>
    </div>
    )
}