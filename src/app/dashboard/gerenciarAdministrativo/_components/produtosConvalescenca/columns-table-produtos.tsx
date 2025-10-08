"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { IoMdTrash } from "react-icons/io"
import { HiPencil } from "react-icons/hi2"
import { Tooltip } from "react-tooltip";
import { ProdutosProps } from "@/types/produtos"

type ActionsProps = {
  onEdit?: (plano: ProdutosProps) => void
  onDelete?: (plano: ProdutosProps) => void
}

export function columnsProdutos({
  onEdit,
  onDelete
}: ActionsProps): ColumnDef<ProdutosProps>[] {
  return [
    {
      accessorKey: "descricao",
      header: "Descrição",
      cell: ({ row }) => (
        <div className="text-left w-full">{row.getValue("descricao")}</div>
      ),
    },
    {
      accessorKey: "unidade",
      header: "Unidade",
      cell: ({ row }) => {
        return <div className="pl-2 text-left">{row.getValue("unidade")}</div>
      },
    },
    {
      accessorKey: "valor_custo",
      header: "Valor Custo",
      cell: ({ row }) => {
        const valor = parseFloat(row.getValue("valor_custo"))
        const formatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(valor)
        return <div className="text-left">{formatted}</div>
      },
    },
    {
      accessorKey: "valor_venda",
      header: "Valor Venda",
      cell: ({ row }) => {
        const acrescimo = parseFloat(row.getValue("valor_venda"))
        const formatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(acrescimo)
        return <div className="text-left">{formatted}</div>
      },
    },
    {
      accessorKey: "quantidade",
      header: "Quantidade",
      cell: ({ row }) => {
        return <div className="pl-2 text-left">{row.getValue("quantidade")}</div>
      },
    },
    {
      accessorKey: "margem_lucro",
      header: "Margem de Lucro",
      cell: ({ row }) => {
        const acrescimo = parseFloat(row.getValue("margem_lucro"))
        const formatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(acrescimo)
        return <div className="text-left">{formatted}</div>
      },
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => (
        <div className="text-left w-full">{row.getValue("tipo")}</div>
      ),
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
              className="h-8 w-8"
            >
              <HiPencil className="h-4 w-4" />
            </Button>
            <Button
              data-tooltip-id="toolId"
              data-tooltip-content={'Deletar'}
              variant="destructive"
              size="icon"
              onClick={() => onDelete?.(plano)}
              className="h-8 w-8"
            >
              <IoMdTrash className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]
}