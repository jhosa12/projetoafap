"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, FileUp, RefreshCw } from "lucide-react"
import { format, isValid, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox" // 1. Importe o Checkbox
import { ConvProps } from "../../_types/convalescente"

// Função utilitária para formatar datas (mesma da tabela de óbitos)
const formatDate = (value: any): string => {
  if (!value) return "-";

  try {
    let date: Date;

    if (typeof value === 'string') {
      // Tenta parseISO primeiro para strings ISO
      date = value.includes('T') ? parseISO(value) : new Date(value);
    } else if (value instanceof Date) {
      date = value;
    } else {
      return "-";
    }

    if (!isValid(date)) {
      return "Data inválida";
    }

    return format(date, "dd/MM/yyyy", { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data:', error, value);
    return "Data inválida";
  }
};

export interface ColumnActions {

  onDevolverProduto: (item: ConvProps) => void

}

export const columns = (actions: ColumnActions): ColumnDef<ConvProps>[] => [
  {
    id: "select",
    header: () => null,
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "id_contrato",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Contrato <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-sm">{row.getValue("id_contrato")}</div>,
  },
  {
    id: "titular",
    accessorFn: (row) => row.contrato?.associado?.nome,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Titular <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-sm">{row.original.contrato?.associado?.nome || '-'}</div>,
  },
  {
    accessorKey: "nome",
    header: "Usuário",
    cell: ({ row }) => <div className="text-sm">{row.getValue("nome")}</div>,
  },
  {
    accessorKey: "data",
    header: "Data",
    cell: ({ row }) => {
      const data = row.getValue("data");
      return <div className="text-sm">{formatDate(data)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div className="text-sm">{String(row.getValue("status")).toUpperCase()}</div>
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {

      const item = row.original

      return (
        <div className="flex justify-center">
          <button
            data-tooltip-id="toolId"
            data-tooltip-content={'Devolver produto'}
            onClick={(event) => {

              event.stopPropagation()
              actions.onDevolverProduto(item)
            }}
            type="button"
            className="p-2 hover:bg-gray-200 rounded-md"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      )
    }
  },
];