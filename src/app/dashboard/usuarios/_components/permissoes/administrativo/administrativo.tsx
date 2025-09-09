import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";
import { PermissionCard, type PermissionItem } from "@/components/permissions/permission-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
  const [query, setQuery] = useState("");
  const permissionsSet = useMemo(() => new Set(permissions), [permissions]);

  // Listas de itens por grupo em cada aba
  const contratoGroups: { title: string; items: PermissionItem[] }[] = [
    {
      title: "Dados Associado",
      items: [
        { id: "ADM1.1.1", label: "Editar" },
        { id: "ADM1.1.2", label: "Lançar/Editar Obs." },
        { id: "ADM1.1.3", label: "Inativar/Ativar" },
      ],
    },
    {
      title: "Historico/Mensal.",
      items: [
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
      ],
    },
    {
      title: "Dependentes",
      items: [
        { id: "ADM1.3", label: "Visualizar" },
        { id: "ADM1.3.1", label: "Exibir Excluidos" },
        { id: "ADM1.3.3", label: "Excluir" },
        { id: "ADM1.3.2", label: "Adicionar" },
        { id: "ADM1.3.4", label: "Editar" },
      ],
    },
    {
      title: "Óbitos",
      items: [{ id: "ADM1.5", label: "Visualizar" }],
    },
  ];

  const caixaGroups: { title: string; items: PermissionItem[] }[] = [
    {
      title: "Movimentação",
      items: [
        { id: "ADM2.1.1", label: "Adicionar" },
        { id: "ADM2.1.3", label: "Editar" },
        { id: "ADM2.1.4", label: "Excluir" },
        { id: "ADM2.1.5", label: "Vizualizar Valores" },
        { id: "ADM2.1.6", label: "Caixa geral" },
      ],
    },
    {
      title: "Relatórios",
      items: [{ id: "ADM2.2", label: "Visualizar" }],
    },
  ];

  const cobrancaGroups: { title: string; items: PermissionItem[] }[] = [
    {
      title: "Lista Cobrança",
      items: [
        { id: "ADM3.2", label: "Imprimir" },
        { id: "ADM3.1", label: "Filtrar" },
      ],
    },
  ];

  const gerenciarGroups: { title: string; items: PermissionItem[] }[] = [
    {
      title: "Plano de contas",
      items: [
        { id: "ADM4.1", label: "Visualizar" },
        { id: "ADM4.1.1", label: "Adicionar" },
        { id: "ADM4.1.2", label: "Editar" },
        { id: "ADM4.1.3", label: "Excluir" },
      ],
    },
    {
      title: "Metas",
      items: [
        { id: "ADM4.2", label: "Visualizar" },
        { id: "ADM4.2.1", label: "Adicionar" },
        { id: "ADM4.2.2", label: "Editar" },
        { id: "ADM4.2.3", label: "Excluir" },
      ],
    },
    {
      title: "Convalescencia",
      items: [
        { id: "ADM4.3", label: "Visualizar" },
        { id: "ADM4.3.1", label: "Adicionar" },
        { id: "ADM4.3.2", label: "Editar" },
        { id: "ADM4.3.3", label: "Excluir" },
      ],
    },
    {
      title: "Planos",
      items: [
        { id: "ADM4.4", label: "Visualizar" },
        { id: "ADM4.4.1", label: "Adicionar" },
        { id: "ADM4.4.2", label: "Editar" },
        { id: "ADM4.4.3", label: "Excluir" },
      ],
    },
  ];

  const convalescenciaGroups: { title: string; items: PermissionItem[] }[] = [
    {
      title: "Convalescencia",
      items: [
        { id: "ADM5", label: "Visualizar" },
        { id: "ADM5.1", label: "Adicionar" },
        { id: "ADM5.2", label: "Editar" },
        { id: "ADM5.3", label: "Excluir" },
      ],
    },
  ];

  const groupsByTab: Record<string, { title: string; items: PermissionItem[] }[]> = {
    contrato: contratoGroups,
    caixa: caixaGroups,
    cobranca: cobrancaGroups,
    gerenciar: gerenciarGroups,
    convalescencia: convalescenciaGroups,
  };

  const toggle = (id: string) => handlePermission(id);

  const selectAllCurrentTab = () => {
    const groups = groupsByTab[activeTab] ?? [];
    const allItems = groups.flatMap((g) => g.items);
    allItems.forEach((it) => {
      if (!permissionsSet.has(it.id)) toggle(it.id);
    });
  };

  const clearAllCurrentTab = () => {
    const groups = groupsByTab[activeTab] ?? [];
    const allItems = groups.flatMap((g) => g.items);
    allItems.forEach((it) => {
      if (permissionsSet.has(it.id)) toggle(it.id);
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        {TABS.map(tab => (
          <TabsTrigger key={tab.key} value={tab.key}>{tab.title}</TabsTrigger>
        ))}
      </TabsList>

      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar permissões (nome ou código)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="secondary" onClick={() => setQuery("")}>Limpar busca</Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline" onClick={selectAllCurrentTab}>Selecionar todos (aba)</Button>
          <Button variant="outline" onClick={clearAllCurrentTab}>Limpar (aba)</Button>
        </div>
      </div>

      {/* ADM Contrato */}
      <TabsContent value="contrato">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {contratoGroups.map((g) => (
            <PermissionCard
              key={g.title}
              title={g.title}
              items={g.items}
              permissionsSet={permissionsSet}
              onToggle={toggle}
              filter={query}
            />
          ))}
        </div>
      </TabsContent>

      {/* Caixa */}
      <TabsContent value="caixa">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {caixaGroups.map((g) => (
            <PermissionCard
              key={g.title}
              title={g.title}
              items={g.items}
              permissionsSet={permissionsSet}
              onToggle={toggle}
              filter={query}
            />
          ))}
        </div>
      </TabsContent>

      {/* Cobrança */}
      <TabsContent value="cobranca">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {cobrancaGroups.map((g) => (
            <PermissionCard
              key={g.title}
              title={g.title}
              items={g.items}
              permissionsSet={permissionsSet}
              onToggle={toggle}
              filter={query}
            />
          ))}
        </div>
      </TabsContent>

      {/* Gerenciar */}
      <TabsContent value="gerenciar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {gerenciarGroups.map((g) => (
            <PermissionCard
              key={g.title}
              title={g.title}
              items={g.items}
              permissionsSet={permissionsSet}
              onToggle={toggle}
              filter={query}
            />
          ))}
        </div>
      </TabsContent>

      {/* Convalescencia */}
      <TabsContent value="convalescencia">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {convalescenciaGroups.map((g) => (
            <PermissionCard
              key={g.title}
              title={g.title}
              items={g.items}
              permissionsSet={permissionsSet}
              onToggle={toggle}
              filter={query}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
