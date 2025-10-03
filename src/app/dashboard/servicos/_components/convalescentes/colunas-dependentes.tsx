"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import setarListaConv from "@/app/dashboard/servicos/_hooks/novo-registro/useActionsNovoRegistro"
import { ConvProps } from "../../_types/convalescente"

export type Dependente = {
  id_dependente?: number
  nome?: string
  data_nasc?: Date
  // Adicionei parentesco para um exemplo mais rico, ajuste se necessário
  parentesco?: string
  excluido?: boolean
}


import { UseFormReset, UseFormWatch } from "react-hook-form"

interface ActionsProps {
  setModalDependente: (value: boolean) => void;
  reset: UseFormReset<ConvProps>;
  watch: UseFormWatch<ConvProps>;
}


export const getColumns = ({ setModalDependente, reset, watch }: ActionsProps): ColumnDef<Dependente>[] => [

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
    accessorKey: "nome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("nome")}</div>,
  },
  {
    accessorKey: "data_nasc",
    header: "Nascimento",
    cell: ({ row }) => {
      const data = row.getValue("data_nasc") as Date | null
      if (!data) {
        return <span>-</span>
      }
      return <div>{new Date(data).toLocaleDateString('pt-BR')}</div>
    }
  },
  {
    accessorKey: "parentesco",
    header: "Parentesco",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const dependente = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                const dadosMapeados: Partial<ConvProps> = {
                  nome: dependente.nome,
                  data_nasc: dependente.data_nasc,
                  id_dependente: dependente.id_dependente
                };
                reset({ ...watch(), ...dadosMapeados });
                setModalDependente(false);
              }}
            >
              Selecionar este dependente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Visualizando ${dependente.nome}`)}>
              Ver detalhes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]