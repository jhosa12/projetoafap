import { Tabs } from "flowbite-react";
import { HiUserCircle } from "react-icons/hi2";
import { TabAdministrativo } from "./administrativo/administrativo";
import { TabComercial } from "./comercial/comercial";
import { TabAfapSaude } from "./afapSaude/afapSaude";
import { TabServicos } from "./servicos/servicos";
import { TabConfiguracoes } from "./configuracoes/configuracoes";
import { TabEstoque } from "./estoque/estoquePermissions";


interface DataProps{
    permissions:Array<string>,
    handlePermission:(permission:string)=>void
}


export function Permissoes({permissions,handlePermission}:DataProps){


    return(
        <Tabs   theme={{base:'bg-white rounded-lg ',tablist:{tabitem:{base:"flex items-center justify-center  p-4 text-sm font-medium   disabled:cursor-not-allowed disabled:text-gray-400 "}}}} aria-label="Tabs with icons" variant="underline">
                  <Tabs.Item active title="Administrativo" icon={HiUserCircle}>
     <TabAdministrativo  handlePermission={handlePermission} permissions={permissions}/>
      </Tabs.Item>
      <Tabs.Item active title="Comercial" icon={HiUserCircle}>
     <TabComercial  handlePermission={handlePermission} permissions={permissions}/>
      </Tabs.Item>
      <Tabs.Item active title="Afap Saúde" icon={HiUserCircle}>
     <TabAfapSaude handlePermission={handlePermission} permissions={permissions}/>
      </Tabs.Item>
      <Tabs.Item active title="Estoque" icon={HiUserCircle}>
      <TabEstoque handlePermission={handlePermission} permissions={permissions}/>
      </Tabs.Item>
      <Tabs.Item active title="Serviços" icon={HiUserCircle}>
     <TabServicos handlePermission={handlePermission} permissions={permissions}/>
      </Tabs.Item>
      <Tabs.Item active title="Financeiro" icon={HiUserCircle}>
      TESTE22222
      </Tabs.Item>
      <Tabs.Item active title="Configurações" icon={HiUserCircle}>
      <TabConfiguracoes permissions={permissions} handlePermission={handlePermission}/>
      </Tabs.Item>
  
      

    
  
        </Tabs>
    )
}