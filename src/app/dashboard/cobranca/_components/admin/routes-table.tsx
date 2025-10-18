"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Eye, User, Filter, Delete } from "lucide-react"
import { StatusBadge } from "./status-badge"
import { RouteProps } from "../../types/types"
import { useState } from "react"
import { ModalConfirmar } from "@/components/modals/modalConfirmar"


interface RoutesTableProps {
  routes: RouteProps[]
  onViewDetails: (route: RouteProps) => void
  onOpenFilters: () => void
}

export function RoutesTable({ routes, onViewDetails, onOpenFilters }: RoutesTableProps) {
  const [excluir,setExcluir] = useState(false)
  return (
    <div className="px-4 py-2 ">
      <Card>
        <CardHeader> 
          <CardTitle>Rotas de Cobrança</CardTitle>
          <CardDescription>
            {routes.length} rota{routes.length !== 1 ? "s" : ""} encontrada
            {routes.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[calc(100vh-300px)] overflow-y-auto">
          {routes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Consultor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Bairros</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead>Atualizada em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route) => {
                  const totalClientes = route.cobranca.length
                  const concluidos = route.cobranca.filter((c) => c.check_in && c.check_out).length
                  const percent = totalClientes > 0 ? Math.round((concluidos / totalClientes) * 100) : 0

                  return (
                    <TableRow key={route.id_cobranca}>
                      <TableCell className="font-medium">#{route.id_cobranca}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 uppercase">
                          <User className="h-4 w-4 text-muted-foreground " />
                          {route.parametros.consultor}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={route.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {route.parametros?.bairros?.slice(0, 2)?.map((bairro, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {bairro}
                            </Badge>
                          ))}
                          {route.parametros?.bairros?.length > 2 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline" className="text-xs">
                                    +{route.parametros?.bairros?.length - 2}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="space-y-1">
                                    {route.parametros?.bairros?.slice(2)?.map((bairro, index) => (
                                      <div key={index}>{bairro}</div>
                                    ))}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                   
                      <TableCell>
                        <div className="space-y-1 w-40">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{concluidos}/{totalClientes}</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="h-2 w-full rounded bg-muted">
                            <div className="h-2 rounded bg-primary" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        { route.dt_created ? new Date(route.dt_created).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        { route.dt_updated ? new Date(route.dt_updated).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() =>onViewDetails(route)  }>
                          <Eye className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                        <Button variant="outline" size="sm" onClick={() =>setExcluir(true)}>
                          <Delete color="red" className="h-4 w-4 mr-1" />
                          
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-lg font-medium mb-2">Nenhuma rota encontrada</h3>
              <p className="text-muted-foreground mb-2">Ajuste os filtros para encontrar as rotas desejadas.</p>
              <Button variant="outline" onClick={onOpenFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Ajustar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ModalConfirmar
      handleConfirmar={()=>{}}
      openModal={excluir}
      pergunta="Realmente deseja excluir a rota ?"
      setOpenModal={()=>setExcluir(false)}
      />
    </div>
  )
}
