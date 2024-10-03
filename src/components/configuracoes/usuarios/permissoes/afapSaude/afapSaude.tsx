



import { Card, Tabs, ToggleSwitch } from "flowbite-react";



interface DataProps{
    permissions:Array<string>,
    handlePermission:(permission:string)=>void
}


export function TabAfapSaude({permissions,handlePermission}:DataProps){
   // const [permissions,setPermissions] = useState<Array<string>>([])



   /* const handlePermission =(permission:string)=>{
        if( permissions.includes(permission)){
            setPermissions(permissions.filter(item=>item!==permission))
        }else{
            setPermissions([...permissions,permission])
        }
    
    }*/

    return(
        <Tabs   theme={{base:'bg-white rounded-lg',tablist:{tabitem:{base:"flex items-center justify-center  px-4 text-sm font-medium   disabled:cursor-not-allowed disabled:text-gray-400 "}}}} aria-label="Tabs with icons" variant="underline">
                  <Tabs.Item active title="Agenda" >
                    
                  <div className="grid grid-cols-4 gap-2" >
                  <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                    <h1 className="text-sm font-semibold">Calendário</h1>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('AFS1.1')} onChange={()=>handlePermission('AFS1.1')}  label="Adicionar"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('AFS1.2')} onChange={()=>handlePermission('AFS1.2')} label="Editar"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('AFS1.3')} onChange={()=>handlePermission('AFS1.3')} label="Excluir"/>
                       
                  </Card>
            
                  </div>
      </Tabs.Item>

      <Tabs.Item active title="Pré agendamento" >
                    
                    <div className="grid grid-cols-4 gap-2" >
                    <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                      <h1 className="text-sm font-semibold">Pré Agendamento</h1>
                      <ToggleSwitch  sizing={'sm'} checked={permissions.includes('AFS2.1')} onChange={()=>handlePermission('AFS2.1')} label="Adicionar"/>
                      <ToggleSwitch sizing={'sm'} checked={permissions.includes('AFS2.2')} onChange={()=>handlePermission('AFS2.2')} label="Editar"/>
                      <ToggleSwitch sizing={'sm'} checked={permissions.includes('AFS2.3')} onChange={()=>handlePermission('AFS2.3')} label="Excluir"/>
                         
                    </Card>
              
                    </div>
        </Tabs.Item>

        <Tabs.Item active title="Consultas" >
                    
                    <div className="grid grid-cols-4 gap-2" >
                    <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                      <h1 className="text-sm font-semibold">Consultas</h1>
                      <ToggleSwitch  sizing={'sm'} checked={permissions.includes('AFS3.1')} onChange={()=>handlePermission('AFS3.1')} label="Adicionar"/>
                      <ToggleSwitch sizing={'sm'} checked={permissions.includes('AFS3.2')} onChange={()=>handlePermission('AFS3.2')} label="Editar"/>
                      <ToggleSwitch sizing={'sm'} checked={permissions.includes('AFS3.3')} onChange={()=>handlePermission('AFS3.3')} label="Excluir"/>
                         
                    </Card>
              
                    </div>
        </Tabs.Item>
        <Tabs.Item active title="Configurar" >
                    
                    <div className="grid grid-cols-4 gap-2" >
                    <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                      <h1 className="text-sm font-semibold">Exames</h1>
                      <ToggleSwitch  sizing={'sm'} checked={permissions.includes('AFS4.1.1')} onChange={()=>handlePermission('AFS4.1.1')} label="Adicionar"/>
                      <ToggleSwitch sizing={'sm'} checked={permissions.includes('AFS4.1.2')} onChange={()=>handlePermission('AFS4.1.2')} label="Editar"/>
                      <ToggleSwitch sizing={'sm'} checked={permissions.includes('AFS4.1.3')} onChange={()=>handlePermission('AFS4.1.3')} label="Excluir"/>
                         
                
                         
                    </Card>
                    <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                      <h1 className="text-sm font-semibold">Medicos</h1>
                      <ToggleSwitch  sizing={'sm'} checked={permissions.includes('AFS4.2.1')} onChange={()=>handlePermission('AFS4.2.1')} label="Adicionar"/>
                      <ToggleSwitch sizing={'sm'} checked={permissions.includes('AFS4.2.2')} onChange={()=>handlePermission('AFS4.2.2')} label="Editar"/>
                      <ToggleSwitch sizing={'sm'} checked={permissions.includes('AFS4.2.3')} onChange={()=>handlePermission('AFS4.2.3')} label="Excluir"/>
                         
                
                         
                    </Card>
              
                    </div>
        </Tabs.Item>
       
       
       
     
        </Tabs>
    )
}


