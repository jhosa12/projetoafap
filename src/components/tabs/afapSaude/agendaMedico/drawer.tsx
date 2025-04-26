import { MdEvent } from "react-icons/md";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "react-datepicker";
import pt from "date-fns/locale/pt-BR";
import { api } from "@/lib/axios/apiClient";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { EventProps, MedicoProps } from "@/types/afapSaude";
import { toast } from "sonner";
import { useEffect } from "react";

interface DrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  arrayMedicos: Array<MedicoProps>;
  dataEvent: Partial<EventProps>;
  setArrayEvent: (array: Array<EventProps>) => void;
  events: Array<EventProps>;
  deletarEvento: () => Promise<void>;
}

export function ModalDrawer({
  events,
  setArrayEvent,
  isOpen,
  toggleDrawer,
  arrayMedicos,
  dataEvent,
  deletarEvento,
}: DrawerProps) {
  const { register, handleSubmit, setValue, control, watch,reset } =
    useForm<EventProps>({
      defaultValues: {
        ...dataEvent,
        end: dataEvent.id_agmed ? dataEvent.end : dataEvent.start,
      },
    });

    useEffect(() => {
      if (dataEvent) {
        reset({
          ...dataEvent,
          end: dataEvent.id_agmed ? dataEvent.end : dataEvent.start,
          start: dataEvent.start ? dataEvent.start : undefined,
        });
      }
    }, [dataEvent, reset]);

  const handleEvento: SubmitHandler<EventProps> = (data) => {
    if (data.id_agcli || data.id_agmed) editarEvento(data);
    else novoEvento(data);
  };

  const novoEvento = async (data: EventProps) => {
    if (
      !data.status ||
      !data.id_med ||
      !data.title ||
      !data.start ||
      !data.end
    ) {
      toast.info("Preencha todos os campos obrigatórios!");
      return;
    }
    if (new Date(data.end) <= new Date(data.start)) {
      toast.info("Data final deve ser maior que a data inicial");
      return;
    }

    toast.promise(
      api.post("/agenda/novoEvento", {
        id_med: Number(data.id_med),
        data: new Date(),
        start: data.start,
        end: data.end,
        title: data.title,
        status: data.status,
        obs: data.obs,
        tipoAg: data.tipoAg,
      }),
      {
        error: "Erro na requisição",
        loading: "Gerando Evento...",
        success: (res) => {
          const novo = [...events, res.data].map((item) => ({
            ...item,
            start: item.start ? new Date(item.start) : new Date(),
            end: item.end ? new Date(item.end) : new Date(),
          }));
          setArrayEvent(novo);
          toggleDrawer();
          return "Evento gerado com sucesso";
        },
      }
    );
  };

  const editarEvento = async (data: EventProps) => {
    if (new Date(data.end) <= new Date(data.start)) {
      toast.info("Data final deve ser maior que a data inicial");
      return;
    }
    if (
      !watch("status") ||
      !dataEvent.id_med ||
      !dataEvent.start ||
      !dataEvent.end
    ) {
      toast.info("Preencha todos os campos obrigatórios!");
      return;
    }

    toast.promise(
      api.put("/agenda/editarEvento", {
        id_agmed: Number(data.id_agmed),
        id_med: Number(data.id_med),
        start: data.start,
        end: data.end,
        title: data.title,
        status: data.status,
        obs: data.obs,
      }),
      {
        error: "Erro na requisição",
        loading: "Editando Evento...",
        success: (res) => {
          const novo = events
            .map((ev) => (ev.id_agmed === dataEvent.id_agmed ? res.data : ev))
            .map((item) => ({
              ...item,
              start: item.start ? new Date(item.start) : new Date(),
              end: item.end ? new Date(item.end) : new Date(),
            }));
          setArrayEvent(novo);
          toggleDrawer();
          return "Evento editado com sucesso";
        },
      }
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleDrawer}>
      <SheetContent side={"right"} className="bg-white px-10 sm:max-w-2xl ">
        <SheetHeader className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <MdEvent size={32} />
            <SheetTitle>Novo Evento</SheetTitle>
          </div>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(handleEvento)}
          className="flex flex-col gap-6 mt-4"
        >
          {/* Seleção de Médico */}
          <div>
            <Label htmlFor="medico">Especialista</Label>
            <Controller
              control={control}
              name="id_med"
              render={({ field }) => (
                <Select
                  value={String(field.value)}
                  onValueChange={(value) => {
                    const sel = arrayMedicos.find(
                      (m) => m.id_med.toString() === value
                    );
                    if (sel) {
                      setValue("id_med", sel.id_med);
                      setValue("title", `${sel.nome}-(${sel.espec})`);
                    }
                  }}
                >
                  <SelectTrigger id="medico" className="w-full">
                    <SelectValue placeholder="Selecione o especialista" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {arrayMedicos.map((item) => (
                        <SelectItem
                          key={item.id_med}
                          value={item.id_med.toString()}
                        >
                          <div className="inline-flex items-center gap-2">
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL}/file/${item.imageUrl}`}
                              alt={item.nome}
                              className="w-6 h-6 rounded-full"
                            />
                            {item.nome} ({item.espec})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ABERTO">ABERTO</SelectItem>
                    <SelectItem value="CANCELADO">CANCELADO</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Datas */}
          <div className=" flex flex-row gap-4">
            <div className="flex flex-col gap-1 w-full">
              <Label>Data Inicial</Label>
              <Controller
                control={control}
                name="start"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    selected={value}
                    onChange={(d) => d && onChange(d)}
                    showTimeSelect
                    dateFormat="Pp"
                    locale={pt}
                    className="w-full  rounded-md border border-gray-300 h-9 px-3 py-2"
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Label>Data Final</Label>
              <Controller
                control={control}
                name="end"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    selected={value}
                    onChange={(d) => d && onChange(d)}
                    showTimeSelect
                    dateFormat="Pp"
                    locale={pt}
                    className="w-full z-50 rounded-md border h-9 border-gray-300 px-3 py-2"
                  />
                )}
              />
            </div>
          </div>

          {/* Observação */}
          <div>
            <Label htmlFor="obs">Observação</Label>
            <Textarea id="obs" rows={4} {...register("obs")} className="mt-1" />
          </div>

          {/* Botões */}
          <div className="flex gap-4 mt-4">
            {dataEvent.id_agcli && dataEvent.id_agmed ? (
              <>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={deletarEvento}
                >
                  Deletar
                </Button>
                <Button type="submit" variant="outline" className="flex-1">
                  Editar Evento
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={toggleDrawer}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                 { dataEvent.id_agmed ? 'Editar Evento' : 'Salvar Evento'}
                </Button>
              </>
            )}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
