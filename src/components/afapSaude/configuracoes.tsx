import { Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList } from "react-icons/hi";
import { HiUserCircle } from "react-icons/hi2";
import { MdAccessTimeFilled, MdDashboard, MdMedicalServices } from "react-icons/md";
import { AddEditExames } from "./addEditExames";
import { ExamesProps, MedicoProps } from "@/pages/afapSaude";
import AdmMedico from "./admMedico";

interface DataProps{
    exames:Array<ExamesProps>
    setExames:(array:Array<ExamesProps>)=>void
    medicos:Array<MedicoProps>
    setMedicos:(arr:Array<MedicoProps>)=>void
}

export default function Configuracoes({exames,setExames,medicos,setMedicos}:DataProps){


    return(
        <div className="overflow-x-auto">
      <Tabs theme={{tablist:{tabitem:{base:"flex  items-center justify-center rounded-t-lg p-2 text-sm font-medium first:ml-0 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",variant:{fullWidth:{active:{off:'bg-gray-600',on:'bg-gray-100 text-black'}}}}}}} aria-label="Full width tabs" variant="fullWidth">
        <Tabs.Item active title="Exames" icon={HiUserCircle}>
         <AddEditExames exames={exames} setExames={setExames}/>
        </Tabs.Item>
        <Tabs.Item title="Administrar Médicos" icon={MdMedicalServices}>
         <AdmMedico medicos={medicos} setArray={setMedicos}/>
        </Tabs.Item>
        <Tabs.Item title="Settings" icon={HiAdjustments}>
          This is <span className="font-medium text-white">Settings tab's associated content</span>.
          Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
          control the content visibility and styling.
        </Tabs.Item>
        <Tabs.Item title="Contacts" icon={HiClipboardList}>
          This is <span className="font-medium text-white">Contacts tab's associated content</span>.
          Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
          control the content visibility and styling.
        </Tabs.Item>
      
      </Tabs>
    </div>
    )
}