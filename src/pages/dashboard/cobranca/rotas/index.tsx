import { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Plus, Eye, Calendar, Users, TrendingUp } from "lucide-react";
import RouteGenerator from "@/components/routeCobranca/RouteGenerator";
import RouteDetailsModal from "@/components/routeCobranca/routeManagement/RouteDetailsModal";
import { AuthContext } from "@/store/AuthContext";


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

const mockRoutes: Route[] = [
  {
    id: "R001",
    consultant: "João Silva",
    districts: ["Centro", "Vila Nova"],
    clientsTotal: 45,
    clientsVisited: 28,
    amountCollected: 15420.50,
    status: 'ativa',
    createdAt: new Date('2025-07-01'),
    deadline: new Date('2025-07-15')
  },
  {
    id: "R002", 
    consultant: "Maria Santos",
    districts: ["Jardim América"],
    clientsTotal: 32,
    clientsVisited: 32,
    amountCollected: 22100.00,
    status: 'concluida',
    createdAt: new Date('2025-06-28'),
    deadline: new Date('2025-07-10')
  },
  {
    id: "R003",
    consultant: "Pedro Costa", 
    districts: ["Industrial", "Santa Mônica"],
    clientsTotal: 38,
    clientsVisited: 12,
    amountCollected: 8750.25,
    status: 'ativa',
    createdAt: new Date('2025-07-02'),
    deadline: new Date('2025-07-20')
  }
];

const RouteManagement = () => {
  const [routes] = useState<Route[]>(mockRoutes);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const {empresas} = useContext(AuthContext)

  const getStatusColor = (status: Route['status']) => {
    switch (status) {
      case 'ativa': return 'default';
      case 'pausada': return 'secondary';
      case 'concluida': return 'destructive';
      default: return 'outline';
    }
  };

  const getProgressPercentage = (visited: number, total: number) => {
    return Math.round((visited / total) * 100);
  };

  const totalActive = routes.filter(r => r.status === 'ativa').length;
  const totalAmount = routes.reduce((sum, r) => sum + r.amountCollected, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Acompanhamento de Rotas</h1>
          </div>
          <p className="text-sm text-gray-600">Monitore o progresso das rotas de cobrança</p>
        </div>

        <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Rota
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gerar Nova Rota</DialogTitle>
            </DialogHeader>
            <RouteGenerator empresas={empresas} onClose={() => setIsGeneratorOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rotas Ativas</p>
                <p className="text-2xl font-bold text-blue-600">{totalActive}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Arrecadado</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Consultores</p>
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(routes.map(r => r.consultant)).size}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rotas em Andamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Consultor</TableHead>
                <TableHead>Bairros</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Arrecadado</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.id}</TableCell>
                  <TableCell>{route.consultant}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {route.districts.slice(0, 2).map(district => (
                        <Badge key={district} variant="outline" className="text-xs">
                          {district}
                        </Badge>
                      ))}
                      {route.districts.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{route.districts.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{route.clientsVisited}/{route.clientsTotal}</span>
                        <span>{getProgressPercentage(route.clientsVisited, route.clientsTotal)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${getProgressPercentage(route.clientsVisited, route.clientsTotal)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-green-600 font-medium">
                    R$ {route.amountCollected.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(route.status)}>
                      {route.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {route.deadline.toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedRoute(route);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RouteDetailsModal 
        route={selectedRoute}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default RouteManagement;
