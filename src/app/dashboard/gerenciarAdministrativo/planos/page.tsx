'use client'
import { columnsPlanos } from "../_components/planos/columns-table-planos";
import useActionsPlanos from "../_hooks/planos/useActionsPlanos";
import { PlanosProps } from "@/types/planos";
import { useContext, useEffect, useMemo, useState } from "react";
import ModalFormPlanos from "../_components/planos/modal-form-planos";
import { AuthContext } from "@/store/AuthContext";
import { useHandleSalvar } from "../_hooks/planos/useHandleSalvar";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import { useHandleExcluirPlano } from "../_hooks/planos/useHandleExcluirPlano";



export default function Planos() {
  const [open, setOpen] = useState(false);
  const { onSave, listar, listaPlanos, loading, deletarPlano, editarPlano, setListaPlanos, plano, setPlano } = useActionsPlanos()
  const { limparDados } = useContext(AuthContext)
  const [openModalConfirmar, setOpenModalConfirmar] = useState(false)
  const [planoExcluir, setPlanoExcluir] = useState<Partial<PlanosProps | null>>(null)
  const handleSalvar = useHandleSalvar({
    onSave,
    limparDados,
    setOpen,
    listar
  })

  const { handleConfirmarExclusao } = useHandleExcluirPlano({
    deletarPlano,
    listar
  })

  const colunasPlanos = useMemo(() => {
    return columnsPlanos({
      onDelete: (plano: any) => {
        setOpenModalConfirmar(true)
        setPlanoExcluir(plano)
      },

      onEdit: (plano: any) => {
        setOpen(true)
        setPlano(plano)

      }
    })
  }, [])


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

      <DataTable
        columns={colunasPlanos}
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

      {openModalConfirmar &&
        <ModalConfirmar
          openModal={openModalConfirmar}
          setOpenModal={() => setOpenModalConfirmar(false)}
          handleConfirmar={async () => {
            await handleConfirmarExclusao(planoExcluir)
            setPlanoExcluir(null)
          }}
          pergunta="Deseja excluir este plano da lista?"
        />
      }
    </div>
  )
}