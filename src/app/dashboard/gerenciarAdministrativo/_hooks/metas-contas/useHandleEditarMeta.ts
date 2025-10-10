import { toast } from "sonner";
import { useCallback } from "react";
import { MetaProps } from "../../_types/types";

export function useEditarMeta(linhaSelecionada: MetaProps | null, setModalOpen: (open: boolean) => void) {
  return useCallback(() => {
    if (!linhaSelecionada) {
      toast.error("Por favor, selecione uma linha para Editar.");
      return;
    }
    setModalOpen(true); 
  }, [linhaSelecionada, setModalOpen]);
}
