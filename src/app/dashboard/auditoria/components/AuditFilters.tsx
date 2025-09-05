import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AuditLog } from "@/types/audit";

interface AuditFiltersProps {
  filters: AuditLog;
  onFiltersChange: (filters: AuditLog) => void;
  onClearFilters: () => void;
}

export default function AuditFilters({ filters, onFiltersChange, onClearFilters }: AuditFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-500" />
          <h3 className="font-semibold text-slate-900">Filtros</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Pesquisar..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.action || ""} onValueChange={(value) => handleFilterChange("action", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Ação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todas as ações</SelectItem>
            <SelectItem value="CREATE">Criar</SelectItem>
            <SelectItem value="UPDATE">Atualizar</SelectItem>
            <SelectItem value="DELETE">Deletar</SelectItem>
            <SelectItem value="LOGIN">Login</SelectItem>
            <SelectItem value="LOGOUT">Logout</SelectItem>
            <SelectItem value="VIEW">Visualizar</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.model || ""} onValueChange={(value) => handleFilterChange("model", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Modelo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os modelos</SelectItem>
            <SelectItem value="User">Usuário</SelectItem>
            <SelectItem value="Product">Produto</SelectItem>
            <SelectItem value="Order">Pedido</SelectItem>
            <SelectItem value="Customer">Cliente</SelectItem>
            <SelectItem value="Invoice">Fatura</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.timestamp ? format(new Date(filters.timestamp), "dd/MM/yyyy", { locale: ptBR }) : "Data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.timestamp ? new Date(filters.timestamp) : undefined}
              onSelect={(date) => handleFilterChange("timestamp", date?.toISOString() || "")}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}