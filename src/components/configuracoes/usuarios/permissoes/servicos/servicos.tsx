



import { Card, Tabs, ToggleSwitch } from "flowbite-react";
import { useState } from "react";

interface DataProps{
    permissions:Array<string>,
    handlePermission:(permission:string)=>void
}




export function TabServicos({permissions,handlePermission}:DataProps){




   

    return(
        <Tabs   theme={{base:'bg-white rounded-lg',tablist:{tabitem:{base:"flex items-center justify-center  px-4 text-sm font-medium   disabled:cursor-not-allowed disabled:text-gray-400 "}}}} aria-label="Tabs with icons" variant="underline">
                  <Tabs.Item active title="Óbitos" >
                    
                  <div className="grid grid-cols-4 gap-2" >
                  <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                    <h1 className="text-sm font-semibold">Acompanhamento</h1>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('SVS1')} onChange={()=>handlePermission('SVS1')} label="Visualizar"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('SVS1.1')} onChange={()=>handlePermission('SVS1.1')} label="Adicionar"/>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('SVS1.2')} onChange={()=>handlePermission('SVS1.2')} label="Editar"/>
                    
                      <ToggleSwitch sizing={'sm'} checked={permissions.includes('SVS1.3')} onChange={()=>handlePermission('SVS1.3')} label="Excluir"/>
                      <ToggleSwitch  sizing={'sm'} checked={permissions.includes('SVS1.4')} onChange={()=>handlePermission('SVS1.4')} label="Filtro"/>
                       
                  </Card>
            
                  </div>
      </Tabs.Item>
     
        </Tabs>
    )
}


