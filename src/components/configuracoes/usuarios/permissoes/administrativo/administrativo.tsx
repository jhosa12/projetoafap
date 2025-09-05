import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface DataProps {
  permissions: Array<string>;
  handlePermission: (permission: string) => void;
}

const TABS = [
  { key: "contrato", title: "Adm Contrato" },
  { key: "caixa", title: "Caixa" },
  { key: "cobranca", title: "Cobrança" },
  { key: "gerenciar", title: "Gerenciar" },
  { key: "convalescencia", title: "Convalescencia" },
];

export function TabAdministrativo({ permissions, handlePermission }: DataProps) {
  const [activeTab, setActiveTab] = useState("contrato");

  const renderCheckbox = (id: string, label: string) => (
    <div key={id} className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={permissions.includes(id)}
        onCheckedChange={() => handlePermission(id)}
      />
      <label htmlFor={id} className="text-sm">{label}</label>
    </div>
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        {TABS.map(tab => (
          <TabsTrigger key={tab.key} value={tab.key}>{tab.title}</TabsTrigger>
        ))}
      </TabsList>

      {/* ADM Contrato */}
      <TabsContent value="contrato">
        <div className="grid grid-cols-4 gap-2">
          <Card className="p-2">
            <CardHeader>
              <CardTitle className="text-xs">Dados Associado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {["ADM1.1.1", "ADM1.1.2", "ADM1.1.3"].map((id, i) =>
                renderCheckbox(id, ["Editar", "Lançar/Editar Obs.", "Inativar/Ativar"][i])
              )}
            </CardContent>
          </Card>

          <Card className="p-2">
            <CardHeader>
              <CardTitle className="text-xs">Historico/Mensal.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                "ADM1.2", "ADM1.2.1", "ADM1.2.3", "ADM1.2.5", "ADM1.2.6", "ADM1.2.2",
                "ADM1.2.7", "ADM1.2.8", "ADM1.2.9", "ADM1.2.10", "ADM1.2.11"
              ].map((id, i) =>
                renderCheckbox(id, [
                  "Visualizar", "Adicionar Mensalidade", "Excluir Mensalidade", "Baixar",
                  "Estornar", "Adicionar Acordos", "Baixa Retroativa", "Alterar Vencimento",
                  "Alterar data cobrança", "Exibir Pagas", "Manipular Acresc./Desc."
                ][i])
              )}
            </CardContent>
          </Card>

          <Card className="p-2">
            <CardHeader>
              <CardTitle className="text-xs">Dependentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {["ADM1.3", "ADM1.3.1", "ADM1.3.3", "ADM1.3.2", "ADM1.3.4"].map((id, i) =>
                renderCheckbox(id, ["Visualizar", "Exibir Excluidos", "Excluir", "Adicionar", "Editar"][i])
              )}
            </CardContent>
          </Card>

          <Card className="p-2">
            <CardHeader>
              <CardTitle className="text-xs">Óbitos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {renderCheckbox("ADM1.5", "Visualizar")}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Caixa */}
      <TabsContent value="caixa">
        <div className="grid grid-cols-4 gap-2">
          <Card className="p-2">
            <CardHeader>
              <CardTitle className="text-xs">Movimentação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {["ADM2.1.1", "ADM2.1.3", "ADM2.1.4", "ADM2.1.5", "ADM2.1.6"].map((id, i) =>
                renderCheckbox(id, ["Adicionar", "Editar", "Excluir", "Vizualizar Valores", "Caixa geral"][i])
              )}
            </CardContent>
          </Card>

          <Card className="p-2">
            <CardHeader>
              <CardTitle className="text-xs">Relatórios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {renderCheckbox("ADM2.2", "Visualizar")}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Cobrança */}
      <TabsContent value="cobranca">
        <div className="grid grid-cols-4 gap-2">
          <Card className="p-2">
            <CardHeader>
              <CardTitle className="text-sm">Lista Cobrança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {["ADM3.2", "ADM3.1"].map((id, i) =>
                renderCheckbox(id, ["Imprimir", "Filtrar"][i])
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Gerenciar */}
      <TabsContent value="gerenciar">
        <div className="grid grid-cols-4 gap-2">
          {[
            { title: "Plano de contas", base: "ADM4.1" },
            { title: "Metas", base: "ADM4.2" },
            { title: "Convalescencia", base: "ADM4.3" },
            { title: "Planos", base: "ADM4.4" }
          ].map(({ title, base }) => (
            <Card key={base} className="p-2">
              <CardHeader>
                <CardTitle className="text-sm">{title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {[base, `${base}.1`, `${base}.2`, `${base}.3`].map((id, i) =>
                  renderCheckbox(id, ["Visualizar", "Adicionar", "Editar", "Excluir"][i])
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* Convalescencia */}
      <TabsContent value="convalescencia">
        <div className="grid grid-cols-4 gap-2">
          <Card className="p-2">
            <CardHeader>
              <CardTitle className="text-sm">Convalescencia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {["ADM5", "ADM5.1", "ADM5.2", "ADM5.3"].map((id, i) =>
                renderCheckbox(id, ["Visualizar", "Adicionar", "Editar", "Excluir"][i])
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
