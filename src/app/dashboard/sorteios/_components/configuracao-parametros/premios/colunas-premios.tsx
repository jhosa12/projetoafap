import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { PremioProps } from "../../../_types/premio";
import { EmpresaProps } from "@/types/empresa";
import { Button } from "@/components/ui/button";
import { Tooltip } from "react-tooltip";

type ActionsProps = {
  empresas: EmpresaProps[]
  onEdit?: (obito: Partial<PremioProps>) => void;
  onDelete?: (obito: Partial<PremioProps>) => void;
};

export function getColunasPremio({ empresas, onEdit, onDelete }: ActionsProps): ColumnDef<Partial<PremioProps>>[] {
  return [
    {
      accessorKey: "ordem",
      header: "Ordem de Sorteio",
      cell: ({ row }) => <>{row.index + 1}º</>,
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.descricao}</span>
      ),
    },
    {
      accessorKey: "conveniado",
      header: "Conveniado",
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.conveniado}</span>
      ),
    },
    {
      accessorKey: "empresa",
      header: "Empresa",
      cell: ({ row }) => (
        <span className="font-semibold">
          {empresas.find((empresa) => empresa.id === row.original.id_empresa)?.nome}
        </span>
      ),
    },
    {
      id: "acoes",
      header: "Ações",
      cell: ({ row }) => {
        const premio = row.original


        return (
          <div className="inline-flex text-start justify-end whitespace-nowrap gap-2" >
            <Tooltip className="z-20" id="toolId" />
            <Button
              variant="outline"
              size="icon"
              data-tooltip-id="toolId"
              data-tooltip-content={'Editar'}
              onClick={() => onEdit?.(premio)}
              className="rounded-lg text-black hover:bg-black hover:text-gray-200 p-1">
              <Pencil size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              data-tooltip-id="toolId"
              data-tooltip-content={'Excluir'}
              onClick={() => onDelete?.(premio)}
              className="rounded-lg text-red-600 hover:bg-red-600 hover:text-gray-200 p-1">
              <Trash2 size={18} />
            </Button>
          </div>
        )
      },
    }
  ]
};