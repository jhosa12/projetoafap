import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabDadosPaciente from "./TabDadosPaciente";
import TabConsulta from "./TabConsulta";
import TabProcedimentos from "./TabProcedimentos";
import { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ConsultaProps, EventProps, MedicoProps } from "@/types/afapSaude";


export interface TabsConsultaProps {
    register: UseFormRegister<ConsultaProps>;
    control: Control<ConsultaProps>;
    watch: UseFormWatch<ConsultaProps>;
    setValue: UseFormSetValue<ConsultaProps>;
}

interface ComponentTabProps extends TabsConsultaProps{
    medicos:Array<MedicoProps>
    events:Array<EventProps>
}

export default function TabsConsulta({ register, control, watch, setValue,events,medicos }: ComponentTabProps) {
  return (
    <Tabs defaultValue="dados">
      <TabsList className="mb-4">
        <TabsTrigger value="dados">Dados Paciente</TabsTrigger>
        <TabsTrigger value="consulta">Consulta</TabsTrigger>
        <TabsTrigger value="procedimentos">Procedimentos</TabsTrigger>
      </TabsList>

      <TabsContent  forceMount className="hidden data-[state=active]:flex flex-col gap-4" value="dados">
        <TabDadosPaciente register={register} control={control} watch={watch} setValue={setValue} />
      </TabsContent>
      
      <TabsContent   forceMount className="hidden data-[state=active]:flex flex-col gap-4" value="consulta">
        <TabConsulta events={events} medicos={medicos}  register={register} control={control} watch={watch} setValue={setValue} />
      </TabsContent>
      <TabsContent  forceMount className="hidden data-[state=active]:flex flex-col gap-4" value="procedimentos">
        <TabProcedimentos medicos={medicos} register={register} control={control} watch={watch} setValue={setValue} />
      </TabsContent>
    </Tabs>
  );
}
