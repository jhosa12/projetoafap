import { Card, CardContent } from "@/components/ui/card"
import { CobrancaStats } from "@/types/cobranca"


interface StatsCardsProps {
  stats: CobrancaStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalClientes}</div>
            <p className="text-xs text-muted-foreground">Total de Clientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalMensalidades}</div>
            <p className="text-xs text-muted-foreground">Mensalidades</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">R$ {stats?.valorTotal?.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Valor Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.clientesVisitados}</div>
            <p className="text-xs text-muted-foreground">Clientes Visitados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">R$ {stats?.valorRecebido?.toFixed(2) || "0.00"}</div>
            <p className="text-xs text-muted-foreground">Valor Recebido</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
