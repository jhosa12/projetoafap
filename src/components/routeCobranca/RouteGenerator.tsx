import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, FileText, MessageSquare } from "lucide-react";
import DistrictSelector from "./routeForm/DistrictSelector";
import PeriodSelector from "./routeForm/PeriodSelector";
import ClientCriteriaSelector from "./routeForm/ClientCriteriaSelector";
import ConsultantSelector from "./routeForm/ConsultantSelector";
import RoutePreview from "./routeForm/RoutePreview";
import { toast } from "sonner";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { RouteProps } from "@/types/cobranca";
import { Textarea } from "../ui/textarea";
import useApiPost from "@/hooks/useApiPost";
import { EmpresaProps } from "@/types/empresa";


export interface RouteFormData {
  districts: string[];
  period: { start: Date | null; end: Date | null };
  overdueMonths: number;
  consultant: string;
}

interface RouteGeneratorProps {
  onClose?: () => void;
  empresas:EmpresaProps[] | null
}

const RouteGenerator = ({ onClose,empresas }: RouteGeneratorProps) => {

    const {control,handleSubmit,watch,formState:{errors}} = useForm<RouteProps>();
    const {data,loading,postData} = useApiPost('/cobranca/novaRota')





  const handleGenerateRoute:SubmitHandler<RouteProps> = async(data) => {
    console.log(data)
    await postData(data)


    if (data.parametros.bairros?.length === 0) {
      toast("Erro de validação",{
        
        description: "Selecione pelo menos um bairro",
//variant: "destructive",
      });
      return;
    }

    if (!data.parametros.consultor) {
      toast("Erro de validação",{
        
        description: "Selecione um consultor",
//variant: "destructive",
      });
      return;
    }

    toast("Rota gerada com sucesso!",{
      
      description: `Rota criada para ${data.parametros.consultor} em ${data.parametros.bairros?.length} bairro(s)`,
//variant: "destructive",
    });

   
    
   
      onClose?.();
    
  };

  //const isFormValid = watch("parametros.bairros").length > 0 && watch("parametros.consultor");

  return (
    <form onSubmit={handleSubmit(handleGenerateRoute)} className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Localização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              name="parametros.bairros"
              control={control}
              render={({ field }) => (
                <DistrictSelector 
                  control={control}
                  empresas={empresas}
                />
              )}
            />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Período
              </CardTitle>
            </CardHeader>
            <CardContent>
            <Controller
              name="parametros.periodo"
              control={control}
              render={({ field }) => (
                <PeriodSelector
                  period={field.value}
                  onChange={(period) => field.onChange(period)}
                />
              )}
            />
          
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Critérios
              </CardTitle>
            </CardHeader>
            <CardContent>
          
                <ClientCriteriaSelector
                  control={control}
                  watch={watch}
                />
           
          
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-4 w-4" />
              Consultor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              name="parametros.consultor"
              control={control}
              render={({ field }) => (
                <ConsultantSelector
                  selected={field.value}
                  onChange={(consultant) => field.onChange(consultant)}
                />
              )}
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <RoutePreview formData={watch()} />

        <Card>
        <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Observações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              name="observacao"
              control={control}
              render={({ field }) => (
                <Textarea
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <Button 
              type="submit"
             // disabled={!isFormValid}
              className="w-full"
              size="lg"
            >
              Gerar Rota
            </Button>
            
            {/* {!isFormValid && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Preencha todos os campos obrigatórios
              </p>
            )} */}
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default RouteGenerator