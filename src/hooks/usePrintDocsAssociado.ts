import { CartaNovoAssociado } from "@/Documents/associado/cartaNovoAssociado/cartaDocument";
import CarteiraAssociado from "@/Documents/associado/carteiraAssociado/CarteiraAssociado";
import DocumentTemplate from "@/Documents/associado/contratoAdesão/DocumentTemplate";
import ContratoResumo from "@/Documents/associado/contratoResumido/ContratoResumo";
import ImpressaoCarne from "@/Documents/associado/mensalidade/ImpressaoCarne";
import { ReciboMensalidade } from "@/Documents/associado/mensalidade/Recibo";
import { ProtocoloCancelamento } from "@/Documents/associado/protocoloCancelamento/ProtocoloCancelamento";
import { api } from "@/lib/axios/apiClient";
import { AuthContext } from "@/store/AuthContext";
import { AssociadoProps } from "@/app/dashboard/admcontrato/_types/associado";
import { pageStyle } from "@/utils/pageStyle";
import { removerFusoDate } from "@/utils/removerFusoDate";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import { Docs } from "@/app/dashboard/admcontrato/_types/contrato";
import { Alert } from "flowbite-react";

export function usePrintDocsAssociado(
  usuario: string,
  id_empresa: string,
  dadosassociado: Partial<AssociadoProps>,
  setarDadosAssociado: (fields: Partial<AssociadoProps>) => void,
  onClose?: Function
) {
  const [doc, setDoc] = useState<Docs>(undefined);

  const componentRefs = {
    contrato: useRef<HTMLDivElement>(null),
    carteira: useRef<HTMLDivElement>(null),
    carne: useRef<HTMLDivElement>(null),
    resumo: useRef<HTMLDivElement>(null),
    carta: useRef<HTMLDivElement>(null),
    cancelamento: useRef<HTMLDivElement>(null),
  };

  const handleRegisterImpressao = useCallback(
    async (arquivo: Docs) => {
      if (!arquivo) return;
      const { newDate } = removerFusoDate(new Date());
      const impressoes = [...(dadosassociado.contrato?.impressoes || [])];
      const index = impressoes.findIndex((imp) => imp.arquivo === arquivo);
     
      if (index === -1) {
        impressoes.push({ arquivo, date: newDate, user: usuario });
      } else {
        impressoes[index] = {
          ...impressoes[index],
          date: newDate,
          user: usuario,
        };
      }

      try {
        const response = await api.put("/contrato/impressoes", {
          id_contrato_global: dadosassociado?.contrato?.id_contrato_global,
          impressoes,
        });
        // handlePrint(arquivo)
        setarDadosAssociado({
          contrato: {
            ...dadosassociado?.contrato,
            impressoes: response.data.impressoes,
          },
        });
        //onClose?.()
      } catch (error) {
        toast.error("Erro ao registrar impressão");
      }
    },
    [dadosassociado, usuario]
  );

  const imprimirCancelamento = useReactToPrint({
    pageStyle: pageStyle,
    documentTitle: "CANCELAMENTO",
    contentRef: componentRefs.cancelamento,
    onBeforePrint: async () => await handleRegisterImpressao("cancelamento"),
  });

  const imprimirContrato = useReactToPrint({
    pageStyle: pageStyle,
    documentTitle: "CONTRATO",
    contentRef: componentRefs.contrato,
    onBeforePrint: async () => await handleRegisterImpressao("contrato"),
  });

  const imprimirCarteira = useReactToPrint({
    pageStyle: pageStyle,
    documentTitle: "CARTEIRA",
    contentRef: componentRefs.carteira,
    onBeforePrint: async () => await handleRegisterImpressao("carteira"),
  });

  const imprimirCarne = useReactToPrint({
    pageStyle: pageStyle,
    documentTitle: "CARNÊ",
    contentRef: componentRefs.carne,
    onBeforePrint: async () => await handleRegisterImpressao("carne"),
  });

  const imprimirResumo = useReactToPrint({
    pageStyle: pageStyle,
    documentTitle: "RESUMO",
    contentRef: componentRefs.resumo,
    onBeforePrint: async () => await handleRegisterImpressao("resumo"),
  });

  const imprimirCarta = useReactToPrint({
    pageStyle: pageStyle,
    documentTitle: "CARTA",
    contentRef: componentRefs.carta,
    onBeforePrint: async () => await handleRegisterImpressao("carta"),
  });

  const handleImpressao = useCallback(
    (docs: Docs) => {
       
      switch (docs) {
        case "contrato":
          imprimirContrato();

          break;
        case "carteira":
          imprimirCarteira();
          break;
        case "carne":
          imprimirCarne();

          break;
        case "resumo":
          imprimirResumo();

          break;
        case "carta":
          imprimirCarta();

          break;
        case "cancelamento":
          imprimirCancelamento();

          break;
        default:
          break;
      }
    },
    [doc]
  );

  return {
    handleImpressao,
    componentRefs,
    doc,
    setDoc,
  };
}
