import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, FileText, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { RouteProps } from "../../types/types";


interface RoutePreviewProps {
  formData: RouteProps;
  estimativa:number
}

const RoutePreview = ({ formData,estimativa}: RoutePreviewProps) => {
  

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Resumo da Rota</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-3 w-3 text-gray-500" />
            <span className="font-medium">Bairros:</span>
          </div>
          {formData?.parametros?.bairros?.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {formData?.parametros?.bairros?.slice(0, 3).map(bairro => (
                <Badge key={bairro} variant="outline" className="text-xs">
                  {bairro}
                </Badge>
              ))}
              {formData?.parametros?.bairros?.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{formData.parametros.bairros.length - 3} mais
                </Badge>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500">Nenhum bairro selecionado</p>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-3 w-3 text-gray-500" />
            <span className="font-medium">Período:</span>
          </div>
          { formData?.parametros?.periodo?.end ? (
            <p className="text-xs text-gray-700">
              {formData?.parametros?.periodo?.start ? new Date(formData.parametros.periodo.start).toLocaleDateString() : "Todo Periodo até"} - {new Date(formData.parametros.periodo.end).toLocaleDateString()}
            </p>
          ) : (
            <p className="text-xs text-gray-500">Período não definido</p>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-3 w-3 text-gray-500" />
            <span className="font-medium">Critério:</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {formData?.parametros?.criterio?.value}+ mensalidades vencidas
          </Badge>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-3 w-3 text-gray-500" />
            <span className="font-medium">Consultor:</span>
          </div>
          {formData?.parametros?.consultor ? (
            <p className="text-xs text-gray-700">{formData?.parametros?.consultor}</p>
          ) : (
            <p className="text-xs text-gray-500">Não selecionado</p>
          )}
        </div>

        <Separator />

        <div className="bg-blue-50 p-2 rounded-md">
          <p className="text-xs font-medium text-blue-900">Estimativa:</p>
          <p className="text-xs text-blue-700">
            ~{estimativa} clientes potenciais
          </p>
        </div>
        <Button
                  type="submit"
                  // disabled={!isFormValid}
                  className="w-full"
                  size="lg"
                >
                  Gerar Rota
                </Button>
      </CardContent>
    </Card>
  );
};

export default RoutePreview;
