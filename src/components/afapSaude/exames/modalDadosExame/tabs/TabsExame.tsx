import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { EventProps, ExameRealizadoProps, ExamesProps, MedicoProps } from "@/types/afapSaude";
import { Dispatch, SetStateAction } from "react";
import TabDadosClienteExame from "./TabDadosCliente";
import TabDadosExames from "./TabDadosExames";


export interface TabsFormExameProps {
    register: UseFormRegister<ExameRealizadoProps>;
    control: Control<ExameRealizadoProps>;
    watch: UseFormWatch<ExameRealizadoProps>;
    setValue: UseFormSetValue<ExameRealizadoProps>;
}

export interface ComponentTabExameProps extends TabsFormExameProps {
   
     exames: Array<ExamesProps>;
 
}

export default function TabsExames({ register, control, watch, setValue,exames }: ComponentTabExameProps) {
  return (
    <Tabs defaultValue="dados">
      <TabsList className="mb-4 grid w-full grid-cols-2">
        <TabsTrigger value="dados">Dados Cliente</TabsTrigger>
        <TabsTrigger value="exames">Exames</TabsTrigger>
      </TabsList>

      <TabsContent  forceMount className="hidden data-[state=active]:flex flex-col gap-4" value="dados">
        <TabDadosClienteExame register={register} control={control} watch={watch} setValue={setValue} />
      </TabsContent>
      
      <TabsContent   forceMount className="hidden data-[state=active]:flex flex-col gap-4" value="exames">
        <TabDadosExames exames={exames}  register={register} control={control} watch={watch} setValue={setValue} />
      </TabsContent>
    </Tabs>
  );
}
