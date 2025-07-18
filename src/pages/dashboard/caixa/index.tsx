import { api } from "@/lib/axios/apiClient";
import { MdDelete, MdOutlineLaunch } from "react-icons/md";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from "date-fns/locale/pt-BR";
import { ModalLancamentosCaixa } from "@/components/modals/caixa/modalLancamentosCaixa";
import { AuthContext } from "@/store/AuthContext";
import { Modal, Spinner, Table } from "flowbite-react";
import { HiPencil } from "react-icons/hi2";
import { ModalFechamento } from "../../../components/modals/caixa/modalFechamento";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ajustarData } from "@/utils/ajusteData";
import { ScreenCloseCaixa } from "@/components/caixa/screenCloseCaixa";
import { ModalMensalidade } from "@/components/modals/admContrato/historico/modalmensalidade";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BiCalendarMinus } from "react-icons/bi";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import { toast } from "sonner";
import {
  FormCaixaProps,
  LancamentosProps,
  ResponseCaixaProps,
} from "@/types/caixa";
import { MensalidadeBaixaProps } from "@/types/financeiro";
import ActionsCaixa from "@/components/caixa/ActionsCaixa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

registerLocale("pt", pt);

export default function CaixaMovimentar() {
  const [mov, setMov] = useState<Partial<LancamentosProps>>();
  const [saldo, setSaldo] = useState(0);
  const { usuario, permissoes, infoEmpresa } = useContext(AuthContext);
  const [selectRelatorio, setSelectRelatorio] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mensalidade, setMensalidade] =
    useState<Partial<MensalidadeBaixaProps>>();
  const [modalDados, setModalDados] = useState<boolean>(false);
  const [despesas, setDespesas] = useState<number>(0);
  const [data, setData] = useState<Partial<ResponseCaixaProps>>();
  const [valorForma, setValorForma] = useState<Record<string, number>>();
  const [openModal, setModal] = useState<{ [key: string]: boolean }>({
    lancar: false,
    excluir: false,
    fecharCaixa: false,
  });
  const [openDrop, setOpenDrop] = useState(false);
  const { register, watch, handleSubmit, control } = useForm<FormCaixaProps>({
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  useEffect(() => {
    if (modalDados) return;
    let currentBarcode = "";
    let timeout: ReturnType<typeof setTimeout>;

    const handleKeyPress = (event: KeyboardEvent) => {
      
      event.stopPropagation();
      //Verifica se a tecla "Enter" foi pressionada
      if (event.key === "Enter") {
        //setScannedCode(currentBarcode);
        
        event.preventDefault();
        buscarMensalidade(currentBarcode);
        currentBarcode = ""; // Reinicia o código de barras após a leitura
        setModal({ lancar: false });
      } else {
        //Acumula os caracteres do código de barras
        currentBarcode += event.key;
      }

      //Limpa o buffer se não houver atividade por 300ms
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        currentBarcode = "";
      }, 300);
    };

    //Adiciona o ouvinte de eventos para capturar as teclas pressionadas
    document.addEventListener("keydown", handleKeyPress, true);

    //Remove o ouvinte de eventos quando o componente é desmontado
    return () => {
      document.removeEventListener("keydown", handleKeyPress, true);
    };
  }, [
    modalDados,
   
    infoEmpresa,
  ]);

  /*  useEffect(()=>{



        const handleScanner=(event:KeyboardEvent)=>{

            if(event.key==='F2'){
               if (!watch('id_empresa')) {
                toast.info('Selecione uma empresa')
                return
               }
                setScanner(true)
            }
           
        }

        document.addEventListener('keydown',handleScanner)

        return () => {
            document.removeEventListener('keydown', handleScanner);
        };



    },[])*/

  const buscarMensalidade = useCallback(
    async (n_doc: string) => {
      console.log(infoEmpresa?.id);
      setLoading(true);
      try {
        const response = await api.post("/mensalidade/baixaDireta", {
          n_doc,
          id_empresa: infoEmpresa?.id,
        });

        setMensalidade(response.data);
        setModalDados(true);
      } catch (error: any) {
        console.log("Erro:", error); // Verifique o erro mais claramente
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Ocorreu um erro desconhecido.");
        }
      }

      setLoading(false);
    },
    [infoEmpresa, mensalidade, modalDados]
  );

  useEffect(() => {
    handleChamarFiltro();
  }, [infoEmpresa]);

  const handleExcluir = useCallback(async () => {
    toast.promise(
      api.delete(`/caixa/deletar/${infoEmpresa?.id}/${mov?.lanc_id}`),
      {
        error: "Erro ao deletar lancamento",
        loading: "Solicitando exclusão..",
        success: () => {
          // const novo = [...(data?.lista||[])]
          // const index = novo.findIndex(item=>item.lanc_id===mov?.lanc_id)
          //  novo.splice(index,1)
          //  setData({...data,lista:novo})
          handleChamarFiltro(); // Ensure this is awaited
          setModal({ excluir: false });
          //setModalExc(false)

          return "Deletado com sucesso";
        },
      }
    );
  }, [mov?.lanc_id, data?.lista, infoEmpresa?.id]);

  const handleChamarFiltro = () => {
    listarLancamentos({
      endDate: watch("endDate"),
      startDate: watch("startDate"),
      id_empresa: infoEmpresa?.id ?? "",
      descricao: watch("descricao"),
    });
  };

  const listarLancamentos: SubmitHandler<FormCaixaProps> = useCallback(
    async (data) => {
      if (data.startDate > data.endDate) {
        toast.info("Data final deve ser maior que a data inicial");
        return;
      }

      const { dataIni, dataFim } = ajustarData(data.startDate, data.endDate);
      try {
        setLoading(true);
        const response = await api.post("/listarLancamentos", {
          id_empresa: infoEmpresa?.id,
          dataInicial: dataIni,
          dataFinal: dataFim,
          descricao: data.descricao,
          // id_user:usuario?.id
        });

        //console.log(response.data)

        setData(response.data);
        // setLancamentos(lista)
        // setPlanos(plano_de_contas)
        // setGrupos(grupos)
        // setFechado(fechamento)
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    },
    [infoEmpresa?.id, usuario]
  );

  useEffect(() => {
    if (data?.lista && data?.lista.length > 0) {
      const totalPorFormaPagamento = data?.lista?.reduce((acc, lancamento) => {
        if (
          lancamento.lancamentoForma &&
          typeof lancamento.lancamentoForma === "object"
        ) {
          Object?.entries(lancamento?.lancamentoForma)?.forEach(
            ([forma, dados]) => {
              lancamento.tipo === "RECEITA"
                ? (acc[dados.forma] =
                    (acc[dados.forma] || 0) + Number(dados.valor))
                : (acc[dados.forma] =
                    (acc[dados.forma] || 0) - Number(dados.valor));
            }
          );
        }
        return acc;
      }, {} as Record<string, number>);

      setValorForma(totalPorFormaPagamento);

      const soma = data.lista?.reduce((total, item) => {
        if (item.tipo === "RECEITA") {
          return (total = total + Number(item.valor));
        } else return (total = total - Number(item.valor));
      }, 0);
      setSaldo(soma);
      const somadespesas = data.lista?.reduce((total, item) => {
        if (item.tipo === "DESPESA") {
          return (total = total + Number(item.valor));
        } else {
          return total;
        }
      }, 0);
      setDespesas(somadespesas);
    } else {
      setSaldo(0);
      setDespesas(0);
      setValorForma({});
    }
  }, [data?.lista]);

  return (
    <>
      {/*openModal.lancar && <ModalLancamento bancos={infoEmpresa?.bancos??[]} id_empresa={infoEmpresa?.id??''} handleFiltro={handleChamarFiltro}  mov={mov??{}} openModal={openModal.lancar} setOpenModal={()=>setModal({lancar:false})}  planos={data?.plano_de_contas??[]}  grupo={data?.grupo??[]}/>*/}

      <ModalConfirmar
        openModal={openModal.excluir}
        handleConfirmar={handleExcluir}
        pergunta="Deseja excluir o lançamento?"
        setOpenModal={() => setModal({ excluir: false })}
      />

      {/*<ModalDadosMensalidade  handleChamarFiltro={handleChamarFiltro} setMensalidade={setMensalidade} mensalidade={mensalidade??{}} open={modalDados} setOpen={setModalDados}/>*/}

      {modalDados && (
        <ModalMensalidade
          handleAtualizar={() =>
            listarLancamentos({
              startDate: watch("startDate"),
              endDate: watch("endDate"),
              id_empresa: infoEmpresa?.id ?? "",
              descricao: watch("descricao"),
            })
          }
          mensalidade={{
            ...mensalidade,
          }}
          openModal={modalDados}
          setOpenModal={setModalDados}
        />
      )}

      <Modal size={"sm"} popup show={loading}>
        <Modal.Body>
          <div className=" flex flex-col mt-6 w-full justify-center items-center">
            <Spinner size={"lg"} color={"warning"} />
            <span>Localizando dados....</span>
          </div>
        </Modal.Body>
      </Modal>

      <div className="flex flex-col  w-full ">
        <div className=" bg-white inline-flex items-end w-full gap-2 ">
          <form
            onSubmit={handleSubmit(listarLancamentos)}
            className="flex w-full items-end flex-row justify-end p-1 gap-4 text-black pr-2 "
          >
            <div className="flex flex-col whitespace-nowrap ml-4 bg-gray-50 px-2 py-1 text-[11px] rounded-md ">
              <div className="inline-flex items-center gap-4">
                <div>
                  <span>SALDO:</span>
                  <span>
                    {" "}
                    {Number(data?.dif).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>

                <div>
                  <span>DIA ANTERIOR:</span>
                  <span>
                    {" "}
                    {Number(data?.valorAnterior).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-4">
                <div>
                  <span>SALDO DIA:</span>
                  <span>R$ {saldo.toFixed(2)}</span>
                </div>

                <div>
                  <span>DESPESAS:</span>
                  <span>
                    {" "}
                    {Number(despesas).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>

                <div>
                  <span>RECEITAS:</span>
                  <span>
                    {" "}
                    {Number(saldo + despesas).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>

              <ul className="inline-flex gap-4">
                {valorForma &&
                  Object.entries(valorForma).map(([forma, valor]) => (
                    <li key={forma}>
                      <strong>{forma}:</strong>{" "}
                      {Number(valor).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="flex items-center gap-2">
              <div>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      selected={value}
                      onChange={(e) => e && onChange(e)}
                      dateFormat={"dd/MM/yyyy"}
                      locale={pt}
                      required
                      className="flex w-full shadow-sm uppercase  z-50 text-[11px] leading-[14px]   border  rounded-sm    border-gray-200 placeholder-gray-400  "
                    />
                  )}
                />
              </div>

              <BiCalendarMinus size={25} />

              <div>
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      selected={value}
                      onChange={(e) => e && onChange(e)}
                      dateFormat={"dd/MM/yyyy"}
                      locale={pt}
                      required
                      className="flex shadow-sm w-full uppercase  z-50 text-[11px]   border  rounded-sm    border-gray-200 placeholder-gray-400 leading-[14px] "
                    />
                  )}
                />
              </div>
            </div>

            <div className="w-1/2">
              <Input
                placeholder="Descrição"
                className="w-full h-8 text-[11px]"
                {...register("descricao")}
              />
            </div>

            <Button variant={"outline"} size={"sm"} type="submit">
              <IoSearchSharp /> Buscar
            </Button>

            <Button
              variant={"outline"}
              onClick={() => {
                setMov({
                  conta: "",
                  conta_n: "",
                  ccustos_desc: "",
                  data: undefined,
                  datalanc: new Date(),
                  descricao: "",
                  historico: "",
                  num_seq: null,
                  tipo: "",
                  usuario: "",
                  valor: null,
                  ccustos_id: null,
                  notafiscal: "",
                }),
                  setModal({ lancar: true });
              }}
              size={"sm"}
              type="button"
            >
              <MdOutlineLaunch />
              Lançar
            </Button>
            <ActionsCaixa
              infoEmpresa={infoEmpresa}
              id_empresa={infoEmpresa?.id ?? ""}
              data={data}
              setSelectRelatorio={setSelectRelatorio}
            />
          </form>
        </div>
        {!!data?.fechamento ? (
          <ScreenCloseCaixa fechamento={data.fechamento} />
        ) : (
          <div className="flex flex-col border-t-2 bg-white">
            <div className="overflow-y-auto mt-1 px-2 h-[calc(100vh-130px)] ">
              <Table
                hoverable
                theme={{
                  root: { shadow: "none" },
                  body: { cell: { base: "px-2 py-0 text-[10px] font-medium" } },
                }}
              >
                <Table.Head
                  className="sticky top-0 bg-white z-5 border-b-[1px] border-gray-300"
                  theme={{
                    cell: {
                      base: "bg-gray-50 px-2 py-0 text-[11px] border border-gray-300",
                    },
                  }}
                >
                  <Table.HeadCell className="border border-gray-300">
                    Nº
                  </Table.HeadCell>
                  <Table.HeadCell className="border border-gray-300">
                    DATA
                  </Table.HeadCell>
                  <Table.HeadCell className="border border-gray-300">
                    CONTA
                  </Table.HeadCell>
                  <Table.HeadCell className="border border-gray-300">
                    C.CUSTOS
                  </Table.HeadCell>
                  <Table.HeadCell className="border border-gray-300">
                    DOCUMENTO
                  </Table.HeadCell>
                  <Table.HeadCell className="border border-gray-300">
                    HISTÓRICO
                  </Table.HeadCell>
                  <Table.HeadCell className="border border-gray-300">
                    TIPO
                  </Table.HeadCell>
                  <Table.HeadCell className="border border-gray-300">
                    VALOR
                  </Table.HeadCell>
                  <Table.HeadCell className="border border-gray-300">
                    AÇÕES
                  </Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y divide-gray-300">
                  {data?.lista?.map((item) => (
                    <Table.Row key={item.lanc_id} className="text-black">
                      <Table.Cell className="whitespace-nowrap border border-gray-300">
                        {item.num_seq}
                      </Table.Cell>
                      <Table.Cell
                        className="border border-gray-300"
                        data-tooltip-id="tooltip-hora"
                        data-tooltip-place="bottom"
                        data-tooltip-content={new Date(
                          item.datalanc
                        ).toLocaleTimeString()}
                      >
                        {new Date(item.data).toLocaleDateString("pt-BR", {
                          timeZone: "UTC",
                        })}
                      </Table.Cell>
                      <Table.Cell className="border border-gray-300">
                        {item.conta}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap border border-gray-300">
                        {item.ccustos_desc}
                      </Table.Cell>
                      <Table.Cell className="border border-gray-300">
                        {item.notafiscal
                          ? item.notafiscal.toUpperCase()
                          : item?.descricao?.toUpperCase()}
                      </Table.Cell>
                      <Table.Cell className="border border-gray-300">
                        {item.historico}
                      </Table.Cell>
                      <Table.Cell
                        className={`font-semibold border border-gray-300 ${
                          item.tipo === "RECEITA"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.tipo}
                      </Table.Cell>
                      <Table.Cell className="font-semibold border border-gray-300">
                        {Number(item.valor).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </Table.Cell>
                      <Table.Cell className="space-x-4 whitespace-nowrap border border-gray-300">
                        <button
                          disabled={
                            item.conta === "1.01.002" ||
                            !permissoes.includes("ADM2.1.3")
                          }
                          onClick={(event) => {
                            event.stopPropagation();
                            setMov({ ...item });
                            setModal({ lancar: true });
                          }}
                          className="font-medium text-gray-500 hover:text-cyan-600 disabled:cursor-not-allowed"
                        >
                          <HiPencil size={14} />
                        </button>
                        <button
                          disabled={
                            item.conta === "1.01.002" ||
                            !permissoes.includes("ADM2.1.4")
                          }
                          onClick={() => {
                            setMov({ lanc_id: item.lanc_id }),
                              setModal({ excluir: true });
                          }}
                          className="font-medium text-gray-500 hover:text-red-600 disabled:cursor-not-allowed"
                        >
                          <MdDelete size={16} />
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        )}

        {!data?.fechamento && (
          <div className="inline-flex gap-3   text-black w-full bg-white p-2">
            {/*  <button disabled={!permissoes.includes('ADM2.1.5')} onClick={()=>setVisible(!visible)} className="justify-center items-center disabled:hover:cursor-not-allowed">
           {visible? <IoMdEye color="blue" size={20}/>:<IoMdEyeOff color="blue" size={20}/>}
            </button>
   
   <div className="text-black text-xs">

    <span className="inline-flex items-center  rounded-s-lg px-4 py-1 gap-1  font-medium  border-t border-b    bg-gray-100 border-gray-400  ">
   
   {visible?`Saldo:  ${Number(data?.dif).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`:"------"}
   </span>


        <span className={`inline-flex items-center px-4 py-1 gap-1  font-medium  border   focus:z-10 focus:ring-2  bg-gray-100 border-gray-400 ${saldo<0?"text-red-500":""}`}>

   {visible?`Saldo Dia: ${Number(saldo).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`:"------"}
  </span>

  <span className="inline-flex items-center px-4 py-1 gap-1  font-medium  border-t border-b    bg-gray-100 border-gray-400  ">
   
  {visible?`Receitas:  ${Number(saldo+despesas).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`:"------"}
  </span>

  <span className="inline-flex items-center px-4 py-1 gap-1  font-medium  border 0 rounded-e-lg    bg-gray-100 border-gray-400 ">

  {visible?`Despesas: ${Number(despesas).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`:"------"}
  </span>
  </div>*/}
          </div>
        )}
      </div>

      {openModal.fecharCaixa && (
        <ModalFechamento
          listar={() =>
            listarLancamentos({
              endDate: watch("endDate"),
              startDate: watch("startDate"),
              id_empresa: infoEmpresa?.id ?? "",
              descricao: watch("descricao"),
            })
          }
          dataCaixaEnd={watch("endDate")}
          dataCaixa={watch("startDate")}
          id_empresa={infoEmpresa?.id ?? ""}
          lancamentos={data?.lista ?? []}
          openModal={openModal.fecharCaixa}
          setOpenModal={() => setModal({ fecharCaixa: false })}
        />
      )}

      {/*openModalPrint && <ModalImpressao array={data?.lista??[]} openModal={openModalPrint} setOpenModal={setPrint} startDate={watch('startDate')} endDate={watch('endDate')} usuario={usuario?.nome??''}/>*/}

      {openModal.lancar && (
        <ModalLancamentosCaixa
          id_empresa={infoEmpresa?.id ?? ""}
          handleFiltro={handleChamarFiltro}
          mov={mov ?? {}}
          openModal={openModal.lancar}
          setOpenModal={() => setModal({ lancar: false })}
          planos={data?.plano_de_contas ?? []}
          grupo={data?.grupo ?? []}
        />
      )}
      {/* 
      <div style={{ display: "none" }}>
      
        {selectRelatorio && (
          <RelatorioSintetico
            infoEmpresa={infoEmpresa}
            tipoRelatorio={selectRelatorio}
            soma={handleGerirRelatorio() ?? ({} as SomaProps)}
            usuario={usuario?.nome ?? ""}
            startDate={watch("startDate")}
            endDate={watch("endDate")}
            array={data?.lista ?? []}
            ref={currentPage}
          />
        )}
      </div> */}
    </>
  );
}
