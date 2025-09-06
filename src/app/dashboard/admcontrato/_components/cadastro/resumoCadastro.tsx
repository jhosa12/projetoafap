
import { ChildrenProps } from "./modalCadastro";
import { useContext } from "react";
import { AuthContext } from "@/store/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";


export function ResumoCadastro({watch}:ChildrenProps){
  const {infoEmpresa} = useContext(AuthContext)

   const steps = [
    {
      id: "empresa",
      label: "Empresa",
      title: infoEmpresa?.nome || "Empresa não selecionada",
      description: "",
      completed: !!infoEmpresa,
      isCompany: true
    },
    {
      id: "titular",
      label: "Dados Titular",
      title: watch('name') || "João Silva",
      description: `ENDEREÇO: ${watch('endereco') || "Rua das Flores, 123 - São Paulo/SP"}`,
      completed: true
    },
    {
      id: "plano",
      label: "Dados Plano",
      title: watch('contrato.plano') || "Plano Premium",
      description: Number(watch('contrato.valor_mensalidade') || 299.90).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }),
      completed: true
    },
    {
      id: "dependentes",
      label: "Dependentes",
      title: `${watch('arraydep')?.length || 0} dependente(s)`,
      description: "",
      completed: true
    },
    {
      id: "contrato",
      label: "Dados Contrato",
      title: watch('contrato.id_contrato') || "",
      description: !watch('contrato.id_contrato') ? "Salve os dados para gerar contrato" : "",
      completed: !!watch('contrato.id_contrato')
    }
  ];
 
    return (
    <div className="w-full">
  
      {/* Timeline horizontal */}
      <div className="flex w-full overflow-x-auto">
        <div className="flex min-w-max gap-8 pb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center min-w-[150px]">
              {/* Timeline point */}
              <div className="relative flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white ${
                    step.completed
                      ? "bg-green-200 text-green-600"
                      : "bg-red-200 text-red-600"
                  }`}
                >
                  {step.completed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                
                </div>
                
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-4 h-0.5 w-8 bg-gray-200" />
                )}
              </div>

              {/* Content */}
              <div className="mt-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">
                  {step.label}
                </div>
                <div className="text-sm font-semibold text-foreground mb-1 whitespace-nowrap">
                  {step.title}
                </div>
                {step.description && (
                  <div className={`text-xs ${
                    step.id === "contrato" && !step.completed 
                      ? "text-yellow-600" 
                      : "text-muted-foreground"
                  } whitespace-nowrap`}>
                    {step.description}
                  </div>
                )}
                
                {/* Badge para empresa */}
                {step.isCompany && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    Empresa Selecionada
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}






