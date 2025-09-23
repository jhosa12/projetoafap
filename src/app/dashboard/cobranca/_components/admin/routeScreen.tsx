"use client"

import { useState } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Header } from "./header"
import { StatsCards } from "./stats-cards"
import { RoutesTable } from "./routes-table"
import { FiltersDialog } from "./filters-dialog"
import { RouteDetailsDialog } from "./route-details-dialog"
import { ConsultoresProps } from "@/types/consultores"

import { FormProvider, useForm } from "react-hook-form"
import { CobrancaStats, RotaFilterProps, RouteProps } from "../../types/types"
import { useRouterActions } from "../../_hooks/useRouterActions"


interface Props{

    empresa:{
        id_empresa:string,
        nome:string
    },
    cidadesEmpresa:Array<string>
    cobradores:ConsultoresProps[],
 
    
}

export default function CobrancaAdmin({empresa,cidadesEmpresa,cobradores}: Props) {
  
  const [selectedRoute, setSelectedRoute] = useState<RouteProps | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const methods = useForm<RotaFilterProps>()

  const {getRotas,handleSincData,initialFilters,routes} = useRouterActions({})


  const handleViewDetails = (route: RouteProps) => {
    setSelectedRoute(route)
    setDialogOpen(true)
  }


const statsCobranca:CobrancaStats = {
    totalClientes:routes.reduce((total, route) => total + (route.cobranca?.length || 0), 0),
    totalMensalidades:0,
    valorTotal:0,
    clientesVisitados:routes.reduce((total, route) => {
      return total+route.cobranca?.filter(c => c.check_in && c.check_out).length || 0
    }, 0),
    mensalidadesPagas:routes.reduce((total,route)=>{
      return route?.pagamentos?.length? total+(route.pagamentos?.length):total
    },0),
    valorRecebido:routes.reduce((total,route)=>total+(route.pagamentos?.reduce((sum,pag)=>sum+(pag.valor_forma??0),0) ??0),0)
}
  return (
    <FormProvider {...methods}>
    <TooltipProvider>
      <div className=" bg-gray-50">
        <Header
          getRotas={getRotas}
          onOpenFilters={() => setFiltersOpen(true)}
          empresa={empresa}
          cidadesEmpresa={cidadesEmpresa}
          cobradores={cobradores}
        />
        <StatsCards stats={statsCobranca} />
        <RoutesTable
          routes={routes}
          onViewDetails={handleViewDetails}
          onOpenFilters={() => setFiltersOpen(true)}
        />
        <FiltersDialog
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          filters={initialFilters}
          getRotas={getRotas}
        />
        <RouteDetailsDialog getRotas={()=>{getRotas(methods.getValues())}} route={selectedRoute} open={dialogOpen} onOpenChange={setDialogOpen} />
      </div>
    </TooltipProvider>
    </FormProvider>
  )
}
