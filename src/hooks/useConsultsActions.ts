
import { toast } from "sonner";
import { api } from "@/lib/axios/apiClient";
import { ConsultaProps, FiltroConsultaProps } from "@/types/afapSaude";

interface UseConsultasActionsProps {
  data: Partial<ConsultaProps> | undefined;
  setData: (data: Partial<ConsultaProps>) => void;
  setModal: (modal: { [key: string]: boolean }) => void;
  usuario: any;
  consultas: ConsultaProps[];
  setConsultas: (consultas: ConsultaProps[]) => void;
  getValues: () => FiltroConsultaProps;
  buscarConsultas: (filtros: FiltroConsultaProps) => Promise<void>;
  formPag: string;
}

export function useConsultasActions({
  data,
  setData,
  setModal,
  usuario,
  consultas,
  setConsultas,
  getValues,
  buscarConsultas,
  formPag,
}: UseConsultasActionsProps) {






  
//Posicao ------------------POSICAO ---------------
 const handleConfirmarPosicao = async (novaPosicao: number) => {
    if (!data?.id_consulta) return;

    toast.promise(
      api.put(`/afapSaude/consultas/position/${data.id_consulta}/${novaPosicao}`),
      {
        loading: "Atualizando posição...",
        success: () => {
          buscarConsultas(getValues());
          setModal({ alterarPosicao: false });
          return "Posição atualizada com sucesso!";
        },
        error: "Erro ao atualizar posição",
      }
    );
  };



  //Estornar ------------------ESTORNAR CONSULTA ---------------
  const handleEstornarConsulta = async () => {
    if (!data?.id_consulta) return;
    if (data.status !== "RECEBIDO") {
      toast.warning("Consulta ainda não foi recebida");
      return;
    }

    toast.promise(
      api.put("/afapSaude/estornarConsulta", { id_consulta: data.id_consulta }),
      {
        loading: "Estornando consulta...",
        success: () => {
          buscarConsultas(getValues());
          setModal({ estornar: false });
          return "Consulta estornada com sucesso!";
        },
        error: "Erro ao estornar consulta",
      }
    );
  };

  //Alterar Status ------------------ALTERAR STATUS ---------------
  const handleAlterarStatus = async () => {
    if (!data?.data_prev) {
      toast.warning("Cliente ainda não agendou data!");
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
        loading: "Alterando status...",
        success: (res) => {
          const novas = [...consultas];
          const index = novas.findIndex(c => c.id_consulta === data?.id_consulta);
          if (index !== -1) novas[index] = res.data;
          setConsultas(novas);
          setModal({ status: false });
          setData({});
          return "Status alterado com sucesso";
        },
        error: "Erro ao alterar status",
      }
    );
  };

  //Receber consulta ------------------RECEBER CONSULTA ---------------
  const handleReceberConsulta = async () => {
    if (!data?.id_consulta) {
      toast.warning("Selecione uma consulta");
      return;
    }

    if (data.status === "RECEBIDO") {
      toast.warning("Consulta já foi recebida!");
      return;
    }

    if (data.status === "AGUARDANDO DATA") {
      toast.warning("Consulta ainda não foi agendada!");
      return;
    }

    if (!data.procedimentos?.length) {
      toast.warning("Defina os procedimentos realizados!");
      return;
    }

    if (!formPag) {
      toast.warning("Selecione uma forma de pagamento");
      return;
    }

    const dataAtual = new Date();
    dataAtual.setMinutes(dataAtual.getMinutes() - dataAtual.getTimezoneOffset());

    const valorTotal = data.procedimentos.reduce((total, item) => total + item.valorFinal, 0);

    toast.promise(
      api.put("/afapSaude/receberConsulta", {
        id_consulta: data.id_consulta,
        datalancUTC: dataAtual.toISOString(),
        descricao: "CONSULTA",
        historico: `CONSULTA.${data.id_consulta}-${data.nome}-${data.espec}`,
        valor: valorTotal,
        usuario: usuario?.nome,
        id_empresa: data.id_empresa,
      }),
      {
        loading: "Recebendo consulta...",
        success: () => {
          buscarConsultas(getValues());
          setModal({ receber: false });
          setData({});
          return "Consulta recebida com sucesso!";
        },
        error: "Erro ao receber consulta",
      }
    );
  };


//Deletar ------------------DELETAR CONSULTA ---------------
  const handleDeletar = async () => {
    if (!data?.id_consulta) {
      toast.warning("Selecione uma consulta");
      return;
    }

    if (data.status === "RECEBIDO") {
      toast.warning("Impossível deletar. Consulta já foi recebida!");
      return;
    }

    toast.promise(
      api.delete("/afapSaude/consultas/deletarCadastro", {
        data: { id_consulta: data.id_consulta },
      }),
      {
        loading: "Deletando dados...",
        success: () => {
          setConsultas(consultas.filter((c) => c.id_consulta !== data.id_consulta));
          setModal({ deletar: false });
          setData({});
          return "Consulta deletada com sucesso!";
        },
        error: "Erro ao deletar consulta",
      }
    );
  };

  return {
    handleEstornarConsulta,
    handleAlterarStatus,
    handleReceberConsulta,
    handleDeletar,
    handleConfirmarPosicao,
  };
}
