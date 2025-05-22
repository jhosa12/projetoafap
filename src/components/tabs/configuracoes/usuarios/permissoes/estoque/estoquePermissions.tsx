import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface DataProps {
  permissions: Array<string>;
  handlePermission: (permission: string) => void;
}

export function TabEstoque({ permissions, handlePermission }: DataProps) {
  const [activeTab, setActiveTab] = useState("estoque");

  const renderCheckbox = (id: string, label: string) => (
    <div key={id} className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={permissions.includes(id)}
        onCheckedChange={() => handlePermission(id)}
      />
      <Label htmlFor={id} className="text-sm">{label}</Label>
    </div>
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="estoque">Estoque</TabsTrigger>
        <TabsTrigger value="historico">Histórico</TabsTrigger>
      </TabsList>

      <TabsContent value="estoque">
        <div className="grid grid-cols-4 gap-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Estoque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {renderCheckbox("EST1.1", "Cadastrar Produtos")}
              {renderCheckbox("EST1.2", "Saída de estoque")}
              {renderCheckbox("EST1.3", "Entrada de estoque")}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="historico">
        <div className="grid grid-cols-4 gap-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Histórico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {renderCheckbox("EST2.1", "Adicionar")}
              {renderCheckbox("EST2.2", "Estornar")}
              {renderCheckbox("EST2.3", "Excluir")}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
