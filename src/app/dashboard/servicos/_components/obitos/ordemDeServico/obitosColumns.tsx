import { ColumnDef } from "@tanstack/react-table";
import { HiOutlineTrash, HiPencil } from "react-icons/hi2";
import { Button } from "@/components/ui/button"; // shadcn button
import { IoMdTrash } from "react-icons/io";
import { ObitoProps } from "../../../_types/obito";

type ActionsProps = {
  onEdit?: (obito: ObitoProps) => void;
  onDelete?: (obito: ObitoProps) => void;
};

export function getObitoColumns({
  onEdit,
  onDelete,
}: ActionsProps): ColumnDef<ObitoProps>[] {
  return [
    {
      accessorKey: "tipo_atendimento",
      header: "TIPO",
    },
    {
      accessorKey: "end_data_falecimento",
      header: "DATA FAL.",
    },
    {
      accessorKey: "id_contrato",
      header: "CONTRATO",
    },
    {
      accessorKey: "rd_nome",
      header: "NOME DECL.",
    },
    {
      accessorKey: "nome_falecido",
      header: "NOME FALECIDO",
    },
    {
      accessorKey: "id_contrato_st",
      header: "SITUAÇÃO",
    },
    {
      accessorKey: "falecido",
      header: "FALECIDO",
    },
    {
      accessorKey: "data_nascimento",
      header: "DATA NASC.",
    },
    {
      accessorKey: "status",
      header: "STATUS",
    },

    // {
    //   accessorKey: "valorBruto",
    //   header: "Valor Bruto",
    //   cell: ({ row }) => {
    //     const value = row.getValue("valorBruto") as number;
    //     return value.toLocaleString("pt-BR", {
    //       style: "currency",
    //       currency: "BRL",
    //     });
    //   },
    // },
    // {
    //   accessorKey: "porcPart",
    //   header: "Valor Particular",
    //   cell: ({ row }) => {
    //     const value = row.getValue("porcPart") as number;
    //     return value.toLocaleString("pt-BR", {
    //       style: "currency",
    //       currency: "BRL",
    //     });
    //   },
    // },
    // {
    //   accessorKey: "porcFun",
    //   header: "Desconto Funerária",
    //   cell: ({ row }) => `${row.getValue("porcFun")}%`,
    // },
    // {
    //   accessorKey: "porcPlan",
    //   header: "Desconto Plano",
    //   cell: ({ row }) => `${row.getValue("porcPlan")}%`,
    // },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const exame = row.original;

        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit?.(exame)}
              className="h-6 w-6"
            >
              <HiPencil className="h-3 w-3" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete?.(exame)}
              className="h-6 w-6"
            >
              <IoMdTrash className="h-3 w-3" />
            </Button>
          </div>
        );
      },
    },
  ];
}
