"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, User } from "lucide-react";

interface Lead {
  id_lead: number;
  data: Date;
  status: string;
  nome: string;
}

interface ModalDetalhesLeadsProps {
  open: boolean;
  onClose: () => void;
  leads: Lead[];
  tipo: "LEAD" | "PROSPECCAO" | "PREV VENDA";
}

const getTipoConfig = (tipo: string) => {
  switch (tipo) {
    case "LEAD":
      return {
        title: "Leads",
        description: "Lista de todos os leads cadastrados no período",
        badgeVariant: "default" as const,
      };
    case "PROSPECCAO":
      return {
        title: "Prospecções",
        description: "Lista de todas as prospecções em andamento",
        badgeVariant: "secondary" as const,
      };
    case "PREV VENDA":
      return {
        title: "Pré-Vendas",
        description: "Lista de todas as pré-vendas em negociação",
        badgeVariant: "outline" as const,
      };
    default:
      return {
        title: "Leads",
        description: "",
        badgeVariant: "default" as const,
      };
  }
};

export const ModalDetalhesLeads = ({
  open,
  onClose,
  leads,
  tipo,
}: ModalDetalhesLeadsProps) => {
  const config = getTipoConfig(tipo);
  const leadsFiltrados = leads.filter((lead) => lead.status === tipo);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(80vh-150px)]">
          {leadsFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhum registro encontrado para esta categoria
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Nome</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Data Cadastro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leadsFiltrados.map((lead) => (
                    <TableRow key={lead.id_lead} className="hover:bg-muted/50">
                      <TableCell className="font-medium">#{lead.id_lead}</TableCell>
                      <TableCell className="max-w-[300px]">{lead.nome}</TableCell>
                      <TableCell>
                        <Badge variant={config.badgeVariant}>{lead.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(lead.data).toLocaleDateString("pt-BR", {
                            timeZone: "UTC",
                          })}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </ScrollArea>

        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Total: <span className="font-semibold">{leadsFiltrados.length}</span>{" "}
            {leadsFiltrados.length === 1 ? "registro" : "registros"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
