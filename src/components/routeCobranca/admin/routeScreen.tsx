"use client"

import { useState } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CobrancaStats, RouteProps } from "@/types/cobranca"
import { Header } from "./header"
import { StatsCards } from "./stats-cards"
import { RoutesTable } from "./routes-table"
import { NewRouteDialog } from "./new-route-dialog"
import { FiltersDialog } from "./filters-dialog"
import { RouteDetailsDialog } from "./route-details-dialog"
import RouteDetailsModal from "../routeManagement/RouteDetailsModal"
import RouteGenerator from "../RouteGenerator"
import { EmpresaProps } from "@/types/empresa"

interface Props{
    routes: RouteProps[]
    empresas:EmpresaProps[] | null
}

export default function CobrancaAdmin({routes,empresas}: Props) {
  
  const [selectedRoute, setSelectedRoute] = useState<RouteProps | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newRouteOpen, setNewRouteOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({
    consultor: "",
    status: "todos", // Default to "todos" to show all initially
    bairro: "",
  })

  const handleViewDetails = (route: RouteProps) => {
    setSelectedRoute(route)
    setDialogOpen(true)
  }

//   const handleNewRoute = (newRouteData: Omit<RouteProps, "id_cobranca" | "dt_created" | "dt_updated">) => {
//     const newRoute: RouteProps = {
//       ...newRouteData,
//       id_cobranca: Math.max(...routes.map((r) => r.id_cobranca)) + 1,
//       dt_created: new Date(),
//       dt_updated: new Date(),
//     }
//     setRoutes((prev) => [...prev, newRoute])
//   }

  const filteredRoutes = routes.filter((route) => {
    return (
      (!filters.consultor || route.consultor.toLowerCase().includes(filters.consultor.toLowerCase())) &&
      (filters.status === "todos" || route.status === filters.status) &&
      (!filters.bairro || route.parametros.bairros.some((b) => b.toLowerCase().includes(filters.bairro.toLowerCase())))
    )
  })

  const activeFiltersCount = Object.values(filters).filter((value) => value && value !== "todos").length

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <Header
          activeFiltersCount={activeFiltersCount}
          onOpenFilters={() => setFiltersOpen(true)}
          empresas={empresas}
        />
        <StatsCards stats={{}as CobrancaStats} />
        <RoutesTable
          routes={filteredRoutes}
          onViewDetails={handleViewDetails}
          onOpenFilters={() => setFiltersOpen(true)}
        />

        <NewRouteDialog open={newRouteOpen} onOpenChange={setNewRouteOpen} onSave={()=>{}} />
         
        <FiltersDialog
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          filters={filters}
          onFiltersChange={setFilters}
        />
        <RouteDetailsDialog route={selectedRoute} open={dialogOpen} onOpenChange={setDialogOpen} />
      </div>
    </TooltipProvider>
  )
}
