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
import { DataTableGerenciar } from "../_components/data-table-gerenciar";


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
    <div className="px-6 mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold border-b-gray-300 text-gray-900">
          Planos
        </h2>
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

      <DataTableGerenciar
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