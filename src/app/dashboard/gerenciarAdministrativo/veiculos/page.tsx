'use client'
import React, { useContext, useEffect, useState } from "react"
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
import { AuthContext, signOut } from "@/store/AuthContext"
import { ModalConfirmar } from "@/components/modals/modalConfirmar"
import { useHandleExcluirVeiculo } from "../_hooks/veiculos/useHandleExcluirVeiculo"

export default function Veiculos() {

  const { usuario, signOut } = useContext(AuthContext)
  const [rowSelection, setRowSelection] = useState({})
  const {
    listarVeiculos,
    arrayVeiculos,
    onSave,
    adicionarVeiculo,
    excluirVeiculo
  } = useActionsVeiculos()
  const [modalNovoVeiculo, setModalNovoVeiculo] = useState(false)
  const [modalConfirmacaoExclusao, setModalConfirmacaoExclusao] = useState(false)

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

  const { handleExcluir } = useHandleExcluirVeiculo({
    excluirVeiculo,
    listarVeiculos
  })

  useEffect(() => {
    if (!usuario) {
      return signOut()
    }
    listarVeiculos()
  }, [usuario])

  return (
    <div className="flex flex-col w-full h-screen lg:p-6 gap-2">
      {modalNovoVeiculo &&
        <ModalVeiculo
          openModal={modalNovoVeiculo}
          onClose={() => setModalNovoVeiculo(false)}
          veiculo={linhaSelecionada}
          handleSalvar={handleSalvar}
        />
      }
      {modalConfirmacaoExclusao &&
        <ModalConfirmar
          openModal={modalConfirmacaoExclusao}
          setOpenModal={() => setModalConfirmacaoExclusao(false)}
          handleConfirmar={() => {
            if (linhaSelecionada) {
              handleExcluir(linhaSelecionada)
            }
          }}
          pergunta="Deseja mesmo excluir este veículo da lista?"
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
              setModalConfirmacaoExclusao(true)
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