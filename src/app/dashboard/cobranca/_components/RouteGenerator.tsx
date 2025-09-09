import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Users,
  FileText,
  Plus,
} from "lucide-react";
import DistrictSelector from "./routeForm/DistrictSelector";
import PeriodSelector from "./routeForm/PeriodSelector";
import ClientCriteriaSelector from "./routeForm/ClientCriteriaSelector";
import ConsultantSelector from "./routeForm/ConsultantSelector";
import RoutePreview from "./routeForm/RoutePreview";
import { toast } from "sonner";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";

import useApiPost from "@/hooks/useApiPost";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { api } from "@/lib/axios/apiClient";
import { ConsultoresProps } from "@/types/consultores";
import { InadimplenciaBairroProps, RotaFilterProps, RouteProps } from "../types/types";
import { useRouterActions } from "../_hooks/useRouterActions";


export interface RouteFormData {
  districts: string[];
  period: { start: Date | null; end: Date | null };
  overdueMonths: number;
  consultant: string;
}

interface RouteGeneratorProps {
  empresa: {
    id_empresa: string,
    nome: string
  },
  cidadesEmpresa: Array<string>
  cobradores: ConsultoresProps[],
  filters: RotaFilterProps,
  getRotas: (data: RotaFilterProps) => Promise<void>
}

const RouteGenerator = ({ empresa, cidadesEmpresa, cobradores, filters, getRotas }: RouteGeneratorProps) => {
  const metodos = useForm<RouteProps>();
  const { postData } = useApiPost("/cobranca/novaRota", undefined, undefined, () => setIsGeneratorOpen(false));
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [arrayBairros, setArrayBairros] = useState<
    InadimplenciaBairroProps[]
  >([]);
 

  useEffect(() => {
    const getBairros = async () => {
      const res = await api.post("/cobranca/inadimplencia", {
        id_empresa: empresa.id_empresa,
        cidade: metodos.watch('parametros.cidade') ?? "",
        param: ">",
        n_parcelas: 1,
        status: ["A", "R"],
        statusReagendamento: 'A/R',
        startDate: new Date("1900-01-01"),
        endDate: new Date(),
        resumeBairro: true,
      });

      setArrayBairros(res.data.inadResumoBairro)
    };
    getBairros();
  }, [empresa, metodos.watch('parametros.cidade')]);



  const handleGenerateRoute: SubmitHandler<RouteProps> = async (data) => {




    await postData({ ...data, id_empresa: empresa.id_empresa, empresa: empresa.nome, parametros: { ...data.parametros, statusReagendamento: 'A/R' } });

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
    getRotas(filters)

    /* toast("Rota gerada com sucesso!", {
     description: `Rota criada para ${data.parametros.consultor} em ${data.parametros.bairros?.length} bairro(s)`,
     //variant: "destructive",
   });*/

    //setIsGeneratorOpen(false);
  };

  //const isFormValid = watch("parametros.bairros").length > 0 && watch("parametros.consultor");
const estimativa = metodos.watch('parametros.bairros')?.reduce((acc,item)=>{
  return acc+(arrayBairros?.find(it=>it.bairro===item)?.totalContratos ?? 0)
},0)
  return (
    <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"}>
          <Plus />
          Nova Rota
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl  overflow-y-auto">
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
                    <ClientCriteriaSelector consultores={cobradores} />
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
                <CardContent className="z-50">
                  
                  <Controller
                    name="parametros.consultor"
                    control={metodos.control}
                    rules={{required:'Campo Obrigatorio'}}
                    render={({ field }) => (
                      <ConsultantSelector
                        selected={field.value}
                        onChange={(consultant) => field.onChange(consultant)}
                        consultants={cobradores}
                      />
                    )}
                  />
                  <span className="text-xs text-red-600">{metodos.formState.errors.parametros?.consultor?.message}</span>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <RoutePreview estimativa={estimativa} formData={metodos.watch()} />
              {/* 
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
            </Card> */}




              {/* {!isFormValid && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Preencha todos os campos obrigatórios
              </p>
            )} */}

            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default RouteGenerator;
