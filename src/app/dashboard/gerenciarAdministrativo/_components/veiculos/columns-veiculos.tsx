"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { VeiculoProps } from "@/types/veiculo"

export const columnsVeiculos: ColumnDef<VeiculoProps>[] = [
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
    accessorKey: "modelo",
    header: "Modelo",
    cell: ({ row }) => (
      <div className="text-left w-full">{row.getValue("modelo")}</div>
    ),
  },
  {
    accessorKey: "marca",
    header: "Marca",
    cell: ({ row }) => <span>{row.getValue("marca")}</span>,
  },
  {
    accessorKey: "ano",
    header: "Ano",
    cell: ({ row }) => <span>{row.getValue("ano")}</span>,
  },
  {
    accessorKey: "cor",
    header: "Cor",
    cell: ({ row }) => <span>{row.getValue("cor")}</span>,
  },
  {
    accessorKey: "placa",
    header: "Placa",
    cell: ({ row }) => <span>{row.getValue("placa")}</span>,
  },
  {
    accessorKey: "chassi",
    header: "Chassi",
    cell: ({ row }) => <span>{row.getValue("chassi")}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span>{row.getValue("status")}</span>,
  },
]
