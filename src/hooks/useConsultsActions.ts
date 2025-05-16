
import { useState, useCallback, useRef, useEffect, useContext } from "react";
import { api } from "@/lib/axios/apiClient";
import { AuthContext } from "@/store/AuthContext";
import { useReactToPrint } from "react-to-print";
import { ajustarData } from "@/utils/ajusteData";
import pageStyle from "@/utils/pageStyle";
import { ConsultaProps, MedicoProps, EventProps } from "@/types/afapSaude";
import ListaConsultas from "@/Documents/afapSaude/listaConsultas";
import FichaConsulta from "@/Documents/afapSaude/fichaConsulta";
import { ReciboMensalidade } from "@/Documents/associado/mensalidade/Recibo";
import { toast } from "sonner";

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

export const statusList = [
  "AGENDADO",
  "AGUARDANDO DATA",
  "CONFIRMADO",
  "ATENDIDO",
  "CANCELADO",
  "RECEBIDO",
];

interface FilterProps{
  startDate:Date,
  endDate:Date,
  id_med?:number,
  status?:string,
  signal?:AbortSignal
}

interface UseConsultasProps {
  medicos: MedicoProps[];
  consultas: ConsultaProps[];
  setConsultas: (array: ConsultaProps[]) => void;
  events: EventProps[];
}

export const useConsultasActions = ({ medicos, consultas, setConsultas }: UseConsultasProps) => {
  const [data, setData] = useState<Partial<ConsultaProps>>();
  const [formPag, setFormPag] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { usuario } = useContext(AuthContext);

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

  const currentPage = useRef<HTMLDivElement|null>(null);
  const currentRecibo = useRef<HTMLDivElement|null>(null);
  const currentConsultas = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    modal.printProntuario && imprimirFicha();
    modal.printRecibo && imprimirRecibo();
    modal.printListaConsultas && imprimirConsultas();
  }, [modal.printProntuario, modal.printRecibo, modal.printListaConsultas]);

  const buscarConsultas = useCallback(
    async ({ startDate, endDate, id_med, status, signal }:FilterProps) => {
      const { dataIni, dataFim } = ajustarData(startDate, endDate);

      if (startDate > endDate) {
        toast.warning("Data inicial não pode ser maior que a data final");
        return;
      }

      try {
        setLoading(true);
        const response = await api.post(
          "/afapSaude/consultas",
          { startDate: dataIni, endDate: dataFim, id_med, status },
          { signal }
        );
        setConsultas(response.data);
        setModal((prev) => ({ ...prev, filtro: false }));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [setConsultas]
  );

  useEffect(() => {
    const controller = new AbortController();
    buscarConsultas({ startDate: new Date(), endDate: new Date(), status: undefined, signal: controller.signal });

    return () => controller.abort();
  }, [buscarConsultas]);

  const imprimirFicha = useReactToPrint({
    pageStyle,
    content: () => currentPage.current,
    onAfterPrint: () => setModal((prev) => ({ ...prev, printProntuario: false })),
  });

  const imprimirConsultas = useReactToPrint({
    pageStyle: `
      @page { size: landscape; margin: 1rem; }
      @media print { body { -webkit-print-color-adjust: exact; } }
    `,
    content: () => currentConsultas.current,
    onAfterPrint: () => setModal((prev) => ({ ...prev, printListaConsultas: false })),
  });

  const imprimirRecibo = useReactToPrint({
    pageStyle,
    content: () => currentRecibo.current,
    onBeforeGetContent: () => {
      if (!data?.id_consulta) {
        toast.warning("Selecione uma consulta");
        return Promise.reject();
      }
      if (data?.status !== "RECEBIDO") {
        toast.warning("Consulta não foi recebida!");
        return Promise.reject();
      }
      return Promise.resolve();
    },
    onAfterPrint: () => setModal((prev) => ({ ...prev, printRecibo: false })),
  });

  return {
    data,
    setData,
    modal,
    setModal,
    buscarConsultas,
    loading,
    formPag,
    setFormPag,
    imprimirFicha,
    imprimirConsultas,
    imprimirRecibo,
  };
};
