import { ImpressoesProps } from './../../admcontrato/_types/impressoes';
import { ConvProps } from "../_types/convalescente";
import DocumentTemplateContrato from "../_documents/convalescencia/contrato/DocumentTemplate";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { boolean } from "zod";
import { removerFusoDate } from "@/utils/removerFusoDate";
import { api } from "@/lib/axios/apiClient";
import { toast } from "sonner";
import { pageStyle } from "@/utils/pageStyle";

export type Docs = 'contrato' | 'comprovante' | 'comprovanteGenerico'
type SetarListaConvType = (item: Partial<ConvProps>) => void

export function useActionsPrintConvalescenca(

  itemSelecionado: Partial<ConvProps | null>,
  idContratoGlobal: number | null,
  usuario: string,
  id_empresa: string,
  setarListaConv: SetarListaConvType,
  onClose?: Function,


) {
  const [documentoAtivo, setDocumentoAtivo] = useState<Docs | null>(null);

  const componentRefs = {
    contrato: useRef<HTMLDivElement>(null),
    comprovante: useRef<HTMLDivElement>(null),
    comprovanteGenerico: useRef<HTMLDivElement>(null)
  }

  const handleRegisterImpressao = async (arquivo: Docs) => {
    const { newDate } = removerFusoDate(new Date())
    const impressoes = [...(itemSelecionado?.contrato?.impressoes || [])]
    const index = impressoes.findIndex((imp) => imp.arquivo === arquivo)

    if (index === -1) {
      impressoes.push({ arquivo, date: newDate, user: usuario })
    } else {
      impressoes[index] = { ...impressoes[index], date: newDate, user: usuario };
    }
    try {

       await api.put("/contrato/impressoes", {
        id_contrato_global: itemSelecionado?.id_contrato_global,
        impressoes,
      });

      toast.success(`Registro de impressão para ${arquivo} salvo.`)
    
    } catch (error) {
      console.error("ERRO CAPTURADO:", error);
      toast.error("Erro ao registrar impressão");
      throw error;
    }
  }

  const limparEstadoPosImpressao = () => {
    console.log("Impressão concluída ou cancelada. Limpando estado.")
    setDocumentoAtivo(null)
    onClose?.()

  }


  const imprimirContrato = useReactToPrint({
    pageStyle: pageStyle,
    documentTitle: "CONTRATO",
    contentRef: componentRefs.contrato,
    onBeforePrint: () => handleRegisterImpressao('contrato'),
    onAfterPrint: limparEstadoPosImpressao,
  })

  const imprimirComprovante = useReactToPrint({
    pageStyle: pageStyle,
    documentTitle: "COMPROVANTE",
    contentRef: componentRefs.comprovante,
    onBeforePrint: () =>  handleRegisterImpressao('comprovante'),
    onAfterPrint: limparEstadoPosImpressao,
  })

  const imprimirComprovanteGenerico = useReactToPrint({
    pageStyle: pageStyle,
    documentTitle: "COMPROVANTE",
    contentRef: componentRefs.comprovanteGenerico,
    onBeforePrint: () =>  handleRegisterImpressao('comprovanteGenerico'),
    onAfterPrint:  limparEstadoPosImpressao 

  })

  useEffect(() => {
    if (documentoAtivo) {
      console.log(`useEffect do hook detectou: '${documentoAtivo}'. Acionando a impressão.`);
      if (documentoAtivo === 'contrato') {
        imprimirContrato();
      } else if (documentoAtivo === 'comprovanteGenerico') {
        imprimirComprovanteGenerico();
      } else if (documentoAtivo === 'comprovante') {
        imprimirComprovante()
      }
    }
  }, [documentoAtivo]);

  const iniciarImpressao = (doc: Docs) => {
    console.log(`Componente solicitou impressão para: '${doc}'`);
    setDocumentoAtivo(doc);
  };

  return {
    iniciarImpressao,      
    componentRefs,
    documentoAtivo
  }

}