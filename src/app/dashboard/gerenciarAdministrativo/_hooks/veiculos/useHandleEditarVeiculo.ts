import { toast } from "sonner";
import { useCallback } from "react";
import { VeiculoProps } from "@/types/veiculo";

export function useHandleEditarVeiculo(linhaSelecionada: VeiculoProps | null, setModalOpen: (open: boolean) => void) {
  return useCallback(() => {
    if (!linhaSelecionada) {
      toast.error("Por favor, selecione uma linha para Editar.");
      return;
    }
    setModalOpen(true);
  }, [linhaSelecionada, setModalOpen]);
}
