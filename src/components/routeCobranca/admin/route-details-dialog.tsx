"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import {  FileText } from "lucide-react"
import { StatusBadge } from "./status-badge"
import { RouteProps } from "@/types/cobranca"
import { InadimplenciaTab } from "./tabs/inadimplencia-tab"
import { PagamentosTab } from "./tabs/pagamentos-tab"
import { AgendamentosTab } from "./tabs/agendamentos-tab"
import { SolicitacoesTab } from "./tabs/solicitacoes-tab"
import { AtualizacoesTab } from "./tabs/atualizacoes-tab"


interface RouteDetailsDialogProps {
  route: RouteProps | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RouteDetailsDialog({ route, open, onOpenChange }: RouteDetailsDialogProps) {
  if (!route) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Rota #{route.id_cobranca}</DialogTitle>
          <DialogDescription>
            Consultor: {route.consultor} • Status: <StatusBadge status={route.status} />
          </DialogDescription>
        </DialogHeader>

        <TooltipProvider>
          <Tabs defaultValue="inadimplencia" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="inadimplencia">Inadimplência</TabsTrigger>
              <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
              <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
              <TabsTrigger value="solicitacoes">Solicitações</TabsTrigger>
              <TabsTrigger value="atualizacoes">Atualizações</TabsTrigger>
            </TabsList>

            <TabsContent value="inadimplencia" className="space-y-4">
             <InadimplenciaTab route={route} />
            </TabsContent>

            <TabsContent value="pagamentos">
             <PagamentosTab pagamentos={route?.pagamentos }/>
            </TabsContent>

            <TabsContent value="agendamentos">
             <AgendamentosTab agendamentos={route?.agendamentos}/>
            </TabsContent>

            <TabsContent value="solicitacoes">
              <SolicitacoesTab solicitacoes={route?.solicitacoes }/>
            </TabsContent>

            <TabsContent value="atualizacoes">
              <AtualizacoesTab atualizacoes={route?.atualizacaoCadastral}/>
            </TabsContent>
          </Tabs>
        </TooltipProvider>

        {route.observacao && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Observações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{route.observacao}</p>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  )
}
