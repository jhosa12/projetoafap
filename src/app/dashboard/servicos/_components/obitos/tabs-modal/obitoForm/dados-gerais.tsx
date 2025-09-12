import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Controller, useFormContext } from "react-hook-form";
import { ObitoProps } from "@/app/dashboard/servicos/_types/obito";

export const OSDadosGerais = () => {
  const { register, control } = useFormContext<ObitoProps>();

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900">Informações do Contrato</CardTitle>
        <CardDescription className="text-gray-600">
          Dados básicos do contrato e atendimento
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="id_contrato">Número do Contrato *</Label>

          <Input {...register('id_contrato')} placeholder="CT-2024-001" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dec_obito_num">Número da Declaração *</Label>

          <Input {...register('dec_obito_num')} placeholder="DO-2024-001" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plano">Plano</Label>
          <Controller
            control={control}
            name="plano"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Básico">Básico</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Executivo">Executivo</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="atendente">Atendente</Label>

          <Input id="atendente" {...register('atendente')} placeholder="Nome do atendente" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipo_atendimento">Tipo de Atendimento</Label>
          <Controller
            control={control}
            name="tipo_atendimento"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completo">Completo</SelectItem>
                  <SelectItem value="Básico">Básico</SelectItem>
                  <SelectItem value="Cremação">Cremação</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="situacao_contrato">Situação do Contrato</Label>
          <Controller
            control={control}
            name="situacao_contrato"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
