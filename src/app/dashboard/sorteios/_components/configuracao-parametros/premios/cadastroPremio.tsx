import { useContext, useEffect, useMemo, useState } from "react";
import React from 'react';
import ModalPremio from "./modalPremio";
import { Button } from "@/components/ui/button";
import { PremioProps } from "../../../_types/premio";
import { AuthContext } from "@/store/AuthContext";
import { useActionsSorteios } from "../../../_hooks/useActionsSorteios";
import { useActionsConveniados } from "../../../../conveniados/_hooks/useActionsConveniados";
import { DataTable } from "@/components/ui/data-table";
import { getColunasPremio } from "./colunas-premios";
import { useHandleSalvarConfSorteios } from "../../../_hooks/useHandleSalvarConfSorteios";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import { useHandleExcluir } from "../../../_hooks/configuracao-parametros/useHandleExcluir";
import { toast } from "sonner";




export default function CadastroPremio() {

  const [openModal, setOpenModal] = useState(false)
  const [openModalConfirmar, setOpenModalConfirmar] = useState(false)
  const [itemEdit, setItemEdit] = useState<Partial<PremioProps> | null>(null)
  const [itemExcluir, setItemExcluir] = useState<Partial<PremioProps> | null>(null)
  const { empresas, usuario, signOut } = useContext(AuthContext)
  const { listarConveniados, conveniados } = useActionsConveniados()
  const [dadosCarregados, setDadosCarregados] = useState(false)

  useEffect(() => {
    if (!usuario) {
      return signOut()
    }

    Promise.all([listarConveniados(), listarPremios()]).then(() => {
      if (!dadosCarregados) {
        toast.success("Dados carregados com sucesso!");
        setDadosCarregados(true);
      }
    });

  }, [usuario])


  const {

    listarPremios,
    premios,
    setPremios,
    deletarPremio,
    onSave

  } = useActionsSorteios({
    conveniados

  })

  const { handleSalvar } = useHandleSalvarConfSorteios({
    onSave,
    setOpenModal,
    listarPremios

  })

  const { handleConfirmarExclusao } = useHandleExcluir(
    {
      deletarPremio,
      listarPremios
    }
  )


  const colunasPremio = useMemo(() => {
    return getColunasPremio({
      empresas,
      onEdit(premio: any) {
        setOpenModal(true);
        setItemEdit(premio);
      },
      onDelete(premio: any) {
        setOpenModalConfirmar(true);
        setItemExcluir(premio);
      }
    });
  }, [empresas]);





  return (
    <div className="flex flex-col w-full p-2 text-black">

      {openModal &&
        <ModalPremio
          arrayPremios={premios}
          setPremios={setPremios}
          listarPremios={listarPremios}
          conveniados={conveniados}
          empresas={empresas}
          modal={openModal}
          setModal={() => {

            setOpenModal(false)
            setItemEdit(null)

          }}
          itemEdit={itemEdit}
          handleSalvar={handleSalvar}
        />
      }

      {openModalConfirmar &&
        <ModalConfirmar
          openModal={openModalConfirmar}
          setOpenModal={() => setOpenModalConfirmar(false)}
          handleConfirmar={async () => {
            await handleConfirmarExclusao(itemExcluir)
            setItemExcluir(null)
          }}
          pergunta="Deseja excluir este prêmio da lista?"
        />
      }

      <div className="flex-shrink-0 flex flex-col lg:flex-row w-full items-start lg:items-center justify-between gap-4 p-2">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Lista de Prêmios
        </h3>
        <Button
          size='sm'
          className="ml-auto"
          onClick={() => {

            setItemEdit(null)
            setOpenModal(true)

          }} >
          Adicionar Prêmio
        </Button>
      </div>

      <DataTable
        columns={colunasPremio}
        data={premios}
      />

    </div>
  )
}