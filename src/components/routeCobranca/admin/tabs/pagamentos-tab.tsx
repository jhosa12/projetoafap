
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RouteProps } from "@/types/cobranca"



export function PagamentosTab({ route }: { route: RouteProps }) {

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
                      {route.pagamentos.map((pagamento) => (
                        <TableRow key={pagamento.id_mensalidade_global}>
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
