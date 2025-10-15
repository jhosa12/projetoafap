import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Controller, useFormContext } from "react-hook-form";
import { ObitoProps } from "@/app/dashboard/servicos/_types/obito";
import { Textarea } from "@/components/ui/textarea";
import { MyErrorMessage } from "@/components/my-error-message";
import { DatePickerInput } from "@/components/DatePickerInput";

export const OSDadosServicos = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ObitoProps>();

  return (
    <div className="space-y-2">
      <Card className="bg-white border-gray-200 shadow-none ">
        <CardHeader>
          <CardTitle className="text-gray-900">Dados do Falecimento</CardTitle>
          <CardDescription className="text-gray-600">
            Informações sobre o falecimento
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="flex flex-col space-y-2">
            <Label htmlFor="end_data_falecimento">Data do Falecimento *</Label>
                 <Controller
            control={control}
            name="end_data_falecimento"
            render={({field})=>(
          <DatePickerInput
          onChange={field.onChange}
          value={field.value}
           className="h-9"
          />
            )}
            />
            <MyErrorMessage errors={errors} name="end_data_falecimento" />
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="end_hora_falecimento">Hora do Falecimento</Label>
            <Controller
              control={control}
              name="end_hora_falecimento"
              render={({ field }) => (
                <DatePickerInput
                onChange={field.onChange}
                value={field.value?new Date(field.value):undefined}
                showTimeSelect
                 showTimeSelectOnly
                 timeCaption="Time"
                 dateFormat="h:mm"
                 className="h-9"
                 
                />
              )}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="end_local_falecimento">Local do Falecimento</Label>
            <Input
              id="end_local_falecimento"
              {...register("end_local_falecimento")}
              placeholder="Hospital, residência, etc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dc_nome_medico">Nome do Médico</Label>
            <Input
              id="dc_nome_medico"
              {...register("dc_nome_medico")}
              placeholder="Dr. Nome do médico"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dc_crm">CRM</Label>
            <Input id="dc_crm" {...register("dc_crm")} placeholder="123456" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="dc_laudo_med">Causa da Morte</Label>
            <Textarea
              id="dc_laudo_med"
              {...register("dc_laudo_med")}
              placeholder="Descrição da causa da morte"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Serviços</CardTitle>
          <CardDescription className="text-gray-600">
            Informações sobre velório e sepultamento
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">


          <div className="space-y-2 col-span-2">
            <Label htmlFor="obs">Observações</Label>
            <Textarea
              id="obs"
              {...register("observacoes_gerais")}
              placeholder="Observações para a execução do serviço"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="local_velorio">Local do Velório</Label>
            <Input
              id="local_velorio"
              {...register("local_velorio")}
              placeholder="Nome da capela ou local"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="dt_velorio">Data do Velório</Label>

            <Controller
              control={control}
              name="dt_velorio"
              render={({ field }) => (
                <DatePickerInput
                  onChange={field.onChange}
                  value={field.value}
                   className="h-9"
                />
                 
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cemiterio">Cemitério</Label>
            <Input
              id="cemiterio"
              {...register("cemiterio")}
              placeholder="Nome do cemitério"
            />
          </div>
            <div className="space-y-2">
            <Label htmlFor="end_cemiterio">Cemitério</Label>
            <Input
              id="end_cemiterio"
              {...register("endereco_cemiterio")}
              placeholder="Endereço do cemitério"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="dt_sepultamento">Data do Sepultamento</Label>
            <Controller
              control={control}
              name="dt_sepultamento"
              render={({ field }) => (
                <DatePickerInput
                  onChange={field.onChange}
                  value={field.value}
                  className="h-9"
                />
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
