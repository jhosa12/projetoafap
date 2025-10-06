
import { Docs } from "@/app/dashboard/servicos/_hooks/listagem/useActionsPrintConvalescenca";

interface ActionsProps {
  documentoImprimir: Docs | null;
  iniciarImpressao: (doc: Docs) => void;
  setModalImprimirBotoes: (open: boolean) => void;
  setRowSelection: (row: any) => void;
}

export function useExecutarImpressao({
  documentoImprimir,
  iniciarImpressao,
  setModalImprimirBotoes,
  setRowSelection,
}: ActionsProps) {
  return async () => {
    if (!documentoImprimir) return;
    iniciarImpressao(documentoImprimir);
    setModalImprimirBotoes(false);
    setRowSelection({});
  };
}
