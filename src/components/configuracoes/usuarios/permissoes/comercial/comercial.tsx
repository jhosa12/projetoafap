



import { Card, Tabs, ToggleSwitch } from "flowbite-react";
import { useState } from "react";
import { HiUserCircle } from "react-icons/hi2";
import { themaTab } from "../permisssoes";

interface DataProps{
    permissions:Array<string>,
    handlePermission:(permission:string)=>void
}



export function TabComercial({permissions,handlePermission}:DataProps){
    



   

    return(
        <Tabs   theme={themaTab} aria-label="Tabs with icons" variant="underline">
                  <Tabs.Item active title="Vendas" >
                    
                  <div className="grid grid-cols-4 gap-2" >
                  <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                    <h1 className="text-sm font-semibold">Acompanhamento</h1>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('COM1.1')} onChange={()=>handlePermission('COM1.1')}  label="Filtro"/>
                    <ToggleSwitch sizing={'sm'}checked={permissions.includes('COM1.2')} onChange={()=>handlePermission('COM1.2')}  label="Adicionar Meta"/>
              
                       
                  </Card>
            
                  </div>
      </Tabs.Item>
     
        </Tabs>
    )
}


