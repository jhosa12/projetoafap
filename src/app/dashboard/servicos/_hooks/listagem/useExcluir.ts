
import { toast } from "sonner";
import { ConvProps } from "@/app/dashboard/servicos/_types/convalescente";

interface ActionsProps {
  linhaSelecionada: ConvProps | null;
  setarListaConv: (obj: { id_conv: number | undefined }) => void;
  setExcluir: (val: boolean) => void;
  deletarConv: () => Promise<void>;
  setAtualizacao: React.Dispatch<React.SetStateAction<number>>;
  setRowSelection: (row: any) => void;
}

export function useExcluir({
  linhaSelecionada,
  setarListaConv,
  setExcluir,
  deletarConv,
  setAtualizacao,
  setRowSelection,
}: ActionsProps) {
  const handleExcluir = () => {
    if (!linhaSelecionada) {
      toast.error("Por favor, selecione uma linha para Excluir.");
      return;
    }
    setarListaConv({ id_conv: linhaSelecionada?.id_conv ?? undefined });
    setExcluir(true);
  };

  const handleConfirmarExclusao = async () => {
    try {
      await deletarConv();
      setAtualizacao((v: number) => v + 1);
      setExcluir(false);
      setRowSelection({});
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  return { handleExcluir, handleConfirmarExclusao };
}
