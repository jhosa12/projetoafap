import { RowSelectionState } from "@tanstack/react-table";
import { AssociadoProps } from "@/app/dashboard/admcontrato/_types/associado";
import { toast } from "sonner";
import { UseFormReset, UseFormWatch } from "react-hook-form";
import { ObitoProps } from "../../_types/obito";

interface UseConfirmarSelecaoFalecidoProps {
  rowSelection: RowSelectionState;
  dadosassociado: AssociadoProps | Partial<AssociadoProps> | null;
  reset: UseFormReset<ObitoProps>;
  watch: UseFormWatch<ObitoProps>;
  setModalDependente: (isOpen: boolean) => void;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
}

export function useConfirmarSelecaoFalecido({
  rowSelection,
  dadosassociado,
  reset,
  watch,
  setModalDependente,
  setRowSelection,
}: UseConfirmarSelecaoFalecidoProps) {

  const handleConfirmarSelecao = () => {
    const indicesSelecionados = Object.keys(rowSelection).map(Number)[0];

    if (indicesSelecionados === undefined || !dadosassociado?.dependentes) {
      toast.error('Por favor, selecione um dependente da lista!')
      return
    }

    const dependentesVisiveis = dadosassociado.dependentes.filter(d => !d.excluido)
    const dependenteEscolhido = dependentesVisiveis[indicesSelecionados]

    if (!dependenteEscolhido) {
      toast.error("Não foi possível encontrar o dependente selecionado.")
      return
    }

    const dadosMapeados = {
      nome_falecido: dependenteEscolhido.nome,
      data_nascimento: dependenteEscolhido.data_nasc,
      id_dependente: dependenteEscolhido.id_dependente,
      id_dependente_global: dependenteEscolhido.id_dependente_global
    }

    reset({ ...watch(), ...dadosMapeados })

    toast.success("Dados do dependente preenchidos!")

    setModalDependente(false)
    setRowSelection({})
  }

  return {
    handleConfirmarSelecao
  }
}