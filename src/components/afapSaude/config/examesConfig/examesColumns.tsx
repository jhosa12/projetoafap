
import { ColumnDef } from "@tanstack/react-table";
import { ExamesProps } from "@/types/afapSaude";
import { HiOutlineTrash, HiPencil } from "react-icons/hi2";
import { Button } from "@/components/ui/button"; // shadcn button

type ActionsProps = {
  onEdit: (exame: ExamesProps) => void;
  onDelete: (exame: ExamesProps) => void;
};

export function getExamesColumns({ onEdit, onDelete }: ActionsProps): ColumnDef<ExamesProps>[] {
  return [
    {
      accessorKey: "nome",
      header: "Exame",
    },
    {
      accessorKey: "valorBruto",
      header: "Valor Bruto",
      cell: ({ row }) => {
        const value = row.getValue("valorBruto") as number;
        return Number(value)?.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },
    {
      accessorKey: "porcPart",
      header: "Valor Particular",
      cell: ({ row }) => {
        const value = row.getValue("porcPart") as number;
        return Number(value)?.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },
    {
      accessorKey: "porcFun",
      header: "Desconto Funerária",
      cell: ({ row }) => `${row.getValue("porcFun")}%`,
    },
    {
      accessorKey: "porcPlan",
      header: "Desconto Plano",
      cell: ({ row }) => `${row.getValue("porcPlan")}%`,
    },
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
              onClick={() => onEdit(exame)}
              className="h-6 w-6"
            >
              <HiPencil className="h-3 w-3" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() =>{}}
              className="h-6 w-6"
            >
              <HiOutlineTrash className="h-3 w-3" />
            </Button>
          </div>
        );
      },
    },
  ];
}
