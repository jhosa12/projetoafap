import { useContext } from "react";
import { toast } from "sonner";
import { AuthContext } from "@/store/AuthContext";

export function useSelecionarTitular(
  carregarDados: (id: number) => Promise<any>,
  limparDados: () => void,
  setModal: (modal: any) => void,
  resetForm?: (values: any) => void
) {
  const handleSelecionarTitular = async (id: number) => {
    const toastId = toast.loading("Carregando dados do associado...");
    const dados = await carregarDados(id);
    toast.dismiss(toastId);
    const situacao = dados?.contrato?.situacao?.toUpperCase().trim();
    if (situacao !== "ATIVO") {
      toast.error(`Contrato com status \"${dados?.contrato?.situacao || 'desconhecido'}\". Não é possível selecionar.`);
      return;
    }
    if (resetForm) {
      // Preenche os campos do formulário imediatamente
      resetForm({
        nome: dados.nome,
        data_nasc: dados.data_nasc,
        id_associado: dados.id_associado,
        id_global: dados.id_global,
        // ...adicione outros campos necessários
      });
    }
    setModal((prev: any) => ({ ...prev, busca: false }));
  };

  return handleSelecionarTitular;
}
