import { useEffect, useRef, useState } from "react";
import { MdPrint } from "react-icons/md";
import { Phone, UserPlus, Archive, TrendingUp, Calendar, DollarSign } from "lucide-react";
import ResumoVendedor from "@/Documents/vendas/ResumoVendedor";
import { useReactToPrint } from "react-to-print";

import useApiGet from "@/hooks/useApiGet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { pageStyle } from "@/utils/pageStyle";
import { Spinner } from "../../../../components/ui/spinner";
import { VendasProps } from "./sales/SalesDataTable";
import { ConsultorLeads } from "./sales/SalesTracking";
import { ModalDetalhesLeads } from "./ModalDetalhesLeads";

interface DataProps {
  show: boolean,
  setModalVend: (open: boolean) => void
  vendedor: VendasProps,
  startDate: Date,
  endDate: Date,
  leads: Array<ConsultorLeads>
  usuario: string,
  logoUrl: string,
  id_empresa:string
}

interface AdesaoProps {
  id_contrato: number,
  dt_adesao: Date,
  situacao: string,
  associado: { nome: string },
  valor_mensalidade: number
}

interface ResumoVendedorProps {
  adesoes: Array<AdesaoProps>,
  leads: Array<{
    id_lead: number,
    data: Date,
    status: string,
    nome: string
  }>
}

export function ModalVendedor({ endDate, setModalVend, show, startDate, vendedor, usuario, logoUrl,id_empresa }: DataProps) {
  const { data, postData, loading } = useApiGet<ResumoVendedorProps, { startDate: Date, endDate: Date, id_consultor: number | null, consultor: string,id_empresa:string }>("/vendas/resumoVendedor")
  const componenteRef = useRef<HTMLDivElement>(null);
  const [print, setPrint] = useState(false)
  const [modalDetalhes, setModalDetalhes] = useState<{
    open: boolean;
    tipo: "LEAD" | "PROSPECCAO" | "PREV VENDA" | null;
  }>({ open: false, tipo: null });

  useEffect(() => {
    postData({ startDate, endDate, id_consultor: vendedor.id_consultor, consultor: vendedor.consultor,id_empresa })
  }, [vendedor.id_consultor])

  useEffect(() => {
    print && handlePrint()
  }, [print])

  const handlePrint = useReactToPrint({
    contentRef: componenteRef,
    pageStyle: pageStyle,
    // onBeforePrint: async() => setPrint(false),
  })

  const totalLeads = data?.leads.filter((lead) => lead.status === "LEAD").length ?? 0;
  const totalProspeccoes = data?.leads.filter((lead) => lead.status === "PROSPECCAO").length ?? 0;
  const totalPreVendas = data?.leads.filter((lead) => lead.status === "PREV VENDA").length ?? 0;
  const totalAdesoes = data?.adesoes?.length ?? 0;
  const valorTotal = data?.adesoes?.reduce((acc, item) => acc + Number(item.valor_mensalidade), 0) ?? 0;

  return (
    <Dialog open={show} onOpenChange={setModalVend}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{vendedor?.consultor}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            Período: {new Date(startDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })} até{" "}
            {new Date(endDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : (
          <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
            <div className="space-y-3">
              {/* Métricas Compactas */}
              <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
                <div 
                  className="border rounded-md p-2 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setModalDetalhes({ open: true, tipo: "LEAD" })}
                >
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Leads</p>
                      <p className="text-lg font-semibold">{totalLeads}</p>
                    </div>
                  </div>
                </div>

                <div 
                  className="border rounded-md p-2 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setModalDetalhes({ open: true, tipo: "PROSPECCAO" })}
                >
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Prospecções</p>
                      <p className="text-lg font-semibold">{totalProspeccoes}</p>
                    </div>
                  </div>
                </div>

                <div 
                  className="border rounded-md p-2 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setModalDetalhes({ open: true, tipo: "PREV VENDA" })}
                >
                  <div className="flex items-center gap-2">
                    <Archive className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Pré-Vendas</p>
                      <p className="text-lg font-semibold">{totalPreVendas}</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-2 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Vendas</p>
                      <p className="text-lg font-semibold">{totalAdesoes}</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-2 bg-muted/50">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] text-muted-foreground font-medium">Valor Total</p>
                      <p className="text-base font-bold">
                        {valorTotal.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabela de Adesões */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalhamento de Vendas</CardTitle>
                  <CardDescription>
                    Lista completa de adesões realizadas no período
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Contrato</TableHead>
                          <TableHead className="font-semibold">Data</TableHead>
                          <TableHead className="font-semibold">Nome</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.adesoes?.map((item) => (
                          <TableRow key={item.id_contrato} className="hover:bg-muted/50">
                            <TableCell className="font-medium">#{item.id_contrato}</TableCell>
                            <TableCell>
                              {new Date(item.dt_adesao).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">{item.associado.nome}</TableCell>
                            <TableCell>
                              <Badge variant={item.situacao === "ATIVO" ? "default" : "secondary"}>
                                {item.situacao}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {Number(item.valor_mensalidade).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </TableCell>
                          </TableRow>
                        ))}
                        {data?.adesoes?.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                              Nenhuma venda registrada no período
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          <Button variant="outline" className="ml-auto" onClick={() => setPrint(!print)}>
            <MdPrint />
            Imprimir Resumo
          </Button>
        </DialogFooter>

        <div style={{ display: "none" }}>
          {print && (
            <ResumoVendedor
              logoUrl={logoUrl}
              usuario={usuario}
              endDate={endDate}
              startDate={startDate}
              vendedor={vendedor.consultor}
              adesoes={data?.adesoes ?? []}
              ref={componenteRef}
            />
          )}
        </div>
      </DialogContent>

      {modalDetalhes.open && modalDetalhes.tipo && (
        <ModalDetalhesLeads
          open={modalDetalhes.open}
          onClose={() => setModalDetalhes({ open: false, tipo: null })}
          leads={data?.leads ?? []}
          tipo={modalDetalhes.tipo}
        />
      )}
    </Dialog>
  )
}