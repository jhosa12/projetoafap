"use client";

import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import RouteGenerator from "../RouteGenerator";
import { ConsultoresProps } from "@/types/consultores";
import { useFormContext } from "react-hook-form";
import { RotaFilterProps } from "../../types/types";
import { Dispatch, SetStateAction, useState } from "react";

interface HeaderProps {
  // activeFiltersCount: number
  onOpenFilters: () => void;
  empresa: {
    id_empresa: string;
    nome: string;
  };
  cidadesEmpresa: Array<string>;
  cobradores: ConsultoresProps[];
  getRotas: (data: RotaFilterProps) => Promise<void>;

}

export function Header({
  onOpenFilters,
  empresa,
  cidadesEmpresa,
  cobradores,
  getRotas,

}: HeaderProps) {
  const methodos = useFormContext<RotaFilterProps>();
 const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const { getValues } = methodos;
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Gestão de Rotas de Cobrança
          </h1>
          <p className="text-gray-600">
            Administre e monitore as rotas de cobrança da empresa
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onOpenFilters}>
            <Filter />
            Filtros
          </Button>
           <Button variant={"default"} type="button" onClick={()=>setIsGeneratorOpen(true)}>
          <Plus />
          Nova Rota
        </Button>
         {isGeneratorOpen && <RouteGenerator
            empresa={empresa}
            cidadesEmpresa={cidadesEmpresa}
            cobradores={cobradores}
            getRotas={getRotas}
            filters={getValues()}
            isGeneratorOpen={isGeneratorOpen}
            setIsGeneratorOpen={setIsGeneratorOpen}

          />}
        </div>
      </div>
    </div>
  );
}
