"use client";

import { useMemo, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { LeadProps } from "@/types/vendas";
import { createColumns } from "./columns";

interface Props {
  data: Array<LeadProps>;
  onChangeCategoria: (e: React.ChangeEvent<HTMLSelectElement>, lead: Partial<LeadProps>) => void;
  setLead: React.Dispatch<React.SetStateAction<Partial<LeadProps>>>;
  setModal: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

export const TableHistoricoVendas = ({
  data,
  onChangeCategoria,
  setLead,
  setModal,
}: Props) => {
  const columns = useMemo(
    () => createColumns({ onChangeCategoria, setLead, setModal }),
    [onChangeCategoria, setLead, setModal]
  );

  const handleRowClick = useCallback(
    (lead: LeadProps) => {
      setLead(lead);
      setModal((prev) => ({ ...prev, lead: true }));
    },
    [setLead, setModal]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      maxHeight="max-h-[500px]"
      onRowClick={handleRowClick}
    />
  );
}