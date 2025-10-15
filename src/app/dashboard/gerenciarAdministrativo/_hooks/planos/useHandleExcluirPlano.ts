import { PlanosProps } from "@/types/planos"
import { toast } from "sonner"

interface ExcluirProps {
  deletarPlano: (plano: PlanosProps) => Promise<void>
  listar: () => Promise<void>
}

export function useHandleExcluirPlano({ deletarPlano, listar }: ExcluirProps) {


  const handleConfirmarExclusao = async (plano: any): Promise<void> => {

    try {

      await deletarPlano(plano)
      await listar()

    } catch (error) {
      toast.error("Erro ao deletar plano.")
    }
  }

  return { handleConfirmarExclusao }


}