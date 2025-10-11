'use client'
import { columnsPlanos } from "../_components/planos/columns-table-planos";
import useActionsPlanos from "../_hooks/planos/useActionsPlanos";
import { PlanosProps } from "@/types/planos";
import { useContext, useEffect, useState } from "react";
import ModalFormPlanos from "../_components/planos/modal-form-planos";
import { AuthContext } from "@/store/AuthContext";
import { useHandleSalvar } from "../_hooks/planos/useHandleSalvar";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableSemSelecao } from "@/components/data-table-sem-selecao";


export default function Planos() {
  const [open, setOpen] = useState(false);
  const { onSave, listar, listaPlanos, loading, deletarPlano, editarPlano, setListaPlanos, plano, setPlano } = useActionsPlanos()
  const { limparDados } = useContext(AuthContext)

  const handleSalvar = useHandleSalvar({
    onSave,
    limparDados,
    setOpen,
    listar
  })


  return (
    <div className="flex flex-col w-full h-screen lg:p-6 gap-2">
      <div className="flex items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Planos
        </h3>
        <Button
          onClick={() => {
            setPlano(null);
            setOpen(true);
          }}
          size="sm"
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Adicionar Plano
        </Button>
      </div>

      <DataTableSemSelecao
        columns={columnsPlanos({
          onDelete: (plano: PlanosProps) => deletarPlano(plano.id_plano),

          onEdit: (plano: PlanosProps) => {
            setOpen(true)
            setPlano(plano)

          }
        })}
        data={listaPlanos}
      />

      <ModalFormPlanos
        isFormOpen={open}
        selectedPlano={plano}
        setIsFormOpen={() => {
          limparDados()
          setOpen(false)
        }}
        setSelectedPlano={setPlano}
        onSave={handleSalvar}

      />
    </div>
  )
}