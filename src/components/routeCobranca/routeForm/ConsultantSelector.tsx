import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ConsultantSelectorProps {
  selected: string;
  onChange: (consultant: string) => void;
}

const consultants = [
  { id: "joao", name: "João Silva", status: "disponível", routes: 2 },
  { id: "maria", name: "Maria Santos", status: "disponível", routes: 1 },
  { id: "pedro", name: "Pedro Costa", status: "ocupado", routes: 4 },
  { id: "ana", name: "Ana Oliveira", status: "disponível", routes: 0 },
];

const ConsultantSelector = ({ selected, onChange }: ConsultantSelectorProps) => {
  const selectedConsultant = consultants.find(c => c.id === selected);

  return (
    <div className="space-y-3">
      <Select value={selected} onValueChange={onChange}>
        <SelectTrigger className="text-sm">
          <SelectValue placeholder="Selecione um consultor" />
        </SelectTrigger>
        <SelectContent>
          {consultants.map(consultant => (
            <SelectItem key={consultant.id} value={consultant.id}>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {consultant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{consultant.name}</span>
                  <span className="text-xs text-gray-500">
                    {consultant.routes} rotas ativas
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedConsultant && (
        <div className="p-2 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {selectedConsultant.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{selectedConsultant.name}</span>
            </div>
            <Badge 
              variant={selectedConsultant.status === 'disponível' ? 'default' : 'secondary'} 
              className="text-xs"
            >
              {selectedConsultant.status}
            </Badge>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {selectedConsultant.routes} rotas ativas
          </p>
        </div>
      )}
    </div>
  );
};

export default ConsultantSelector;