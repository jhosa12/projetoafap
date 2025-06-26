

import { Button } from "@/components/ui/button";
import { ConsultaProps, EventProps, MedicoProps } from "@/types/afapSaude";
import TabsConsulta from "./tabsModalConsulta/TabsConsulta";
import { ErrorIndicator } from "@/components/errorIndicator";
import {  useState } from "react";
import { ModalBusca } from "@/components/modals/modalBusca/modalBusca";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ModalBuscaConsulta from "./ModalBuscaConsulta";
import { useModalConsultaForm } from "@/hooks/afapSaude/useModalConsultaForm";

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
  id_empresa:string|undefined
  empresa?:string
  
}

export function ModalConsulta({
  openModal,
  setOpenModal,
  medicos,
  id_empresa,
  consulta,
  buscarConsultas,
  consultas,
  setConsulta,
  events,
  setConsultas,
  verifyPermission,
  empresa
}: DataProps) {
  const [search, setSearch] = useState(false);
 

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    control,
    errors,
    onSubmit,
    buscarPlano,
    reset,
  } = useModalConsultaForm({
    consulta,
    setConsulta,
    consultas,
    setConsultas,
    buscarConsultas,
    setOpenModal,
    events,
    id_empresa,
  });


  return (
    <Dialog open={openModal} onOpenChange={() => setOpenModal(false)}>
      <DialogContent className="sm:max-w-[calc(100vw-20rem)]">
        <DialogHeader>
          <div className="inline-flex gap-8 items-center">
          <DialogTitle >
            ADMINISTRAR CONSULTA - ({empresa})
            {/* <ClienteModal />*/}
          </DialogTitle>
            {!consulta.id_consulta && <ModalBuscaConsulta reset={reset}/>}
          </div>
          
          <DialogDescription>
            {consulta?.id_consulta ? "Editar" : "Cadastrar"}
            
          </DialogDescription>

          
        </DialogHeader>

        <form
          className="flex flex-col w-full gap-2"
         onSubmit={handleSubmit(onSubmit)}
        >
          <TabsConsulta
            events={events}
            medicos={medicos}
            setSearch={setSearch}
            register={register}
            control={control}
            watch={watch}
            setValue={setValue}
            verifyPermission={verifyPermission}
          />
          <Button  disabled={verifyPermission(consulta?.id_consulta ? "AFS3.2" : "AFS3.1")} variant={"default"} className="ml-auto" type="submit">
            {consulta?.id_consulta ? "Atualizar" : "Cadastrar"}
          </Button>
          <ErrorIndicator errors={errors} />
        </form>

        <ModalBusca
          carregarDados={buscarPlano}
          selectEmp="63b930b9-503b-4fb1-9a60-7d2d0f5c85b8"
          setVisible={() => setSearch(false)}
          visible={search}
        />
      </DialogContent>
    </Dialog>
  );
}
