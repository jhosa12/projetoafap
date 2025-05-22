import { Modal } from "flowbite-react";
import { api } from "@/lib/axios/apiClient";
import { SubmitHandler, useForm } from "react-hook-form";
import { valorInicial } from "./consultas";
import { ajustarData } from "@/utils/ajusteData";
import { Button } from "@/components/ui/button";
import { ConsultaProps, EventProps, MedicoProps } from "@/types/afapSaude";
import { removerFusoDate } from "@/utils/removerFusoDate";
import { toast } from "sonner";
import TabsConsulta from "./tabsConsulta/TabsConsulta";
import { ErrorIndicator } from "@/components/errorIndicator";
import { useEffect, useState } from "react";
import { ModalBusca } from "@/components/modals/modalBusca/modalBusca";
import { error } from "console";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DataProps {
  openModal: boolean;
  setOpenModal: (toogle: boolean) => void;
  medicos: Array<MedicoProps>;
  consultas: Array<ConsultaProps>;
  consulta: Partial<ConsultaProps>;
  buscarConsultas: () => void;
  setConsultas: (array: Array<ConsultaProps>) => void;
  setConsulta: (consulta: Partial<ConsultaProps>) => void;
  events: Array<EventProps>;
  verifyPermission: (permission: string) => boolean
  
}

export function ModalConsulta({
  openModal,
  setOpenModal,
  medicos,
  consulta,
  buscarConsultas,
  consultas,
  setConsulta,
  events,
  setConsultas,
  verifyPermission
}: DataProps) {
  const [search, setSearch] = useState(false);
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

  const handleOnSubmit: SubmitHandler<ConsultaProps> = (data) => {
    data.id_consulta ? handleEditarConsulta(data) : handleCadastrar(data);
  };

  const handleEditarConsulta = async (data: ConsultaProps) => {
    let dataInit = undefined;

    if (data?.id_agmed) {
      const dataNova = events.find(
        (item) => item.id_agmed === data?.id_agmed
      )?.start;
      const { dataIni, dataFim } = ajustarData(dataNova, undefined);
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
          const index = consultas.findIndex(
            (item) => item.id_consulta === data?.id_consulta
          );
          if (index !== -1) {
            novo[index] = { ...novo[index], ...response.data }; // Mantém a referência original, apenas atualiza os valores
          }

          const consultasOrdenadas = [...novo].sort((a, b) => {
            const dataA = a.hora_prev
              ? new Date(a.hora_prev).getTime()
              : Infinity; // Se for null, vai para o final
            const dataB = b.hora_prev
              ? new Date(b.hora_prev).getTime()
              : Infinity;

            return dataA - dataB;
          });

          setConsultas(consultasOrdenadas);
          //buscarConsultas({startDate:new Date(),endDate:new Date(),id_med:undefined,status:undefined,buscar:undefined})
          setConsulta(valorInicial);
          setOpenModal(false);

          return "Dados alterados com sucesso!";
        },
      }
    );
  };

  const handleCadastrar = async (data: ConsultaProps) => {
    //const { dataIni, dataFim } = ajustarData(data.data_prev, data.data_prev)
    const { newDate } = removerFusoDate(data.data_prev);
    const { newDate: dataAtual } = removerFusoDate(new Date());
    const { newDate: nasc } = removerFusoDate(data.nascimento);

    toast.promise(
      api.post("/afapSaude/consultas/cadastro", {
        ...data,
        data: dataAtual,
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

  const handleSearchPlano = async (id: number) => {
    toast.promise(api.post("/afapSaude/plano/busca", { id_plano: id }), {
      error: (error: any) =>
        error?.response?.data?.error ?? "Erro ao buscar plano",
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

  return (
    <Dialog open={openModal} onOpenChange={() => setOpenModal(false)}>
      <DialogContent className="sm:max-w-[calc(100vw-20rem)]">
        <DialogHeader>
          <DialogTitle>
            ADMINISTRAR CONSULTA
            {/* <ClienteModal />*/}
          </DialogTitle>
          <DialogDescription>
            {consulta?.id_consulta ? "Editar" : "Cadastrar"}
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col w-full gap-2"
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          <TabsConsulta
            events={events}
            medicos={medicos}
            setSearch={setSearch}
            register={register}
            control={control}
            watch={watch}
            setValue={setValue}
          />
          <Button  disabled={verifyPermission(consulta?.id_consulta ? "AFS3.2" : "AFS3.1")} variant={"default"} className="ml-auto" type="submit">
            {consulta?.id_consulta ? "Atualizar" : "Cadastrar"}
          </Button>
          <ErrorIndicator errors={errors} />
        </form>

        <ModalBusca
          carregarDados={handleSearchPlano}
          selectEmp="63b930b9-503b-4fb1-9a60-7d2d0f5c85b8"
          setVisible={() => setSearch(false)}
          visible={search}
        />
      </DialogContent>
    </Dialog>
  );
}
