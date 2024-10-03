



import { Card, Tabs, ToggleSwitch } from "flowbite-react";


interface DataProps{
    permissions:Array<string>,
    handlePermission:(permission:string)=>void
}



export function TabConfiguracoes({permissions,handlePermission}:DataProps){
    
    return(
        <Tabs   theme={{base:'bg-white rounded-lg',tablist:{tabitem:{base:"flex items-center justify-center  px-4 text-sm font-medium   disabled:cursor-not-allowed disabled:text-gray-400 "}}}} aria-label="Tabs with icons" variant="underline">
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


