import { useCallback } from "react";
import { toast } from "sonner";
import { AssociadoProps } from "@/app/dashboard/admcontrato/_types/associado";
import { RowSelectionState } from "@tanstack/react-table";

type ActionsProps = {
  rowSelection: RowSelectionState;
  dadosassociado: AssociadoProps | Partial<AssociadoProps> | null;
  reset: (values: any) => void;
  watch: () => any;
  setModalDependente: (open: boolean) => void;
  setRowSelection: (state: RowSelectionState) => void;
};

export function useFormularioConv({
  rowSelection,
  dadosassociado,
  reset,
  watch,
  setModalDependente,
  setRowSelection,
}: ActionsProps) {
  const handleConfirmarSelecao = useCallback(() => {
    const indicesSelecionados = Object.keys(rowSelection).map(Number)[0];

    if (indicesSelecionados === undefined || !dadosassociado?.dependentes) {
      toast.error('Por favor, selecione um dependente da lista!');
      return;
    }
    const dependentesVisiveis = dadosassociado.dependentes.filter(d => !d.excluido);
    const dependenteEscolhido = dependentesVisiveis[indicesSelecionados];

    if (!dependenteEscolhido) {
      toast.error("Não foi possível encontrar o dependente selecionado.");
      return;
    }
    const dadosMapeados = {
      nome: dependenteEscolhido.nome,
      data_nasc: dependenteEscolhido.data_nasc,
      id_dependente: dependenteEscolhido.id_dependente,
      id_dependente_global: dependenteEscolhido.id_dependente_global
    };

    reset({ ...watch(), ...dadosMapeados, tipo_contrato: 'DEPENDENTE' });

    toast.success("Dados do dependente preenchidos!");

    setModalDependente(false);
    setRowSelection({});
  }, [rowSelection, dadosassociado, reset, watch, setModalDependente, setRowSelection]);

  return { handleConfirmarSelecao };
}
