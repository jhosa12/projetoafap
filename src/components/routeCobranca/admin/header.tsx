"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"
import RouteGenerator from "../RouteGenerator"
import { ConsultoresProps } from "@/types/consultores"
import { RotaFilterProps } from "@/pages/dashboard/cobranca/rotas"

interface HeaderProps {
 // activeFiltersCount: number
  onOpenFilters: () => void
empresa:{
    id_empresa:string,
    nome:string
},
cidadesEmpresa:Array<string>
cobradores:ConsultoresProps[]

}

export function Header({onOpenFilters,empresa,cidadesEmpresa,cobradores }: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Gestão de Rotas de Cobrança</h1>
          <p className="text-gray-600">Administre e monitore as rotas de cobrança da empresa</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onOpenFilters}>
            <Filter  />
            Filtros
         
          </Button>
           <RouteGenerator empresa={empresa} cidadesEmpresa={cidadesEmpresa} cobradores={cobradores} />
        </div>
      </div>
    </div>
  )
}
