
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MensalidadePagaProps, RouteProps } from "@/types/cobranca"



export function PagamentosTab({ pagamentos }: { pagamentos: Array<MensalidadePagaProps> }) {

return (
     <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Referência</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Data Pagamento</TableHead>
                        <TableHead>Observações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagamentos?.map((pagamento) => (
                        <TableRow className="text-xs" key={pagamento.id_mensalidade_global}>
                          <TableCell>{pagamento.cliente_nome}</TableCell>
                          <TableCell>{pagamento.referencia}</TableCell>
                          <TableCell>R$ {pagamento.valor_principal.toFixed(2)}</TableCell>
                          <TableCell>{pagamento.data_pgto ? new Date(pagamento.data_pgto).toLocaleDateString() : "-"}</TableCell>
                          <TableCell>{pagamento.observacoes || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
)
}
