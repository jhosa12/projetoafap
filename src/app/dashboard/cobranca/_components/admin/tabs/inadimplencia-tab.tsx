import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "../status-badge"
import { MapButton } from "../map-button"
import { RouteProps } from "../../../types/types"

export function InadimplenciaTab({ route }: { route: RouteProps }) {
  // Calculate status counts
  const statusCounts = route.cobranca.reduce((acc, item) => {
    const status = item.consultorRegistro?.status_consultor || 'NAO DEFINIDO';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Ensure all statuses are included with 0 count if not present
  const allStatuses = [
    'NÃO LOCALIZADO', 
    'NÃO QUER VISITA', 
    'NÃO ESTAVA EM CASA', 
    'LOCALIZADO',
    'NAO DEFINIDO'
  ] as const;

  return (
    <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
      <div className="flex flex-wrap gap-2 mb-4">
        {allStatuses.map((status) => (
          <Badge key={status} variant="secondary" className="text-xs">
            {status}: {statusCounts[status] || 0}
          </Badge>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Mensalidades</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Check-in/out</TableHead>
            <TableHead>Obs.</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {route.cobranca.map((item) => (
            <TableRow key={item.id_global} className="text-xs">
              <TableCell>
                <div className="font-medium">{item.associado.nome}</div>
                <div className="text-muted-foreground">{item.associado.bairro}</div>
              </TableCell>
              <TableCell>
                {item.associado.endereco}, {item.associado.numero}
                <br />
                <span className="text-muted-foreground">{item.associado.cidade}</span>
              </TableCell>
              <TableCell>
                <div>{item.associado.celular1}</div>
                {item.associado.celular2 && (
                  <div className="text-muted-foreground">{item.associado.celular2}</div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="destructive">{item.overdueCount} vencidas</Badge>
              </TableCell>
              <TableCell>
                <span className="font-medium text-red-600">R$ {item.totalOverdueAmount.toFixed(2)}</span>
              </TableCell>
              <TableCell>
                {item.status_visita && <StatusBadge status={item.status_visita} />}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {item.check_in && (
                    <div className="text-xs">
                      <span className="text-green-600">In:</span> {item.check_in.data && new Date(item.check_in.data).toLocaleString('pt-BR')}
                    </div>
                  )}
                  {item.check_out && (
                    <div className="text-xs">
                      <span className="text-red-600">Out:</span> {item.check_out.data && new Date(item.check_out.data).toLocaleString('pt-BR')}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-semibold">
                {item.consultorRegistro?.status_consultor}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {item.check_in && (
                    <MapButton
                      coordenadas={{
                        inLocale: {
                          lat_In: item.check_in.coordenadas.latitude,
                          lng_In: item.check_in.coordenadas.longitude
                        },
                        outLocale: item.check_out?.coordenadas ? {
                          lat_Out: item.check_out.coordenadas.latitude,
                          lng_Out: item.check_out.coordenadas.longitude
                        } : undefined
                      }}
                      endereco={`${item.associado.endereco}, ${item.associado.numero}`}
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}