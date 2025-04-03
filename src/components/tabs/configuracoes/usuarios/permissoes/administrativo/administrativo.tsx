

import { Card, Checkbox, Label, Tabs, ToggleSwitch, Tooltip } from "flowbite-react";
import { themaCard, themaTab } from "../permisssoes";



interface DataProps {
  permissions: Array<string>,
  handlePermission: (permission: string) => void
}


export function TabAdministrativo({ permissions, handlePermission }: DataProps) {


  return (
    <Tabs theme={themaTab} aria-label="Tabs with icons" variant="underline">
      <Tabs.Item active title="Adm Contrato" >

        <div className="grid grid-cols-4 gap-2" >

          <Card theme={themaCard} className="p-2">
            <h1 className="text-xs font-semibold">Dados Associado</h1>
            <div className=" space-y-1">
              {[
                { id: "ADM1.1.1", label: "Editar" },
                { id: "ADM1.1.2", label: "Lançar/Editar Obs." },
                { id: "ADM1.1.3", label: "Inativar/Ativar" },
              ].map((perm) => (
                <div className="flex items-center gap-2">
                  <Checkbox id={perm.id} key={perm.id} checked={permissions.includes(perm.id)}
                    onChange={() => handlePermission(perm.id)} />
                  <Label htmlFor={perm.id}>  {perm.label}</Label>
                </div>
              ))}
            </div>
          </Card>



          <Card theme={themaCard} className="p-2">
            <h1 className="text-xs font-semibold">Historico/Mensal.</h1>
            <div className=" space-y-1">
              {[
                { id: "ADM1.2", label: "Visualizar" },
                { id: "ADM1.2.1", label: "Adicionar Mensalidade" },
                { id: "ADM1.2.3", label: "Excluir Mensalidade" },
                { id: "ADM1.2.5", label: "Baixar" },
                { id: "ADM1.2.6", label: "Estornar" },
                { id: "ADM1.2.2", label: "Adicionar Acordos" },
                { id: "ADM1.2.7", label: "Baixa Retroativa" },
                { id: "ADM1.2.8", label: "Alterar Vencimento" },
                { id: "ADM1.2.9", label: "Alterar data cobrança" },
                { id: "ADM1.2.10", label: "Exibir Pagas" },
                { id: "ADM1.2.11", label: "Manipular Acresc./Desc." },
              ].map((perm) => (
                <div className="flex items-center gap-2">
                  <Checkbox id={perm.id} key={perm.id} checked={permissions.includes(perm.id)}
                    onChange={() => handlePermission(perm.id)} />
                  <Label className="whitespace-nowrap truncate" htmlFor={perm.id}>  {perm.label}</Label>
                </div>
              ))}
            </div>
          </Card>


          <Card theme={themaCard} className="p-2">
            <h1 className="text-xs font-semibold">Dependentes</h1>
            <div className=" space-y-1">
              {[
                { id: "ADM1.3", label: "Visualizar" },
                { id: "ADM1.3.1", label: "Exibir Excluidos" },
                { id: "ADM1.3.3", label: "Excluir" },
                { id: "ADM1.3.2", label: "Adicionar" },
                { id: "ADM1.3.4", label: "Editar" },
              ].map((perm) => (
                <div className="flex items-center gap-2">
                  <Checkbox id={perm.id} key={perm.id} checked={permissions.includes(perm.id)}
                    onChange={() => handlePermission(perm.id)} />
                  <Label htmlFor={perm.id}>  {perm.label}</Label>
                </div>
              ))}
            </div>
          </Card>

          <Card theme={themaCard} className="p-2">
            <h1 className="text-xs font-semibold">Óbitos</h1>
            <div className=" space-y-1">
              {[
                { id: "ADM1.5", label: "Visualizar" },

              ].map((perm) => (
                <div className="flex items-center gap-2">
                  <Checkbox id={perm.id} key={perm.id} checked={permissions.includes(perm.id)}
                    onChange={() => handlePermission(perm.id)} />
                  <Label htmlFor={perm.id}>  {perm.label}</Label>
                </div>
              ))}
            </div>
          </Card>





        </div>
      </Tabs.Item>
      <Tabs.Item active title="Caixa" >

        <div className="grid grid-cols-4 gap-2" >
          <Card className="p-2" theme={themaCard}>
            <h1 className="text-xs font-semibold">Movimentação</h1>
            <div className="space-y-1">{[
              { id: 'ADM2.1.1', label: "Adicionar" },
              { id: 'ADM2.1.3', label: "Editar" },
              { id: 'ADM2.1.4', label: "Excluir" },
              { id: 'ADM2.1.5', label: "Vizualizar Valores" },
              { id: 'ADM2.1.6', label: "Caixa geral" },
            ].map((perm) => (
              <div className="flex items-center gap-2">
                <Checkbox id={perm.id} key={perm.id} checked={permissions.includes(perm.id)}
                  onChange={() => handlePermission(perm.id)} />
                <Label className="whitespace-nowrap truncate" htmlFor={perm.id}>  {perm.label}</Label>
              </div>
            ))}
            </div>
          </Card>

          <Card theme={themaCard} className="p-2">
            <h1 className="text-xs font-semibold">Relatórios</h1>
            <div className="space-y-1">
              {[
                { id: "ADM2.2", label: "Visualizar" },

              ].map((perm) => (
                <div className="flex items-center gap-2">
                  <Checkbox id={perm.id} key={perm.id} checked={permissions.includes(perm.id)}
                    onChange={() => handlePermission(perm.id)} />
                  <Label htmlFor={perm.id}>  {perm.label}</Label>
                </div>
              ))}
            </div>
          </Card>



        </div>
      </Tabs.Item>
      <Tabs.Item active title="Cobrança" >
        <div className="grid grid-cols-4 gap-2" >
          <Card theme={themaCard}>
            <h1 className="text-sm font-semibold">Lista Cobrança</h1>
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM3.2')} onChange={() => handlePermission('ADM3.2')} label="Imprimir" />
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM3.1')} onChange={() => handlePermission('ADM3.1')} label="Filtrar" />

          </Card>
        </div>
      </Tabs.Item>
      <Tabs.Item active title="Gerenciar" >
        <div className="grid grid-cols-4 gap-2" >
          <Card theme={themaCard}>
            <h1 className="text-sm font-semibold">Plano de contas</h1>
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.1')} onChange={() => handlePermission('ADM4.1')} label="Visualizar" />
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.1.1')} onChange={() => handlePermission('ADM4.1.1')} label="Adicionar" />
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.1.2')} onChange={() => handlePermission('ADM4.1.2')} label="Editar" />
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.1.3')} onChange={() => handlePermission('ADM4.1.3')} label="Excluir" />

          </Card>
          <Card theme={themaCard}>
            <h1 className="text-sm font-semibold">Metas</h1>
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.2')} onChange={() => handlePermission('ADM4.2')} label="Visualizar" />
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.2.1')} onChange={() => handlePermission('ADM4.2.1')} label="Adicionar" />
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.2.2')} onChange={() => handlePermission('ADM4.2.2')} label="Editar" />
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.2.3')} onChange={() => handlePermission('ADM4.2.3')} label="Excluir" />

          </Card>
          <Card theme={themaCard}>

            <h1 className="text-sm font-semibold">Convalescencia</h1>
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.3')} onChange={() => handlePermission('ADM4.3')} label="Visualizar" />
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.3.1')} onChange={() => handlePermission('ADM4.3.1')} label="Adicionar" />
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.3.2')} onChange={() => handlePermission('ADM4.3.2')} label="Editar" />
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.3.3')} onChange={() => handlePermission('ADM4.3.3')} label="Excluir" />

          </Card>
          <Card theme={themaCard}>
            <h1 className="text-sm font-semibold">Planos</h1>
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.4')} onChange={() => handlePermission('ADM4.4')} label="Visualizar" />
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.4.1')} onChange={() => handlePermission('ADM4.4.1')} label="Adicionar" />
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.4.2')} onChange={() => handlePermission('ADM4.4.2')} label="Editar" />
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM4.4.3')} onChange={() => handlePermission('ADM4.4.3')} label="Excluir" />

          </Card>
        </div>
      </Tabs.Item>
      <Tabs.Item active title="Convalescencia" >
        <div className="grid grid-cols-4 gap-2" >
          <Card theme={themaCard}>
            <h1 className="text-sm font-semibold">Convalescencia</h1>
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM5')} onChange={() => handlePermission('ADM5')} label="Visualizar" />
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM5.1')} onChange={() => handlePermission('ADM5.1')} label="Adicionar" />
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM5.2')} onChange={() => handlePermission('ADM5.2')} label="Editar" />
            <ToggleSwitch sizing={'sm'} checked={permissions.includes('ADM5.3')} onChange={() => handlePermission('ADM5.3')} label="Excluir" />

          </Card>
        </div>
      </Tabs.Item>

    </Tabs>
  )
}


