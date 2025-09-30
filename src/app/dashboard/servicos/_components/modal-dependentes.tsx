// Em um novo arquivo, ex: /_components/obitos/modal-selecao-dependente.tsx

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TabelaCompleta } from "./convalescentes/data-table";
import { RowSelectionState } from "@tanstack/react-table";

// 1. Definimos as "props" que o modal precisa para funcionar
interface ModalSelecaoDependenteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dependentes: any[]; // Use um tipo mais específico se tiver, ex: DependenteProps[]
  columns: any[];
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>
}

export function ModalSelecaoDependente({
  isOpen,
  onClose,
  onConfirm,
  dependentes,
  columns,
  rowSelection,
  setRowSelection,
}: ModalSelecaoDependenteProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Selecione o Dependente</DialogTitle>
          <DialogDescription>
            Selecione o dependente desejado na lista abaixo. Clique em 'Confirmar'
            para finalizar a seleção.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <TabelaCompleta
            columns={columns}
            data={dependentes}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onConfirm} 
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}