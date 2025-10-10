"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MetaProps } from "../../_types/types"
import { Checkbox } from "@/components/ui/checkbox"

export const columnsMetas: ColumnDef<MetaProps>[] = [
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
    accessorKey: "descricao",
    header: "Descrição",
    cell: ({ row }) => (
      <div className="text-left w-full">{row.getValue("descricao")}</div>
    ),
  },
  {
    accessorKey: "date",
    header: "Data Início",
    cell: ({ row }) => <span>{new Date(row.getValue("date")).toLocaleDateString()}</span>,
  },
  {
    accessorKey: "dateFimMeta",
    header: "Data Fim.",
    cell: ({ row }) => <span>{new Date(row.getValue("dateFimMeta")).toLocaleDateString()}</span>,
  },
  {
    accessorKey: "valor",
    header: "Valor",
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue("valor"))
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor)
      return <div className="text-left">{formatted}</div>
    },
  },
  {
    accessorKey: "nome_empresa",
    header: "Empresa",
    cell: ({ row }) => <span>{row.getValue("nome_empresa")}</span>,
  },
]
