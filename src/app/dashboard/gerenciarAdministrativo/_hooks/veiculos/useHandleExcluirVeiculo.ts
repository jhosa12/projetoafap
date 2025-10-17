import { VeiculoProps } from "@/types/veiculo"
import { toast } from "sonner"

interface ExcluirProps {
  excluirVeiculo: (veiculo: VeiculoProps) => void
  listarVeiculos: () => Promise<void>
}


export function useHandleExcluirVeiculo({ excluirVeiculo, listarVeiculos }: ExcluirProps) {

  const handleExcluir = async (veiculo: VeiculoProps) => {

    try {

      await excluirVeiculo(veiculo)
      await listarVeiculos()


    } catch (error) {

      toast.error("Erro ao excluir veículos.")

    }
  }

  return { handleExcluir }
}