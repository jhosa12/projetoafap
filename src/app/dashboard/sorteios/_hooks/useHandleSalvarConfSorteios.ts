import { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { PremioProps } from "../_types/premio";

interface SalvarProps {

  onSave: SubmitHandler<PremioProps>
  setOpenModal: (value: boolean) => void;
  listarPremios: () => void;

}

export function useHandleSalvarConfSorteios({ onSave, setOpenModal, listarPremios }: SalvarProps) {

  const handleSalvar = async (data: any) => {
    try {
      const resultado = await onSave(data);

      if (resultado === true) {

        setOpenModal(false);
        listarPremios();

      }
    } catch (error: any) {
      toast.error("Erro ao salvar.");
    }
  };

  return { handleSalvar }
}