import { ColumnDef } from "@tanstack/react-table";
import { HiOutlineTrash, HiPencil } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox" 
import { Badge } from "@/components/ui/badge";
import { IoMdTrash } from "react-icons/io";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tooltip } from "react-tooltip";
import { ObitoProps } from "../../../_types/obito"; const formatDate = (value: any): string => {
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
  onRowClick?: (obito: ObitoProps) => void
};

export function getObitoColumns({
  onEdit,
  onDelete,
  onRowClick
}: ActionsProps): ColumnDef<ObitoProps>[] {
  return [
  
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
      accessorKey: "tipo_atendimento",
      header: "TIPO",
      cell: ({ row }) =>
        <div className="text-sm">
          {row.getValue("tipo_atendimento")}
        </div>,
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
      cell: ({ row }) => {
        const contratoId = row.getValue("id_contrato");

        if (!contratoId || contratoId === null || contratoId === undefined || contratoId === "") {
          return (
            <Badge
              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 border-gray-200"
              variant="outline"
            >
              SEM CONTRATO
            </Badge>
          );
        }

        return <div className="text-sm">{String(contratoId)}</div>;
      },
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
      cell: ({ row }) => {
        const situacaoValue = row.getValue("situacao_contrato");
        const situacao = situacaoValue === null || situacaoValue === undefined || situacaoValue === ""
          ? "SEM CONTRATO"
          : String(situacaoValue).toUpperCase();

        const getSituacaoColor = (situacao: string) => {
          switch (situacao) {
            case "ATIVO":
              return "bg-green-100 text-green-800 border-green-200";
            case "INATIVO":
              return "bg-red-100 text-red-800 border-red-200";
            default:
              return "bg-gray-100 text-gray-800 border-gray-200";
          }
        };

        return (
          <Badge
            className={`px-2 py-1 text-xs font-medium ${getSituacaoColor(situacao)}`}
            variant="outline"
          >
            {situacao}
          </Badge>
        );
      },
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
      cell: ({ row }) => {
        const status = String(row.getValue("status")).toUpperCase();

        const getStatusColor = (status: string) => {
          switch (status) {
            case "PENDENTE":
              return "bg-red-100 text-red-800 border-red-200";
            case "FECHADO":
              return "bg-green-100 text-green-800 border-green-200";
            default:
              return "bg-gray-100 text-gray-800 border-gray-200";
          }
        };

        return (
          <Badge
            className={`px-2 py-1 text-xs font-medium ${getStatusColor(status)}`}
            variant="outline"
          >
            {status}
          </Badge>
        );
      },
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
            <Tooltip className="z-20" id="toolId" />
            <Button
              data-tooltip-id="toolId"
              data-tooltip-content={'Editar'}
              variant="outline"
              size="icon"
              onClick={() => onEdit?.(obito)}
              className="h-6 w-6"
            >
              <HiPencil className="h-3 w-3" />
            </Button>
            <Button
              data-tooltip-id="toolId"
              data-tooltip-content={'Excluir'}
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
