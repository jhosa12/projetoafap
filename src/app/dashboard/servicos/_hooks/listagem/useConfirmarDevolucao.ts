import { toast } from "sonner";
import { Docs } from "../useActionsPrintConvalescenca";

interface ActionsProps {
  itemSelecionado: any;
  produtoSelecionadoId: number | null;
  setMaterialParaImpressao: (material: any[]) => void;
  receberDevolucao: (id: number | null) => Promise<void>;
  setAtualizacao: React.Dispatch<React.SetStateAction<number>>;
  selecionarImpressaoModal: boolean;
  iniciarImpressao: (doc: Docs) => void;
}

export function useConfirmarDevolucao() {
  return async function handleConfirmarDevolucao({
    itemSelecionado,
    produtoSelecionadoId,
    setMaterialParaImpressao,
    receberDevolucao,
    setAtualizacao,
    selecionarImpressaoModal,
    iniciarImpressao,
  }: ActionsProps) {
    if (!itemSelecionado) {
      toast.error("Nenhum item selecionado para devolução.");
      return;
    }

    const materialFiltrado = (itemSelecionado.convalescenca_prod ?? []).filter(
      (produto: any) => produto.id_conv_prod === produtoSelecionadoId
    );

    setMaterialParaImpressao(materialFiltrado);
    try {
      await receberDevolucao(produtoSelecionadoId);
      setAtualizacao((v: number) => v + 1);
      if (selecionarImpressaoModal) {
        iniciarImpressao("comprovante");
      }
    } catch (error) {
      toast.error("Não foi possível alterar o status.");
    }
  };
}
