import { api } from "@/lib/axios/apiClient";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HiDocumentAdd, HiFilter, HiSearch } from "react-icons/hi";
import FichaConsulta from "@/Documents/afapSaude/fichaConsulta";
import { useReactToPrint } from "react-to-print";
import { AuthContext } from "@/store/AuthContext";

import handleWhatsAppClick from "@/utils/openWhats";

import { ReciboMensalidade } from "@/Documents/associado/mensalidade/Recibo";
import { ajustarData } from "@/utils/ajusteData";
import ListaConsultas from "@/Documents/afapSaude/listaConsultas";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "../../ui/button";
import {
  ConsultaProps,
  EventProps,
  FiltroConsultaProps,
  MedicoProps,
  statusConsultaArray,
} from "@/types/afapSaude";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { ModalConsulta } from "@/components/afapSaude/consultas/modalNovaConsulta";
import { ModalFiltroConsultas } from "@/components/afapSaude/consultas/modalFiltro";
import { DropdownAcoesConsulta } from "./DropdownAcoesConsulta";
import PrintDocComponent from "@/components/PrintDocComponent";
import { EmpresaProps } from "@/types/empresa";
import { pageStyle, pageStyleLandscape } from "@/utils/pageStyle";
import { Input } from "@/components/ui/input";
import { useConsultasActions } from "@/hooks/useConsultsActions";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import { HelpCircle } from "lucide-react";
import ModalPosicao from "./ModalPosicao";
import { AtendimentoAtual } from "./tabsConsultas/AtendimentoAtual";
import { TodasConsultas } from "./tabsConsultas/TodasConsultas";
import { FilaEspera } from "./tabsConsultas/FilaEspera";

interface DataProps {
  medicos: Array<MedicoProps>;
  events: Array<EventProps>;
  verifyPermission: (permission: string) => boolean;
  empresa: EmpresaProps | null;
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

export default function Consultas({
  medicos,
  events,
  verifyPermission,
  empresa,
}: DataProps) {
  const [data, setData] = useState<Partial<ConsultaProps>>();
  const { usuario, consultores } = useContext(AuthContext);
  const [formPag, setFormPag] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [consultas, setConsultas] = useState<Array<ConsultaProps>>([]);
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
    alterarPosicao: false,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const currentPage = useRef<HTMLDivElement | null>(null);
  const currentRecibo = useRef<HTMLDivElement | null>(null);

  const { register, control, handleSubmit, getValues, reset } =
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
    especialidade,
  }: FiltroConsultaProps) => {
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
          especialidade,
          id_empresa: empresa?.id,
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

  const {
    handleEstornarConsulta,
    handleAlterarStatus,
    handleReceberConsulta,
    handleDeletar,
    handleConfirmarPosicao,
  } = useConsultasActions({
    data,
    setData,
    setModal,
    usuario,
    consultas,
    setConsultas,
    getValues,
    buscarConsultas,
    formPag,
  });

  const handleSearch = useCallback(async (term: string) => {
    try {
      setLoading(true);
      const response = await api.post("/afapSaude/consultas", {
        nome: term,
      });
      setConsultas(response.data);
    } catch (error) {
      console.error("Erro ao buscar consultas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // const { data: estorno, postData: handleEstorno } = useApiPut<
  //   any,
  //   { id_consulta: number }
  // >(
  //   "/afapSaude/estornarConsulta",
  //   () => buscarConsultas(getValues()),
  //   () => setModal({ estornar: false })
  // );

  useEffect(() => {
    modal.printProntuario && imprimirFicha();
    modal.printRecibo && imprimirRecibo();
  }, [modal.printProntuario, modal.printRecibo, modal.printListaConsultas]);

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

  const imprimirFicha = useCallback(
    useReactToPrint({
      pageStyle: pageStyle,
      content: () => currentPage.current,
      onBeforeGetContent: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      },
      onAfterPrint: () => {
        setData({}), setModal({ printProntuario: false });
      },
    }),
    [data?.id_consulta]
  );

  const handleAlterarPosicao = () => {

    setModal({ alterarPosicao: true });
  };

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
    //if(consultas.length>0)return
    buscarConsultas({ ...getValues(), signal });

    return () => {
      controller.abort();
    };
  }, [empresa?.id]);

  return (
    <Tabs defaultValue="atendimento" className="space-y-4">
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="atendimento">Atendimento Atual</TabsTrigger>
      <TabsTrigger value="todas">Todas as Consultas</TabsTrigger>
      <TabsTrigger value="fila">Fila de Espera</TabsTrigger>
    </TabsList>

    <TabsContent value="atendimento" className="space-y-4">
      <AtendimentoAtual consultas={consultas} />
    </TabsContent>

    <TabsContent value="todas" className="space-y-4">
      <TodasConsultas consultas={consultas} />
    </TabsContent>

    <TabsContent value="fila" className="space-y-4">
      <FilaEspera consultas={consultas} />
    </TabsContent>
  </Tabs>
    // <div className="flex flex-col p-2 gap-2">
    //   {modal.editar && (
    //     <ModalConsulta
    //       empresa={empresa?.cidade_uf}
    //       verifyPermission={verifyPermission}
    //       events={events}
    //       id_empresa={empresa?.id}
    //       setConsulta={setData}
    //       consultas={consultas}
    //       consulta={data ?? {}}
    //       setConsultas={setConsultas}
    //       medicos={medicos}
    //       openModal={modal.editar}
    //       setOpenModal={() => setModal({ editar: false })}
    //       buscarConsultas={() => buscarConsultas(getValues())}
    //     />
    //   )}

    //   <div className=" inline-flex w-full justify-between text-black items-center">
    //     <div className="inline-flex gap-4">
    //       <Button
    //         disabled={verifyPermission("AFS3.1")}
    //         variant={"outline"}
    //         onClick={() => {
    //           setData({}), setModal({ editar: true });
    //         }}
    //         size={"sm"}
    //         color="gray"
    //       >
    //         <HiDocumentAdd className=" h-4 w-4" />
    //         Adicionar
    //       </Button>

    //       <PrintDocComponent
    //         pageOrientation={pageStyleLandscape}
    //         textButton="Lista de consultas"
    //       >
    //         <ListaConsultas dados={consultas} />
    //       </PrintDocComponent>

    //       <Button
    //         variant={"outline"}
    //         size={"sm"}
    //         onClick={() => setModal({ filtro: true })}
    //       >
    //         {" "}
    //         <HiFilter className=" h-4 w-4" /> Filtro
    //       </Button>
    //       <div className="inline-flex gap-1">
    //         <Input
    //           className="h-8 border-gray-200 shadow-sm"
    //           placeholder="Buscar"
    //           value={searchTerm}
    //           onChange={(e) => {
    //             setSearchTerm(e.target.value);
    //             if (!e.target.value) {
    //               buscarConsultas(getValues());
    //             }
    //           }}
    //         />
    //         <Button
    //           size="sm"
    //           variant="outline"
    //           onClick={() => handleSearch(searchTerm)}
    //         >
    //           <HiSearch className="h-4 w-4" />
    //         </Button>
    //       </div>
    //     </div>

    //     <span className="text-xs font-medium">
    //       Total de consultas: {consultas.length}
    //     </span>
    //   </div>

    

    //   <div className="overflow-y-auto h-[calc(100vh-145px)]">
    //     <div className="overflow-y-auto h-[calc(100vh-145px)]">
    //       <Table>
    //         <TableHeader>
    //           <TableRow>
    //             <TableHead>Seq.</TableHead>
    //             <TableHead>Origem</TableHead>
    //             <TableHead>Nome</TableHead>
    //             <TableHead>Fone</TableHead>
    //             <TableHead>Especialidade</TableHead>
    //             <TableHead>Data</TableHead>
    //             <TableHead>Data Prev.</TableHead>
    //             <TableHead>Hora Prev</TableHead>
    //             <TableHead>Valor</TableHead>
    //             <TableHead>Usuário</TableHead>
    //             <TableHead>Retorno</TableHead>
    //             <TableHead>Status</TableHead>
    //             <TableHead></TableHead>
    //           </TableRow>
    //         </TableHeader>
    //         <TableBody>
    //           {consultas.map((item, index) => (
    //             <TableRow
    //               key={item.id_consulta}
    //               className={`font-medium hover:cursor-pointer text-[10px] py-1`}
    //               onClick={(e) => {
    //                 setData(item), setModal({ editar: true });
    //               }}
    //             >
    //               <TableCell className="cursor-pointer hover:bg-gray-50">
    //                 <button
    //                   onClick={(e) => {
    //                     e.stopPropagation();
    //                   setData(item)
    //                   setModal({alterarPosicao:true})
    //                   }}
    //                   className="text-white flex items-center gap-1 hover:bg-blue-500 hover:text-blue-50"
    //                 >
    //               {item?.posicao ? <span className={`text-xs font-medium border p-2 rounded ${item?.status === "RECEBIDO"||item?.status === "ATENDIDO" ? "bg-green-600" : "bg-blue-600"}`}>{item?.posicao}</span> : <HelpCircle className="w-4 h-4 text-blue-600" />}
    //                 </button>
    //               </TableCell>
    //               <TableCell>{item.externo}</TableCell>
    //               <TableCell>{item.nome}</TableCell>
    //               <TableCell className="whitespace-nowrap">
    //                 {item.celular}
    //               </TableCell>
    //               <TableCell>
    //                 {medicos.find((medico) => medico.id_med === item.id_med)?.espec}
    //               </TableCell>
    //               <TableCell>
    //                 {new Date(item.data).toLocaleDateString("pt-BR", {
    //                   timeZone: "UTC",
    //                 })}
    //               </TableCell>
    //               <TableCell>
    //                 {item.data_prev &&
    //                   new Date(item?.data_prev).toLocaleDateString("pt-BR", {
    //                     timeZone: "UTC",
    //                   })}
    //               </TableCell>
    //               <TableCell>
    //                 {item.hora_prev &&
    //                   new Date(item?.hora_prev).toLocaleTimeString("pt-BR")}
    //               </TableCell>
    //               <TableCell>
    //                 {Number(
    //                   item?.procedimentos?.reduce(
    //                     (acc, curr) => acc + curr.valorFinal,
    //                     0
    //                   ) ?? 0
    //                 ).toLocaleString("pt-BR", {
    //                   style: "currency",
    //                   currency: "BRL",
    //                 })}
    //               </TableCell>
    //               <TableCell>{item?.user}</TableCell>
    //               <TableCell className="font-semibold text-red-600">
    //                 {item?.retorno}
    //               </TableCell>
    //               <TableCell onClick={(e) => e.stopPropagation()}>
    //                 <Select
    //                   value={item?.status}
    //                   onValueChange={(e) => {
    //                     handleChangeStatus({ item, status: e });
    //                   }}
    //                 >
    //                   <SelectTrigger
    //                     className={`border-0 w-[140px] shadow-none font-semibold text-[10px] focus:ring-0 ${
    //                       item?.status === "AGENDADO"
    //                         ? "text-blue-500"
    //                         : item?.status === "AGUARDANDO DATA"
    //                         ? "text-yellow-500"
    //                         : item?.status === "CONFIRMADO"
    //                         ? "text-cyan-500"
    //                         : item?.status === "RECEBIDO"
    //                         ? "text-green-500"
    //                         : item?.status === "ATENDIDO"
    //                         ? "text-violet-600"
    //                         : item?.status === "CANCELADO"
    //                         ? "text-red-500"
    //                         : ""
    //                     } `}
    //                   >
    //                     <SelectValue placeholder="Select a status" />
    //                   </SelectTrigger>
    //                   <SelectContent className="shadow-none">
    //                     <SelectGroup className="shadow-none">
    //                       {statusConsultaArray?.map((item) => (
    //                         <SelectItem
    //                           className="text-xs"
    //                           disabled={
    //                             item === "AGENDADO" || item === "RECEBIDO"
    //                           }
    //                           key={item}
    //                           value={item}
    //                         >
    //                           {item}
    //                         </SelectItem>
    //                       ))}
    //                     </SelectGroup>
    //                   </SelectContent>
    //                 </Select>
    //               </TableCell>
    //               <TableCell onClick={(e) => e.stopPropagation()}>
    //                 <DropdownAcoesConsulta
    //                   verifyPermissions={verifyPermission}
    //                   item={item}
    //                   setData={setData}
    //                   setModal={setModal}
    //                   handleWhatsAppClick={() =>
    //                     handleWhatsAppClick({
    //                       phone: item.celular,
    //                     })
    //                   }
    //                 />
    //               </TableCell>
    //             </TableRow>
    //           ))}
    //         </TableBody>
    //       </Table>
    //     </div>
    //   </div>

    //   <ModalConfirmar
    //     openModal={modal.deletar ?? false}
    //     setOpenModal={() => setModal({ deletar: false })}
    //     handleConfirmar={handleDeletar}
    //     pergunta={"Realmente deseja deletar essa consulta?"}
    //   />

    //   <ModalFiltroConsultas
    //     reset={reset}
    //     register={register}
    //     control={control}
    //     handle={handleSubmit}
    //     consultores={consultores}
    //     medicos={medicos}
    //     buscarConsultas={buscarConsultas}
    //     loading={loading}
    //     setFiltro={() => setModal({ filtro: false })}
    //     show={modal.filtro ?? false}
    //   />

    //   {modal.receber && (
    //     <ModalConfirmar
    //       pergunta="Realmente deseja receber essa consulta?"
    //       handleConfirmar={handleReceberConsulta}
    //       openModal={modal.receber ?? false}
    //       setOpenModal={() => setModal({ receber: false })}
    //     >
    //       <Select
    //         value={formPag}
    //         onValueChange={(e) => {
    //           setFormPag(e);
    //         }}
    //       >
    //         <SelectTrigger
    //           className={`shadow-none font-semibold  focus:ring-0`}
    //         >
    //           <SelectValue placeholder="Selecione a forma de pagamento" />
    //         </SelectTrigger>
    //         <SelectContent className="shadow-none ">
    //           <SelectGroup className="shadow-none ">
    //             <SelectItem className="text-xs" value="DINHEIRO">
    //               DINHEIRO
    //             </SelectItem>
    //             <SelectItem className="text-xs" value="CARTAO">
    //               CARTÃO
    //             </SelectItem>
    //             <SelectItem className="text-xs" value="PIX">
    //               PIX
    //             </SelectItem>
    //             <SelectItem className="text-xs" value="TRANSFERENCIA">
    //               TRANSFERÊNCIA
    //             </SelectItem>
    //           </SelectGroup>
    //         </SelectContent>
    //       </Select>
    //     </ModalConfirmar>
    //   )}

    //   <div style={{ display: "none" }}>
    //     <FichaConsulta
    //       ref={currentPage}
    //       especialista={
    //         medicos.find((item) => item.id_med === data?.id_med)?.nome ?? ""
    //       }
    //       id_consulta={data?.id_consulta ?? null}
    //       bairro={data?.bairro ?? ""}
    //       data={data?.data_prev ? new Date(data?.data_prev) : new Date()}
    //       cidade={data?.cidade ?? ""}
    //       cpf={data?.cpf ?? ""}
    //       endereco={data?.endereco ?? ""}
    //       nascimento={data?.nascimento ?? undefined}
    //       identidade={data?.identidade ?? ""}
    //       especialidade={
    //         medicos.find((item) => item.id_med === data?.id_med)?.espec ?? ""
    //       }
    //       responsavel={data?.responsavel ?? ""}
    //       nome={data?.nome ?? ""}
    //       procedimentos={data?.procedimentos}
    //       celular={data?.celular ?? ""}
    //       parentesco={data?.grau_parentesco ?? ""}
    //       logoUrl={empresa?.logoUrl ?? ""}
    //     />

    //     {modal.printRecibo && (
    //       <ReciboMensalidade
    //         ref={currentRecibo}
    //         cidade_uf="CEDRO/CE"
    //         endereco="RUA VER. SALUSTIANO MOURAO, 394 - CENTRO"
    //         logoUrl="/afapsaudelogo.jpg"
    //         associado={data?.nome ?? ""}
    //         contrato={data?.id_consulta ?? null}
    //         data_pgto={data?.dt_pgto ?? null}
    //         n_doc=""
    //         referencia=""
    //         valor={Number(
    //           data?.procedimentos?.reduce(
    //             (acc, curr) => acc + curr.valorFinal,
    //             0
    //           ) ?? 0
    //         )}
    //         vencimento={new Date()}
    //         referente={`Consulta Médica - ${data?.espec}`}
    //       />
    //     )}
    //   </div>

    //   <ModalConfirmar
    //     pergunta="Realmente deseja alterar o status?"
    //     handleConfirmar={handleAlterarStatus}
    //     openModal={modal.status ?? false}
    //     setOpenModal={() => setModal({ status: false })}
    //   />

    //   <ModalConfirmar
    //     pergunta="Realmente deseja Estornar a consulta?"
    //     handleConfirmar={handleEstornarConsulta}
    //     openModal={modal.estornar ?? false}
    //     setOpenModal={() => setModal({ estornar: false })}
    //   />

    //   <ModalPosicao
    //     open={modal.alterarPosicao}
    //     onClose={() => setModal({ alterarPosicao: false })}
    //     handleConfirmarPosicao={handleConfirmarPosicao}
    //     posicao={data?.posicao}
    //   />
    // </div>
  );
}
