import { useContext } from "react";
import { toast } from "sonner";
import { AuthContext } from "@/store/AuthContext";

export function useSelecionarTitular(
  carregarDados: (id: number) => Promise<void>,
  limparDados: () => void,
  waitMs: number = 150 // permite customizar o tempo de espera
) {
  const { dadosassociado } = useContext(AuthContext);

  // Retorna true se pode fechar o modal, false se não pode
  const handleSelecionarTitular = async (id: number) => {
    await carregarDados(id);
    // Aguarda atualização do contexto
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    const situacao = dadosassociado?.contrato?.situacao?.toUpperCase().trim();
    if (!dadosassociado?.contrato) {
      toast.error("Contrato não encontrado para o associado.");
      limparDados();
      return false;
    }
    if (situacao === "INATIVO") {
      toast.error("Contrato inativo. Não é possível selecionar.");
      limparDados();
      return false;
    }
    return true;
  };

  return { handleSelecionarTitular };
}
