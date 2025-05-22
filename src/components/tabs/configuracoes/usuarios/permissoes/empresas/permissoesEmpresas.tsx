import { useContext } from "react";
import { AuthContext } from "@/store/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface DataProps {
  permissions: Array<string>;
  handlePermission: (permission: string) => void;
}

export function PermissoesEmpresas({ permissions, handlePermission }: DataProps) {
  const { empresas } = useContext(AuthContext);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Empresas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {empresas.map((empresa: { id: string; nome: string }) => {
          const permKey = `EMP${empresa.id}`;
          return (
            <div key={permKey} className="flex items-center space-x-2">
              <Checkbox
                id={permKey}
                checked={permissions.includes(permKey)}
                onCheckedChange={() => handlePermission(permKey)}
              />
              <label htmlFor={permKey} className="text-sm">
                {empresa.nome}
              </label>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
