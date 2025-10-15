import { toast } from "sonner"
import { PremioProps } from "../../_types/premio"

interface ExcluirProps {
  deletarPremio: (premio: PremioProps) => Promise<void>
  listarPremios: () => Promise<void>
}

export function useHandleExcluir({ deletarPremio, listarPremios }: ExcluirProps) {
  const handleConfirmarExclusao = async (premio: any) => {

    try {

      await deletarPremio(premio)
      await listarPremios()


    } catch (error) {
      toast.error("Erro ao deletar prêmio.")

    }
  }

  return { handleConfirmarExclusao }
}