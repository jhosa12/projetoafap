'use client';

import { AuthContext } from "@/store/AuthContext";
import React, { useContext, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button";
import { CirclePlus, MoreHorizontalIcon } from "lucide-react";
import { ModalAdicionar } from "../_components/plano-contas/modal-adicionar-conta";
import { Accordion } from "@/components/ui/accordion";
import { GrupoItem } from "../_components/plano-contas/grupo-item";
import { construirHierarquia, NodoConta } from "@/utils/listaContas";
import { useActionsPlanoContas } from "../_hooks/plano-contas/useActionsPlanoContas";
import { useHandleSalvarPC } from "../_hooks/plano-contas/useHandleSalvarPC";
import { PlanoContasProps } from "../../financeiro/_types/plano-contas";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";


export default function PlanoDeContas() {

  const { usuario, signOut } = useContext(AuthContext)
  const [modal, setModal] = useState(false)
  const [itemEdit, setItemEdit] = useState<PlanoContasProps | null>(null);
  const { listaPlanoContas, onSave, listarPlanoContas, deletarPlanoConta } = useActionsPlanoContas()
  const [modalExcluir,setModalExcluir] =useState(false)
  const { handleSalvar } = useHandleSalvarPC(
    onSave,
    setModal,
    listarPlanoContas

  )

  useEffect(() => {
    if (!usuario) return signOut();
    listarPlanoContas()
  }, [usuario]);

  const handleEditar = (item: NodoConta) => {

    const planoConta: PlanoContasProps = {
      conta: item.id,
      descricao: item.descricao,
      tipo: item.tipo,
      perm_lanc: item.perm_lanc,
      data: new Date(),

    };
    setItemEdit(planoConta);
    setModal(true);
  };

  const handleExcluir = async (id: string) => {
    await deletarPlanoConta(id)
    listarPlanoContas()
  }

  const hierarquiaContas = useMemo(() => {
    return construirHierarquia(listaPlanoContas);
  }, [listaPlanoContas]);

  return (
    <div className="flex flex-col w-full h-screen lg:p-6 gap-2">
      <div className="flex-shrink-0 flex flex-col lg:flex-row w-full items-start lg:items-center justify-between gap-4 p-2">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Plano de Contas
        </h3>

        <div className="inline-flex gap-2">
          <Button size='sm' onClick={() => {
            setItemEdit(null);
            setModal(true);
          }}>
            <CirclePlus />Adicionar Conta</Button>
        </div>
      </div>

      <ModalAdicionar
        handleSalvar={handleSalvar}
        open={modal}
        onClose={() => {
          setModal(false);
          setItemEdit(null);
        }}
        itemEdit={itemEdit}
      />
      <div className="inline-flex rounded-lg gap-2 overflow-y-auto bg-white justify-between p-2 w-full max-h-[calc(100vh-120px)]  ">
        <Accordion type="single" collapsible className="w-full px-2">
          {hierarquiaContas?.map((item) => (
            <GrupoItem key={item.id} item={item} onEditar={handleEditar} onExcluir={()=>{}} />

          ))}
        </Accordion>
      </div>

<ModalConfirmar
  handleConfirmar={async()=>{}}
  openModal={modalExcluir}
  setOpenModal={()=>setModalExcluir(false)}
  pergunta="Realmente deseja excluir esse plano de contas?"

/>
    </div>
  )
}