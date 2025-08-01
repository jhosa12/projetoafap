import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ConsultoresProps } from "@/types/consultores";

interface ConsultantSelectorProps {
  selected: string;
  onChange: (consultant: string) => void;
  consultants:ConsultoresProps[]
}



const ConsultantSelector = ({ selected, onChange,consultants }: ConsultantSelectorProps) => {
  const selectedConsultant = consultants?.find(c => c.id_consultor === Number(selected));

  return (
    <div className="space-y-3">
      <Select value={selected} onValueChange={onChange}>
        <SelectTrigger className="text-sm">
          <SelectValue placeholder="Selecione um consultor" />
        </SelectTrigger>
        <SelectContent>
          {consultants?.map(consultant => (
            <SelectItem key={consultant.id_consultor} value={consultant.nome}>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {consultant.nome.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{consultant.nome}</span>
                  {/* <span className="text-xs text-gray-500">
                    {consultant.routes} rotas ativas
                  </span> */}
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
                  {selectedConsultant.nome.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{selectedConsultant.nome}</span>
            </div>
            <Badge 
              variant={selectedConsultant.funcao === 'disponível' ? 'default' : 'secondary'} 
              className="text-xs"
            >
              {selectedConsultant.check}
            </Badge>
          </div>
          {/* <p className="text-xs text-gray-600 mt-1">
            {selectedConsultant.routes} rotas ativas
          </p> */}
        </div>
      )}
    </div>
  );
};

export default ConsultantSelector;