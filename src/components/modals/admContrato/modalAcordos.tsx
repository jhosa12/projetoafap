import { useEffect, useState } from "react";
import { api } from "@/lib/axios/apiClient";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { AcordoProps, MensalidadeProps } from "@/types/financeiro";
import { ConsultoresProps } from "@/types/consultores";
import { toast } from "sonner";

// Shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ajustarData } from "@/utils/ajusteData";

interface DadosAcordoProps {
  acordo: Partial<AcordoProps>;
  open: boolean;
  close: Function;

  mensalidades: Array<Partial<MensalidadeProps>>;
  id_contrato_global: number | null;
  id_global: number | null;
  id_empresa: string;
  id_contrato: number | undefined;
  id_associado: number | undefined;
  consultores: Array<Partial<ConsultoresProps>>;
  carregarDados: (id: number) => Promise<void>;
}
export function ModalAcordos({
  acordo,
  id_empresa,
  open,
  close,
  mensalidades,
  carregarDados,
  id_contrato_global,
  id_global,
  id_associado,
  id_contrato,
  consultores,
}: DadosAcordoProps) {
  const [mensalidadeSelect, setMensalidade] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm<AcordoProps>({
    defaultValues: {
      ...acordo,
      total_acordo:
        acordo.mensalidadeAcordo?.reduce(
          (acc, at) => acc + Number(at?.mensalidade?.valor_principal || 0),
          0
        ) || 0,
    },
  });

  const gatilho = watch("mensalidadeAcordo");

  useEffect(() => {
    const soma = gatilho?.reduce((acc, at) => {
      return acc + Number(at?.mensalidade?.valor_principal);
    }, 0);
    setValue("total_acordo", soma);
  }, [gatilho]);

  const handleRemove = async (id_mensalidade_global: number) => {
    if (acordo.id_acordo) {
      toast.promise(
        api.put(`/acordo/removerMensalidade`, {
          id_mensalidade: id_mensalidade_global,
          id_acordo: null,
        }),
        {
          loading: "Removendo...",
          success: async () => {
            id_global && (await carregarDados(id_global));
            const array = watch("mensalidadeAcordo") || [];
            const newArray = array.filter(
              (item) => item.mensalidade.id_mensalidade_global !== id_mensalidade_global
            );
            setValue("mensalidadeAcordo", newArray);

            return "Mensalidade removida com sucesso!";
          },
          error: "Erro ao remover mensalidade",
        }
      );
    }
    return;
  };

  const handleRemoverMensalidade = async (id_mensal_acordo?: number) => {

    if(!id_mensal_acordo){return}

     
      toast.promise(
       await api.put(`/acordo/removerMensalidade`, {
          id_mensal_acordo:id_mensal_acordo
        }),
        {
          loading: "Removendo...",
          success: async (response) => {
            id_global && (await carregarDados(id_global));
            const index = watch("mensalidadeAcordo")?.findIndex(
              (item) => item.id_mensal_acordo === id_mensal_acordo
            );
            if(index){
              const array = watch("mensalidadeAcordo") || [];
              const newArray = array.filter(
                (item) => item.id_mensal_acordo !== id_mensal_acordo
              );
              setValue("mensalidadeAcordo", newArray);
            }
            return "Mensalidade removida com sucesso!";
          },
          error: "Erro ao remover mensalidade",
        }
      );
  }

  const handleNovaRef = async () => {
    const mensalidade = mensalidades.find(
      (mensalidade) => mensalidade.id_mensalidade_global === mensalidadeSelect
    );

    const mensalidadeArray = watch("mensalidadeAcordo") || [];
    const isExists = mensalidadeArray?.some(
      (item) => item.mensalidade?.referencia === mensalidade?.referencia
    );
    if (isExists) {
      toast.info("Referência já inclusa no acordo!");
      return;
    }

    const array = watch("mensalidadeAcordo") || [];

    if (acordo.id_acordo) {
      toast.promise(
        api.put(`/acordo/removerMensalidade`, {
          id_mensalidade: mensalidade?.id_mensalidade_global,
          id_acordo: acordo.id_acordo,
        }),
        {
          loading: "Adicionando...",
          success: async (response) => {
            id_global && (await carregarDados(id_global));
           
            array.push(response.data);
            setValue("mensalidadeAcordo", array);
            return "Mensalidade adicionada com sucesso!";
          },
          error: "Erro ao adicionar mensalidade",
        }
      );

      return;
    }


    if (mensalidade) {
      const array = [...mensalidadeArray];
      array.push({mensalidade:mensalidade});
      array.sort(
        (a, b) =>
          Number(a.mensalidade.id_mensalidade_global) - Number(b.mensalidade.id_mensalidade_global)
      );
      setValue("mensalidadeAcordo", array);
    }
  };

  const handleConsultorSelect = (id_consultor: number) => {
    setValue("id_consultor", id_consultor);
    setValue(
      "realizado_por",
      consultores?.find((consultor) => consultor.id_consultor === id_consultor)
        ?.nome
    );
  };

  const onSubmit: SubmitHandler<AcordoProps> = (data) => {
    acordo.id_acordo ? editarAcordo(data) : criarAcordo(data);
  };

  const criarAcordo = async (data: AcordoProps) => {
    if (!data.data_fim || !data.descricao || !data.id_consultor) {
      toast.info("Preencha todos os campos!");
      return;
    }

    const {dataIni,dataFim} = ajustarData(new Date(),data.data_fim)

    const dt_criacao = new Date();
    const dt_prev = new Date();
    dt_criacao.setTime(
      dt_criacao.getTime() - dt_criacao.getTimezoneOffset() * 60 * 1000
    );
    dt_prev.setTime(
      dt_prev.getTime() - dt_prev.getTimezoneOffset() * 60 * 1000
    );

    toast.promise(
      api.post("/novoAcordo", {
        id_empresa,
        id_contrato_global,
        id_global,
        id_consultor: Number(data.id_consultor),
        status: "A",
        data_inicio: dt_criacao.toISOString(),
        data_fim: dataFim,
        total_acordo: Number(data.total_acordo),
        realizado_por: data.realizado_por,
        descricao: data.descricao,
        metodo: data.metodo,
        dt_criacao: new Date(),
        mensalidades: data.mensalidadeAcordo.map(item=>item.mensalidade),
        id_contrato: id_contrato,
        id_associado: id_associado,
      }),
      {
        error: "Erro na requisição",
        success: () => {
          id_global && carregarDados(id_global);
          close();
          return "Acordo criado com sucesso";
        },
        loading: "Criando acordo",
      }
    );
    //  toast.success("Acordo criado com sucesso")
  };

  async function editarAcordo(data: AcordoProps) {
    toast.promise(
      api.put("/editarAcordo", {
        id_acordo: data.id_acordo,
        //status:'A',
        //dt_pgto:new Date(),
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
        descricao: data.descricao.toUpperCase(),
        metodo: data.metodo,
        total_acordo: data.total_acordo,
        realizado_por: data.realizado_por,
        id_consultor: Number(data.id_consultor),
        //mensalidade:novasMensalidades
        //mensalidades:data.mensalidade
      }),
      {
        error: "Erro ao efetuar atualização",
        loading: "Efetuando atualização",
        success: "Atualização Efetuada com sucesso!",
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && close()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {acordo.id_acordo ? "Editar" : "Novo"} Acordo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                placeholder="Descrição do acordo"
                {...register("descricao", { required: "Campo obrigatório" })}
                className={errors.descricao && "border-destructive"}
              />
              {errors.descricao && (
                <p className="text-sm text-destructive">
                  {errors.descricao.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Consultor *</Label>
              <Controller
                name="id_consultor"
                control={control}
                rules={{ required: "Selecione um consultor" }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(Number(value));
                      handleConsultorSelect(Number(value));
                    }}
                    value={field.value?.toString() || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um consultor" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultores?.map((consultor) => (
                        <SelectItem
                          key={consultor.id_consultor}
                          value={consultor.id_consultor?.toString() || ""}
                        >
                          {consultor.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.id_consultor && (
                <p className="text-sm text-destructive">
                  {errors.id_consultor.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Data de Início</Label>
              <Controller
                name="data_fim"
                control={control}
                render={({ field }) => (
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-9 justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(new Date(field.value), "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        locale={ptBR}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Método de Pagamento</Label>
              <Input
                placeholder="Ex: Boleto, PIX, Cartão"
                {...register("metodo")}
              />
            </div>

            <div className="space-y-2">
              <Label>Total do Acordo</Label>
              <div className="flex items-center h-10 px-3 py-2 text-sm border rounded-md bg-muted">
                {watch("total_acordo")?.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Mensalidades do Acordo</h4>
              <div className="flex space-x-2">
                <Select
                  value={mensalidadeSelect?.toString() || ""}
                  onValueChange={(value) => setMensalidade(Number(value))}
                >
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Selecione uma mensalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {mensalidades
                      ?.filter(
                        (m) => !m.id_acordo || m.id_acordo === acordo.id_acordo
                      )
                      .map((mensalidade) => (
                        <SelectItem
                          key={mensalidade.id_mensalidade_global}
                          value={
                            mensalidade.id_mensalidade_global?.toString() || ""
                          }
                        >
                          {mensalidade.referencia} -{" "}
                          {mensalidade.valor_principal?.toLocaleString(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                            }
                          )}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={handleNovaRef}
                  disabled={!mensalidadeSelect}
                >
                  Adicionar
                </Button>
              </div>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referência</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Pag.</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {watch("mensalidadeAcordo")?.map((item) => (
                    <TableRow key={item.mensalidade.id_mensalidade_global}>
                      <TableCell className="text-xs">{item.mensalidade.referencia}</TableCell>
                      <TableCell className="text-xs">
                        {item.mensalidade.vencimento &&
                          new Date(item.mensalidade.vencimento).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-xs">
                        {Number(item.mensalidade.valor_principal).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell className="text-xs">{item.mensalidade.status}</TableCell>
                      <TableCell className="text-xs">
                        {item.mensalidade.data_pgto &&
                          new Date(item.mensalidade.data_pgto).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right ">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoverMensalidade(item.id_mensal_acordo)
                          }
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!watch("mensalidadeAcordo") ||
                    watch("mensalidadeAcordo")?.length === 0) && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Nenhuma mensalidade adicionada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => close()}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
