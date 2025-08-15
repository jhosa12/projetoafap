import { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Plus,
} from "lucide-react";
import DistrictSelector from "./routeForm/DistrictSelector";
import PeriodSelector from "./routeForm/PeriodSelector";
import ClientCriteriaSelector from "./routeForm/ClientCriteriaSelector";
import ConsultantSelector from "./routeForm/ConsultantSelector";
import RoutePreview from "./routeForm/RoutePreview";
import { toast } from "sonner";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { InadimplenciaBairroProps, RouteProps } from "@/types/cobranca";
import { Textarea } from "../ui/textarea";
import useApiPost from "@/hooks/useApiPost";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { api } from "@/lib/axios/apiClient";
import { ConsultoresProps } from "@/types/consultores";

export interface RouteFormData {
  districts: string[];
  period: { start: Date | null; end: Date | null };
  overdueMonths: number;
  consultant: string;
}

interface RouteGeneratorProps {
    empresa:{
      id_empresa:string,
      nome:string
    },
    cidadesEmpresa:Array<string>
    cobradores:ConsultoresProps[]
}

const RouteGenerator = ({ empresa,cidadesEmpresa,cobradores }: RouteGeneratorProps) => {
  const metodos = useForm<RouteProps>();
  const { postData } = useApiPost("/cobranca/novaRota");
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [arrayBairros, setArrayBairros] = useState<
   InadimplenciaBairroProps[]
  >([]);

  useEffect(() => {
    const getBairros = async () => {
      const res = await api.post("/cobranca/inadimplencia", {
        id_empresa:empresa.id_empresa,
        cidade: metodos.watch('parametros.cidade')??"",
        param: ">",
        n_parcelas: 1,
        status: ["A", "R"],
        startDate: new Date("1900-01-01"),
        endDate: new Date(),
        resumeBairro: true,
      });

      setArrayBairros(res.data.inadResumoBairro)
    };
    getBairros();
  }, [empresa,metodos.watch('parametros.cidade')]);



  const handleGenerateRoute: SubmitHandler<RouteProps> = async (data) => {
   
    await postData({...data,id_empresa:empresa.id_empresa,empresa:empresa.nome});

    if (data.parametros.bairros?.length === 0) {
      toast("Erro de validação", {
        description: "Selecione pelo menos um bairro",
        //variant: "destructive",
      });
      return;
    }

    if (!data.parametros.consultor) {
      toast("Erro de validação", {
        description: "Selecione um consultor",
        //variant: "destructive",
      });
      return;
    }

    toast("Rota gerada com sucesso!", {
      description: `Rota criada para ${data.parametros.consultor} em ${data.parametros.bairros?.length} bairro(s)`,
      //variant: "destructive",
    });

    setIsGeneratorOpen(false);
  };

  //const isFormValid = watch("parametros.bairros").length > 0 && watch("parametros.consultor");

  return (
    <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"}>
          <Plus  />
          Nova Rota
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerar Nova Rota</DialogTitle>
        </DialogHeader>
        <FormProvider {...metodos}>
        <form
          onSubmit={metodos.handleSubmit(handleGenerateRoute)}
          className="grid lg:grid-cols-3 gap-4"
        >
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent>
               
                    <DistrictSelector
                      bairros={arrayBairros}
                      cidades={cidadesEmpresa}
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
          
                      <PeriodSelector
                        
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
                  <ClientCriteriaSelector  />
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
                  control={metodos.control}
                  render={({ field }) => (
                    <ConsultantSelector
                      selected={field.value}
                      onChange={(consultant) => field.onChange(consultant)}
                      consultants={cobradores}
                    />
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <RoutePreview formData={metodos.watch()} />

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
                  control={metodos.control}
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
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default RouteGenerator;
