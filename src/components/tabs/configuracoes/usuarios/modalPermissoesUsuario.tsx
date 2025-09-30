import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Permissoes } from "./permissoes/permisssoes";

interface ModalPermissoesUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: string[];
  onPermissionChange: (permission: string) => void;
  title?: string;
}

export function ModalPermissoesUsuario({
  isOpen,
  onClose,
  permissions,
  onPermissionChange,
  title = "Gerenciar Permissões"
}: ModalPermissoesUsuarioProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-200px)] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Permissoes 
            permissions={permissions} 
            handlePermission={onPermissionChange} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
