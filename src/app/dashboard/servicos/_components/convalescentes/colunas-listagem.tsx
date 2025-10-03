"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, FileUp, RefreshCw } from "lucide-react"
import { format, isValid, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    cell: ({ row }) => {
      const contratoId = row.getValue("id_contrato");

      if (!contratoId || contratoId === null || contratoId === undefined || contratoId === "") {
        return (
          <Badge
            className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 border-gray-200"
            variant="outline"
          >
            SEM CONTRATO
          </Badge>
        );
      }

      return <div className="text-sm">{String(contratoId)}</div>;
    },
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
    cell: ({ row }) => {
      const status = String(row.getValue("status")).toUpperCase();

      const getStatusColor = (status: string) => {
        switch (status) {
          case "ENTREGUE":
            return "bg-green-100 text-green-800 border-green-200";
          case "ABERTO":
            return "bg-blue-100 text-blue-800 border-blue-200";
          case "PENDENTE":
            return "bg-red-100 text-red-800 border-red-200";
          default:
            return "bg-gray-100 text-gray-800 border-gray-200";
        }
      };

      return (
        <Badge
          className={`px-2 py-1 text-xs font-medium ${getStatusColor(status)}`}
          variant="outline"
        >
          {status}
        </Badge>
      );
    }
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