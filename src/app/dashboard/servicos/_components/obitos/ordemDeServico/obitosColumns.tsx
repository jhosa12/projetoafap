import { ColumnDef } from "@tanstack/react-table";
import { HiOutlineTrash, HiPencil } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { IoMdTrash } from "react-icons/io";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ObitoProps } from "../../../_types/obito";

const formatDate = (value: any): string => {
  if (!value) return "-";

  try {
    let date: Date;

    if (typeof value === 'string') {
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
      cell: ({ row }) => <div className="text-sm">{row.getValue("tipo_atendimento")}</div>,
    },
    {
      accessorKey: "end_data_falecimento",
      header: "DATA FAL.",
      cell: ({ row }) => {
        const data = row.getValue("end_data_falecimento");
        return <div className="text-sm">{formatDate(data)}</div>;
      },
    },
    {
      accessorKey: "id_contrato",
      header: "CONTRATO",
      cell: ({ row }) => <div className="text-sm">{row.getValue("id_contrato")}</div>,
    },
    {
      accessorKey: "rd_nome",
      header: "NOME DECL.",
      cell: ({ row }) => <div className="text-sm">{row.getValue("rd_nome")}</div>,
    },
    {
      accessorKey: "nome_falecido",
      header: "NOME FALECIDO",
      cell: ({ row }) => <div className="text-sm">{row.getValue("nome_falecido")}</div>,
    },
    {
      accessorKey: "situacao_contrato",
      header: "SITUAÇÃO",
      cell: ({ row }) => <div className="text-sm">{row.getValue("situacao_contrato")}</div>,
    },
    {
      accessorKey: "falecido",
      header: "FALECIDO",
      cell: ({ row }) => <div className="text-sm">{row.getValue("falecido")}</div>,
    },
    {
      accessorKey: "data_nascimento",
      header: "DATA NASC.",
      cell: ({ row }) => {
        const data = row.getValue("data_nascimento");
        return <div className="text-sm">{formatDate(data)}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => <div className="text-sm">{row.getValue("status")}</div>,
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
        const obito = row.original;

        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit?.(obito)}
              className="h-6 w-6"
            >
              <HiPencil className="h-3 w-3" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete?.(obito)}
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
