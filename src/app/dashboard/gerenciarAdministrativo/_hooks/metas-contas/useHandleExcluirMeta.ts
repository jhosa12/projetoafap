import { toast } from "sonner";
import { MetaProps } from "../../_types/meta";

interface ExcluirProps {
  deletarMeta: (meta: MetaProps) => Promise<void>
  listarMetas: () => Promise<void>
}

export function useHandleExcluirMeta({ deletarMeta, listarMetas }: ExcluirProps) {

  const excluirMeta = async (meta: any) => {

    try {

      await deletarMeta(meta)
      await listarMetas()
      toast.success("Meta excluída com sucesso!")

    } catch (error) {
      toast.error("Erro ao deletar meta.")
    }

  }

  return { excluirMeta }

}