import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RouteProps } from "@/types/cobranca"
import { StatusBadge } from "../status-badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { MapButton } from "../map-button"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"




export function InadimplenciaTab({ route }: { route: RouteProps }) {


return (
  <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
     <Table  >
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Endereço</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Mensalidades</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Check-in/out</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {route.cobranca.map((item) => (
                        <TableRow key={item.id_global}>
                          <TableCell className="text-xs">
                            
                              <div className="font-medium ">{item.associado.nome}</div>
                              <div className=" text-muted-foreground">{item.associado.bairro}</div>
                           
                          </TableCell>
                          <TableCell className="text-xs">
                            
                              {item.associado.endereco}, {item.associado.numero}
                              <br />
                              <span className="text-muted-foreground">{item.associado.cidade}</span>
                            
                          </TableCell>
                          <TableCell className="text-xs">
                           
                              <div>{item.associado.celular1}</div>
                              {item.associado.celular2 && (
                                <div className="text-muted-foreground">{item.associado.celular2}</div>
                              )}
                            
                          </TableCell>
                          <TableCell className="text-xs">
                            <Badge variant="destructive">{item.overdueCount} vencidas</Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            <span className="font-medium text-red-600">R$ {item.totalOverdueAmount.toFixed(2)}</span>
                          </TableCell>
                          <TableCell>{item.status_visita && <StatusBadge status={item.status_visita} />}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                   
                              {item.check_in && (
                                <div className="text-xs">
                                  <span className="text-green-600">In:</span> {item.check_in.data && new Date(item.check_in.data).toLocaleDateString('pt-BR',{
                                    timeZone:'America/Fortaleza'
                                  })} - {item.check_in.data && new Date(item.check_in.data).toLocaleTimeString('pt-BR',{
                                    timeZone:'America/Fortaleza'
                                  })}
                                </div>
                              )}
                              {item.check_out && (
                                <div className="text-xs">
                                  <span className="text-red-600">Out:</span> {item.check_out.data.toLocaleString('pt-BR')}
                                </div>
                              )}
                              {item.check_out?.observacoes && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="outline" className="text-xs cursor-help">
                                      Obs
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{item.check_out.observacoes}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="flex gap-1">
                              {item.check_in && (
                                <MapButton
                                  coordenadas={{
                                    inLocale:{
                                      lat_In:item.check_in.coordenadas.latitude,
                                      lng_In:item.check_in.coordenadas.longitude
                                    },
                                    outLocale:{
                                      lat_Out:item.check_out?.coordenadas.latitude,
                                      lng_Out:item.check_out?.coordenadas.longitude
                                    }
                                  }}
                                  endereco={`${item.associado.endereco}, ${item.associado.numero}`}
                                />
                              )}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Phone className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Ligar para {item.associado.celular1}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
)
}