
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MensalidadePagaProps } from "../../../types/types"




export function PagamentosTab({ pagamentos }: { pagamentos: Array<MensalidadePagaProps>,id_rota:number }) {



  


const getStatusColor = (status:string|undefined)=>{
  switch (status) {
    case "A":
      return "warning"
    case "PAGO":
      return "success"
    case "ERRO":
      return "destructive"
    default:
      return "default"
  }
}

return (
  <div>
   
 <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Referência</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Data Pagamento</TableHead>
                        <TableHead>Forma Pagamento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Observações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagamentos?.map((pagamento,index) => (
                        <TableRow className="text-xs" key={index}>
                          <TableCell>{pagamento.cliente_nome}</TableCell>
                          <TableCell>{pagamento.referencia}</TableCell>
                          <TableCell>R$ {pagamento.valor_principal.toFixed(2)}</TableCell>
                          <TableCell>{pagamento.data_pgto ? new Date(pagamento.data_pgto).toLocaleDateString() : "-"}</TableCell>
                          <TableCell>{pagamento.forma_pagto}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(pagamento.status)}>
                            {pagamento.status}
                              </Badge></TableCell>
                            <TableCell>{pagamento.observacoes || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
  </div>
    
)
}
