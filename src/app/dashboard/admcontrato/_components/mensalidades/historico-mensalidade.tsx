import ImpressaoCarne from "@/Documents/associado/mensalidade/ImpressaoCarne";
import { useReactToPrint } from "react-to-print";
import React, {  useEffect, useRef, useState } from "react";
import { IoPrint } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { RiAddCircleFill } from "react-icons/ri";
import { ReciboMensalidade } from "@/Documents/associado/mensalidade/Recibo";
import { Popover } from "flowbite-react";
import { PopoverVencimento } from "./popover-vencimento";
import { PopoverReagendamento } from "./popover-reagendamento";
import { LuArrowDown, LuArrowDownUp, LuArrowUp } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import useApiPut from "@/hooks/useApiPut";
import { toast } from "sonner";
import { usePrintDocsAssociado } from "@/hooks/usePrintDocsAssociado";
import { EmpresaProps } from "@/types/empresa";
import { AssociadoProps } from "@/app/dashboard/admcontrato/_types/associado";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { pageStyle } from "@/utils/pageStyle";
import { ModalEditarMensalidade } from "./modal-editarMensalidade";
import { ModalMensalidade } from "./modal-mensalidade";
import { MensalidadeProps } from "../../_types/mensalidades";
import useActionsMensalidades from "../../_hooks/useActionsMensalidades";

export interface SetAssociadoProps {
  mensalidade: Partial<MensalidadeProps>;
  mensalidadeAnt: Partial<MensalidadeProps>;
  id_associado: number;
  closeModalPlano: boolean;
}

interface DadosProps {
  usuario: { id?: string; nome: string };
  carregarDados: (id: number) => Promise<void>;
  dadosassociado: Partial<AssociadoProps>;
  setarDadosAssociado: (dados: Partial<AssociadoProps>) => void;
  infoEmpresa: EmpresaProps | null;
  permissoes: Array<string>;
}

export function HistoricoMensalidade({
  dadosassociado,
  carregarDados,
  usuario,
  infoEmpresa,
  setarDadosAssociado,
  permissoes,
}: DadosProps) {
  const [checkMensal, setCheck] = useState(false);
 
  const [mensalidadeSelect, setMensalidade] = useState<
    Partial<MensalidadeProps>
  >({} as Partial<MensalidadeProps>);
  const componentRecibo = useRef<HTMLDivElement | null>(null);
  const [mensalidadeRecibo, setMensalidadeRecibo] =
    useState<Partial<MensalidadeProps>>();
  const [openModal, setModal] = useState<Record<string, boolean>>({
    excluir: false,
    baixar: false,
    editar: false,
    recibo: false,
    carne: false,
  });
  const {
    excluirMensalidade,
    handleEditar,
    handleEstorno,
    linhasSelecionadas,
    setLinhasSelecionadas,
    adicionarMensalidade,
    toggleSelecionada,
  } = useActionsMensalidades({mensalidade:mensalidadeSelect,setMensalidade});

  const { componentRefs, handlePrint, printState, handleImpressao } =
    usePrintDocsAssociado(
      dadosassociado,
      usuario.nome ?? "",
      infoEmpresa?.id ?? "",
      setarDadosAssociado,
      () => setModal({ carne: false })
    );

  const imprimirRecibo = useReactToPrint({
    pageStyle: pageStyle,
    documentTitle: "RECIBO MENSALIDADE",
    content: () => componentRecibo.current,
    onBeforeGetContent: () => setModal({ recibo: true }), // Ativa antes da impressão
    onAfterPrint: () => setMensalidadeRecibo(undefined), // Desativa após a impressão
  });

  useEffect(() => {
    if (mensalidadeRecibo?.id_mensalidade_global) {
      imprimirRecibo();
    }
  }, [mensalidadeRecibo?.id_mensalidade_global]);


  return (
    <div className="flex flex-col w-full">
      {mensalidadeRecibo?.id_mensalidade && (
        <div ref={componentRecibo}>
          <ReciboMensalidade
            cidade_uf={infoEmpresa?.cidade_uf ?? ""}
            endereco={infoEmpresa?.endereco ?? ""}
            logoUrl={infoEmpresa?.logoUrl ?? ""}
            associado={dadosassociado.nome ?? ""}
            contrato={dadosassociado?.contrato?.id_contrato ?? null}
            n_doc={mensalidadeRecibo?.n_doc ?? ""}
            referencia={mensalidadeRecibo?.referencia ?? ""}
            valor={mensalidadeRecibo?.valor_principal ?? 0}
            vencimento={mensalidadeRecibo?.vencimento ?? null}
            data_pgto={mensalidadeRecibo?.data_pgto ?? new Date()}
            referente={`Mensalidade ${mensalidadeRecibo?.n_doc} com referência ${mensalidadeRecibo?.referencia}`}
          />
        </div>
      )}

      {printState.carne && (
        <div style={{ display: "none" }}>
          <ImpressaoCarne
            infoEmpresa={infoEmpresa}
            ref={componentRefs.carne}
            arrayMensalidade={
              linhasSelecionadas.length > 0
                ? linhasSelecionadas
                : dadosassociado.mensalidade?.filter(
                    (item) => item.status !== "P"
                  ) ?? []
            }
            dadosAssociado={{
              nome: dadosassociado.nome ?? "",
              endereco: dadosassociado.endereco ?? "",
              bairro: dadosassociado.bairro ?? "",
              cidade: dadosassociado.cidade ?? "",
              id_contrato: dadosassociado?.contrato?.id_contrato ?? null,
              numero: Number(dadosassociado.numero),
              uf: dadosassociado.uf ?? "",
              plano: dadosassociado?.contrato?.plano ?? "",
            }}
          />
        </div>
      )}

      {/*openScanner && <Scanner verficarTicket={verificarBaixa} openModal={openScanner} setModal={setOpenScanner}   />*/}

      {openModal.editar && (
        <ModalEditarMensalidade
          mensalidade={{
            ...mensalidadeSelect,
          }}
          openModal={openModal.editar}
          setOpenModal={() => setModal({ editar: false })}
          handleEditar={handleEditar}
          handleEstorno={handleEstorno}
        />
      )}

      {openModal.excluir && (
        <ModalConfirmar
          openModal={openModal.excluir}
          setOpenModal={() => setModal({ excluir: false })}
          pergunta={`Realmente deseja excluir a(s) mensalidade(s)?`}
          handleConfirmar={()=>excluirMensalidade({actions:{success:()=>setModal({excluir:false})}})}
        />
      )}

      {printState.carne && (
        <ModalConfirmar
          pergunta={`Realmente deseja imprimir o(a) carnê ?. Esteja ciente de que ao confirmar, os dados de data e usuario que realizou a impressão serão atualizados!`}
          openModal={printState.carne}
          setOpenModal={() => handlePrint("carne")}
          handleConfirmar={handleImpressao}
        />
      )}

      <div className="flex w-full  gap-2">
        <div className="flex items-center">
          <Checkbox
            checked={checkMensal}
            onCheckedChange={() => setCheck(!checkMensal)}
            disabled={!permissoes.includes("ADM1.2.10")}
            className="h-4 w-4" // Tamanho reduzido
          />
          <span className="ml-2 text-xs font-medium">Exibir Pagas</span>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
          <Button
            variant="outline"
            size="sm"
            disabled={!permissoes.includes("ADM1.2.1")}
            onClick={()=>adicionarMensalidade({})}
          >
            <RiAddCircleFill className="mr-1 h-4 w-4" /> Adicionar
          </Button>

          <PopoverReagendamento
            setSelecionadas={setLinhasSelecionadas}
            mensalidades={linhasSelecionadas}
            id_global={dadosassociado.id_global ?? null}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePrint("carne")}
          >
            <IoPrint className="mr-1 h-4 w-4" /> Imprimir
          </Button>

          <PopoverVencimento id_global={dadosassociado.id_global ?? null} />

          <PopoverAcresDecres
            permissions={permissoes}
            acrescimo={Number(dadosassociado.contrato?.acrescimo)}
            decrescimo={Number(dadosassociado?.contrato?.desconto)}
            id_global={dadosassociado.id_global ?? null}
            id_plano={dadosassociado.contrato?.id_plano ?? null}
            id_contrato_global={
              dadosassociado.contrato?.id_contrato_global ?? null
            }
            atualizar={() => carregarDados(Number(dadosassociado.id_global))}
          />

          <Button
            variant="outline"
            size="sm"
            disabled={!permissoes.includes("ADM1.2.3")}
            onClick={() => setModal({ excluir: true })}
          >
            <MdDeleteForever className="mr-1 h-4 w-4" /> Excluir
          </Button>
        </div>
      </div>
      <div className="flex w-full overflow-auto mt-2 px-2 max-h-[calc(100vh-240px)]">
        <table className="block w-full overflow-y-auto overflow-x-auto text-xs text-center rtl:text-center border-collapse  ">
          <thead className="sticky w-full top-0  text-xs  border-b-2 bg-white ">
            <tr>
              <th scope="col" className="px-6 py-1">
                NP
              </th>
              <th scope="col" className=" px-6 py-1">
                VENC.
              </th>
              <th scope="col" className=" px-6 py-1">
                REF
              </th>
              <th scope="col" className="px-6 py-1">
                COBRANÇA
              </th>
              <th scope="col" className="px-6 py-1">
                VALOR
              </th>
              <th scope="col" className="px-6 py-1">
                STATUS
              </th>
              <th scope="col" className=" px-6 py-1">
                PAG.
              </th>
              <th scope="col" className=" px-6 py-1">
                HR PAG.
              </th>
              <th scope="col" className=" px-6 py-1">
                USUÁRIO
              </th>
              <th scope="col" className=" px-6 py-1">
                VAL. PAGO
              </th>
              <th scope="col" className=" px-6 py-1">
                FORMA
              </th>
              <th scope="col" className=" px-6 py-1">
                ATRASO
              </th>
              <th scope="col" className="px-12 py-1"></th>
            </tr>
          </thead>
          <tbody className="divide-y ">
            {Array.isArray(dadosassociado?.mensalidade) &&
              dadosassociado?.mensalidade?.map((item, index) => {
                return checkMensal ? (
                  <tr
                    key={index}
                    onClick={() => toggleSelecionada(item)}
                    className={`  text-[10px] font-semibold text-black ${
                      calcularDiferencaEmDias(
                        new Date(),
                        new Date(item.vencimento),
                        item.status
                      ) >= 1 &&
                      item.status === "A" &&
                      "text-red-600"
                    }  ${
                      linhasSelecionadas.some(
                        (linha) => linha.id_mensalidade === item.id_mensalidade
                      )
                        ? "bg-gray-300"
                        : ""
                    }  ${
                      item.status === "P" && "text-blue-600"
                    }   hover:bg-gray-300 hover:text-black hover:cursor-pointer }`}
                  >
                    <th scope="row" className={`px-5 py-1  `}>
                      {item.parcela_n}
                    </th>
                    <td className={`px-2 py-1 `}>
                      {item.vencimento &&
                        new Date(item.vencimento).toLocaleDateString("pt", {
                          timeZone: "UTC",
                        })}
                    </td>
                    <td className="px-2 py-1">{item.referencia}</td>
                    <td className="px-5 py-1">
                      {item.cobranca &&
                        new Date(item.cobranca).toLocaleDateString("pt", {
                          timeZone: "UTC",
                        })}
                    </td>
                    <td className="px-3 py-1">
                      {Number(item.valor_principal).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td
                      className={`px-4 py-1  font-bold ${
                        item.status !== "P" && "text-red-600"
                      }`}
                    >
                      {item.status}
                    </td>
                    <td className="px-4 py-1">
                      {item.data_pgto
                        ? new Date(item.data_pgto).toLocaleDateString("pt", {
                            timeZone: "UTC",
                          })
                        : ""}
                    </td>
                    <td className="px-4 py-1">{item.hora_pgto}</td>
                    <td className="px-6 py-1 whitespace-nowrap">
                      {item.usuario?.toUpperCase()}
                    </td>
                    <td className={`px-6 py-1`}>
                      {Number(item.valor_total).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="px-4 py-1">{item.form_pagto}</td>

                    <td className="px-4 py-1">
                      {calcularDiferencaEmDias(
                        new Date(),
                        new Date(item.vencimento),
                        item.status
                      )}
                    </td>
                    <td
                      className={`inline-flex items-center px-4 py-1 space-x-2 whitespace-nowrap  ${
                        new Date(item.vencimento) < new Date() &&
                        item.status === "A"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      <button
                        onClick={(event) => {
                          event.stopPropagation(); // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                          // setOpenEditar(true)
                          setModal({ editar: true });
                          setMensalidade({
                            ...item,
                            valor_total:
                              item.status === "A"
                                ? item.valor_principal
                                : item.valor_total,
                          });
                        }}
                        className={`  hover:underline `}
                      >
                        Editar
                      </button>
                      {item.status !== "P" && (
                        <button
                          onClick={(event) => {
                            event.stopPropagation(); // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                            if (dadosassociado.contrato?.situacao === "INATIVO")
                              return toast.warning(
                                "Contrato inativo, impossível baixar mensalidade"
                              );
                            // setModalMens(true)
                            setModal({ baixar: true });
                            setMensalidade({
                              ...item,
                              valor_total:
                                item.status === "A" ||
                                item.status === "R" ||
                                item.status === "R"
                                  ? item.valor_principal
                                  : item.valor_total,
                              data_pgto: item.data_pgto
                                ? item.data_pgto
                                : new Date(),
                            });
                          }}
                          className={`hover:underline`}
                        >
                          Baixar
                        </button>
                      )}

                      <button
                        type="button"
                        className="hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMensalidadeRecibo({
                            ...item,
                            data_pgto: item.data_pgto
                              ? item.data_pgto
                              : new Date(),
                          });
                        }}
                      >
                        Recibo
                      </button>
                    </td>
                  </tr>
                ) : (
                  item.status !== "P" && (
                    <tr
                      key={index}
                      onClick={() => toggleSelecionada(item)}
                      className={`font-semibold text-[10px]  text-black ${
                        calcularDiferencaEmDias(
                          new Date(),
                          new Date(item.vencimento),
                          item.status
                        ) >= 1 && "text-red-600"
                      }   ${
                        linhasSelecionadas.some(
                          (linha) =>
                            linha.id_mensalidade === item.id_mensalidade
                        )
                          ? "bg-gray-300"
                          : ""
                      }   hover:bg-gray-300 hover:text-black hover:cursor-pointer  }`}
                    >
                      <td className="px-5 py-1   ">{item.parcela_n}</td>
                      <td className="px-2 py-1">
                        {new Date(item.vencimento).toLocaleDateString("pt", {
                          timeZone: "UTC",
                        })}
                      </td>
                      <td className="px-2 py-1">{item.referencia}</td>
                      <td className="px-5 py-1">
                        {new Date(item.cobranca).toLocaleDateString("pt", {
                          timeZone: "UTC",
                        })}
                      </td>
                      <td className="px-3 py-1">
                        {Number(item.valor_principal).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className={`px-4 py-1  font-bold text-red-600`}>
                        {item.status}
                      </td>
                      <td className="px-4 py-1">
                        {item.data_pgto
                          ? new Date(item.data_pgto).toLocaleDateString("pt", {
                              timeZone: "UTC",
                            })
                          : ""}
                      </td>
                      <td className="px-4 py-1">{item.hora_pgto}</td>
                      <td className="px-6 py-1 whitespace-nowrap">
                        {item.usuario?.toUpperCase()}
                      </td>
                      <td className={`px-6 py-1`}>
                        {Number(item.valor_total).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="px-4 py-1">{item.form_pagto}</td>
                      <td className="px-4 py-1">
                        {calcularDiferencaEmDias(
                          new Date(),
                          new Date(item.vencimento),
                          item.status
                        )}
                      </td>
                      <td
                        className={`px-4 py-1 space-x-2 whitespace-nowrap ${
                          new Date(item.vencimento) < new Date() &&
                          item.status === "A"
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      >
                        <button
                          onClick={(event) => {
                            event.stopPropagation(); // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                            // setOpenEditar(true),
                            setModal({ editar: true });
                            setMensalidade({
                              ...item,
                              valor_total:
                                item.status === "A"
                                  ? item.valor_principal
                                  : item.valor_total,
                            });
                          }}
                          className={`hover:underline `}
                        >
                          Editar
                        </button>

                        {item.status !== "P" && (
                          <button
                            onClick={(event) => {
                              event.stopPropagation(); // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                              if (
                                dadosassociado.contrato?.situacao === "INATIVO"
                              )
                                return toast.warning(
                                  "Contrato inativo, impossível baixar mensalidade"
                                );
                              //setModalMens(true)
                              setModal({ baixar: true });
                              setMensalidade({
                                ...item,
                                valor_total:
                                  item.status === "A" ||
                                  item.status === "E" ||
                                  item.status === "R"
                                    ? item.valor_principal
                                    : item.valor_total,
                                data_pgto: item.data_pgto
                                  ? item.data_pgto
                                  : new Date(),
                              });
                            }}
                            className={`  hover:underline`}
                          >
                            Baixar
                          </button>
                        )}

                        <button
                          type="button"
                          className="hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMensalidadeRecibo({
                              ...item,
                              data_pgto: item.data_pgto
                                ? item.data_pgto
                                : new Date(),
                            });
                          }}
                        >
                          Recibo
                        </button>
                      </td>
                    </tr>
                  )
                );
              })}
          </tbody>
        </table>
      </div>

      {openModal.baixar && (
        <ModalMensalidade
          mensalidade={{
            associado: {
              ...dadosassociado,
              mensalidade: dadosassociado.mensalidade,
            },
            aut: mensalidadeSelect?.aut,
            banco_dest: mensalidadeSelect?.banco_dest,
            contrato: { situacao: dadosassociado.contrato?.situacao ?? "" },
            data_pgto: mensalidadeSelect?.data_pgto,
            id_mensalidade_global: mensalidadeSelect?.id_mensalidade_global,
            form_pagto: mensalidadeSelect?.form_pagto,
            id_contrato: mensalidadeSelect?.id_contrato,
            id_mensalidade: mensalidadeSelect?.id_mensalidade,
            valor_metodo: mensalidadeSelect?.valor_metodo,
            valor_total: mensalidadeSelect?.valor_total,
            referencia: mensalidadeSelect?.referencia,
            vencimento: mensalidadeSelect?.vencimento,
            status: mensalidadeSelect?.status,
            valor_principal: mensalidadeSelect?.valor_principal,
          }}
          handleAtualizar={async () => {
            await carregarDados(Number(dadosassociado.id_global));
            setLinhasSelecionadas([]);
          }}
          openModal={openModal.baixar}
          setOpenModal={() => setModal({ baixar: false })}
        />
      )}

      {/*openModal.baixar &&   <ModalBaixaMensalidade

mensalidade={{
    associado:{...dadosassociado,mensalidade:dadosassociado.arrayMensalidade},
    aut:mensalidadeSelect?.aut,
    banco_dest:mensalidadeSelect?.banco_dest,
    contrato:{situacao:dadosassociado.situacao},
    data_pgto:mensalidadeSelect?.data_pgto,
    id_mensalidade_global:mensalidadeSelect?.id_mensalidade_global,
    form_pagto:mensalidadeSelect?.form_pagto,
    id_contrato:mensalidadeSelect?.id_contrato,
    id_mensalidade:mensalidadeSelect?.id_mensalidade,
    valor_metodo:mensalidadeSelect?.valor_metodo,
    valor_total:mensalidadeSelect?.valor_total,
    referencia:mensalidadeSelect?.referencia,
    vencimento:mensalidadeSelect?.vencimento,
    status:mensalidadeSelect?.status,
    valor_principal:mensalidadeSelect?.valor_principal
   }} 
    handleAtualizar={async()=>{ await carregarDados(Number(dadosassociado.id_global));setLinhasSelecionadas([])}}
    openModal={openModal.baixar}
     setOpenModal={()=>setModal({baixar:false})}
/>*/}
    </div>
  );
}

function calcularDiferencaEmDias(data1: Date, data2: Date, status: string) {
  // Convertendo as datas para objetos Date

  if (status === "P") {
    return 0;
  }

  const timestamp1 = data1.getTime();
  const timestamp2 = data2.getTime();

  // Calculando a diferença em milissegundos
  const diferencaEmMilissegundos = timestamp1 - timestamp2;

  // Convertendo a diferença em dias (1 dia = 24 horas x 60 minutos x 60 segundos x 1000 milissegundos)
  const diferencaEmDias = Math.ceil(
    diferencaEmMilissegundos / (1000 * 60 * 60 * 24)
  );

  return diferencaEmDias <= 0 ? 0 : diferencaEmDias;
}

interface ReqProps {
  id_plano: number | null;
  id_global: number | null;
  id_contrato_global: number | null;
  acrescimo: number | null;
  decrescimo: number | null;
}
interface PopoverProps extends ReqProps {
  atualizar: () => Promise<void>;
  permissions: Array<string>;
}

const PopoverAcresDecres = ({
  id_plano,
  id_global,
  id_contrato_global,
  acrescimo,
  decrescimo,
  atualizar,
  permissions,
}: PopoverProps) => {
  const { register, handleSubmit } = useForm<{
    acrescimo: number | null;
    decrescimo: number | null;
  }>({
    defaultValues: { acrescimo: acrescimo, decrescimo: decrescimo },
  });
  const { postData } = useApiPut<any, ReqProps>(
    "/mensalidade/acrescimoDecrescimo"
  );

  const onSubmit: SubmitHandler<{
    acrescimo: number | null;
    decrescimo: number | null;
  }> = async (data) => {
    const res = await postData({
      id_global,
      id_contrato_global,
      id_plano,
      acrescimo: Number(data.acrescimo),
      decrescimo: Number(data.decrescimo),
    });

    await atualizar();
  };

  return (
    <Popover
      id="popover-basic"
      content={
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-2 w-32 gap-2"
        >
          <div className="inline-flex items-center gap-1">
            <LuArrowUp color="green" size={20} />
            <Input
              className="h-7"
              type="number"
              step={0.01}
              {...register("acrescimo")}
            />
          </div>

          <div className="inline-flex items-center gap-1">
            <LuArrowDown color="red" size={20} />
            <Input
              className="h-7"
              {...register("decrescimo")}
              type="number"
              step={0.01}
            />
          </div>

          <Button
            disabled={!permissions.includes("ADM1.2.11")}
            variant={"outline"}
            size="sm"
            type="submit"
          >
            Aplicar
          </Button>
        </form>
      }
    >
      <Button
        variant={"outline"}
        onClick={() => {}}
        type="button"
        color="light"
        size="sm"
      >
        <LuArrowDownUp className="mr-1 h-4 w-4" />
        Acres./Decres.
      </Button>
    </Popover>
  );
};
