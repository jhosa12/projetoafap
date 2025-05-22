import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { id } from "date-fns/locale";

interface DataProps {
  permissions: Array<string>;
  handlePermission: (permission: string) => void;
}

const sections = [
  {
    tab: "agenda",
    label: "Agenda",
    items: [
      {
        title: "Calendário",
        permissions: [
          { id: "AFS1.1", label: "Adicionar" },
          { id: "AFS1.2", label: "Editar" },
          { id: "AFS1.3", label: "Excluir" },
        ],
      },
    ],
  },

    {
    tab: "exames",
    label: "Exames",
    items: [
      {
        title: "Exames",
        permissions: [
          { id: "AFS2.0", label: "Acessar Tela" },
          { id: "AFS2.1", label: "Adicionar" },
          { id: "AFS2.2", label: "Editar" },
          { id: "AFS2.3", label: "Excluir" },
           { id: "AFS2.4", label: "Receber" },
            { id: "AFS2.5", label: "Estornar" },
          
        ],
      },
    ],
  },
 
  {
    tab: "consultas",
    label: "Consultas",
    items: [
      {
        title: "Consultas",
        permissions: [
          { id: "AFS3.0", label: "Acessar Tela" },
          { id: "AFS3.1", label: "Adicionar" },
          { id: "AFS3.2", label: "Editar" },
          { id: "AFS3.3", label: "Excluir" },
          { id: "AFS3.4", label: "Prontuário" },
          { id: "AFS3.5", label: "Receber Consulta" },
          { id: "AFS3.6", label: "Estornar Consulta" },
        ],
      },
    ],
  },
  

  {
    tab: "configurar",
    label: "Configurar",
    items: [
         {
        title: "Tela Principal",
        permissions: [
          { id: "AFS4.0", label: "Acesso a Tela" },
         
        ],
      },
      {
        title: "Exames",
        permissions: [
          { id: "AFS4.1.1", label: "Adicionar" },
          { id: "AFS4.1.2", label: "Editar" },
          { id: "AFS4.1.3", label: "Excluir" },
        ],
      },
      {
        title: "Médicos",
        permissions: [
          { id: "AFS4.2.1", label: "Adicionar Medico" },
          { id: "AFS4.2.2", label: "Editar Medico" },
          { id: "AFS4.2.3", label: "Excluir Medico" },
          {id: "AFS4.2.4", label: "Adicionar Procedimentos"},
          {id: "AFS4.2.5", label: "Editar Procedimentos"},
          {id: "AFS4.2.6", label: "Excluir Procedimentos"},
          {id: "AFS4.2.7", label: "Recibo de Repasse"},

        ],
      },
    ],
  },
];

function PermissionCheckbox({
  permission,
  label,
  permissions,
  handlePermission,
}: {
  permission: string;
  label: string;
  permissions: string[];
  handlePermission: (permission: string) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={permission}
        checked={permissions.includes(permission)}
        onCheckedChange={() => handlePermission(permission)}
      />
      <label htmlFor={permission} className="text-sm">
        {label}
      </label>
    </div>
  );
}

export function TabAfapSaude({
  permissions,
  handlePermission,
}: DataProps) {
  return (
    <Tabs defaultValue={sections[0].tab} className="w-full">
      <TabsList>
        {sections.map((section) => (
          <TabsTrigger key={section.tab} value={section.tab}>
            {section.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {sections.map((section) => (
        <TabsContent key={section.tab} value={section.tab}>
          <div className="grid grid-cols-4 gap-2">
            {section.items.map((item, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-sm">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {item.permissions.map((perm) => (
                    <PermissionCheckbox
                      key={perm.id}
                      permission={perm.id}
                      label={perm.label}
                      permissions={permissions}
                      handlePermission={handlePermission}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
