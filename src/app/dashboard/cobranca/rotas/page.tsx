'use client';

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/store/AuthContext";
import { RouteProps } from "@/types/cobranca";
import { api } from "@/lib/axios/apiClient";
import CobrancaAdmin from "@/app/dashboard/cobranca/components/admin/routeScreen";
import { DateRange } from "react-day-picker";
import { ajustarData } from "@/utils/ajusteData";

export interface RotaFilterProps {
  consultor: string;
  status: string;
  bairro: string;
  dateRange: DateRange | undefined;
}
const RouteManagement = () => {
  const [routes, setRoutes] = useState<RouteProps[]>([]);
  const { infoEmpresa, cidadesEmpresa, consultores } = useContext(AuthContext);

  const cobradores = consultores.filter((c) => c.funcao === "COBRADOR (RDA)");

  const initialFilters: RotaFilterProps = {
    consultor: "",
    bairro: "",
    dateRange: {
      from: new Date(),
      to: new Date(),
    },
    status: "",
  };

  useEffect(() => {
    getRotas(initialFilters);
  }, []);

  const getRotas = async (data: RotaFilterProps) => {

    const {dataIni,dataFim} = ajustarData(data.dateRange?.from,data.dateRange?.to)
    try {
      const response = await api.post("/cobranca/rotas",
        {
          startDate:dataIni,
          endDate:dataFim
        }
      );
      setRoutes(response.data);
    } catch (error) {}
  };

  // const getProgressPercentage = (visited: number, total: number) => {
  //   return Math.round((visited / total) * 100);
  // };

  // const totalActive = routes.filter((r) => r.status === "ativa").length;
  // const totalAmount = 0;
  // const totalAmount = routes.reduce((sum, r) => sum + r.amountCollected, 0);

  return (
    <CobrancaAdmin
      cobradores={consultores}
      routes={routes}
      empresa={{id_empresa:infoEmpresa?.id!,nome:infoEmpresa?.nome??''}}
      cidadesEmpresa={cidadesEmpresa}
      initialFilters={initialFilters}
      getRotas={getRotas}
    />
    // <div className="p-6 max-w-7xl mx-auto">
    //   <div className="flex items-center justify-between mb-6">
    //     <div>
    //       <div className="flex items-center gap-2 mb-2">
    //         <MapPin className="h-5 w-5 text-blue-600" />
    //         <h1 className="text-2xl font-semibold text-gray-900">Acompanhamento de Rotas</h1>
    //       </div>
    //       <p className="text-sm text-gray-600">Monitore o progresso das rotas de cobrança</p>
    //     </div>

    //     <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
    //       <DialogTrigger asChild>
    //         <Button className="flex items-center gap-2">
    //           <Plus className="h-4 w-4" />
    //           Nova Rota
    //         </Button>
    //       </DialogTrigger>
    //       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
    //         <DialogHeader>
    //           <DialogTitle>Gerar Nova Rota</DialogTitle>
    //         </DialogHeader>
    //         <RouteGenerator empresas={empresas} onClose={() => setIsGeneratorOpen(false)} />
    //       </DialogContent>
    //     </Dialog>
    //   </div>

    //   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    //     <Card>
    //       <CardContent className="pt-6">
    //         <div className="flex items-center justify-between">
    //           <div>
    //             <p className="text-sm font-medium text-gray-600">Rotas Ativas</p>
    //             <p className="text-2xl font-bold text-blue-600">{totalActive}</p>
    //           </div>
    //           <MapPin className="h-8 w-8 text-blue-600" />
    //         </div>
    //       </CardContent>
    //     </Card>

    //     <Card>
    //       <CardContent className="pt-6">
    //         <div className="flex items-center justify-between">
    //           <div>
    //             <p className="text-sm font-medium text-gray-600">Total Arrecadado</p>
    //             <p className="text-2xl font-bold text-green-600">
    //               R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
    //             </p>
    //           </div>
    //           <TrendingUp className="h-8 w-8 text-green-600" />
    //         </div>
    //       </CardContent>
    //     </Card>

    //     <Card>
    //       <CardContent className="pt-6">
    //         <div className="flex items-center justify-between">
    //           <div>
    //             <p className="text-sm font-medium text-gray-600">Consultores</p>
    //             <p className="text-2xl font-bold text-purple-600">
    //               {0}
    //             </p>
    //           </div>
    //           <Users className="h-8 w-8 text-purple-600" />
    //         </div>
    //       </CardContent>
    //     </Card>
    //   </div>

    //   <Card>
    //     <CardHeader>
    //       <CardTitle className="text-lg">Rotas em Andamento</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <Table>
    //         <TableHeader>
    //           <TableRow>
    //             <TableHead>ID</TableHead>
    //             <TableHead>Consultor</TableHead>
    //             <TableHead>Bairros</TableHead>
    //             <TableHead>Progresso</TableHead>
    //             <TableHead>Arrecadado</TableHead>
    //             <TableHead>Status</TableHead>
    //             <TableHead>Prazo</TableHead>
    //             <TableHead>Ações</TableHead>
    //           </TableRow>
    //         </TableHeader>
    //         <TableBody>
    //           {routes.map((route) => (
    //             <TableRow key={route.id_cobranca}>
    //               <TableCell className="font-medium">{route.id_cobranca}</TableCell>
    //               <TableCell>{route.consultor}</TableCell>
    //               <TableCell>
    //                 <div className="flex flex-wrap gap-1">
    //                   {route.parametros.bairros.slice(0, 2).map(district => (
    //                     <Badge key={district} variant="outline" className="text-xs">
    //                       {district}
    //                     </Badge>
    //                   ))}
    //                   {route.parametros.bairros.length > 2 && (
    //                     <Badge variant="outline" className="text-xs">
    //                       +{route.parametros.bairros.length - 2}
    //                     </Badge>
    //                   )}
    //                 </div>
    //               </TableCell>
    //               <TableCell>
    //                 <div className="space-y-1">
    //                   <div className="flex justify-between text-xs">
    //                     {/* <span>{route.clientsVisited}/{route.clientsTotal}</span>
    //                     <span>{getProgressPercentage(route.clientsVisited, route.clientsTotal)}%</span> */}
    //                   </div>
    //                   <div className="w-full bg-gray-200 rounded-full h-2">
    //                     <div
    //                       className="bg-blue-600 h-2 rounded-full"
    //                       // style={{ width: `${getProgressPercentage(route.clientsVisited, route.clientsTotal)}%` }}
    //                     />
    //                   </div>
    //                 </div>
    //               </TableCell>
    //               <TableCell className="text-green-600 font-medium">
    //                 R$ {route.pagamentos.reduce((total, pagamento) => total + pagamento.valor_principal, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
    //               </TableCell>
    //               <TableCell>
    //                 <Badge variant={getStatusColor(route.status)}>
    //                   {route.status}
    //                 </Badge>
    //               </TableCell>
    //               <TableCell className="text-sm">
    //                 {/* {route.deadline.toLocaleDateString('pt-BR')} */}
    //               </TableCell>
    //               <TableCell>
    //                 <Button
    //                   variant="outline"
    //                   size="sm"
    //                   onClick={() => {
    //                     setSelectedRoute(route);
    //                     setIsDetailsOpen(true);
    //                   }}
    //                 >
    //                   <Eye className="h-3 w-3" />
    //                 </Button>
    //               </TableCell>
    //             </TableRow>
    //           ))}
    //         </TableBody>
    //       </Table>
    //     </CardContent>
    //   </Card>

    //   {/* <RouteDetailsModal
    //     route={selectedRoute}
    //     isOpen={isDetailsOpen}
    //     onClose={() => setIsDetailsOpen(false)}
    //   /> */}
    // </div>
  );
};

export default RouteManagement;
