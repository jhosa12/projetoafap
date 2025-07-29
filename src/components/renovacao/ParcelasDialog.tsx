import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ParcelasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (parcelas: number) => void;
  loading?: boolean;
}

export function ParcelasDialog({ open, onOpenChange, onConfirm, loading }: ParcelasDialogProps) {
  const [parcelas, setParcelas] = useState<number>(12);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parcelas < 1) {
      toast.error("O número de parcelas deve ser maior que zero");
      return;
    }
    onConfirm(parcelas);
  };

  if (!isMounted) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Número de Parcelas</DialogTitle>
            <DialogDescription>
              Informe quantas parcelas devem ser geradas para a renovação.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parcelas" className="text-right">
                Parcelas
              </Label>
              <Input
                id="parcelas"
                type="number"
                min="1"
                max="24"
                value={parcelas}
                onChange={(e) => setParcelas(Number(e.target.value))}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Processando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
