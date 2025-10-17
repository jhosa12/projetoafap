'use client'
import React, { useEffect, useState } from "react"
import { useActionsVeiculos } from "../_hooks/veiculos/useActionsVeiculos"
import { DataTable } from "@/components/ui/data-table"
import { VeiculoProps } from "@/types/veiculo"
import { columnsVeiculos } from "../_components/veiculos/columns-veiculos"
import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { Circle, CirclePlus, Pencil, Printer, Trash, Trash2 } from "lucide-react"
import { useHandleSalvarVeiculo } from "../_hooks/veiculos/useHandleSalvaVeiculor"
import { ModalVeiculo } from "../_components/veiculos/modalVeiculo"
import { useHandleEditarVeiculo } from "../_hooks/veiculos/useHandleEditarVeiculo"
import { toast } from "sonner"

export default function Veiculos() {

  const [rowSelection, setRowSelection] = useState({})
  const { listarVeiculos, arrayVeiculos, onSave, adicionarVeiculo, excluirVeiculo } = useActionsVeiculos()
  const [modalNovoVeiculo, setModalNovoVeiculo] = useState(false)

  const linhaSelecionada: VeiculoProps | null = React.useMemo(() => {
    const indicesSelecionados = Object.keys(rowSelection);
    if (indicesSelecionados.length !== 1) return null;
    const indice = parseInt(indicesSelecionados[0], 10);

    return arrayVeiculos[indice] || null;

  }, [rowSelection, arrayVeiculos]);

  const { handleSalvar } = useHandleSalvarVeiculo(
    onSave,
    setModalNovoVeiculo,
    listarVeiculos,
    setRowSelection
  )

  const handleEditar = useHandleEditarVeiculo(
    linhaSelecionada,
    setModalNovoVeiculo
  )

  useEffect(() => {
    listarVeiculos()
  }, [])

  return (
    <div className="flex flex-col w-full h-screen lg:p-6 gap-2">
      {modalNovoVeiculo &&
        <ModalVeiculo
          openModal={modalNovoVeiculo}
          onClose={() => setModalNovoVeiculo(false)}
          veiculo={linhaSelecionada}
          handleNovoVeiculo={adicionarVeiculo}
          handleSalvar={handleSalvar}
        />
      }
      <div className="flex-shrink-0 flex flex-col lg:flex-row w-full items-start lg:items-center justify-between gap-4 p-2">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Veículos
        </h3>
        <ButtonGroup>
          <Button
            variant="outline"
            onClick={() => {

              if (linhaSelecionada) {
                setRowSelection(false)
                setModalNovoVeiculo(true)

              } else {
                setModalNovoVeiculo(true)
              }
            }}
          >
            <CirclePlus className='mr-1 h-4 w-4' /> Novo</Button>
          <Button
            variant="outline"
            onClick={handleEditar}
          >
            <Pencil className='mr-1 h-4 w-4' /> Editar
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (!linhaSelecionada) {
                toast.error("Por favor, selecione uma linha para excluir.")
                return
              }

              excluirVeiculo(linhaSelecionada)
            }}
            className="rounded-lg text-red-600 hover:bg-red-600 hover:text-gray-200 p-1"
          >
            <span className="flex items-center gap-2 p-2">
              <Trash2 size={18} />
              Excluir
            </span>
          </Button>
          <Button
            onClick={() => window.print()}
            variant="outline"
          >
            <Printer className='mr-1 h-4 w-4' /> Imprimir
          </Button>
        </ButtonGroup>
      </div>
      <DataTable
        columns={columnsVeiculos}
        data={arrayVeiculos}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />

    </div>
  )
}