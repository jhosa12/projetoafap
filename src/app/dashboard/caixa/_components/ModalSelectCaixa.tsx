import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { api } from "@/lib/axios/apiClient";
import { toast } from "sonner";
import { Combobox } from "../../../../components/ui/combobox";
import { DatePickerInput } from "../../../../components/DatePickerInput";
import pt from "date-fns/locale/pt-BR";
import { registerLocale } from "react-datepicker";
import { BiCalendarMinus } from "react-icons/bi";
import { Button } from "../../../../components/ui/button";
import { ajustarData } from "@/utils/ajusteData";

registerLocale("pt", pt);

import { EmpresaProps } from "@/types/empresa";
import { useReactToPrint } from "react-to-print";
import { pageStyle } from "@/utils/pageStyle";
import RelatorioMovimentacao from "../_documents/relatorioMovimentacao";
import { LancamentosProps } from "../_types/types";
import { SomaProps } from "../../financeiro/_components/tabs/caixa/caixa";
import { CcustosProps, PlanoContasProps } from "../../financeiro/_types/types";

interface FilterCaixaProps {
  caixa: string;
  conta?: string;
  start: Date;
  end: Date;
}

interface ModalPropsRelatorios {
  id_empresa: string;
  infoEmpresa: EmpresaProps | null;
  planoContas: Array<PlanoContasProps>;
}

export default function ModalSelectCaixa({
  id_empresa,
  infoEmpresa,
  planoContas,
}: ModalPropsRelatorios) {
  const [open, setOpen] = useState(false);
  const currentPage = useRef<HTMLDivElement | null>(null);
  const [ccustos, setCcustos] = useState<Array<CcustosProps>>([]);
  const { control, handleSubmit, watch } = useForm<FilterCaixaProps>({
    defaultValues: {
      start: new Date(),
      end: new Date(),
    },
  });
  const [data, setData] = useState<Array<LancamentosProps>>([]);

  useEffect(() => {
    if (data.length > 0) {
      ImprimirRelatorio();
    }
  }, [data]);

  const ImprimirRelatorio = useReactToPrint({
    pageStyle: pageStyle,
    contentRef: currentPage,
    onAfterPrint: () => {},
    onBeforePrint: async () => {
      setData([]);
      setOpen(false);
    },
    //  removeAfterPrint:false
  });

  const handleReqCcustos = async () => {
    try {
      const response = await api.get("/financeiro/caixa/listarCcustos");

      setCcustos(response.data);
    } catch (error) {
      toast.error("Erro ao carregar plano de contas.");
    }
  };

  const listarLancamentos: SubmitHandler<FilterCaixaProps> = useCallback(
    async (data) => {
      if (data.start > data.end) {
        toast.info("Data final deve ser maior que a data inicial");
        return;
      }

      const { dataIni, dataFim } = ajustarData(data.start, data.end);
      try {
        //  setLoading(true);
        const response = await api.post("/relatorioCaixa", {
          id_empresa,
          startDate: dataIni,
          endDate: dataFim,
          ccusto: data.caixa,
          // id_user:usuario?.id
        });

        setData(response.data);
        // setLancamentos(lista)
        // setPlanos(plano_de_contas)
        // setGrupos(grupos)
        // setFechado(fechamento)
      } catch (err) {
        console.log(err);
      }

      ///setLoading(false);
    },
    [id_empresa]
  );

  const handleGerirRelatorio = useCallback(() => {
    return data.reduce(
      (acumulador, atual) => {
        const valor = Number(atual.valor);

        if (atual.tipo === "RECEITA")
          switch (atual?.mensalidade?.form_pagto) {
            case "PIX":
              acumulador.pix += valor;
              break;
            case "BOLETO":
              acumulador.boleto += valor;
              break;
            case "CARTAO":
            case "CARTÃO CREDITO":
            case "CARTÃO DEBITO":
              acumulador.cartao += valor;
              break;
            case "DINHEIRO":
            case "":
              acumulador.dinheiro += valor;
              break;
            default:
              break; // Adicione uma ação padrão se necessário
          }

        if (atual.tipo === "DESPESA") {
          acumulador.despesas += valor;
        }
        if (atual.tipo === "RECEITA") {
          acumulador.total += valor;
        }

        return acumulador;
      },
      {
        pix: 0,
        boleto: 0,
        cartao: 0,
        dinheiro: 0,
        deposito: 0,
        total: 0,
        transferencia: 0,
        despesas: 0,
      } as SomaProps
    );
  }, [data]);

  useEffect(() => {
    handleReqCcustos();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-sm px-2">Relatório</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Relatório de Caixa</DialogTitle>
          <DialogDescription>Selecione o caixa</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(listarLancamentos)} className="space-y-4">
          <Controller
            name="caixa"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Combobox
                placeholder="Selecione o Caixa"
                items={
                  ccustos?.map((item) => {
                    return { label: item.descricao, value: item.descricao };
                  }) ?? []
                }
                onChange={onChange}
                value={value}
              />
            )}
          />

          <Controller
            name="conta"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Combobox
                placeholder="Selecione a conta"
                items={
                  planoContas?.map((item) => {
                    return { label: item.descricao, value: item.conta };
                  }) ?? []
                }
                onChange={onChange}
                value={value ?? null}
              />
            )}
          />

          <div className="flex items-center gap-2">
            <div>
              <Controller
                control={control}
                name="start"
                render={({ field: { onChange, value } }) => (
                  <DatePickerInput
                    value={value}
                    onChange={(e) => e && onChange(e)}
                    dateFormat={"dd/MM/yyyy"}
                    locale={pt}
                    required
                  />
                )}
              />
            </div>

            <BiCalendarMinus size={25} />

            <div>
              <Controller
                control={control}
                name="end"
                render={({ field: { onChange, value } }) => (
                  <DatePickerInput
                    value={value}
                    onChange={(e) => e && onChange(e)}
                    dateFormat={"dd/MM/yyyy"}
                    locale={pt}
                    required
                  />
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Buscar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <div style={{ display: "none" }}>
        <RelatorioMovimentacao
          infoEmpresa={infoEmpresa}
          tipoRelatorio={"ANALITICO"}
          soma={handleGerirRelatorio() ?? ({} as SomaProps)}
          usuario={watch("caixa")}
          startDate={watch("start")}
          endDate={watch("end")}
          array={data ?? []}
          ref={currentPage}
        />
      </div>
    </Dialog>
  );
}
