"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns";

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox" // 1. Importe o Checkbox
import { ConvProps } from "../../_types/convalescente"

export const columns: ColumnDef<ConvProps>[] = [
  // 2. Adicione esta nova coluna no início do array
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
  // O resto das suas colunas permanece igual...
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
    cell: ({ row }) => <div>{row.original.contrato?.associado?.nome || '-'}</div>,
  },
  {
    accessorKey: "nome",
    header: "Usuário"
  },
  {
    accessorKey: "data",
    header: "Data",
    cell: ({ row }) => {
      const data = row.getValue("data") as Date | null;
      return data ? <div>{format(new Date(data), 'dd/MM/yyyy')}</div> : <span>--/--/----</span>;
    },
  },
  
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div>{String(row.getValue("status")).toUpperCase()}</div>
  },
];