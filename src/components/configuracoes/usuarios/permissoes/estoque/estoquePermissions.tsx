




import { Card, Tabs, ToggleSwitch } from "flowbite-react";



interface DataProps{
    permissions:Array<string>,
    handlePermission:(permission:string)=>void
}


export function TabEstoque({permissions,handlePermission}:DataProps){
   

    return(
        <Tabs   theme={{base:'bg-white rounded-lg',tablist:{tabitem:{base:"flex items-center justify-center  px-4 text-sm font-medium   disabled:cursor-not-allowed disabled:text-gray-400 "}}}} aria-label="Tabs with icons" variant="underline">
                  <Tabs.Item active title="Estoque" >
                    
                  <div className="grid grid-cols-4 gap-2" >
                  <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                    <h1 className="text-sm font-semibold">Estoque</h1>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('EST1.1')} onChange={()=>handlePermission('EST1.1')}  label="Cadastrar Produtos"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('EST1.2')} onChange={()=>handlePermission('EST1.2')} label="Saída de estoque"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('EST1.3')} onChange={()=>handlePermission('EST1.3')} label="Entrada de estoque"/>
                       
                  </Card>
            
                  </div>
      </Tabs.Item>

      <Tabs.Item active title="Historico" >
                    
                    <div className="grid grid-cols-4 gap-2" >
                    <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                      <h1 className="text-sm font-semibold">Historico</h1>
                      <ToggleSwitch  sizing={'sm'} checked={permissions.includes('EST2.1')} onChange={()=>handlePermission('EST2.1')} label="Adicionar"/>
                      <ToggleSwitch sizing={'sm'} checked={permissions.includes('EST2.2')} onChange={()=>handlePermission('EST2.2')} label="Estornar"/>
                      <ToggleSwitch sizing={'sm'} checked={permissions.includes('EST2.3')} onChange={()=>handlePermission('EST2.3')} label="Excluir"/>
                         
                    </Card>
              
                    </div>
        </Tabs.Item>

 
     
       
       
       
     
        </Tabs>
    )
}






