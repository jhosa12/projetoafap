"use client";

import { LeadProps } from "@/types/vendas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BairroIndicators } from "./BairroIndicators";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ModalBairroIndicatorsProps {
  open: boolean;
  onClose: () => void;
  data: LeadProps[];
}

export const ModalBairroIndicators = ({
  open,
  onClose,
  data,
}: ModalBairroIndicatorsProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Indicadores por Bairro</DialogTitle>
          <DialogDescription>
            Visualize a distribuição de leads, prospecções e vendas por bairro
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <BairroIndicators data={data} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
