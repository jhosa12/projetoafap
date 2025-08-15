import { RouteProps, SolicitacaoCobradorProps } from "@/types/cobranca";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { SolicitacoesCobrador } from "@/Documents/cobranca/SolicitacoesCobrador";





export function SolicitacoesTab({ solicitacoes }: { solicitacoes: Array<SolicitacaoCobradorProps> }) {
  const currentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    content() {
      return currentRef.current
    },
  })

return (
    <div >  
    <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Cliente</TableHead>
        <TableHead>Categoria</TableHead>
        <TableHead>Descrição</TableHead>
        <TableHead>Contrato</TableHead>
        <TableHead>Ações</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {solicitacoes?.map((solicitacao) => (
        <TableRow className="text-xs" key={solicitacao.id_global}>
          <TableCell>{solicitacao.nome_cliente}</TableCell>
          <TableCell>
            <Badge className="text-xs" variant="outline">{solicitacao.categoria}</Badge>
          </TableCell>
          <TableCell>{solicitacao.descricao}</TableCell>
          <TableCell>{solicitacao.id_contrato}</TableCell>
          <TableCell><Button variant="outline" onClick={handlePrint}><Printer /></Button></TableCell>       
           </TableRow>
      ))}
    </TableBody>
  </Table>

{
  <div style={{ display: 'none' }}>
<SolicitacoesCobrador ref={currentRef} solicitacoes={solicitacoes} /> 
</div>
}
  </div>
)
}
