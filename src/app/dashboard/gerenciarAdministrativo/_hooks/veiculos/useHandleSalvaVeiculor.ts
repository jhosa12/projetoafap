import { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { VeiculoProps } from "@/types/veiculo";


export function useHandleSalvarVeiculo(
  onSave: SubmitHandler<VeiculoProps>,
  setOpen: (open: boolean) => void,
  listarVeiculos: () => void,
  setLinhaSelecionada: (open: boolean) => void
) {

  const handleSalvar: SubmitHandler<VeiculoProps> = async (data) => {
    try {


      const resultado = await onSave(data);

      if (resultado === true) {
        setOpen(false);
        setLinhaSelecionada(false)
        listarVeiculos()


      }
    } catch (error: any) {
      toast.error("Erro ao salvar veiculo. Por favor, tente novamente!");
    }
  };

  return { handleSalvar };
}
