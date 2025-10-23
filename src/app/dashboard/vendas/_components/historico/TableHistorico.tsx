"use client";

import { useMemo, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { createColumns } from "./columns";
import { LeadProps } from "../../_types/types";

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