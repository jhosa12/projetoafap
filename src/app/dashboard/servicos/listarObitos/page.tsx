"use client"

import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { getObitoColumns } from "@/app/dashboard/servicos/_components/obitos/ordemDeServico/obitosColumns";
import useActionsObito from "../_hooks/obitos/useActionsObito";
import { ObitoProps } from "../_types/obito";
import { ModalObitoForm } from "../_components/obitos/tabs-modal/modal-obito-form";
import { Pencil, PlusCircle } from "lucide-react";
import { AuthContext } from "@/store/AuthContext";
import { SubmitHandler } from "react-hook-form";
import { DocsObito, useActionsPrintOS } from "../_hooks/obitos/useActionsPrintOS";
import { toast } from "sonner";
import OrdemServico from "../_documents/obitos/OrdemServico";
import AutTanato from "../_documents/obitos/Tanato";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import { useImprimirModal } from "../_hooks/obitos/useImprimirModalOb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Printer } from "lucide-react"

export default function ListarObitos() {
  const [openOs, setOpenOs] = useState(false);
  const { selectEmp, limparDados } = useContext(AuthContext)
  const { listaServicos, deletarObito, onSave, servico, setServico, listar } = useActionsObito()
  const [modalImprimir, setModalImprimir] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<ObitoProps | null>(null);
  const [documentoImprimir, setDocumentoImprimir] = useState<DocsObito | null>(null);
  const [idObitoParaImpressao, setIdObitoParaImpressao] = useState<number | null>(null);
  const [rowSelection, setRowSelection] = useState({});

  const {
    iniciarImpressao,
    componentRefs,
  } = useActionsPrintOS(
    itemSelecionado,
    idObitoParaImpressao,
    (item: Partial<ObitoProps>) => {
      listar();
    },
    () => setModalImprimir(false)
  )

  const confirmarImpressao = () => {
    if (documentoImprimir && itemSelecionado) {
      iniciarImpressao(documentoImprimir);
      setModalImprimir(false);
      setDocumentoImprimir(null);
    }
  };

  const linhaSelecionada: ObitoProps | null = React.useMemo(() => {
    const indicesSelecionados = Object.keys(rowSelection);
    if (indicesSelecionados.length !== 1) return null;
    const indice = parseInt(indicesSelecionados[0], 10);
    return listaServicos[indice] || null;
  }, [rowSelection, listaServicos]);

  const handleImprimirModal = useImprimirModal({
    linhaSelecionada,
    setItemSelecionado,
    setIdObitoParaImpressao,
    setDocumentoImprimir,
    setModalImprimir,
  });

  const handleSalvar: SubmitHandler<ObitoProps> = async (data) => {
    const sucesso = await onSave(data)

    if (sucesso) {
      console.log("Salvo com sucesso!!")
      limparDados()
      setOpenOs(false)
      listar()
    } else {
      console.log("Erro ao salvar!!")
    }
  };

  const nomesDocumentos = {
    ordemDeServico: 'Ordem de Serviço',
    tanato: 'Tanato'
  }

  return (
    <div className="px-6 mt-2 space-y-4">
      <h1 className="text-2xl font-semibold border-b border-b-gray-300 text-gray-900">
        Histórico de O.S's
      </h1>
      <DataTable
        columns={getObitoColumns({
          onDelete(obito) {
            deletarObito(obito);
          },
          onEdit(obito) {
            setOpenOs(true);
            setServico(obito);
          },
        })}
        data={listaServicos}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      >
        <Button onClick={() => {
          setServico(null)
          setOpenOs(true)
        }} size={"sm"} variant={"outline"}>
          <PlusCircle /> Adicionar
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                if (!linhaSelecionada) {
                  toast.error("Por favor, selecione uma linha para Imprimir um Comprovante!");
                  return;
                }
                handleImprimirModal('ordemDeServico' as DocsObito);
              }}
            >
              Ordem de Serviço
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (!linhaSelecionada) {
                  toast.error("Por favor, selecione uma linha para Imprimir um Comprovante!");
                  return;
                }
                handleImprimirModal('tanato' as DocsObito);
              }}
            >
              Tanato
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DataTable>

      <ModalObitoForm
        isFormOpen={openOs}
        selectedObito={servico}
        setIsFormOpen={() => {
          limparDados()
          setOpenOs(false)
        }}
        setSelectedObito={setServico}
        selectEmp={selectEmp}
        onSave={handleSalvar}
      />

      <div style={{ display: "none" }}>
        {modalImprimir && itemSelecionado && (
          <ModalConfirmar
            openModal={modalImprimir}
            setOpenModal={() => {
              setModalImprimir(false);
              setDocumentoImprimir(null);
            }}
            handleConfirmar={async () => confirmarImpressao()}
            pergunta={`Realmente deseja imprimir
               ${documentoImprimir === 'ordemDeServico' ?
                nomesDocumentos.ordemDeServico : nomesDocumentos.tanato}`}
          />
        )}

        {itemSelecionado && (
          <>
            <div ref={componentRefs?.ordemDeServico}>
              <OrdemServico
                nome_falecido={itemSelecionado?.nome_falecido ?? ""}
                atendente={itemSelecionado?.atendente ?? ""}
                contrato={itemSelecionado?.id_contrato ?? 0}
                descricao_plano={itemSelecionado?.descricao_plano ?? ""}
                informacoes_plano={itemSelecionado?.informacoes_plano ?? ""}
                situacao={itemSelecionado?.situacao_contrato ?? ""}
                falecido={itemSelecionado?.falecido ?? ""}
                nome_dec={itemSelecionado?.rd_nome ?? ""}
                cpf_dec={itemSelecionado?.cpf ?? ""}
                endereco_dec={itemSelecionado?.rd_endereco ?? ""}
                bairro_dec={itemSelecionado?.rd_bairro ?? ""}
                numero_dec={Number(itemSelecionado?.rd_numero) || 0}
                cidade_dec={itemSelecionado?.rd_cidade ?? ""}
                uf_dec={itemSelecionado?.rd_uf ?? ""}
                data_nasc_falecido={itemSelecionado?.data_nascimento}
                naturalidade_falecido={itemSelecionado?.naturalidade ?? ""}
                nome_pai={itemSelecionado?.nome_pai ?? ""}
                nome_mae={itemSelecionado?.nome_mae ?? ""}
                estado_civil={itemSelecionado?.estado_civil ?? ""}
                religiao={itemSelecionado?.religiao ?? ""}
                profissao={itemSelecionado?.profissao ?? ""}
                endereco_falecido={itemSelecionado?.end_rua ?? ""}
                numero_falecido={itemSelecionado?.end_numero ?? 0}
                bairro_falecido={itemSelecionado?.end_bairro ?? ""}
                cidade_falecido={itemSelecionado?.end_cidade ?? ""}
                uf_falecido={itemSelecionado?.end_uf ?? ""}
                data_falecimento={itemSelecionado?.end_data_falecimento}
                hora_falecimento={itemSelecionado?.end_hora_falecimento}
                local_falecimento={itemSelecionado?.end_local_falecimento ?? ""}
                cemiterio={itemSelecionado?.cemiterio ?? ""}
                laudo_medico={itemSelecionado?.dc_laudo_med ?? ""}
                medico={itemSelecionado?.dc_nome_medico ?? ""}
                data_sepultamento={itemSelecionado?.dt_sepultamento}
                hora_sepultamento={itemSelecionado?.hr_sepultamento}
                crm={itemSelecionado?.dc_crm ?? ""}
                obito_itens={itemSelecionado?.obito_itens ?? []}
              />
            </div>

            <div ref={componentRefs?.tanato}>
              <AutTanato
                nome_falecido={itemSelecionado?.nome_falecido ?? ""}
                contrato={itemSelecionado?.id_contrato ?? 0}
                nome_dec={itemSelecionado?.rd_nome ?? ""}
                cpf_dec={itemSelecionado?.cpf ?? ""}
                rg_dec={itemSelecionado?.rg ?? ""}
                endereco_dec={itemSelecionado?.rd_endereco ?? ""}
                bairro_dec={itemSelecionado?.rd_bairro ?? ""}
                numero_dec={Number(itemSelecionado?.rd_numero) || 0}
                cidade_dec={itemSelecionado?.rd_cidade ?? ""}
                uf_dec={itemSelecionado?.rd_uf ?? ""}
                data_nasc_falecido={itemSelecionado?.data_nascimento ? new Date(itemSelecionado.data_nascimento) : null}
                endereco_falecido={itemSelecionado?.end_rua ?? ""}
                numero_falecido={Number(itemSelecionado?.end_numero) || 0}
                bairro_falecido={itemSelecionado?.end_bairro ?? ""}
                cidade_falecido={itemSelecionado?.end_cidade ?? ""}
                uf_falecido={itemSelecionado?.end_uf ?? ""}
                autorizado={true}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
