"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"
import RouteGenerator from "../RouteGenerator"
import { EmpresaProps } from "@/types/empresa"

interface HeaderProps {
  activeFiltersCount: number
  onOpenFilters: () => void
selectEmp:string
}

export function Header({ activeFiltersCount, onOpenFilters,selectEmp }: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Rotas de Cobrança</h1>
          <p className="text-gray-600 mt-1">Administre e monitore as rotas de cobrança da empresa</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onOpenFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
           <RouteGenerator selectEmp={selectEmp} />
        </div>
      </div>
    </div>
  )
}
