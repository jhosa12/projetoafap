import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  User, 
  Clock, 
  Monitor, 
  MapPin, 
  Database,
  Hash,
  FileText,
  Code,
  ArrowRight
} from "lucide-react";
import { AuditLog } from "@/types/audit";

interface AuditDetailsProps {
  log: AuditLog;
  open: boolean;
  onClose: () => void;
}

export default function AuditDetails({ log, open, onClose }: AuditDetailsProps) {
  if (!log) return null;

  const getChangedFields = () => {
    if (!log.changes || !log.changes.newState || !log.changes.previousState) {
      return [];
    }

    const newState = log.changes.newState;
    const previousState = log.changes.previousState;
    const changes: { field: string; oldValue: any; newValue: any }[] = [];

    Object.keys(newState).forEach(key => {
      const newValue = newState[key];
      const oldValue = previousState[key];
      
      // Verifica se houve mudança
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        changes.push({
          field: key,
          oldValue: oldValue,
          newValue: newValue
        });
      }
    });

    return changes;
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) {
      return <span className="text-slate-400 italic">null</span>;
    }
    if (typeof value === 'boolean') {
      return <Badge variant={value ? "default" : "secondary"}>{value.toString()}</Badge>;
    }
    if (typeof value === 'string' && value.includes('T') && value.includes('Z')) {
      try {
        return format(new Date(value), "dd/MM/yyyy HH:mm", { locale: ptBR });
      } catch {
        return value;
      }
    }
    return String(value);
  };

  const changedFields = getChangedFields();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Detalhes da Auditoria - ID {log.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Ação:</span>
                  <Badge variant="outline">{log.action}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Modelo:</span>
                  <span className="font-medium text-xs">{log.model}</span>
                </div>
                {log.modelId && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">ID do Registro:</span>
                    <span className="font-medium text-xs">{log.modelId}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Data/Hora:</span>
                  <span className="font-medium text-xs">
                    {log.timestamp && format(new Date(log.timestamp), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR })}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs">Informações do Usuário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {log.userName && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Nome:</span>
                    <span className="font-medium text-xs">{log.userName}</span>
                  </div>
                )}
                {log.modelId && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">ID do Registro:</span>
                    <span className="font-medium text-xs">{log.modelId}</span>
                  </div>
                )}
                {log.ip && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">IP:</span>
                    <span className="font-medium text-xs">{log.ip}</span>
                  </div>
                )}
                {log.hostname && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Hostname:</span>
                    <span className="font-medium text-xs">{log.hostname}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {log.descricao && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs">Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed text-xs">{log.descricao}</p>
              </CardContent>
            </Card>
          )}
          
          {changedFields.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Campos Alterados ({changedFields.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/4">Campo</TableHead>
                        <TableHead className="w-3/8">Valor Anterior</TableHead>
                        <TableHead className="w-3/8">Novo Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {changedFields.map((change, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium text-xs">
                            {change.field}
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
                              {formatValue(change.oldValue)}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                              {formatValue(change.newValue)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {log.changes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xs flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  JSON Completo das Alterações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(log.changes, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}