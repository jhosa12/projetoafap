import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CompanyIndicatorProps {
  companyName: string;
}

export function CompanyIndicator({ companyName }: CompanyIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Building2 className="h-4 w-4 text-blue-600" />
      <span className="text-sm text-muted-foreground">Empresa atual:</span>
      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
        {companyName}
      </Badge>
    </div>
  );
}
