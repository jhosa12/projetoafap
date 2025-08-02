import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface AuditFilterDialogProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  actionFilter: string;
  setActionFilter: (action: string) => void;
  modelFilter: string;
  setModelFilter: (model: string) => void;
  uniqueModels: string[];
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export function AuditFilterDialog({
  searchTerm,
  setSearchTerm,
  actionFilter,
  setActionFilter,
  modelFilter,
  setModelFilter,
  uniqueModels,
  onClearFilters,
  onApplyFilters,
}: AuditFilterDialogProps) {
  const handleClear = () => {
    onClearFilters();
    onApplyFilters();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <X className="h-4 w-4" />
          Filtros
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtros de Auditoria</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Pesquisar</label>
            <Input
              placeholder="Buscar por descrição, usuário, modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Ação</label>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as ações" />
              </SelectTrigger>
              <SelectContent>
               
                <SelectItem value="CREATE">Criação</SelectItem>
                <SelectItem value="UPDATE">Atualização</SelectItem>
                <SelectItem value="DELETE">Exclusão</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Modelo</label>
            <Select value={modelFilter} onValueChange={setModelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os modelos" />
              </SelectTrigger>
              <SelectContent>
            
                {uniqueModels.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleClear}>
            Limpar Filtros
          </Button>
          <Button onClick={onApplyFilters}>Aplicar Filtros</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
