import { PlanoContasProps } from '@/app/dashboard/financeiro/_types/plano-contas';
import { NodoConta } from '@/utils/listaContas';
import { toast } from 'sonner';

interface ExcluirProps {
  deletarPlanoConta: (conta: string) => void
  listarPlanoContas: () => Promise<void>
  setPlanoExcluir: (conta: PlanoContasProps | null) => void
}

export function useHandleExcluirPC({ deletarPlanoConta, listarPlanoContas, setPlanoExcluir }: ExcluirProps) {

  const handleExcluir = async (planoConta: PlanoContasProps) => {


    try {

      await deletarPlanoConta(planoConta.conta)
      await listarPlanoContas()
      setPlanoExcluir(null)
      toast.success("Plano de conta excluído com sucesso!")

    } catch (error) {
      toast.error("Error ao excluir plano de conta.")
    }
  }

  return { handleExcluir }
}