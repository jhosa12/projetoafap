
import { toast } from "sonner";
import { Docs } from "@/app/dashboard/servicos/_hooks/listagem/useActionsPrintConvalescenca";
import { ConvProps } from "@/app/dashboard/servicos/_types/convalescente";

interface ActionsProps {
  linhaSelecionada: ConvProps | null;
  setItemSelecionado: (item: ConvProps | null) => void;
  setIdContratoParaImpressao: (id: number | null) => void;
  setDocumentoImprimir: (doc: Docs) => void;
  setModalImprimirBotoes: (open: boolean) => void;
}

export function useImprimirModal({
  linhaSelecionada,
  setItemSelecionado,
  setIdContratoParaImpressao,
  setDocumentoImprimir,
  setModalImprimirBotoes,
}: ActionsProps) {
  return (tipoDocumento: Docs) => {
    if (!linhaSelecionada) {
      toast.error("Por favor, selecione uma linha para Imprimir um Comprovante!");
      return;
    }
    setItemSelecionado(linhaSelecionada);
    setIdContratoParaImpressao(linhaSelecionada?.id_contrato_global ?? null);
    setDocumentoImprimir(tipoDocumento);
    setModalImprimirBotoes(true);
  };
}
