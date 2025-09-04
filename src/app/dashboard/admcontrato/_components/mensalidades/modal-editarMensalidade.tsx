import { GiReturnArrow } from "react-icons/gi";
import { AuthContext } from "@/store/AuthContext";
import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/lib/axios/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { removerFusoDate } from "@/utils/removerFusoDate";
import { MensalidadeProps } from "../../_types/mensalidades";

type FormValues = {
  id_mensalidade_global: number;
  id_mensalidade: number | null;
  referencia: string;
  vencimento: Date;
  cobranca: Date;
  valor_principal: number;
  status?: string;
  usuario?: string;
};

interface Props {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  mensalidade: Partial<MensalidadeProps>;
}

export function ModalEditarMensalidade({
  openModal,
  setOpenModal,
  mensalidade,
}: Props) {
  const { dadosassociado, permissoes, setarDadosAssociado, carregarDados } =
    useContext(AuthContext);
  const [confirm, setConfirm] = useState(false);
  const [motivoEstorno, setMotivoEstorno] = useState("");

  const form = useForm<FormValues>({
    defaultValues: {
      ...mensalidade,
      vencimento: mensalidade.vencimento,
      cobranca: mensalidade.cobranca,
      valor_principal: mensalidade.valor_principal || 0,
    },
  });

  // Update form when mensalidade prop changes
  useEffect(() => {
    if (mensalidade) {
      form.reset({
        ...mensalidade,
        vencimento: mensalidade.vencimento,
        cobranca: mensalidade.cobranca,
        valor_principal: mensalidade.valor_principal || 0,
      });
    }
  }, [mensalidade, form]);

  const handleEditar = async (data: FormValues) => {
    const {newDate:vencimento} = removerFusoDate(data.vencimento)
    const {newDate:cobranca} = removerFusoDate(data.cobranca)
    toast.promise(
      api.put("/mensalidade/editar", {
        id_mensalidade_global: data.id_mensalidade_global,
        cobranca: cobranca,
        vencimento: vencimento,
        valor_principal: data.valor_principal,
      }),
      {
        error: "Erro na tentativa de edição, consulte o TI",
        loading: "Realizando edição.....",
        success: () => {
          dadosassociado?.id_global && carregarDados(dadosassociado.id_global);
          setOpenModal(false);
          return "Edição efetuada com sucesso!";
        },
      }
    );
  };

  const onSubmit = (data: FormValues) => {
    handleEditar(data);
  };
  const handleEstorno = async () => {
    const formValues = form.getValues();
    const novoArray = [...(dadosassociado?.mensalidade || [])];
    const index = novoArray.findIndex(
      (item) => item.id_mensalidade === formValues.id_mensalidade
    );
    const mensalidadeProxima = novoArray[index + 1];

    if (mensalidadeProxima && mensalidadeProxima.status === "P") {
      toast.warning(
        "Impossível estornar, a próxima mensalidade se encontra paga!"
      );
      return;
    }
    if (!motivoEstorno) {
      toast.warning("Informe o motivo do estorno");
      return;
    }

  
    toast.promise(
      api.put("/mensalidade/estorno", {
        id_mensalidade: formValues.id_mensalidade,
        id_mensalidade_global: formValues.id_mensalidade_global,
        estorno_motivo: motivoEstorno,
      }),

      {
        error: "Erro na tentativa de estorno, consulte o TI",
        loading: "Realizando estorno.....",
        success: (response) => {
          novoArray[index] = response.data;
          setarDadosAssociado({ mensalidade: novoArray });
          setOpenModal(false);
          return "Estorno efetuado com sucesso!";
        },
      }
    );
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Editar Dados</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-4 gap-4 p-6 max-h-[68vh] overflow-y-auto">
              <FormField
                control={form.control}
                name="referencia"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="text-xs">REFERÊNCIA</FormLabel>
                    <FormControl>
                      <Input disabled className="h-9" {...field} placeholder="REFERÊNCIA" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vencimento"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="text-xs">VENCIMENTO</FormLabel>
                    <FormControl>
                      <DatePickerInput
                        className="h-9 w-full"
                        disabled={!permissoes.includes("ADM1.2.8")}
                        value={field.value}
                        
                        onChange={(date) => field.onChange(date)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cobranca"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="text-xs">COBRANÇA</FormLabel>
                    <FormControl>
                      <DatePickerInput
                        className="h-9 w-full"
                        disabled={!permissoes.includes("ADM1.2.9")}
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor_principal"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="text-xs">VALOR</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="VALOR PRINCIPAL"
                        className="h-9"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="text-xs">STATUS</FormLabel>
                    <FormControl>
                      <Input disabled className="h-9 font-bold" {...field} placeholder="STATUS" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usuario"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="text-xs">BAIXADA POR</FormLabel>
                    <FormControl>
                      <Input disabled className="h-9" {...field} placeholder="BAIXADA POR" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usuario"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="text-xs">AGENDADA POR</FormLabel>
                    <FormControl>
                      <Input disabled className="h-9" {...field} placeholder="AGENDADA POR" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="col-span-4 flex w-full gap-4 mt-4">
                <Button
                  type="submit"
                  disabled={
                    !permissoes.includes("ADM1.2.9") || form.watch("status") === "P"
                  }
                  className="flex-1"
                >
                  Salvar
                </Button>
                {form.watch("status") === "P" && (
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setConfirm(true)}
                  >
                    <GiReturnArrow className="mr-2" />
                    Estornar
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>

        <ModalConfirmar
          pergunta="Tem certeza que deseja estornar essa mensalidade?"
          openModal={confirm}
          setOpenModal={() => setConfirm(false)}
          handleConfirmar={() => handleEstorno()}
        >
          <Input
            value={motivoEstorno}
            onChange={(e) => setMotivoEstorno(e.target.value)}
            placeholder="MOTIVO"
            className="mt-4"
          />
        </ModalConfirmar>
      </DialogContent>
    </Dialog>
  );
}
