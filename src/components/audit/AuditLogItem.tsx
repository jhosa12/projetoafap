import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Clock, 
  Monitor,
  MapPin,
  ChevronRight,
  Database
} from "lucide-react";
import { AuditLog } from "@/types/audit";

const actionConfig = {
  CREATE: { icon: Plus, color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Criar" },
  UPDATE: { icon: Edit, color: "bg-blue-100 text-blue-700 border-blue-200", label: "Atualizar" },
  DELETE: { icon: Trash2, color: "bg-red-100 text-red-700 border-red-200", label: "Deletar" },
};

export default function AuditLogItem({ log, onViewDetails }: { log: AuditLog; onViewDetails: (log: AuditLog) => void }) {
  const config = actionConfig[log.action as keyof typeof actionConfig] || { icon: Database, color: "bg-gray-100 text-gray-700 border-gray-200", label: log.action };
  const ActionIcon = config.icon;

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center`}>
                <ActionIcon className="w-6 h-6" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${config.color} border font-medium`}>
                  {config.label}
                </Badge>
                <span className="text-sm font-medium text-slate-600">{log.model}</span>
                {log.modelId && (
                  <span className="text-xs text-slate-500">ID: {log.modelId}</span>
                )}
              </div>
              
              <p className="text-slate-900 font-medium mb-2">
                {log.descricao || `${config.label} realizado no modelo ${log.model}`}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                {log.userName && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{log.userName}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{format(new Date(log.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                </div>
                {log.ip && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{log.ip}</span>
                  </div>
                )}
                {log.hostname && (
                  <div className="flex items-center gap-1">
                    <Monitor className="w-4 h-4" />
                    <span>{log.hostname}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(log)}
            className="flex-shrink-0 hover:bg-slate-100"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}