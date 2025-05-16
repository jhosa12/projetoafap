import { api } from "@/lib/axios/apiClient";
import { Table } from "flowbite-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { HiPrinter } from "react-icons/hi2";
import { HiDocumentAdd, HiFilter } from "react-icons/hi";

import FichaConsulta from "@/Documents/afapSaude/fichaConsulta";
import { useReactToPrint } from "react-to-print";
import { MdDelete, MdEdit } from "react-icons/md";
import { BiMoneyWithdraw } from "react-icons/bi";
import { AuthContext } from "@/store/AuthContext";
import { GiReturnArrow } from "react-icons/gi";
import { FaWhatsapp } from "react-icons/fa";
import handleWhatsAppClick from "@/utils/openWhats";
import pageStyle from "@/utils/pageStyle";
import { ReciboMensalidade } from "@/Documents/associado/mensalidade/Recibo";
import { ajustarData } from "@/utils/ajusteData";
import { ModalConfirmar } from "../../modals/modalConfirmar";
import ListaConsultas from "@/Documents/afapSaude/listaConsultas";
import { SlOptions } from "react-icons/sl";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../../ui/button";
import {
  ConsultaProps,
  EventProps,
  FiltroConsultaProps,
  MedicoProps,
  statusConsultaArray,
} from "@/types/afapSaude";
import { toast } from "sonner";
import useApiPut from "@/hooks/useApiPut";
import { useForm } from "react-hook-form";
import { ModalConsulta } from "@/components/afapSaude/consultas/modalNovaConsulta";
import { ModalFiltroConsultas } from "@/components/afapSaude/consultas/modalFiltro";
import { DropdownAcoesConsulta } from "./DropdownAcoesConsulta";

interface DataProps {
  medicos: Array<MedicoProps>;
  events: Array<EventProps>;
}
export const valorInicial = {
  celular: "",
  cpf: "",
  data: new Date(),
  espec: "",
  exames: [],
  id_consulta: null,
  id_med: null,
  nome: "",
  tipoDesc: "",
  vl_consulta: 0,
  vl_desc: 0,
  vl_final: 0,
};

export default function Consultas({ medicos, events }: DataProps) {
  const [data, setData] = useState<Partial<ConsultaProps>>();
  const { usuario, consultores } = useContext(AuthContext);
  const [formPag, setFormPag] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [consultas, setConsultas] = useState<Array<ConsultaProps>>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<{ [key: string]: boolean }>({
    filtro: false,
    deletar: false,
    receber: false,
    editar: false,
    estornar: false,
    status: false,
    printProntuario: false,
    printRecibo: false,
    printListaConsultas: false,
  });

const currentPage = useRef<HTMLDivElement|null>(null)
 const currentRecibo = useRef<HTMLDivElement|null>(null)
const currentConsultas = useRef<HTMLDivElement|null>(null)

  const { register, control, handleSubmit, watch, getValues, reset } =
    useForm<FiltroConsultaProps>({
      defaultValues: {
        startDate: new Date(),
        endDate: new Date(),
        buscar: "",
      },
    });

  const buscarConsultas = async ({
    startDate,
    endDate,
    id_med,
    status,
    buscar,
    nome,
    id_consultor,
    externo,
    signal,
    medico,
  }: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    id_med?: number;
    status: string[] | undefined;
    buscar?: string;
    nome?: string;
    id_consultor?: number;
    externo?: string;
    signal?: AbortSignal;
    medico?: string;
  }) => {
    const { dataIni, dataFim } = ajustarData(startDate, endDate);
    let medicoId = medicos.find((item) => item.nome === medico)?.id_med;

    if (startDate && endDate && startDate > endDate) {
      toast.warning("Data inicial não pode ser maior que a data final");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(
        "/afapSaude/consultas",
        {
          startDate: dataIni,
          endDate: dataFim,
          id_med: medicoId ? Number(medicoId) : undefined,
          status,
          externo,
          buscar,
          nome,
          id_consultor,
        },
        {
          signal,
        }
      );

      setConsultas(response.data);
      setModal({ filtro: false });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const { data: estorno, postData: handleEstorno } = useApiPut<
    any,
    { id_consulta: number }
  >(
    "/afapSaude/estornarConsulta",
    () => buscarConsultas(getValues()),
    () => setModal({ estornar: false })
  );

  useEffect(() => {
    modal.printProntuario && imprimirFicha();
    modal.printRecibo && imprimirRecibo();
    modal.printListaConsultas && imprimirConsultas();
  }, [modal.printProntuario, modal.printRecibo, modal.printListaConsultas]);

  const handleEstornarConsulta = async () => {
    if (!data?.id_consulta) {
      return;
    }
    if (data.status !== "RECEBIDO") {
      toast.warning("Consulta ainda nao foi recebida");
      return;
    }

    await handleEstorno({ id_consulta: data.id_consulta });

    // buscarConsultas(getValues())
  };

  const handleChangeStatus = async ({
    status,
    item,
  }: {
    status: string;
    item: ConsultaProps;
  }) => {
    if (item.status === "RECEBIDO") {
      toast.warning("Consulta já foi recebida!");
      return;
    }

    if (
      (status === "CONFIRMADO" || status === "CANCELADO") &&
      !item.data_prev
    ) {
      toast.warning("Cliente ainda não agendou data!");
      return;
    }

    if (status) {
      setData({ ...item, status: status });
    }

    //setOpenStatus(true)
    setModal({ status: true });
  };

  const handleAlterarStatus = async () => {
    if (!data?.data_prev) {
      toast.warning("Cliente ainda não agendou data!");
      return;
    }
    toast.promise(
      api.put("/afapSaude/consultas/Editarcadastro", {
        id_consulta: data?.id_consulta,
        id_agmed: data?.status === "AGUARDANDO DATA" ? null : data?.id_agmed,
        data_prev: data?.status === "AGUARDANDO DATA" ? null : data?.data_prev,
        id_med: Number(data.id_med),
        status: data?.status,
      }),
      {
        error: "Erro na requisição",
        loading: "Alterando status..",
        success: (evento) => {
          const novo = [...consultas];
          const index = consultas.findIndex(
            (item) => item.id_consulta === data?.id_consulta
          );
          novo[index] = { ...evento.data };

          setConsultas(novo);

          //setOpenStatus(false)
          setModal({ status: false });
          setData({});
          return "Status alterado com sucesso";
        },
      }
    );
  };

  const imprimirFicha = useCallback(
    useReactToPrint({
      pageStyle: pageStyle,
      content: () => currentPage.current,
      onAfterPrint: () => {
        setData({}), setModal({ printProntuario: false });
      },
    }),
    [data?.id_consulta]
  );

  const imprimirConsultas = useCallback(
    useReactToPrint({
      pageStyle: `
      @page {
          size: landscape;
          margin: 1rem;
      }
      @media print {
          body {
              -webkit-print-color-adjust: exact;
          }
          @page {
              size: landscape;
              margin: 1rem;
          }
          @page {
              @top-center {
                  content: none;
              }
              @bottom-center {
                  content: none;
              }
          }
      }
  `,
      content: () => currentConsultas.current,
      onAfterPrint: () => {
        setData({}), setModal({ printListaConsultas: false });
      },
    }),
    [consultas]
  );

  const imprimirRecibo = useCallback(
    useReactToPrint({
      pageStyle: pageStyle,
      content: () => currentRecibo.current,
      onBeforeGetContent: () => {
        if (!data?.id_consulta) {
          toast.warning("Selecione uma consulta");
          return Promise.reject();
        }

        if (data?.status !== "RECEBIDO") {
          toast.warning("Consulta não foi recebida!");
          return Promise.reject();
        }

        Promise.resolve();
      },
      onAfterPrint: () => {
        setData({}), setModal({ printRecibo: false });
      },
    }),
    [data?.id_consulta]
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    buscarConsultas({ ...getValues(), signal });

    return () => {
      controller.abort();
    };
  }, []);

  const handleReceberConsulta = useCallback(async () => {
    if (!data?.id_consulta) {
      toast.warning("Selecione uma consulta");
      return;
    }

    if (data?.status === "RECEBIDO") {
      toast.warning("Consulta ja foi recebida!");
      return;
    }
    if (data?.status === "AGUARDANDO DATA") {
      toast.warning("Consulta ainda não foi agendada!");
      return;
    }

    if (data?.procedimentos?.length === 0) {
      toast.warning("Defina os procedimentos realizados!");
      return;
    }

    if (!formPag) {
      toast.warning("Selecione uma forma de pagamento");
      return;
    }

    const dataAtual = new Date();
    dataAtual.setTime(
      dataAtual.getTime() - dataAtual.getTimezoneOffset() * 60 * 1000
    );
   const valorPg= data?.procedimentos?.reduce(
      (total, item) => total + item.valorFinal,
      0
    )

    toast.promise(
      api.put("/afapSaude/receberConsulta", {
        id_consulta: data?.id_consulta,
        // id_usuario:usuario?.id,
        datalancUTC: dataAtual.toISOString(),
        descricao: "CONSULTA",
        historico: `CONSULTA.${data?.id_consulta}-${data?.nome}-${data?.espec}`,
        valor: valorPg, 
        usuario: usuario?.nome,
      }),
      {
        error: "Erro ao receber consulta",
        loading: "Recebendo consulta....",
        success: () => {
          buscarConsultas(getValues());
          setData(valorInicial);
          setModal({ receber: false });
          return "Consulta recebida com sucesso!";
        },
      }
    );
  }, [usuario , consultas, data, formPag,data?.procedimentos]);

  const handleDeletar = useCallback(async () => {
    if (!data?.id_consulta) {
      toast.warning("Selecione uma consulta");
      return;
    }

    if (data?.status === "RECEBIDO") {
      toast.warning("Impossivel deletar. Consulta ja foi recebida!");
      return;
    }

    toast.promise(
      api.delete(`/afapSaude/consultas/deletarCadastro`, {
        data: {
          id_consulta: data?.id_consulta,
        },
      }),
      {
        error: "Erro ao deletar dados",
        loading: "Deletando dados....",
        success: () => {
          setConsultas(
            consultas.filter((atual) => atual.id_consulta !== data?.id_consulta)
          );
          setModal({ deletar: false });
          setData(valorInicial);
          return "Dados deletados com sucesso!";
        },
      }
    );
  }, [consultas, data, setConsultas]);

  return (
    <div className="flex flex-col p-2 gap-2">

        <ModalConsulta
          events={events}
          setConsulta={setData}
          consultas={consultas}
          consulta={data ?? {}}
          setConsultas={setConsultas}
          medicos={medicos}
          openModal={modal.editar}
          setOpenModal={() => setModal({ editar: false })}
          buscarConsultas={() =>
            buscarConsultas({
              startDate: watch("startDate"),
              endDate: watch("endDate"),
              id_med: watch("id_med"),
              status: watch("status"),
              buscar: watch("buscar"),
            })
          }
        />


      <div className=" inline-flex w-full justify-between text-black items-center">
        <div className="inline-flex gap-4">
          <Button
            variant={"outline"}
            onClick={() => {
              setData({}), setModal({ editar: true });
            }}
            size={"sm"}
            color="gray"
          >
            <HiDocumentAdd className=" h-4 w-4" />
            Adicionar
          </Button>

          <Button
            variant={"outline"}
            onClick={() => setModal({ printListaConsultas: true })}
            size={"sm"}
          >
            <HiPrinter className=" h-4 w-4" />
            Imprimir Lista
          </Button>

          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => setModal({ filtro: true })}
          >
            {" "}
            <HiFilter className=" h-4 w-4" /> Filtro
          </Button>
        </div>

        <span className="text-xs font-medium">
          Total de consultas: {consultas.length}
        </span>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-145px)]">
        <Table
          theme={{
            root: { shadow: "none" },
            body: {
              cell: { base: "px-1 text-black py-0 text-[10px] font-medium" },
            },
            head: { cell: { base: "px-1 text-black py-0 text-[11px]" } },
          }}
        >
          <Table.Head className="sticky top-0 bg-white z-10 border-b-2">
            <Table.HeadCell>Nome</Table.HeadCell>
            <Table.HeadCell>Fone</Table.HeadCell>
            <Table.HeadCell>Especialidade</Table.HeadCell>
            <Table.HeadCell>Data</Table.HeadCell>
            <Table.HeadCell>Data Prev.</Table.HeadCell>
            <Table.HeadCell>Hora Prev</Table.HeadCell>
            <Table.HeadCell>Valor</Table.HeadCell>
            <Table.HeadCell>Usuário</Table.HeadCell>
            <Table.HeadCell>Retorno</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {consultas.map((item, index) => (
              <Table.Row
                key={item.id_consulta}
                className={`font-medium bg-white hover:cursor-pointer`}
                  onClick={e => {
                 
                            setData(item), setModal({ editar: true });
                          }}
              >
                <Table.Cell className="whitespace-nowrap">
                  {item.nome}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">
                  {item.celular}
                </Table.Cell>
                <Table.Cell>{item.espec}</Table.Cell>
                <Table.Cell>
                  {new Date(item.data).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
                </Table.Cell>
                <Table.Cell>
                  {item.data_prev &&
                    new Date(item?.data_prev).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                </Table.Cell>

                <Table.Cell>
                  {item.hora_prev &&
                    new Date(item?.hora_prev).toLocaleTimeString("pt-BR")}
                </Table.Cell>
                <Table.Cell>
                  {Number(
                    item?.procedimentos?.reduce(
                      (acc, curr) => acc + curr.valorFinal,
                      0
                    ) ?? 0
                  ).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Table.Cell>
                <Table.Cell>{item?.user}</Table.Cell>
                <Table.Cell className="font-semibold text-red-600">
                  {item?.retorno}
                </Table.Cell>
                <Table.Cell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={item?.status}
                    onValueChange={(e) => {
                      handleChangeStatus({ item, status: e });
                    }}
                  >
                    <SelectTrigger
                      className={`border-0 w-[140px] shadow-none font-semibold text-[10px] focus:ring-0 ${
                        item?.status === "AGENDADO"
                          ? "text-blue-500"
                          : item?.status === "AGUARDANDO DATA"
                          ? "text-yellow-500"
                          : item?.status === "CONFIRMADO"
                          ? "text-cyan-500"
                          : item?.status === "RECEBIDO"
                          ? "text-green-500"
                          : item?.status === "ATENDIDO"
                          ? "text-violet-600"
                          : item?.status === "CANCELADO"
                          ? "text-red-500"
                          : ""
                      } `}
                    >
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent className="shadow-none">
                      <SelectGroup className="shadow-none">
                        {statusConsultaArray?.map((item) => (
                          <SelectItem
                            className="text-xs"
                            disabled={
                              item === "AGENDADO" || item === "RECEBIDO"
                            }
                            key={item}
                            value={item}
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Table.Cell>

                <Table.Cell onClick={(e) => e.stopPropagation()}>
                  <DropdownAcoesConsulta
                    item={item}
                    setData={setData}
                    setModal={setModal}
                    handleWhatsAppClick={handleWhatsAppClick}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      
      
      

      <ModalConfirmar
        openModal={modal.deletar??false}
        setOpenModal={() => setModal({ deletar: false })}
        handleConfirmar={handleDeletar}
        pergunta={"Realmente deseja deletar essa consulta?"}
      />

      <ModalFiltroConsultas
        reset={reset}
        register={register}
        control={control}
        handle={handleSubmit}
        consultores={consultores}
        medicos={medicos}
        buscarConsultas={buscarConsultas}
        loading={loading}
        setFiltro={() => setModal({ filtro: false })}
        show={modal.filtro??false}
      />

      {modal.receber && (
        <ModalConfirmar
          pergunta="Realmente deseja receber essa consulta?"
          handleConfirmar={handleReceberConsulta}
          openModal={modal.receber ??false}
          setOpenModal={() => setModal({ receber: false })}
        >
          <Select
            value={formPag}
            onValueChange={(e) => {
              setFormPag(e);
            }}
          >
            <SelectTrigger
              className={`shadow-none font-semibold  focus:ring-0`}
            >
              <SelectValue placeholder="Selecione a forma de pagamento" />
            </SelectTrigger>
            <SelectContent className="shadow-none ">
              <SelectGroup className="shadow-none ">
                <SelectItem className="text-xs" value="DINHEIRO">
                  DINHEIRO
                </SelectItem>
                <SelectItem className="text-xs" value="CARTAO">
                  CARTÃO
                </SelectItem>
                <SelectItem className="text-xs" value="PIX">
                  PIX
                </SelectItem>
                <SelectItem className="text-xs" value="TRANSFERENCIA">
                  TRANSFERÊNCIA
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </ModalConfirmar>
      )}

      <div className="hidden" style={{ display: "none" }}>
        {modal.printProntuario && (
            <FichaConsulta
            ref={currentPage}
            especialista={
              medicos.find((item) => item.id_med === data?.id_med)?.nome ?? ""
            }
            id_consulta={data?.id_consulta ?? null}
            bairro={data?.bairro ?? ""}
            data={data?.data_prev ? new Date(data?.data_prev) : new Date()}
            cidade={data?.cidade ?? ""}
            cpf={data?.cpf ?? ""}
            endereco={data?.endereco ?? ""}
            nascimento={data?.nascimento ?? undefined}
            identidade={data?.identidade ?? ""}
            especialidade={
              medicos.find((item) => item.id_med === data?.id_med)?.espec ?? ""
            }
            responsavel={data?.responsavel ?? ""}
            nome={data?.nome ?? ""}
            procedimentos={data?.procedimentos}
            celular={data?.celular ?? ""}
            parentesco={data?.grau_parentesco ?? ""}
          /> 
        )}

        {modal.printRecibo && (
          
          <ReciboMensalidade
           ref={currentRecibo}
            cidade_uf="CEDRO/CE"
            endereco="RUA VER. SALUSTIANO MOURAO, 394 - CENTRO"
            logoUrl="/afapsaudelogo.jpg"
            associado={data?.nome ?? ""}
            contrato={data?.id_consulta ?? null}
            data_pgto={data?.dt_pgto ?? null}
            n_doc=""
            referencia=""
            valor={Number(
              data?.procedimentos?.reduce(
                (acc, curr) => acc + curr.valorFinal,
                0
              ) ?? 0
            )}
            vencimento={new Date()}
            referente={`Consulta Médica - ${data?.espec}`}
          />
        )}

        {modal.printListaConsultas && (
       
                     <ListaConsultas ref={currentConsultas} dados={consultas}/>
              
        )}
      </div>

      <ModalConfirmar
        pergunta="Realmente deseja alterar o status?"
        handleConfirmar={handleAlterarStatus}
        openModal={modal.status}
        setOpenModal={() => setModal({ status: false })}
      />

      <ModalConfirmar
        pergunta="Realmente deseja Estornar a consulta?"
        handleConfirmar={handleEstornarConsulta}
        openModal={modal.estornar}
        setOpenModal={() => setModal({ estornar: false })}
      />
    </div>
  );
}
