
import { toast } from "sonner";
import { DocsObito } from "./useActionsPrintOS";
import { ObitoProps } from "../../_types/obito";

interface ActionsProps {
  linhaSelecionada: ObitoProps | null;
  setItemSelecionado: (item: ObitoProps | null) => void;
  setIdObitoParaImpressao: (id: number | null) => void;
  setDocumentoImprimir: (doc: DocsObito) => void;
  setModalImprimir: (open: boolean) => void;
}

export function useImprimirModal({
  linhaSelecionada,
  setItemSelecionado,
  setIdObitoParaImpressao,
  setDocumentoImprimir,
  setModalImprimir,
}: ActionsProps) {
  return (tipoDocumento: DocsObito) => {
    setItemSelecionado(linhaSelecionada);
    setIdObitoParaImpressao(linhaSelecionada?.id_contrato_global ?? null);
    setDocumentoImprimir(tipoDocumento);
    setModalImprimir(true);
  };
}
