"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LeadProps } from "../../_types/types";

interface ColumnsConfig {
  onChangeCategoria: (e: React.ChangeEvent<HTMLSelectElement>, lead: Partial<LeadProps>) => void;
  setLead: React.Dispatch<React.SetStateAction<Partial<LeadProps>>>;
  setModal: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

export const createColumns = ({
  onChangeCategoria,
  setLead,
  setModal,
}: ColumnsConfig): ColumnDef<LeadProps>[] => [
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => (
      <div className="text-[10px] font-semibold text-black">{row.original.nome}</div>
    ),
  },
  {
    id: "cidade",
    header: "Cidade",
    cell: ({ row }) => (
      <div className="text-[10px] text-black font-semibold">
        {row.original.cidade}/{row.original.uf}
      </div>
    ),
  },
  {
    accessorKey: "visita",
    header: "Previsão de Visita",
    cell: ({ row }) => (
      <div className="text-[10px] text-black font-semibold">
        {row.original.visita &&
          new Date(row.original.visita).toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          })}
      </div>
    ),
  },
  {
    accessorKey: "data",
    header: "Data Cad.",
    cell: ({ row }) => (
      <div className="text-[10px] text-black font-semibold">
        {row.original.data &&
          new Date(row.original.data).toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          })}
      </div>
    ),
  },
  {
    accessorKey: "dataVenda",
    header: "Data Venda",
    cell: ({ row }) => (
      <div className="text-[10px] text-black font-semibold">
        {row.original.dataVenda &&
          new Date(row.original.dataVenda).toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          })}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Categoria",
    cell: ({ row }) => (
      <div
        className={`text-[10px] font-semibold ${
          row.original.status === "LEAD"
            ? "text-blue-600"
            : row.original.status === "PROSPECCAO"
            ? "text-yellow-500":
            row.original.status === "INDEFERIDO"
            ? "text-red-500":
             "text-green-500"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <select
          onChange={(e) => onChangeCategoria(e, row.original)}
          className="appearance-none border-none font-semibold bg-transparent text-xs focus:outline-none"
          value={row.original.status}
        >
          <option value="LEAD">LEAD</option>
          <option value="PROSPECCAO">PROSPECCAO</option>
          <option value="PRE VENDA">PRE VENDA</option>
          <option value="VENDA">VENDA</option>
          <option value="INDEFERIDO">INDEFERIDO</option>
        </select>
      </div>
    ),
  },
  {
    accessorKey: "consultor",
    header: "Vendedor",
    cell: ({ row }) => (
      <div className="text-[10px] font-semibold text-black">{row.original.consultor}</div>
    ),
  },
  {
    accessorKey: "celular1",
    header: "Celular1",
    cell: ({ row }) => (
      <div className="text-[10px] font-semibold text-black">{row.original.celular1}</div>
    ),
  },
  {
    accessorKey: "vencimento",
    header: "Vencimento",
    cell: ({ row }) => (
      <div className="text-[10px] font-semibold text-black">
        {row.original.vencimento
          ? new Date(row.original.vencimento).toLocaleDateString()
          : ""}
      </div>
    ),
  },
];
