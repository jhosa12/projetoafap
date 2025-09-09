"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import {  FileText, FolderSyncIcon } from "lucide-react"
import { StatusBadge } from "./status-badge"
import { InadimplenciaTab } from "./tabs/inadimplencia-tab"
import { PagamentosTab } from "./tabs/pagamentos-tab"
import { AgendamentosTab } from "./tabs/agendamentos-tab"
import { SolicitacoesTab } from "./tabs/solicitacoes-tab"
import { AtualizacoesTab } from "./tabs/atualizacoes-tab"
import { api } from "@/lib/axios/apiClient"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { RouteProps } from "../../types/types"


interface RouteDetailsDialogProps {
  route: RouteProps | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RouteDetailsDialog({ route, open, onOpenChange }: RouteDetailsDialogProps) {
  if (!route) return null




  const sincPagamentos = async () => {

    try {
      const response = await api.post("/cobranca/sincPag", {
       id_rota:route.id_cobranca
      })
    } catch (error) {

      toast.error('Erro ao baixar dados')
      
    }
  }


  const sincAgendamentos = async()=>{
      toast.promise(
        api.post('/cobranca/sincAgend',{
          id_rota:route.id_cobranca
        }),
        {
          loading: 'Sincronizando agendamentos...',
          success: 'Agendamentos sincronizados com sucesso!',
          error: 'Erro ao sincronizar agendamentos.'
        }
      )
  }


  const handleSincData = () =>{
      toast.promise(
        Promise.all([
          sincPagamentos(),
          sincAgendamentos()
        ]),
        {
          loading: 'Sincronizando dados...',
          success: 'Dados sincronizados com sucesso!',
          error: 'Erro ao sincronizar dados.'
        }
      )

  }















  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader >
          <DialogTitle>Detalhes da Rota #{route.id_cobranca}</DialogTitle>
          <DialogDescription asChild >
           <div>
           Consultor: {route.consultor} • Status: <StatusBadge status={route.status} />
            </div> 
          </DialogDescription>
         <Button disabled={route.status!=='CONCLUIDA'} className="ml-auto bg-gray-200" variant='outline' onClick={handleSincData}>
          <FolderSyncIcon />
          Sincronizar Dados
          </Button>
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
             <PagamentosTab id_rota={route?.id_cobranca} pagamentos={route?.pagamentos }/>
            </TabsContent>

            <TabsContent value="agendamentos">
             <AgendamentosTab agendamentos={route?.agendamentos}/>
            </TabsContent>

            <TabsContent value="solicitacoes">
              <SolicitacoesTab consultor={route.parametros.consultor} solicitacoes={route?.solicitacoes }/>
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
