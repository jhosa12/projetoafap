'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { RefreshCw, Search, Eye, Database, Plus, Edit, Trash2, Filter } from "lucide-react";
import { AuditFilterDialog } from "@/components/audit/AuditFilterDialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import AuditDetails from "@/components/audit/AuditDetails";
import { AuditLog } from "@/types/audit";
import useApiGet from "@/hooks/useApiGet";
import { ajustarData } from "@/utils/ajusteData";



const actionConfig = {
  CREATE: { icon: Plus, color: "bg-emerald-100 text-emerald-700", label: "Criar" },
  UPDATE: { icon: Edit, color: "bg-blue-100 text-blue-700", label: "Atualizar" },
  DELETE: { icon: Trash2, color: "bg-red-100 text-red-700", label: "Deletar" },
};

export default function Dashboard() {
 // const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const { data:logs, loading,postData } = useApiGet<Array<AuditLog>,{startDate?:string,endDate?:string}>("/auditLog")

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, searchTerm, actionFilter, modelFilter]);

  const loadLogs = async () => {
    setIsLoading(true);
    const {dataIni,dataFim} = ajustarData(new Date(),new Date())
    try {
      await postData({startDate:dataIni,endDate:dataFim})
    } catch (error) {
      console.error("Erro ao carregar logs:", error);
    }
    setIsLoading(false);
  };

  const refreshLogs = async () => {
    setIsRefreshing(true);
    await loadLogs();
    setIsRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...logs??[]];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.descricao?.toLowerCase().includes(term) ||
        log.userName?.toLowerCase().includes(term) ||
        log.model?.toLowerCase().includes(term) ||
        log.ip?.toLowerCase().includes(term) ||
        log.hostname?.toLowerCase().includes(term)
      );
    }

    if (actionFilter) {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    if (modelFilter) {
      filtered = filtered.filter(log => log.model === modelFilter);
    }

    setFilteredLogs(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActionFilter("");
    setModelFilter("");
  };

  const uniqueModels = Array.from(new Set(logs?.map(log => log?.model)));


  return (
    <div className="container mx-auto p-4  space-y-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Logs de Auditoria</h1>
          <p className="text-slate-600 mt-1">Sistema de monitoramento de atividades</p>
        </div>
        <div className="flex flex-col ">
          <div className="flex justify-between items-center gap-2">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por descrição, usuário, modelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-8"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <AuditFilterDialog
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                actionFilter={actionFilter}
                setActionFilter={setActionFilter}
                modelFilter={modelFilter}
                setModelFilter={setModelFilter}
                uniqueModels={uniqueModels}
                onClearFilters={clearFilters}
                onApplyFilters={applyFilters}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={refreshLogs}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      
    
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse flex space-x-4">
                  <div className="w-16 h-12 bg-slate-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-sm border max-h-[calc(100vh-320px)] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ação</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-xs">
                        <div className="flex flex-col items-center gap-2">
                          <Database className="w-12 h-12 text-slate-300" />
                          <span className="text-slate-500">Nenhum log encontrado</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs?.map((log) => {
                      const config = actionConfig[log.action as keyof typeof actionConfig] || { 
                        icon: Database, 
                        color: "bg-gray-100 text-gray-700", 
                        label: log.action 
                      };
                      
                      return (
                        <TableRow key={log.id} className="hover:bg-slate-50">
                          <TableCell>
                            <Badge className={`${config.color} font-medium`}>
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-xs">{log.model}</TableCell>
                          <TableCell className="text-xs">{log.userName || "Sistema"}</TableCell>
                          <TableCell className="text-xs">
                            {format(new Date(log.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </TableCell>
                          <TableCell className="text-xs text-slate-500">{log.ip || "-"}</TableCell>
                          <TableCell className="max-w-xs truncate text-xs">
                            {log.descricao || "-"}
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedLog(log)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
      

      <AuditDetails
        log={selectedLog??{}as AuditLog }
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}