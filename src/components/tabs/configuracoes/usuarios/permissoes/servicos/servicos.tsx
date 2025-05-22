import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface DataProps {
  permissions: Array<string>;
  handlePermission: (permission: string) => void;
}

export function TabServicos({ permissions, handlePermission }: DataProps) {
  const [activeTab, setActiveTab] = useState("obitos");

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
        <TabsTrigger value="obitos">Óbitos</TabsTrigger>
      </TabsList>

      <TabsContent value="obitos">
        <div className="grid grid-cols-4 gap-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Acompanhamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {renderCheckbox("SVS1", "Visualizar")}
              {renderCheckbox("SVS1.1", "Adicionar")}
              {renderCheckbox("SVS1.2", "Editar")}
              {renderCheckbox("SVS1.3", "Excluir")}
              {renderCheckbox("SVS1.4", "Filtro")}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
