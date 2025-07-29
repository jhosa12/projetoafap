import { RouteProps } from "@/types/cobranca";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";





export function SolicitacoesTab({ route }: { route: RouteProps }) {

return (
    <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Cliente</TableHead>
        <TableHead>Categoria</TableHead>
        <TableHead>Descrição</TableHead>
        <TableHead>Contrato</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {route.solicitacoes.map((solicitacao) => (
        <TableRow className="text-xs" key={solicitacao.id_global}>
          <TableCell>{solicitacao.nome_cliente}</TableCell>
          <TableCell>
            <Badge className="text-xs" variant="outline">{solicitacao.categoria}</Badge>
          </TableCell>
          <TableCell>{solicitacao.descricao}</TableCell>
          <TableCell>{solicitacao.id_contrato}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)
}
