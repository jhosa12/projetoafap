
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDays, Phone } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { api } from "@/lib/axios/apiClient"
import { AgendamentoCobranca } from "../../../types/types"




export function AgendamentosTab({ agendamentos }: { agendamentos: Array<AgendamentoCobranca> }) {





return (
  <div>
 
     <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Data Agendamento</TableHead>
                        <TableHead>Contrato</TableHead>
                        <TableHead>Mensalidades</TableHead>
                        <TableHead>Valor Total</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agendamentos?.map((agendamento) => {
                        const valorTotal = agendamento.mensalidades.reduce((sum, mens) => sum + mens.valor, 0)
                        return (
                          <TableRow className="text-xs" key={agendamento.id_global}>
                            <TableCell>
                              <div className="font-medium">{agendamento.cliente_nome}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                {agendamento.data}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{agendamento.contrato}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {agendamento.mensalidades.map((mens, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs mr-1">
                                    {mens.referencia}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">R$ {valorTotal.toFixed(2)}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <CalendarDays className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Reagendar</p>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Phone className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Contatar cliente</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  </div>
)
}
