



import { Card, Tabs, ToggleSwitch } from "flowbite-react";
import { themaTab } from "../permisssoes";


interface DataProps{
    permissions:Array<string>,
    handlePermission:(permission:string)=>void
}



export function TabConfiguracoes({permissions,handlePermission}:DataProps){
    
    return(
        <Tabs   theme={themaTab} aria-label="Tabs with icons" variant="underline">
                  <Tabs.Item active title="Configurações" >
                    
                  <div className="grid grid-cols-4 gap-2" >
                  <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                    <h1 className="text-sm font-semibold">Tela Principal</h1>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('CFG1')} onChange={()=>handlePermission('CFG1')}  label="Acesso"/>
                  
              
                       
                  </Card>
            
                  </div>
      </Tabs.Item>
     
        </Tabs>
    )
}


