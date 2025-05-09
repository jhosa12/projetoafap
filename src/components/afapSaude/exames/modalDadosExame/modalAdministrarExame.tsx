import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  ExameRealizadoProps,
  ExamesData,
  ExamesProps,
} from "@/types/afapSaude";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combobox";
import { PhoneMaskInput } from "@/components/PhoneMaskInput";
import { CPFInput } from "@/components/CpfMaskInput";
import {  X } from "lucide-react";
import { DatePickerInput } from "@/components/DatePickerInput";
import { parentescos } from "@/utils/arrayParentesco";
import TabsExames from "./tabs/TabsExame";

interface DataProps {
  openModal: boolean;
  setOpenModal: () => void;
  registro: ExameRealizadoProps;
  arraySelectExames: ExamesProps[];
  handleNovoExame: (data: ExameRealizadoProps) => Promise<void>;
  handleEditarExame: (data: ExameRealizadoProps) => Promise<void>;
}
export function ModalAdministrarExame({
  openModal,
  setOpenModal,
  registro,
  arraySelectExames,
  handleNovoExame,
  handleEditarExame,
}: DataProps) {
  const { register, setValue, handleSubmit, watch, control } =
    useForm<ExameRealizadoProps>({
      defaultValues: { ...registro },
    });

 

  const handleOnSubmit: SubmitHandler<ExameRealizadoProps> = (data) => {
    registro.id_exame ? handleEditarExame(data) : handleNovoExame(data);
  };

  /* const handleTableExames = (index:number)=>{
       const novoArray =[...data.exames]
       novoArray.splice(index,1)
       setData({...data,exames:novoArray})
 
   }*/

  return (
    <Dialog   open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className="max-w-4xl ">
       
        <DialogHeader>
          <DialogTitle>Administrar Exame</DialogTitle>
          <DialogDescription>
            {registro.id_exame ? "Editar Exame" : "Novo Exame"}
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col w-full"
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          {/* <div className="grid grid-cols-4 gap-2 ">
            <div className="col-span-2">
              <Label className="text-xs" htmlFor="nome">
                Nome Paciente
              </Label>
              <Input
                id="nome"
                placeholder="Nome"
                required
                {...register("nome")}
              />
            </div>

            <div className="col-span-1 flex flex-col justify-end gap-1">
              <Label className="text-xs" htmlFor="nome">
                Nascimento
              </Label>
              <Controller
                control={control}
                name="data_nasc"
                render={({ field: { onChange, value } }) => (
                  <DatePickerInput className="h-9" value={value} onChange={onChange} />
                )}
              />
           
            </div>
            
            <div>
              <Label className="text-xs" htmlFor="celular">
                Celular
              </Label>
           
                  <PhoneMaskInput controlName="celular" register={register} />
                
            
            </div>
            <div>
              <Label className="text-xs" htmlFor="cpf">
                CPF
              </Label>
              
                  <CPFInput  register={register} controlName="cpf" />
                
              
            </div>
            <div className="col-span-1">
              <Label className="text-xs" htmlFor="endereco">
                Endereço
              </Label>
              <Input
                id="endereco"
                required={watch("coleta") === "DOMICILIO"}
                placeholder="Endereço"
                {...register("endereco")}
              />
            </div>

            <div className="col-span-1">
              <Label className="text-xs" htmlFor="numero">
                Número
              </Label>
              <Input
                id="numero"
                type="number"
                placeholder="Numero"
                {...register("numero", { valueAsNumber: true })}
              />
            </div>

            <div className="col-span-1">
              <Label className="text-xs" htmlFor="bairro">
                Bairro
              </Label>
              <Input
                id="bairro"
                placeholder="Bairro"
                {...register("bairro")}
              />
            </div>
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
                      <SelectItem className="text-xs" value="CLINICA">CLÍNICA</SelectItem>
                      <SelectItem  className="text-xs" value="DOMICILIO">DOMICÍLIO</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs" htmlFor="responsavel">
                Nome Responsável (se for menor)
              </Label>
              <Input
                id="responsavel"
                placeholder="Responsável, caso paciente seja menor de idade"
                {...register("nome_responsavel")}
              />
            </div>
            <div>
              <Label className="text-xs" htmlFor="parentesco">
                Parentesco
              </Label>
              <Controller
                control={control}
                name="parentesco"
                defaultValue=""
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="parentesco">
                      <SelectValue placeholder="PARENTESCO" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {parentescos.map((parentesco) => (
                        <SelectItem className='text-xs' key={parentesco.value} value={parentesco.value}>
                          {parentesco.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
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
                      <SelectItem className="text-xs" value="PARTICULAR">PARTICULAR</SelectItem>
                      <SelectItem className="text-xs" value="FUNERARIA">FUNERÁRIA</SelectItem>
                      <SelectItem className="text-xs" value="PLANO DESCONTO">
                        PLANO DESCONTO
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="col-span-1 flex flex-col justify-end gap-1">
              <Label className="text-xs" htmlFor="data_prev">
                Data Prevista
              </Label>
              <Controller
                control={control}
                name="data_prev"
                render={({ field: { onChange, value } }) => (
                  <DatePickerInput className="h-9" value={value} onChange={onChange} />
                )}
              />
           
            </div>

          </div>
       
          <div>
            <div className="inline-flex w-full gap-4 py-4">
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
              <Button
                type="button"
                size="sm"
                onClick={handleAdicionarExame}
                className="mt-auto p-1"
              >
                Adicionar
              </Button>
            </div>
            <div className="overflow-auto max-h-[calc(100vh-500px)]">
              <Table >
                <TableHeader   >
                  <TableRow  >
                    <TableHead>Exame</TableHead>
                    <TableHead>Valor Exame</TableHead>
                    <TableHead>Desconto</TableHead>
                    <TableHead>Valor Final</TableHead>
                    <TableHead>
                      <span className="sr-only">Edit</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {watch("exames")?.map((item, index) => (
                    <TableRow key={index} className="bg-white text-xs">
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
          </div> */}
          <TabsExames register={register} control={control} watch={watch} setValue={setValue} exames={arraySelectExames} />
          <Button className="ml-auto mt-6" type="submit">
            {registro?.id_exame ? "Atualizar" : "Cadastrar"}
          </Button>
        </form>
        
      </DialogContent>
    </Dialog>
  );
}
