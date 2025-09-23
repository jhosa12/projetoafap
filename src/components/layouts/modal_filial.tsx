import { useContext, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users, CheckCircle2 } from "lucide-react";
import { EmpresaProps } from "@/types/empresa";
import { toast } from "sonner";
import { AuthContext } from "@/store/AuthContext";


interface CompanySelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companies: EmpresaProps[];
  onSelectCompany: (company: EmpresaProps) => void;
}

export function CompanySelectionModal({
  open,
  onOpenChange,
  companies,
  onSelectCompany,
}: CompanySelectionModalProps) {
  const [selectedCompany, setSelectedCompany] = useState<EmpresaProps | null>(null);
  
  

  const handleSelectCompany = (company: EmpresaProps) => {
    setSelectedCompany(company);
  };

  const handleConfirmSelection = () => {
    if (selectedCompany) {
      onSelectCompany(selectedCompany);
      toast.success(
        "Filial selecionada",
     { description: `Você está acessando: ${selectedCompany.nome}`},
      );
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[70vh] overflow-y-auto bg-card border-border rounded-sm">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-xl font-semibold text-center text-foreground">
            Selecione uma Filial
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center">
            Escolha qual filial gerenciar
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-2">
          {companies.map((company:EmpresaProps) => (
            <Card
              key={company.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md border rounded-sm ${
                selectedCompany?.id === company.id
                  ? "border-blue-400 bg-blue-400/5 shadow-md"
                  : "border-border hover:border-blue-500/50"
              }`}
              onClick={() => handleSelectCompany(company)}
            >
              <CardHeader className="pb-2 pt-3 px-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <CardTitle className="text-base text-foreground">
                      {company.nome}
                    </CardTitle>
                  </div>
                  {selectedCompany?.id === company.id && (
                    <CheckCircle2 className="h-4 w-4 text-corporate animate-in fade-in-0 zoom-in-50" />
                  )}
                </div>
               
              </CardHeader>
              
              <CardContent className="space-y-2 px-3 pb-3">
                <div className="text-xs text-muted-foreground">
                  <strong>CNPJ:</strong> {company.cnpj}
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{company.cidade_uf}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button
          variant={"default"}
            onClick={handleConfirmSelection}
            disabled={!selectedCompany}
            className=" rounded-sm"
          >
            Acessar Filial
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}