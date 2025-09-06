import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface DataProps {
  permissions: Array<string>;
  handlePermission: (permission: string) => void;
}

export function TabConfiguracoes({ permissions, handlePermission }: DataProps) {
  const [activeTab, setActiveTab] = useState("config");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="config">Configurações</TabsTrigger>
      </TabsList>

      <TabsContent value="config">
        <div className="grid grid-cols-4 gap-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tela Principal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="CFG1"
                  checked={permissions.includes("CFG1")}
                  onCheckedChange={() => handlePermission("CFG1")}
                />
                <Label htmlFor="CFG1" className="text-sm">Acesso</Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
