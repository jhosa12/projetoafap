import { ImpressoesProps } from './../../admcontrato/_types/impressoes';
import { ConvProps } from "../_types/convalescente";
import DocumentTemplateContrato from "../_documents/convalescencia/contrato/DocumentTemplate";
import { useCallback, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { boolean } from "zod";
import { removerFusoDate } from "@/utils/removerFusoDate";
import { api } from "@/lib/axios/apiClient";
import { toast } from "sonner";
import { pageStyle } from "@/utils/pageStyle";

type Docs = 'contrato' | 'comprovante'

export function useActionsPrintConvalescenca(

  dadosConvalescenca: Partial<ConvProps | null>,
  usuario: string,
  id_empresa: string,
  setarListaConva: (fields: Partial<ConvProps>) => void,
  onClose?: Function

) {


  const [printState, setPrintState] = useState<{ [key in Docs]: boolean }>({
    contrato: false,
    comprovante: false,
  })

  const chaveAtiva = printState
    ? Object.entries(printState).find(([_, valor]) => valor === true)?.[0]
    : null


  const componentRefs = {
    contrato: useRef<HTMLDivElement>(null),
    comprovante: useRef<HTMLDivElement>(null)
  }

  const handlePrint = (doc: Docs) => {
    setPrintState((prev) => ({ ...prev, [doc]: !prev[doc] }))
  }

  const handleImpressaoConvalescenca = useCallback(async () => {

    if (printState.contrato) imprimirContrato();
    if (printState.comprovante) imprimirComprovante();



  }, [printState])


  const handleRegisterImpressao = useCallback(async (arquivo: Docs) => {
    const { newDate } = removerFusoDate(new Date())
    const impressoes = [...(dadosConvalescenca?.contrato?.impressoes || [])]
    const index = impressoes.findIndex((imp) => imp.arquivo === arquivo)

    if (!dadosConvalescenca || !dadosConvalescenca.contrato) {
      toast.error("Dados da convalescença ou do contrato estão ausentes. Não é possível registrar.");
      return; // Interrompe a execução se os dados não estiverem prontos
    }

    if (index === -1) {
      impressoes.push({ arquivo, date: newDate, user: usuario })
    } else {
      impressoes[index] = { ...impressoes[index], date: newDate, user: usuario };
    }
    try {

      const response = await api.put("/contrato/impressoes", {
        id_contrato_global: dadosConvalescenca?.contrato?.id_contrato_global,
        impressoes,
      });
      handlePrint(arquivo)

      const novasImpressoes = response.data.impressoes

      const convAtualizada: Partial<ConvProps> = {
        ...dadosConvalescenca,
        contrato: {
          ...dadosConvalescenca?.contrato,
          impressoes: novasImpressoes

        }

      }
      setarListaConva(convAtualizada);
      onClose?.()

    } catch (error) {
      toast.error("Erro ao registrar impressão");
    }
  }, [dadosConvalescenca, usuario, setarListaConva])


  const imprimirContrato = useReactToPrint({
    pageStyle: pageStyle,
    documentTitle: "CONTRATO",
    contentRef: componentRefs.contrato,
    onBeforePrint: async () => {
      await handleRegisterImpressao('contrato');
    },
  })

  const imprimirComprovante = useReactToPrint({
    pageStyle: pageStyle,
    documentTitle: "COMPROVANTE",
    contentRef: componentRefs.contrato,
    onBeforePrint: async () => {
      await handleRegisterImpressao('comprovante');
    },
  })

  return {
    printState,
    handleImpressaoConvalescenca,
    chaveAtiva,
    handlePrint,
    componentRefs
  }

}