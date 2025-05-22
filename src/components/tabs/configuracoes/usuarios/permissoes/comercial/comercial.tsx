import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface DataProps {
  permissions: Array<string>;
  handlePermission: (permission: string) => void;
}

export function TabComercial({ permissions, handlePermission }: DataProps) {
  const [activeTab, setActiveTab] = useState("vendas");

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
        <TabsTrigger value="vendas">Vendas</TabsTrigger>
      </TabsList>

      <TabsContent value="vendas">
        <div className="grid grid-cols-4 gap-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Acompanhamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {renderCheckbox("COM1.1", "Filtro")}
              {renderCheckbox("COM1.2", "Adicionar Meta")}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
