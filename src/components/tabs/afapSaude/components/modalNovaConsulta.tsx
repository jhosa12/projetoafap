import {Modal} from "flowbite-react";
import { useState } from "react";
import { api } from "@/lib/axios/apiClient";
import {  SubmitHandler, useForm } from "react-hook-form";
import { valorInicial } from "../consultas";
import { ajustarData } from "@/utils/ajusteData";
import { Button } from "@/components/ui/button";
import {
  ConsultaProps,
  EventProps,
  MedicoProps,
} from "@/types/afapSaude";
import { removerFusoDate } from "@/utils/removerFusoDate";
import { toast } from "sonner";
import TabsConsulta from "../tabsConsulta/TabsConsulta";
import { ClienteModal } from "./modalNovoCliente";

interface DataProps {
  openModal: boolean;
  setOpenModal: (toogle: boolean) => void;
  medicos: Array<MedicoProps>;
  consultas: Array<ConsultaProps>;
  consulta: Partial<ConsultaProps>;
  buscarConsultas: ()=>void
  setConsultas: (array: Array<ConsultaProps>) => void;
  setConsulta: (consulta: Partial<ConsultaProps>) => void;
  events: Array<EventProps>;
  // usuario?: string
  // id_usuario?: string
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
}: DataProps) {
  
  const [visible, setvisible] = useState(false);
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<ConsultaProps>({ defaultValues: consulta });


  const handleOnSubmit: SubmitHandler<ConsultaProps> = (data) => {
    data.id_consulta ? handleEditarConsulta(data) : handleCadastrar(data);
  };

  const handleEditarConsulta = async (data: ConsultaProps) => {
    let dataInit = undefined;
    if (data?.id_agmed && data?.id_agmed !== consulta.id_agmed) {
      const { dataIni, dataFim } = ajustarData(data.data_prev, undefined);
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
    const { newDate:dataAtual } = removerFusoDate(new Date());
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

  return (
    <Modal
      theme={{
        content: {
          base: "relative h-full w-full p-4 md:h-auto",
          inner:
            "relative flex max-h-[94dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700",
        },
      }}
      show={openModal}
      size="5xl"
      popup
      onClose={() => setOpenModal(false)}
    >
      <Modal.Header>
        <div className="inline-flex gap-4 ml-3 items-center text-sm">
          ADMINISTRAR CONSULTA
         {/* <ClienteModal />*/}
        </div>
      </Modal.Header>
      <Modal.Body>
        <form
          className="flex flex-col w-full gap-2"
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          <TabsConsulta
            events={events}
            medicos={medicos}
            register={register}
            control={control}
            watch={watch}
            setValue={setValue}
          />
          <Button variant={"default"} className="ml-auto" type="submit">
            {consulta?.id_consulta ? "Atualizar" : "Cadastrar"}
          </Button>
          {Object.keys(errors).length > 0 && (
            <ul className="bg-red-100 p-2 inline-flex gap-2 flex-wrap rounded-sm border border-red-300">
              {Object.entries(errors).map(([field, error]) => {
                const msg = (error as { message?: string })?.message;
                return msg ? (
                  <li key={field} className="text-red-600 text-xs">
                    {msg}
                  </li>
                ) : null;
              })}
            </ul>
          )}
        </form>
      </Modal.Body>
    
    </Modal>
  );
}
