'use client'
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import useApiPost from "@/hooks/useApiPost";
import React, { useContext, useEffect, useState } from "react";
import { Funnel, CirclePlus, Pencil, Trash, Printer } from 'lucide-react';
import { EmpresaProps } from "@/types/empresa";
import { ModalMetas } from "@/app/dashboard/gerenciarAdministrativo/_components/metas/modalMetas";
import { ModalFiltroMetas } from "@/app/dashboard/gerenciarAdministrativo/_components/metas/modalFiltro";
import { toast } from "sonner";
import { MetaProps } from "../_types/meta";
import { TabelaCompleta } from "@/app/dashboard/servicos/_components/convalescentes/data-table";
import { columnsMetas } from "../_components/metas/columns-table-metas";
import { AuthContext } from "@/store/AuthContext";
import { useFiltroMetas } from "../_hooks/metas-contas/useHandleFiltro";
import { useHandleCarregarDados } from "../_hooks/useHandleCarregarDados";
import { useEditarMeta } from "../_hooks/metas-contas/useHandleEditarMeta";
import { useActionsMetas } from "../_hooks/metas-contas/useActionsMetas";
import { useHandleSalvar } from "../_hooks/metas-contas/useHandleSalvar";

export interface FormFiltro {
  startDate?: string | undefined,
  endDate?: string | undefined,
  id_empresa: string | undefined,

}


export default function GerenciarMetas() {

  const [modalFiltro, setModalFiltro] = useState(false)
  const [modalNovaMeta, setModalNovaMeta] = useState(false)
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
  const [meta, setMeta] = useState<Partial<MetaProps>>()
  const [rowSelection, setRowSelection] = useState({});
  const { infoEmpresa, selectEmp, usuario, signOut, actions_plano_contas, limparDados } = useContext(AuthContext)
  const id_empresa = selectEmp
  const nome_empresa = infoEmpresa?.fantasia




  const {

    arrayGrupos,
    handleCarregarDados,

  } = useHandleCarregarDados();


  const {
    adicionarMeta,
    deletarMeta,
    listarMetas,
    arrayMetas,
    onSave,
    loading

  } = useActionsMetas(id_empresa)


  const { handleFiltro } = useFiltroMetas(listarMetas, id_empresa, startDate, endDate);



  const dataCompleta = (arrayMetas ?? []).map((item: any) => ({
    ...item,
    nome_empresa: nome_empresa,
    categoria: item?.id_conta ? "gastos" : "vendas"
  }));

  const linhaSelecionada: MetaProps | null = React.useMemo(() => {
    const indicesSelecionados = Object.keys(rowSelection);
    if (indicesSelecionados.length !== 1) return null;
    const indice = parseInt(indicesSelecionados[0], 10);

    return dataCompleta[indice] || null;

  }, [rowSelection, dataCompleta]);

  const handleEditar = useEditarMeta(
    linhaSelecionada,
    setModalNovaMeta
  );

  const { handleSalvar } = useHandleSalvar(
    onSave,
    limparDados,
    setModalNovaMeta,
    listarMetas,
    setRowSelection

  )

  useEffect(() => {
    handleCarregarDados();
  }, []);


  return (


    <div className="flex flex-col w-full h-screen lg:p-6 gap-2">
      {modalNovaMeta &&
        <ModalMetas
          handleNovaMeta={adicionarMeta}
          arrayMetas={arrayMetas}
          id_empresa={id_empresa}
          arraySetores={arrayGrupos}
          meta={linhaSelecionada}
          planoContas={actions_plano_contas?.array_plano_contas}
          setModalMetas={setModalNovaMeta}
          show={modalNovaMeta}
          handleSalvar={handleSalvar}
        />
      }

      {
        modalFiltro && <ModalFiltroMetas
          filtrar={handleFiltro}
          endDate={endDate}
          loading={loading}
          setEndDate={setEndDate}
          setFiltro={setModalFiltro}
          setStartDate={setStartDate}
          startDate={startDate}
          arraySetores={arrayGrupos}
          show={modalFiltro}
        />

      }

      <div className="flex-shrink-0 flex flex-col lg:flex-row w-full items-start lg:items-center justify-between gap-4 p-2">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Metas e Contas
        </h3>

        <ButtonGroup className="ml-auto">
          <Button
            onClick={() => setModalFiltro(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Funnel className='mr-1 h-4 w-4' />Filtrar

          </Button>

          <Button
            onClick={() => {
              if (linhaSelecionada) {

                setRowSelection(false)
                setMeta({}),
                  setModalNovaMeta(true)

              } else {

                setMeta({}),
                  setModalNovaMeta(true)

              }
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <CirclePlus className='mr-1 h-4 w-4' />Nova Meta</Button>


          <Button
            onClick={handleEditar}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Pencil className='mr-1 h-4 w-4' />Editar
          </Button>

          <Button
            onClick={() => {
              if (!linhaSelecionada) {
                toast.error("Por favor, selecione uma linha para excluir.")
                return
              }

              deletarMeta(linhaSelecionada)

            }}
            variant="outline"
          >
            <span className="flex items-center text-red-600">
              <Trash className="mr-1 h-4 w-4 text-red-600" />
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

      <TabelaCompleta
        columns={columnsMetas}
        data={dataCompleta}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />

    </div>
  )
}