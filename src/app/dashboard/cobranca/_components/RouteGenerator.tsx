import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, FileText, Plus } from "lucide-react";
import DistrictSelector from "./routeForm/DistrictSelector";
import PeriodSelector from "./routeForm/PeriodSelector";
import ClientCriteriaSelector from "./routeForm/ClientCriteriaSelector";
import ConsultantSelector from "./routeForm/ConsultantSelector";
import RoutePreview from "./routeForm/RoutePreview";
import { toast } from "sonner";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

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
import {
  InadimplenciaBairroProps,
  RotaFilterProps,
  RouteProps,
} from "../types/types";
import { useRouterActions } from "../_hooks/useRouterActions";
import { ajustarData } from "@/utils/ajusteData";
import { Alert } from "flowbite-react";

export interface RouteFormData {
  districts: string[];
  period: { start: Date | null; end: Date | null };
  overdueMonths: number;
  consultant: string;
}

interface RouteGeneratorProps {
  empresa: {
    id_empresa: string;
    nome: string;
  };
  cidadesEmpresa: Array<string>;
  cobradores: ConsultoresProps[];
  filters: RotaFilterProps;
  getRotas: (data: RotaFilterProps) => Promise<void>;
  isGeneratorOpen:boolean,
   setIsGeneratorOpen:Dispatch<SetStateAction<boolean>>
}

const RouteGenerator = ({
  empresa,
  cidadesEmpresa,
  cobradores,
  filters,
  getRotas,
  isGeneratorOpen,
  setIsGeneratorOpen
}: RouteGeneratorProps) => {
  const metodos = useForm<RouteProps>({
    defaultValues: {
      parametros: {
        criterio: { operator: ">", value: 1 },
        statusReagendamento: "A/R",
        periodo: { start: null, end: new Date() },
        listar_por_cobranca: true,
      },
    },
  });
  const { postData } = useApiPost(
    "/cobranca/novaRota",
    undefined,
    undefined,
    () => setIsGeneratorOpen(false)
  );
 
  const [loading, setLoading] = useState(false);
  const [arrayBairros, setArrayBairros] = useState<InadimplenciaBairroProps[]>(
    []
  );
   const dateStart = metodos.watch("parametros.periodo.start") ?? undefined;
    const dateEnd = metodos.watch("parametros.periodo.end") ?? undefined;

  useEffect(() => {
   
    const { dataIni, dataFim } = ajustarData(
      dateStart,
      dateEnd
    );
    const getBairros = async () => {
      const res = await api.post("/cobranca/inadimplencia", {
        id_empresa: empresa.id_empresa,
        cidade: metodos.watch("parametros.cidade") ?? [],
        param: metodos.watch("parametros.criterio.operator"),
        n_parcelas: metodos.watch("parametros.criterio.value"),
        status: ["A", "R"],
        statusReagendamento: metodos.watch("parametros.statusReagendamento"),
        startDate: dataIni,
        endDate: dataFim,
        resumeBairro: true,
        cobrador: metodos.watch("parametros.cobrador"),
        listar_por_cobranca: metodos.watch("parametros.listar_por_cobranca"),
      });
    
      setArrayBairros(res.data.inadResumoBairro);
    };
    getBairros();
  }, [
    empresa,
      metodos.watch("parametros"),
    dateStart,
    dateEnd,
    metodos.watch("parametros.periodo.start"),
    metodos.watch("parametros.cidade"),
    metodos.watch("parametros.criterio.operator"),
    metodos.watch("parametros.statusReagendamento"),
    metodos.watch("parametros.criterio.value"),
    metodos.watch("parametros.cobrador"),
    metodos.watch("parametros.listar_por_cobranca"),
  
  ]);

  const handleClearParameters = () => {
    metodos.reset({
      ...metodos.getValues(),
      parametros: {
        ...metodos.getValues().parametros,
        cidade: [],
        bairros: [],
        periodo: { start: null, end: null },
        criterio: { operator: ">", value: 1 },
        statusReagendamento: "A/R",
        cobrador: [],
        listar_por_cobranca: true,
        consultor: "",
      },
    });
  };

  const handleGenerateRoute: SubmitHandler<RouteProps> = async (data) => {
    setLoading(true);

    if (
      (!data.parametros.bairros || data.parametros.bairros.length < 1) &&
      !data.parametros.cobrador
    ) {
      toast("Erro de validação", {
        description: "Selecione pelo menos um bairro ou um Cobrador",
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

    const { dataIni, dataFim } = ajustarData(
      data.parametros.periodo.start ?? undefined,
      data.parametros.periodo.end ?? undefined
    );
    await postData({
      ...data,

      id_empresa: empresa.id_empresa,
      empresa: empresa.nome,
      parametros: {
        ...data.parametros,
        periodo: { start: dataIni, end: dataFim },
      },
    });

    try {
      await getRotas(filters);
      toast.success("Rota gerada com sucesso!");
      setIsGeneratorOpen(false);
    } catch (error) {
      console.error("Erro ao gerar rota:", error);
      toast.error("Erro ao gerar rota");
    } finally {
      setLoading(false);
    }
  };

  //const isFormValid = watch("parametros.bairros").length > 0 && watch("parametros.consultor");

  const estimativa =
    metodos.watch("parametros.cobrador") &&
    (!metodos.watch("parametros.bairros") ||
      metodos.watch("parametros.bairros")?.length < 1)
      ? arrayBairros?.reduce((acc, item) => (acc += item.totalContratos), 0)
      : metodos.watch("parametros.bairros")?.reduce((acc, item) => {
          return (
            acc +
            (arrayBairros?.find((it) => it.bairro === item)?.totalContratos ??
              0)
          );
        }, 0);
  return (
    <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
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
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="space-y-1.5 p-6 pb-3">
                  <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Localização
                  </h3>
                </div>
                <div className="p-6 pt-0">
                  <DistrictSelector
                    bairros={arrayBairros}
                    cidades={cidadesEmpresa}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="space-y-1.5 p-6 pb-3">
                    <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Período
                    </h3>
                  </div>
                  <div className="p-6 pt-0">
                    <PeriodSelector />
                  </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="space-y-1.5 p-6 pb-3">
                    <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Critérios
                    </h3>
                  </div>
                  <div className="p-6 pt-0">
                    <ClientCriteriaSelector
                      consultores={cobradores.filter(
                        (item) => item.funcao === "COBRADOR (RDA)"
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="space-y-1.5 p-6 pb-3">
                  <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Consultor
                  </h3>
                </div>
                <div className="p-6 pt-0 z-50">
                  <ConsultantSelector
                    // selected={field.value}
                    //  onChange={(consultant) => field.onChange(consultant)}
                    consultants={cobradores}
                  />

                  <span className="text-xs text-red-600">
                    {metodos.formState.errors.parametros?.consultor?.message}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <RoutePreview
                estimativa={estimativa}
                formData={metodos.watch()}
                handleClearParameters={handleClearParameters}
              />

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
