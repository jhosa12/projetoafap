"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MetaProps } from "../../_types/meta"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
    accessorKey: "categoria",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        Categoria
        <Select
          onValueChange={value => column.setFilterValue(value === "todas" ? undefined : value)}
          defaultValue="todas"
        >
          <SelectTrigger className="w-[100px] h-8 text-xs border rounded">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="vendas">Vendas</SelectItem>
            <SelectItem value="gastos">Gastos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ),
    cell: ({ row }) => {
      const meta = row.original as MetaProps
      return meta.id_conta ? "Gastos" : "Vendas"
    },
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
