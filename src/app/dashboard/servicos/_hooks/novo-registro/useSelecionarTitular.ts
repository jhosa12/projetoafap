import { toast } from "sonner";


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

    // Verificar se os dados foram carregados
    if (!dados) {
      toast.error("Erro ao carregar dados do associado");
      return;
    }
   
    const situacao = dados?.contrato?.situacao;

    if (!situacao || situacao.toUpperCase().trim() !== "ATIVO") {
      toast.error(`Contrato com status "${situacao || 'indefinido'}". Não é possível selecionar contratos inativos para convalescença.`);
      
      limparDados();
      return;
    }

    // Se chegou até aqui, o contrato está ativo
    setModal((prev: any) => ({ ...prev, busca: false }));
  };

  return handleSelecionarTitular;
}
