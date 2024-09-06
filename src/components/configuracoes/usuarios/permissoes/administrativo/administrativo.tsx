



import { Card, Tabs, ToggleSwitch } from "flowbite-react";
import { useState } from "react";
import { HiUserCircle } from "react-icons/hi2";


interface DataProps{
    permissions:Array<string>,
    handlePermission:(permission:string)=>void
}


export function TabAdministrativo({permissions,handlePermission}:DataProps){


    return(
        <Tabs   theme={{base:'bg-white rounded-lg',tablist:{tabitem:{base:"flex items-center justify-center  px-4 text-sm font-medium   disabled:cursor-not-allowed disabled:text-gray-400 "}}}} aria-label="Tabs with icons" variant="underline">
                  <Tabs.Item active title="Adm Contrato" >
                    
                  <div className="grid grid-cols-4 gap-2" >
                  <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                    <h1 className="text-sm font-semibold">Dados Associado</h1>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM1.1.1')} onChange={()=>handlePermission('ADM1.1.1')} label="Editar"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM1.1.2')} onChange={()=>handlePermission('ADM1.1.2')} label="Lançar/editar observações"/>
              
                       
                  </Card>
                  <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                    <h1 className="text-sm font-semibold">Historico/Mensalidade</h1>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM1.2')} onChange={()=>handlePermission('ADM1.2')}  label="Visualizar"/>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM1.2.1')} onChange={()=>handlePermission('ADM1.2.1')}  label="Adicionar Mensalidade"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM1.2.3')} onChange={()=>handlePermission('ADM1.2.3')}  label="Excluir Mensalidade"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM1.2.5')} onChange={()=>handlePermission('ADM1.2.5')}  label="Baixar"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM1.2.6')} onChange={()=>handlePermission('ADM1.2.6')}  label="Estornar"/>
                    <ToggleSwitch  sizing={'sm'}checked={permissions.includes('ADM1.2.2')} onChange={()=>handlePermission('ADM1.2.2')}  label="Adicionar Acordos"/>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM1.2.7')} onChange={()=>handlePermission('ADM1.2.7')}  label="Baixa Retroativa"/>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM1.2.8')} onChange={()=>handlePermission('ADM1.2.8')}  label="Alterar Vencimento"/>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM1.2.9')} onChange={()=>handlePermission('ADM1.2.9')}  label="Alterar data cobrança"/>
                       
                  </Card>
                  <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                    <h1 className="text-sm font-semibold">Dependentes</h1>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM1.3')} onChange={()=>handlePermission('ADM1.3')}  label="Visualizar"/>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM1.3.1')} onChange={()=>handlePermission('ADM1.3.1')}  label="Exibir Excluidos"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM1.3.3')} onChange={()=>handlePermission('ADM1.3.3')}  label="Excluir"/>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM1.3.2')} onChange={()=>handlePermission('ADM1.3.2')}  label="Adicionar"/>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM1.3.4')} onChange={()=>handlePermission('ADM1.3.4')}  label="Editar"/>  
                  </Card>
                  <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                    <h1 className="text-sm font-semibold">Óbitos</h1>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM1.5')} onChange={()=>handlePermission('ADM1.5')}  label="Visualizar"/>
                  </Card>
                  </div>
      </Tabs.Item>
      <Tabs.Item active title="Caixa" >
     
      <div className="grid grid-cols-4 gap-2" >
                  <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                    <h1 className="text-sm font-semibold">Movimentação</h1>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM2.1.1')} onChange={()=>handlePermission('ADM2.1.1')}  label="Adicionar"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM2.1.3')} onChange={()=>handlePermission('ADM2.1.3')}  label="Editar"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM2.1.4')} onChange={()=>handlePermission('ADM2.1.4')}  label="Excluir"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM2.1.2')} onChange={()=>handlePermission('ADM2.1.2')}  label="Filtrar"/>
                       
                  </Card>
                  <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                    <h1 className="text-sm font-semibold">Relatório</h1>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM2.2')} onChange={()=>handlePermission('ADM2.2')}  label="Visualizar"/>
             
                       
                  </Card>
              
               
                  </div>
      </Tabs.Item>
      <Tabs.Item active title="Cobrança" >
      <div className="grid grid-cols-4 gap-2" >
                  <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                    <h1 className="text-sm font-semibold">Lista Cobrança</h1>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM3.2')} onChange={()=>handlePermission('ADM3.2')}  label="Imprimir"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM3.1')} onChange={()=>handlePermission('ADM3.1')}  label="Filtrar"/>
                       
                  </Card>
                  </div>
      </Tabs.Item>
      <Tabs.Item active title="Gerenciar" >
      <div className="grid grid-cols-4 gap-2" >
                  <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                    <h1 className="text-sm font-semibold">Plano de contas</h1>
                        <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM4.1')} onChange={()=>handlePermission('ADM4.1')}  label="Visualizar"/>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM4.1.1')} onChange={()=>handlePermission('ADM4.1.1')}  label="Adicionar"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.1.2')} onChange={()=>handlePermission('ADM4.1.2')}  label="Editar"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.1.3')} onChange={()=>handlePermission('ADM4.1.3')}  label="Excluir"/>
                       
                  </Card>
                  <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                    <h1 className="text-sm font-semibold">Metas</h1>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM4.2')} onChange={()=>handlePermission('ADM4.2')}  label="Visualizar"/>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM4.2.1')} onChange={()=>handlePermission('ADM4.2.1')}  label="Adicionar"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.2.2')} onChange={()=>handlePermission('ADM4.2.2')}  label="Editar"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.2.3')} onChange={()=>handlePermission('ADM4.2.3')}  label="Excluir"/>
                       
                  </Card>
                  <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>

                    <h1 className="text-sm font-semibold">Convalescencia</h1>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM4.3')} onChange={()=>handlePermission('ADM4.3')}  label="Visualizar"/>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM4.3.1')} onChange={()=>handlePermission('ADM4.3.1')}  label="Adicionar"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.3.2')} onChange={()=>handlePermission('ADM4.3.2')}  label="Editar"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.3.3')} onChange={()=>handlePermission('ADM4.3.3')}  label="Excluir"/>
                       
                  </Card>
                  <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                    <h1 className="text-sm font-semibold">Planos</h1>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM4.4')} onChange={()=>handlePermission('ADM4.4')}  label="Visualizar"/>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM4.4.1')} onChange={()=>handlePermission('ADM4.4.1')}  label="Adicionar"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.4.2')} onChange={()=>handlePermission('ADM4.4.2')}  label="Editar"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.4.3')} onChange={()=>handlePermission('ADM4.4.3')}  label="Excluir"/>
                       
                  </Card>
                  </div>
      </Tabs.Item>
      <Tabs.Item active title="Convalescencia" >
      <div className="grid grid-cols-4 gap-2" >
                  <Card  theme={{root:{children:"flex h-full flex-col  gap-2 p-4"}}}>
                    <h1 className="text-sm font-semibold">Convalescencia</h1>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM5')} onChange={()=>handlePermission('ADM5')}  label="Visualizar"/>
                    <ToggleSwitch  sizing={'sm'} checked={permissions.includes('ADM5.1')} onChange={()=>handlePermission('ADM5.1')}  label="Adicionar"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM5.2')} onChange={()=>handlePermission('ADM5.2')}  label="Editar"/>
                    <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM5.3')} onChange={()=>handlePermission('ADM5.3')}  label="Excluir"/>
                       
                  </Card>
                  </div>
      </Tabs.Item>
    
        </Tabs>
    )
}


