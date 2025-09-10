import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useMemo } from "react";

export type PermissionItem = {
  id: string;
  label: string;
};

interface PermissionCardProps {
  title: string;
  items: PermissionItem[];
  permissionsSet: Set<string>;
  onToggle: (id: string) => void;
  filter?: string;
}

export function PermissionCard({ title, items, permissionsSet, onToggle, filter }: PermissionCardProps) {
  const normalizedFilter = (filter ?? "").trim().toLowerCase();

  const filteredItems = useMemo(() => {
    if (!normalizedFilter) return items;
    return items.filter((it) =>
      it.label.toLowerCase().includes(normalizedFilter) || it.id.toLowerCase().includes(normalizedFilter)
    );
  }, [items, normalizedFilter]);

  const counts = useMemo(() => {
    const total = filteredItems.length;
    const selected = filteredItems.reduce((acc, it) => acc + (permissionsSet.has(it.id) ? 1 : 0), 0);
    return { total, selected };
  }, [filteredItems, permissionsSet]);

  const masterChecked: boolean | "indeterminate" = counts.selected === 0
    ? false
    : counts.selected === counts.total
      ? true
      : "indeterminate";

  const handleMasterToggle = () => {
    if (counts.total === 0) return;
    const shouldSelectAll = counts.selected < counts.total;
    filteredItems.forEach((it) => {
      const has = permissionsSet.has(it.id);
      // Se devemos selecionar todos e ainda não tem, liga; se devemos limpar e está ativo, desliga
      if ((shouldSelectAll && !has) || (!shouldSelectAll && has)) {
        onToggle(it.id);
      }
    });
  };

  return (
    <Card className="p-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Checkbox checked={masterChecked} onCheckedChange={handleMasterToggle} />
          <CardTitle className="text-sm">
            {title}
          </CardTitle>
        </div>
        {counts.total > 0 && (
          <span className="text-xs text-muted-foreground">{counts.selected}/{counts.total}</span>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {filteredItems.map((it) => (
          <div key={it.id} className="flex items-center gap-2">
            <Checkbox
              id={it.id}
              checked={permissionsSet.has(it.id)}
              onCheckedChange={() => onToggle(it.id)}
            />
            <label htmlFor={it.id} className="text-sm">{it.label}</label>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-xs text-muted-foreground">Nenhuma permissão encontrada</div>
        )}
      </CardContent>
    </Card>
  );
}
