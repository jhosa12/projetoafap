"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PlanosProps } from "@/types/planos"
import { Tooltip } from "react-tooltip";

type ActionsProps = {
  onEdit?: (plano: PlanosProps) => void
  onDelete?: (plano: PlanosProps) => void
}

export function columnsPlanos({
  onEdit,
  onDelete
}: ActionsProps): ColumnDef<PlanosProps>[] {
  return [
    {
      accessorKey: "descricao",
      header: "Descrição",
      cell: ({ row }) => (
        <div className="text-left w-full">{row.getValue("descricao")}</div>
      ),
    },
    {
      accessorKey: "limite_dep",
      header: "Limite de Dependentes",
      cell: ({ row }) => {
        return <div className="pl-2 text-left">{row.getValue("limite_dep")}</div>
      },
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
      accessorKey: "acrescimo",
      header: "Acréscimo",
      cell: ({ row }) => {
        const acrescimo = parseFloat(row.getValue("acrescimo"))
        const formatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(acrescimo)
        return <div className="text-left">{formatted}</div>
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const plano = row.original

        return (
          <div className="flex gap-2">
            <Tooltip className="z-20" id="toolId" />
            <Button
              data-tooltip-id="toolId"
              data-tooltip-content={'Editar'}
              variant="outline"
              size="icon"
              onClick={() => onEdit?.(plano)}
              className="rounded-lg text-black hover:bg-black hover:text-gray-200 p-1"
            >
              <Pencil size={18} />
            </Button>
            <Button
              data-tooltip-id="toolId"
              data-tooltip-content={'Deletar'}
              variant="outline"
              size="icon"
              onClick={() => onDelete?.(plano)}
              className="rounded-lg text-red-600 hover:bg-red-600 hover:text-gray-200 p-1"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        )
      },
    },
  ]
}