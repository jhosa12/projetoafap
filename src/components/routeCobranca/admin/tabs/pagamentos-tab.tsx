
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/axios/apiClient"
import { MensalidadePagaProps, RouteProps } from "@/types/cobranca"
import { Download } from "lucide-react"
import { toast } from "sonner"



export function PagamentosTab({ pagamentos }: { pagamentos: Array<MensalidadePagaProps> }) {


  const handlePagamento = async () => {

    try {
      const response = await api.post("/cobranca/sincPag", {
       mensalidades:pagamentos
      })
      toast.success('Dados baixados com sucesso')
    } catch (error) {

      console.log(error)
      toast.error('Erro ao baixar dados')
      
    }
  }

return (
  <div>
    <Button variant="outline" onClick={handlePagamento}>
      Baixar
      <Download className="h-4 w-4" />
    </Button>
 <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Referência</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Data Pagamento</TableHead>
                        <TableHead>Forma Pagamento</TableHead>
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
                          <TableCell>{pagamento.forma_pagto}</TableCell>
                          <TableCell>{pagamento.observacoes || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
  </div>
    
)
}
