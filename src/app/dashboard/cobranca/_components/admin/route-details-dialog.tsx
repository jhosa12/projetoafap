"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, FolderSyncIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { StatusBadge } from "./status-badge"
import { InadimplenciaTab } from "./tabs/inadimplencia-tab"
import { PagamentosTab } from "./tabs/pagamentos-tab"
import { AgendamentosTab } from "./tabs/agendamentos-tab"
import { SolicitacoesTab } from "./tabs/solicitacoes-tab"
import { AtualizacoesTab } from "./tabs/atualizacoes-tab"
import { api } from "@/lib/axios/apiClient"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {RouteProps } from "../../types/types"


interface RouteDetailsDialogProps {
  route: RouteProps | null
  open: boolean
  onOpenChange: (open: boolean) => void,
  getRotas:()=>void
}

export function RouteDetailsDialog({ route, open, onOpenChange,getRotas }: RouteDetailsDialogProps) {
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
      <DialogContent className="max-w-[95rem] max-h-[90vh] overflow-y-auto">
        <DialogHeader >
          <DialogTitle>Detalhes da Rota #{route.id_cobranca}</DialogTitle>
          <DialogDescription asChild >
           <div>
           Consultor: {route.parametros.consultor} • Status: <StatusBadge status={route.status} />
            </div> 
          </DialogDescription>
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {route.parametros?.cidade || 'Cidade não definida'}
              </Badge>
              {route.parametros?.bairros?.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs cursor-help">
                      {route.parametros.bairros.length} bairro{route.parametros.bairros.length !== 1 ? 's' : ''}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <p className="font-medium mb-1">Bairros desta rota:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {route.parametros.bairros.map((bairro, index) => (
                        <li key={index} className="text-sm">{bairro}</li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              )}
              {route.parametros?.periodo?.start && route.parametros?.periodo?.end && (
                <Badge variant="outline" className="text-xs">
                  Período: {new Date(route.parametros.periodo.start).toLocaleDateString('pt-BR')} - {new Date(route.parametros.periodo.end).toLocaleDateString('pt-BR')}
                </Badge>
              )}
              {route.parametros?.criterio && (
                <Badge variant="outline" className="text-xs">
                  Critério: {route.parametros.criterio.operator} {route.parametros.criterio.value} mensalidades
                </Badge>
              )}
               <Badge variant="outline" className="text-xs">
                {route.parametros?.statusReagendamento }
              </Badge>
            </div>
            <Button disabled={route.status!=='CONCLUIDA'} className="ml-2 bg-gray-200" variant='outline' onClick={handleSincData}>
              <FolderSyncIcon className="h-4 w-4 mr-2" />
              Sincronizar Dados
            </Button>
          </div>
        
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
              <SolicitacoesTab getRotas={getRotas} id={route.id_cobranca} consultor={route.parametros.consultor} solicitacoes={route?.solicitacoes }/>
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
