import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { MdCheckCircle, MdContentCopy, MdOutlineDescription } from "react-icons/md";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ModalNovoContratoProps {
  show: boolean;
  onClose: () => void;
  loading: boolean;
  closeAll: () => void;
  id_contrato: number | undefined;
  id_global: number | undefined;
  carregarDados: (id: number) => Promise<void>;
}

export const ModalNovoContrato = ({
  id_contrato,
  loading,
  onClose,
  show,
  carregarDados,
  id_global,
  closeAll
}: ModalNovoContratoProps) => {
  const router = useRouter();
  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const formattedTime = format(currentDate, "HH:mm");

  const handleAcessarContrato = async () => {
    try {
      await carregarDados(Number(id_global));
      closeAll();
      router.push(`/dashboard/admcontrato`);
    } catch (error) {
      console.error("Erro ao carregar dados do contrato:", error);
    }
  };

  const handleCopyContractNumber = () => {
    if (id_contrato) {
      navigator.clipboard.writeText(id_contrato.toString());
    }
  };

  return (
    <Dialog open={show} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Spinner  />
            <p className="text-sm text-muted-foreground">Processando contrato...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <DialogHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-green-50">
                  <MdCheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-gray-900">
                    Contrato Gerado com Sucesso
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-500">
                    {formattedDate} às {formattedTime}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MdOutlineDescription className="h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">Número do Contrato</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold">{id_contrato?.toString()}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:bg-gray-100"
                        onClick={handleCopyContractNumber}
                        title="Copiar número do contrato"
                      >
                        <MdContentCopy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 my-3"></div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      O contrato foi gerado com sucesso e está pronto para ser acessado. Você pode visualizá-lo agora ou encontrá-lo mais tarde na lista de contratos.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-6"
              >
                Fechar
              </Button>
              <div className="space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50"
                  onClick={onClose}
                >
                  Ver mais tarde
                </Button>
                <Button 
                  type="button"
                  onClick={handleAcessarContrato}
                  className="px-6 bg-primary hover:bg-primary/90"
                >
                  Acessar Contrato
                </Button>
              </div>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};