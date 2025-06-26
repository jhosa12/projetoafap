import { Label } from "@/components/ui/label";
import { TabsConsultaProps } from "./TabsConsulta";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from "date-fns/locale/pt-BR";
import { EventProps, MedicoProps } from "@/types/afapSaude";
import BuscarClienteModal from "@/components/modals/afapSaude/modalBuscaClientes";
import { Combobox } from "@/components/ui/combobox";
import { arrayDemandaExterna } from "@/utils/arrayDemandaExterna";

interface TabConsultaProps extends TabsConsultaProps {
  medicos: Array<MedicoProps>;
  events: Array<EventProps>;
}

export default function TabConsulta({
  register,
  control,
  watch,
  setValue,
  medicos,
  events,
}: TabConsultaProps) {
  const handleMedico = (event: string) => {
    setValue("id_med", Number(event));
    const medico = medicos.find((item) => item.id_med === Number(event));
    medico
      ? setValue("espec", `${medico?.nome}-(${medico?.espec})`)
      : setValue("espec", "");
    setValue("tipoDesc", "");
    setValue("vl_final", null);
    setValue("vl_consulta", null);
    setValue("vl_desc", null);
  };

  const selectMed = (e: string) => {
    if (e) {
      const evento = events.find((item) => item.id_agmed === Number(e));
      const medico = medicos.find((item) => item.id_med === evento?.id_med);

      setValue("id_agmed", Number(e) ?? null);
      setValue("data_prev", evento?.start ?? undefined);

      /* if (evento && medico)
            gerarIntervalos({ clientes: evento.clientes, start: evento.start, end: evento.end, time: medico.time })*/
    } else {
      setValue("id_agmed", null);
      setValue("data_prev", undefined);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <Label className="text-xs" htmlFor="espec">
          Especialista
        </Label>

        <Controller
          control={control}
          name="id_med"
          rules={{ required: "Especialista é obrigatório" }}
          render={({ field: { onChange, value } }) => (
            <Combobox
              disabled={
                watch("status") === "RECEBIDO" || watch("status") === "ATENDIDO"
              }
              items={
                medicos?.map((item) => ({
                  value: String(item.id_med),
                  label: `${item.nome}-${item.espec}`,
                })) ?? []
              }
              onChange={(e) => handleMedico(e ?? "")}
              value={String(value)}
              placeholder="Especialista"
              searchPlaceholder="Buscar especialista"
            />
          )}
        />
      </div>

      <div>
        <Label className="text-xs" htmlFor="small">
          Consulta/Data
        </Label>

        <Controller
          control={control}
          name="id_agmed"
          render={({ field: { onChange, value } }) => (
            <Select
              disabled={
                watch("status") === "RECEBIDO" || watch("status") === "ATENDIDO"
              }
              value={String(value)}
              onValueChange={selectMed}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Consulta/Data" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {events?.map(
                    (item, index) =>
                      item.id_med === Number(watch("id_med")) && (
                        <SelectItem
                          className="text-xs"
                          key={item.id_agmed}
                          value={String(item.id_agmed)}
                        >
                          {new Date(item.start).toLocaleDateString("pt-BR", {
                            timeZone: "UTC",
                          })}
                        </SelectItem>
                      )
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="col-span-1 flex flex-col justify-end">
        <Label className="text-xs mb-1" htmlFor="hora">
          Hora Prevista
        </Label>

        <Controller
          control={control}
          name="hora_prev"
          render={({ field: { onChange, value } }) => (
            <DatePicker
              id="hora"
              selected={value ? new Date(value) : null}
              onChange={(date) => date && onChange(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="HH:mm"
              timeFormat="HH:mm"
              className=" h-9 w-full text-sm  border border-gray-200 shadow-sm rounded-md"
            />
          )}
        />
      </div>

      <div>
        <Label className="text-xs" htmlFor="small">
          Buscar na residência ?
        </Label>

        <Controller
          control={control}
          name="buscar"
          render={({ field: { onChange, value } }) => (
            <Select value={value} onValueChange={(e) => onChange(e)}>
              <SelectTrigger className="">
                <SelectValue placeholder="" />
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="text-xs" value={"SIM"}>
                      SIM
                    </SelectItem>
                    <SelectItem className="text-xs" value={"NAO"}>
                      NÃO
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </SelectTrigger>
            </Select>
          )}
        />
      </div>

      <div>
        <Label className="text-xs" htmlFor="small">
          Retorno ?
        </Label>

        <Controller
          control={control}
          name="retorno"
          render={({ field: { onChange, value } }) => (
            <Select value={value} onValueChange={(e) => onChange(e)}>
              <SelectTrigger className="">
                <SelectValue placeholder="" />
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="text-xs" value={"SIM"}>
                      SIM
                    </SelectItem>
                    <SelectItem className="text-xs" value={"NAO"}>
                      NÃO
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </SelectTrigger>
            </Select>
          )}
        />
      </div>
      <div>
        <Label className="text-xs">Demanda Externa</Label>
        <Controller
          control={control}
          name="externo"
          rules={{ required: "Demanda Externa é obrigatória" }}
          render={({ field: { onChange, value } }) => (
            <Select value={value} onValueChange={(e) => onChange(e)}>
              <SelectTrigger className="">
                <SelectValue placeholder="" />
                <SelectContent>
                  <SelectGroup>
                    {arrayDemandaExterna.map((item) => (
                      <SelectItem className="text-xs" key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </SelectTrigger>
            </Select>
          )}
        />
      </div>
    </div>
  );
}
