import { api } from "@/lib/axios/apiClient";
import { ConsultaProps, EventProps } from "@/types/afapSaude";
import { ajustarData } from "@/utils/ajusteData";
import { removerFusoDate } from "@/utils/removerFusoDate";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

interface UseModalConsultaFormProps {
  consulta: Partial<ConsultaProps>;
  setConsulta: (consulta: Partial<ConsultaProps>) => void;
  consultas: Array<ConsultaProps>;
  setConsultas: (consultas: Array<ConsultaProps>) => void;
  buscarConsultas: () => void;
  setOpenModal: (toggle: boolean) => void;
  events: Array<EventProps>;
  id_empresa: string | undefined;
}


export function useModalConsultaForm({
     consulta,
  setConsulta,
  consultas,
  setConsultas,
  buscarConsultas,
  setOpenModal,
  events,
  id_empresa 
}:UseModalConsultaFormProps){
     const {
    register,
    setValue,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<ConsultaProps>();



    useEffect(() => {
      reset(consulta);
    }, [consulta, reset]);

    const onSubmit: SubmitHandler<ConsultaProps> = (data) => {
    data.id_consulta ? editarConsulta(data) : cadastrarConsulta(data);
  };

  const editarConsulta = async (data: ConsultaProps) => {
    let dataInit;

    if (data.id_agmed) {
      const dataNova = events.find((item) => item.id_agmed === data.id_agmed)?.start;
      const { dataIni } = ajustarData(dataNova, undefined);
      dataInit = dataIni;
    }

    toast.promise(
      api.put("/afapSaude/consultas/Editarcadastro", {
        ...data,
        data_prev: data?.id_agmed ? dataInit : null,
        status: !data.id_agmed
          ? "AGUARDANDO DATA"
          : data?.id_agmed !== consulta.id_agmed && data.id_agmed
          ? "AGENDADO"
          : data?.status,
        nome: data?.nome?.toUpperCase(),
      }),
      {
        error: "Erro ao editar dados",
        loading: "Alterando dados .....",
        success: (response) => {
          const novo = [...consultas];
          const index = novo.findIndex((item) => item.id_consulta === data.id_consulta);
          if (index !== -1) {
            novo[index] = { ...novo[index], ...response.data };
          }

          const ordenadas = [...novo].sort((a, b) => {
            const dateA = a.hora_prev ? new Date(a.hora_prev).getTime() : Infinity;
            const dateB = b.hora_prev ? new Date(b.hora_prev).getTime() : Infinity;
            return dateA - dateB;
          });

          setConsultas(ordenadas);
          setConsulta({} as ConsultaProps);
          setOpenModal(false);
          return "Dados alterados com sucesso!";
        },
      }
    );
  };

  const cadastrarConsulta = async (data: ConsultaProps) => {
    const { newDate } = removerFusoDate(data.data_prev);
    const { newDate: dataAtual } = removerFusoDate(new Date());
    const { newDate: nasc } = removerFusoDate(data.nascimento);

    toast.promise(
      api.post("/afapSaude/consultas/cadastro", {
        ...data,
        data: dataAtual,
        id_empresa,
        nascimento: nasc,
        data_prev: newDate,
        numero: data.numero ? Number(data.numero) : undefined,
      }),
      {
        error: "Erro ao Cadastrar Dados",
        loading: "Cadastrando Consulta.....",
        success: () => {
          buscarConsultas();
          setOpenModal(false);
          return "Consulta Cadastrada com sucesso";
        },
      }
    );
  };

  const buscarPlano = async (id: number) => {
    toast.promise(api.post("/afapSaude/plano/busca", { id_plano: id }), {
      error: (err: any) => err?.response?.data?.error ?? "Erro ao buscar plano",
      loading: "Buscando plano....",
      success: (response) => {
        setValue("id_contrato", response.data.id_contrato);
        setValue("nome_associado", response.data.nome_associado);
        setValue("id_global", response.data.id_global);
        setValue("id_empContrato", response.data.id_empContrato);
        setValue("tipoDesc", "PLANO");
        return "Plano localizado";
      },
    });
  };

   return {
    register,
    setValue,
    handleSubmit,
    watch,
    control,
    errors,
    onSubmit,
    buscarPlano,
    reset,
  };

}