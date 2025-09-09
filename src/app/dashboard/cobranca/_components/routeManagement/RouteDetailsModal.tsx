import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Calendar, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Route {
  id: string;
  consultant: string;
  districts: string[];
  clientsTotal: number;
  clientsVisited: number;
  amountCollected: number;
  status: 'ativa' | 'pausada' | 'concluida';
  createdAt: Date;
  deadline: Date;
}

interface RouteDetailsModalProps {
  route: Route | null;
  isOpen: boolean;
  onClose: () => void;
}

const mockClients = [
  { name: "João Santos", address: "Rua A, 123", amount: 450.00, status: "pago", visitDate: "01/07/2025" },
  { name: "Maria Silva", address: "Rua B, 456", amount: 320.50, status: "pendente", visitDate: "02/07/2025" },
  { name: "Pedro Costa", address: "Rua C, 789", amount: 280.00, status: "pago", visitDate: "01/07/2025" },
];

const RouteDetailsModal = ({ route, isOpen, onClose }: RouteDetailsModalProps) => {
  if (!route) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'default';
      case 'pendente': return 'secondary';
      case 'reagendado': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Rota {route.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Consultor</p>
                    <p className="font-medium">{route.consultant}</p>
                  </div>
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Progresso</p>
                    <p className="font-medium">{route.clientsVisited}/{route.clientsTotal}</p>
                  </div>
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Arrecadado</p>
                    <p className="font-medium text-green-600">
                      R$ {route.amountCollected.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Prazo</p>
                    <p className="font-medium">{route.deadline.toLocaleDateString('pt-BR')}</p>
                  </div>
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Bairros da Rota
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {route.districts.map(district => (
                  <Badge key={district} variant="outline">
                    {district}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Clientes da Rota</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Visita</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClients.map((client, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell className="text-sm text-gray-600">{client.address}</TableCell>
                      <TableCell className="font-medium">
                        R$ {client.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{client.visitDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RouteDetailsModal;