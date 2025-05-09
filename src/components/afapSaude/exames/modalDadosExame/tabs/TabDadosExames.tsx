import { Label } from "@/components/ui/label";
import { ComponentTabExameProps } from "./TabsExame";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExamesData } from "@/types/afapSaude";
import { DatePickerInput } from "@/components/DatePickerInput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { X } from "lucide-react";
import { HiPlus } from "react-icons/hi2";

export default function TabDadosExames({
  control,
  exames: arraySelectExames,
  watch,
  setValue,
}: ComponentTabExameProps) {

  const handleTipoDesconto = (tipo: string) => {
    const exames = watch("exames");
    if (tipo) {
      const examesAtualizados = exames?.map((item: ExamesData) => {
        const exame = arraySelectExames.find(
          (exame) => exame.id_exame === item.id_exame
        );
        const vl_particular = Number(exame?.porcPart);
        const desconto =
          tipo === "PARTICULAR"
            ? 0
            : tipo === "FUNERARIA"
            ? vl_particular * (Number(exame?.porcFun) / 100)
            : vl_particular * (Number(exame?.porcPlan) / 100);

        item.valorFinal = vl_particular - desconto;
        item.desconto = desconto;
        return item;
      });

      setValue("exames", examesAtualizados ?? []);
      setValue("tipoDesc", tipo);
    }
  };

  const handleAdicionarExame = () => {
    const exame = arraySelectExames.find(
      (item) => item.nome === watch("exame")
    );

    const tipo = watch("tipoDesc");

    if (!tipo) {
      toast.info("Selecione um tipo de desconto");
      return;
    }

    // console.log(exame)
    if (!exame) {
      toast.info("Selecione um exame");
      return;
    }

    // Obter a lista atual de exames, garantindo que seja um array
    const examesAtuais = watch("exames") || [];

    // Verificar se o exame já existe na lista para evitar duplicados
    const exameJaExiste = examesAtuais.some(
      (item: ExamesData) => item.id_exame === exame.id_exame
    ); // Supondo que

    if (exameJaExiste) {
      toast.info("Exame ja existe na lista");
      return;
    }

    // Adicionar o novo exame à lista e atualizar o campo `exames`

    const vl_particular = Number(exame.porcPart);

    const desconto =
      tipo === "PARTICULAR"
        ? 0
        : tipo === "FUNERARIA"
        ? vl_particular * (Number(exame.porcFun) / 100)
        : vl_particular * (Number(exame.porcPlan) / 100);

    setValue("exames", [
      ...examesAtuais,
      {
        data: new Date(),
        id_exame: exame.id_exame,
        nome: exame.nome,
        desconto: desconto,
        valorExame: vl_particular,
        valorFinal: vl_particular - desconto,
        obs: exame.obs,
      },
    ]);
    //console.log("Exame adicionado");
  };

  const handleDelExameTable = (id_exame: number) => {
    setValue(
      "exames",
      watch("exames").filter((item) => item.id_exame !== id_exame)
    );
  };

  return (
    <div className="flex flex-col gap-4">

<div className="grid grid-cols-2 gap-4">
     

     

      <div>
        <Label className="text-xs" htmlFor="coleta">
          Coleta
        </Label>
        <Controller
          control={control}
          name="coleta"
          defaultValue=""
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="coleta">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-xs" value="CLINICA">
                  CLÍNICA
                </SelectItem>
                <SelectItem className="text-xs" value="DOMICILIO">
                  DOMICÍLIO
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex flex-col justify-end gap-1">
        <Label className="text-xs" htmlFor="data_prev">
          Data/Hora Prevista
        </Label>
        <Controller
          control={control}
          name="data_prev"
          render={({ field: { onChange, value } }) => (
            <DatePickerInput
              className="h-9 z-50 "
              dateFormat="Pp"
              showTimeSelect
              value={value}
              onChange={onChange}
            
            />
          )}
        />
      </div>
      </div>

      <div>
        <div className="inline-flex w-full items-center gap-4 py-4">
           <div>
        <Label className="text-xs" htmlFor="desconto">
          Desconto
        </Label>
        <Controller
          control={control}
          name="tipoDesc"
          defaultValue=""
          render={({ field }) => (
            <Select
              onValueChange={(v) => {
                field.onChange(v);
                handleTipoDesconto(v);
              }}
              value={field.value}
            >
              <SelectTrigger id="desconto">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-xs" value="PARTICULAR">
                  PARTICULAR
                </SelectItem>
                <SelectItem className="text-xs" value="FUNERARIA">
                  FUNERÁRIA
                </SelectItem>
                <SelectItem className="text-xs" value="PLANO DESCONTO">
                  PLANO DESCONTO
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className=" w-full">
          <Label className="text-xs" htmlFor="desconto">
          Exames
        </Label>
           <Controller
            name="exame"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Combobox
                items={arraySelectExames.map((item) => ({
                  value: item.nome,
                  label: item.nome,
                }))}
                value={value}
                placeholder="Selecione um exame"
                onChange={onChange}
              />
            )}
          />
      </div>
         
          <Button
            type="button"
            size="sm"
            className="mt-auto"
            onClick={handleAdicionarExame}
           
          >
            <HiPlus />
          </Button>
        </div>
        <div className="relative overflow-auto w-full max-h-[calc(100vh-450px)]">
          <Table>
            <TableHeader>
              
                <TableHead>Exame</TableHead>
                <TableHead>Valor Exame</TableHead>
                <TableHead>Desconto</TableHead>
                <TableHead>Valor Final</TableHead>
                <TableHead>
                  <span className="sr-only">Edit</span>
                </TableHead>
              
            </TableHeader>
            <TableBody >
              {watch("exames")?.map((item, index) => (
                <TableRow key={index} className="bg-white text-[10px] font-medium">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900">
                    {item.nome}
                  </TableCell>
                  <TableCell>
                    {Number(item.valorExame ?? 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell>
                    {Number(item.desconto ?? 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell>
                    {Number(item.valorFinal ?? 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleDelExameTable(item.id_exame)}
                      className="font-medium text-gray-500 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-semibold text-xs">
                <TableCell>TOTAL</TableCell>
                <TableCell>
                  {Number(
                    watch("exames")?.reduce(
                      (acumulador, atual) =>
                        (acumulador += Number(atual.valorExame)),
                      0
                    )
                  ).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>
                  {Number(
                    watch("exames")?.reduce(
                      (acumulador, atual) =>
                        (acumulador += Number(atual.desconto)),
                      0
                    )
                  ).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>
                  {Number(
                    watch("exames")?.reduce(
                      (acumulador, atual) =>
                        (acumulador += Number(atual.valorFinal)),
                      0
                    )
                  ).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
