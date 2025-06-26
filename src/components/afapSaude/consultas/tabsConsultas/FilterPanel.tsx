import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Stethoscope } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"




export const FilterPanel = () => {
    return (
       <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-blue-600" />
            <Select>
                <SelectTrigger className="max-w-56 text-xs h-8">
                    <SelectValue placeholder="Selecione um filtro" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="confirmed">Confirmados</SelectItem>
                    <SelectItem value="waiting">Aguardando</SelectItem>
                    <SelectItem value="in-progress">Em Atendimento</SelectItem>
                </SelectContent>
            </Select>
            
           </div>
    );
};