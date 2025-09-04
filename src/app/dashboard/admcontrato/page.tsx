'use client';

"use client"



import { IoMdSearch } from "react-icons/io";
import "react-tabs/style/react-tabs.css";

import React, { useState, useContext, useEffect } from "react";

import "react-tooltip/dist/react-tooltip.css";

import { HistoricoMensalidade } from "@/app/dashboard/admcontrato/_components/mensalidades/historicoMensalidade";
import { Badge, Dropdown, Modal, Spinner } from "flowbite-react";
import { HiOutlineIdentification, HiUserCircle } from "react-icons/hi2";
import { DadosAssociado } from "@/app/dashboard/admcontrato/_components/dados-associados/screen";
import { Dependentes } from "@/app/dashboard/admcontrato/_components/dependentes/dependentes";
import ModalCadastro from "@/components/modals/admContrato/cadastro/modalCadastro";
import { VerificarSituacao } from "@/app/dashboard/admcontrato/_utils/verificarSituacao";
import { Button } from "@/components/ui/button";
import { AssociadoProps } from "@/app/dashboard/admcontrato/_types/associado";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "usehooks-ts"; // ou qualquer hook de media query
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Users, Wallet } from "lucide-react";
import { UserProps } from "@/types/user";
import { TbWheelchair } from "react-icons/tb";
import { usePrintDocsAssociado } from "@/hooks/usePrintDocsAssociado";
import DocumentTemplate from "@/Documents/associado/contratoAdesão/DocumentTemplate";
import CarteiraAssociado from "@/Documents/associado/carteiraAssociado/CarteiraAssociado";
import ImpressaoCarne from "@/Documents/associado/mensalidade/ImpressaoCarne";
import ContratoResumo from "@/Documents/associado/contratoResumido/ContratoResumo";
import { CartaNovoAssociado } from "@/Documents/associado/cartaNovoAssociado/cartaDocument";
import { ProtocoloCancelamento } from "@/Documents/associado/protocoloCancelamento/ProtocoloCancelamento";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import { ModalAlterarPlano } from "@/components/modals/admContrato/dadosAssociado/modalAlterarPlano";
import { ModalInativar } from "@/components/modals/admContrato/dadosAssociado/modalInativar";
import { Acordos } from "@/app/dashboard/admcontrato/_components/acordos/screen";
import { AuthContext } from "@/store/AuthContext";
import { ModalBusca } from "@/components/modals/modalBusca/modalBusca";
import CarteirasDep from "@/app/dashboard/admcontrato/_components/carteiras/carteirasDep";

export default function AdmContrato() {
  const {
    usuario,
    dadosassociado,
    carregarDados,
    permissoes,
    limparDados,
    loading,
    infoEmpresa,
    setarDadosAssociado,
  } = useContext(AuthContext);
  const [modal, setModal] = useState<{ [key: string]: boolean }>({
    busca: false,
    altPlano: false,
    inativar: false,
    impressao: false,
  });

  const {
    chaveAtiva,
    handleImpressao,
    handlePrint,
    printState,
    componentRefs,
  } = usePrintDocsAssociado(
    dadosassociado,
    usuario?.nome ?? "",
    infoEmpresa?.id ?? "",
    setarDadosAssociado,
    () => setModal({ impressao: false })
  );

  const isMobile = useMediaQuery("(max-width: 768px)");
  const [tab, setTab] = useState("dados");




  /*  useEffect(() => {
          async function listaCadastro() {
              const response = await api.get('/listarDadosCadastro')
              closeModa({ ...data, cidades: response.data.cidades, planos: response.data.planos })
          }
          listaCadastro()
      }, [])*/

  /* async function atualizarObs() {
        try {
            const response = await toast.promise(
                api.put('/atualizarObservacao', {
                    id_contrato: dadosassociado?.contrato?.id_contrato,
                    anotacoes: data.contrato?.anotacoes?.toUpperCase()
                }),
                {
                    error: 'Erro ao adicionar Observação',
                    pending: 'Adicionando Observação',
                    success: 'Observação inserida com sucesso'
                }

            )

            //  await carregarDados()

        } catch (err) {
            console.log(err)
        }


    }*/

  useEffect(() => {
    if (dadosassociado?.id_global) {
      VerificarSituacao({
        situacao: dadosassociado?.contrato?.situacao ?? "",
        mensalidades: dadosassociado?.mensalidade ?? [],
        convalescencia: dadosassociado?.contrato?.convalescencia ?? [],
        carencia: dadosassociado?.contrato?.dt_carencia ?? null,
      });
    }
  }, [dadosassociado?.id_global]);

  useEffect(() => {
    return () => {
      limparDados();
    };
  }, []);

  return (
    <div className={`flex flex-col px-2 w-full justify-center`}>
      {loading && (
        <Modal size={"sm"} popup show={loading}>
          <Modal.Body>
            <div className=" flex flex-col pt-6 w-full justify-center items-center">
              <Spinner size={"lg"} color={"warning"} />
              <span>Localizando dados....</span>
            </div>
          </Modal.Body>
        </Modal>
      )}
      {modal.busca && (
        <ModalBusca
          carregarDados={carregarDados}
          selectEmp={infoEmpresa?.id ?? ""}
          visible={modal.busca}
          setVisible={() => setModal({ busca: false })}
        />
      )}

      {modal.impressao && (
        <ModalConfirmar
          pergunta={`Realmente deseja imprimir o(a) ${chaveAtiva}?. Esteja ciente de que ao confirmar, os dados de data e usuario que realizou a impressão serão atualizados!`}
          openModal={modal.impressao}
          setOpenModal={() => setModal({ impressao: false })}
          handleConfirmar={handleImpressao}
        />
      )}

      {modal.altPlano && (
        <ModalAlterarPlano
          openModal={modal.altPlano}
          setOpenModal={() => setModal({ altPlano: false })}
        />
      )}
      {modal.inativar && (
        <ModalInativar
          openModal={modal.inativar}
          setModal={() => setModal({ inativar: false })}
        />
      )}

      <div className="flex  flex-row justify-start gap-2 items-center w-full mt-2 px-2 pb-1">
        <Button
          disabled={!infoEmpresa}
          variant={"outline"}
          size={"sm"}
          onClick={() => setModal({ busca: true })}
          type="button"
        >
          <IoMdSearch size={18} />
          Buscar Cliente
        </Button>

        <ModalCadastro
          empresa={infoEmpresa?.nome ?? ""}
          isEmpresa={!infoEmpresa}
        />
      </div>

      {dadosassociado.id_global && (
        <div className="flex flex-wrap w-full justify-between gap-2 mb-1 pl-2 text-sm font-semibold text-black">
          <div className="inline-flex gap-3 items-center">
            <span>
              {dadosassociado?.contrato?.id_contrato} - {dadosassociado?.nome}
            </span>
            <span>
              CATEGORIA:
              <span className="pl-3 text-[#c5942b]">
                {dadosassociado?.contrato?.plano}
              </span>
            </span>
            <Badge
              size="sm"
              color={
                dadosassociado.contrato?.situacao === "ATIVO"
                  ? "success"
                  : "failure"
              }
            >
              {dadosassociado?.contrato?.situacao}
            </Badge>
            {dadosassociado?.contrato?.convalescencia?.map((item) => (
              <>
                {item.convalescenca_prod?.map(
                  (dados, index) =>
                    !item.id_dependente &&
                    item.status === "ABERTO" && (
                      <button
                        key={index}
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={dados?.descricao ?? ""}
                        className="text-yellow-500"
                      >
                        <TbWheelchair size={20} />
                      </button>
                    )
                )}
              </>
            ))}
          </div>
          <div className="inline-flex gap-2">
            <Button
              variant={"outline"}
              className=" truncate "
              color={"gray"}
              size={"sm"}
              onClick={() => setModal({ altPlano: true })}
            >
              Alterar Categoria
            </Button>
            <Button
              variant={"outline"}
              className="truncate "
              disabled={!permissoes.includes("ADM1.1.3")}
              onClick={() => setModal({ inativar: true })}
              color={"gray"}
              size={"sm"}
            >
              {dadosassociado?.contrato?.situacao === "ATIVO"
                ? "Inativar Contrato"
                : "Ativar Contrato"}
            </Button>

            <Dropdown
              label=""
              renderTrigger={() => (
                <Button
                  variant={"outline"}
                  className=" truncate"
                  color={"gray"}
                  size={"sm"}
                >
                  Imprimir Documentos
                </Button>
              )}
            >
              <Dropdown.Item
                className="text-xs"
                onClick={() => {
                  handlePrint("carta"), setModal({ ...{}, impressao: true });
                }}
              >
                Carta
              </Dropdown.Item>
              <Dropdown.Item
                className="text-xs"
                onClick={() => {
                  handlePrint("contrato"), setModal({ ...{}, impressao: true });
                }}
              >
                Contrato
              </Dropdown.Item>
              <Dropdown.Item
                className="text-xs"
                onClick={() => {
                  handlePrint("carne"), setModal({ ...{}, impressao: true });
                }}
              >
                Carnê
              </Dropdown.Item>
              <Dropdown.Item
                className="text-xs"
                onClick={() => {
                  handlePrint("carteira"), setModal({ impressao: true });
                }}
              >
                Carteiras
              </Dropdown.Item>
              <Dropdown.Item
                className="text-xs"
                onClick={() => {
                  handlePrint("resumo"), setModal({ impressao: true });
                }}
              >
                Resumo de Contrato
              </Dropdown.Item>
              <Dropdown.Item
                className="text-xs"
                onClick={() => {
                  handlePrint("cancelamento"), setModal({ impressao: true });
                }}
              >
                Cancelamento
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      )}
      {isMobile ? (
        // Renderiza um dropdown ou accordion para dispositivos móveis
        <div className="relative">
          <Select onValueChange={(value) => setTab(value)} defaultValue="dados">
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dados">Dados Associado</SelectItem>
              <SelectItem value="mensalidade">Mensalidades</SelectItem>
              <SelectItem value="dependentes">Dependentes</SelectItem>
              <SelectItem value="carteiras">Carteiras</SelectItem>
            </SelectContent>
          </Select>
          {tab === "dados" && (
            <DadosAssociado
              dadosassociado={dadosassociado}
              infoEmpresa={infoEmpresa}
              permissoes={permissoes}
              setarDadosAssociado={setarDadosAssociado}
              usuario={usuario ?? ({} as UserProps)}
            />
          )}
          {tab === "mensalidade" && (
            <HistoricoMensalidade
              {...{
                carregarDados,
                dadosassociado,
                infoEmpresa,
                usuario: usuario ?? ({} as UserProps),
                permissoes,
                setarDadosAssociado,
              }}
            />
          )}
          {tab === "dependentes" && (
            <Dependentes
              {...{
                dadosassociado,
                infoEmpresa,
                permissoes,
                setarDadosAssociado,
                usuario: usuario ?? ({} as UserProps),
              }}
            />
          )}
          {tab === "carteiras" && (
            <CarteirasDep
              adesao={dadosassociado?.contrato?.dt_adesao ?? new Date()}
              bairro={dadosassociado?.bairro ?? ""}
              celular={dadosassociado?.celular1 ?? ""}
              cidade={dadosassociado?.cidade ?? ""}
              contrato={dadosassociado?.contrato?.id_contrato ?? 0}
              cpf={dadosassociado?.cpfcnpj ?? ""}
              endereco={dadosassociado?.endereco ?? ""}
              numero={dadosassociado?.numero ?? 0}
              plano={dadosassociado?.contrato?.plano ?? ""}
              rg={dadosassociado?.rg ?? ""}
              titular={dadosassociado?.nome ?? ""}
              dependentes={dadosassociado?.dependentes ?? []}
              infoEmpresa={infoEmpresa}
              uf={dadosassociado?.uf ?? ""}
            />
          )}
        </div>
      ) : (
        // Renderiza as tabs para telas maiores
        <Tabs
          defaultValue="dados"
          className=" whitespace-nowrap"
        >
          <TabsList className="gap-2">
            <TabsTrigger value="dados">
              <User className="w-4 h-4 mr-2" />
              Dados
            </TabsTrigger>
            <TabsTrigger value="mensalidade">
              <Wallet className="w-4 h-4 mr-2" />
              Mensalidades
            </TabsTrigger>
            <TabsTrigger value="dependentes">
              <Users className="w-4 h-4 mr-2" />
              Dependentes
            </TabsTrigger>
            <TabsTrigger value="carteiras">
              <HiOutlineIdentification className="w-5 h-5 mr-2" />
              Carteiras
            </TabsTrigger>
            <TabsTrigger value="acordos">
              <HiOutlineIdentification className="w-5 h-5 mr-2" />
              Acordos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dados">
            <DadosAssociado
              dadosassociado={dadosassociado}
              infoEmpresa={infoEmpresa}
              permissoes={permissoes}
              setarDadosAssociado={setarDadosAssociado}
              usuario={usuario ?? ({} as UserProps)}
            />
          </TabsContent>
          <TabsContent value="mensalidade">
            <HistoricoMensalidade
              carregarDados={carregarDados}
              dadosassociado={dadosassociado ?? {}}
              infoEmpresa={infoEmpresa}
              usuario={usuario ?? ({} as UserProps)}
              permissoes={permissoes}
              setarDadosAssociado={setarDadosAssociado}
            />
          </TabsContent>
          <TabsContent value="dependentes">
            <Dependentes
              dadosassociado={dadosassociado ?? ({} as AssociadoProps)}
              infoEmpresa={infoEmpresa}
              permissoes={permissoes}
              setarDadosAssociado={setarDadosAssociado}
              usuario={usuario ?? ({} as UserProps)}
            />
          </TabsContent>
          <TabsContent value="carteiras">
            <CarteirasDep
              adesao={dadosassociado?.contrato?.dt_adesao ?? new Date()}
              bairro={dadosassociado?.bairro ?? ""}
              celular={dadosassociado?.celular1 ?? ""}
              cidade={dadosassociado?.cidade ?? ""}
              contrato={dadosassociado?.contrato?.id_contrato ?? 0}
              cpf={dadosassociado?.cpfcnpj ?? ""}
              endereco={dadosassociado?.endereco ?? ""}
              numero={dadosassociado?.numero ?? 0}
              plano={dadosassociado?.contrato?.plano ?? ""}
              rg={dadosassociado?.rg ?? ""}
              titular={dadosassociado?.nome ?? ""}
              dependentes={dadosassociado?.dependentes ?? []}
              infoEmpresa={infoEmpresa}
              uf={dadosassociado?.uf ?? ""}
            />
          </TabsContent>

          <TabsContent value="acordos">
            <Acordos
              acordos={dadosassociado?.acordo ?? []}
              mensalidades={dadosassociado?.mensalidade?.filter((item) => item.status === "A" || item.status === "R") ?? []}
              id_contrato_global={dadosassociado?.contrato?.id_contrato_global ?? 0}
              id_global={dadosassociado?.id_global ?? 0}
              id_empresa={dadosassociado?.id_empresa ?? ""}
              id_associado={dadosassociado?.id_associado ?? 0}
              id_contrato={dadosassociado?.contrato?.id_contrato ?? 0}

            />
          </TabsContent>
        </Tabs>
      )}

      {/* Documentos */}

      <div style={{ display: "none" }}>
        {printState.contrato && (
          <DocumentTemplate
            adesao={new Date(dadosassociado?.contrato?.dt_adesao ?? "")}
            bairro={dadosassociado?.bairro ?? ""}
            cidade={dadosassociado?.cidade ?? ""}
            complemento={dadosassociado?.guia_rua ?? ""}
            contrato={dadosassociado?.contrato?.id_contrato ?? 0}
            cpf={dadosassociado?.cpfcnpj ?? ""}
            dependentes={dadosassociado?.dependentes ?? []}
            endereco={dadosassociado?.endereco ?? ""}
            estado={dadosassociado?.uf ?? ""}
            nome={dadosassociado?.nome ?? ""}
            numero={String(dadosassociado?.numero) ?? ""}
            rg={dadosassociado?.rg ?? ""}
            telefone={dadosassociado?.celular1 ?? ""}
            infoEmpresa={infoEmpresa}
            ref={componentRefs.contrato}
          />
        )}

        {printState.carteira && (
          <CarteiraAssociado
            infoEmpresa={infoEmpresa}
            adesao={dadosassociado.contrato?.dt_adesao ?? new Date()}
            cpf={dadosassociado.cpfcnpj ?? ""}
            rg={dadosassociado.rg ?? ""}
            dependentes={dadosassociado?.dependentes ?? []}
            plano={dadosassociado?.contrato?.plano ?? ""}
            ref={componentRefs.carteira}
            bairro={dadosassociado?.bairro ?? ""}
            cartTitular={true}
            celular={dadosassociado?.celular1 ?? ""}
            cidade={dadosassociado?.cidade ?? ""}
            contrato={dadosassociado?.contrato?.id_contrato ?? 0}
            dependentesTitular={dadosassociado?.dependentes ?? []}
            endereco={dadosassociado?.endereco ?? ""}
            numero={Number(dadosassociado?.numero)}
            titular={dadosassociado?.nome ?? ""}
            uf={dadosassociado?.uf ?? ""}
          />
        )}

        {printState.carne && (
          <ImpressaoCarne
            infoEmpresa={infoEmpresa}
            ref={componentRefs.carne}
            arrayMensalidade={
              dadosassociado?.mensalidade?.filter(
                (mensalidade) => mensalidade.status !== "P"
              ) ?? []
            }
            dadosAssociado={{
              bairro: dadosassociado?.bairro ?? "",
              cidade: dadosassociado?.cidade ?? "",
              endereco: dadosassociado?.endereco ?? "",
              id_contrato: dadosassociado?.contrato?.id_contrato ?? 0,
              nome: dadosassociado?.nome ?? "",
              uf: dadosassociado?.uf ?? "",
              numero: Number(dadosassociado?.numero),
              plano: dadosassociado?.contrato?.plano ?? "",
            }}
          />
        )}

        {printState.resumo && (
          <ContratoResumo
            infoEmpresa={infoEmpresa}
            ref={componentRefs.resumo}
            dados={dadosassociado ?? {}}
          />
        )}

        {printState.carta && (
          <CartaNovoAssociado
            infoEmpresa={infoEmpresa}
            ref={componentRefs.carta}
            contrato={dadosassociado?.contrato?.id_contrato ?? 0}
            titular={dadosassociado?.nome ?? ""}
          />
        )}

        {printState.cancelamento && (
          <ProtocoloCancelamento
            infoEmpresa={infoEmpresa}
            ref={componentRefs.cancelamento}
            contrato={dadosassociado?.contrato?.id_contrato ?? 0}
            titular={dadosassociado?.nome ?? ""}
            bairro={dadosassociado?.bairro ?? ""}
            cidade={dadosassociado?.cidade ?? ""}
            endereco={dadosassociado?.endereco ?? ""}
            cpf={dadosassociado?.cpfcnpj ?? ""}
            usuario={usuario?.nome ?? ""}
          />
        )}
      </div>
    </div>
  );
}
