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
import { Focus, X } from "lucide-react";

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

  const handleDelExameTable = (id_exame: number) => {
    setValue(
      "exames",
      watch("exames").filter((item) => item.id_exame !== id_exame)
    );
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
          <div className="grid grid-cols-4 gap-2 ">
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
            <div className="col-span-3">
              <Label className="text-xs" htmlFor="endereco">
                Endereço Completo
              </Label>
              <Input
                id="endereco"
                required={watch("coleta") === "DOMICILIO"}
                placeholder="Endereço"
                {...register("endereco")}
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
                      <SelectItem value="CLINICA">CLÍNICA</SelectItem>
                      <SelectItem value="DOMICILIO">DOMICÍLIO</SelectItem>
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
                    <SelectContent>
                      
                      <SelectItem value="CONJUGE">CONJUGE</SelectItem>
                      <SelectItem value="PAI">PAI</SelectItem>
                      <SelectItem value="MÃE">MÃE</SelectItem>
                      <SelectItem value="FILHO">FILHO(A)</SelectItem>
                      <SelectItem value="IRMÃO(Ã)">IRMÃO(Ã)</SelectItem>
                      <SelectItem value="PRIMO">PRIMO(A)</SelectItem>
                      <SelectItem value="SOBRINHO(A)">SOBRINHO(A)</SelectItem>
                      <SelectItem value="NORA">NORA</SelectItem>
                      <SelectItem value="NETO(A)">NETO(A)</SelectItem>
                      <SelectItem value="GENRO">GENRO</SelectItem>
                      <SelectItem value="TIO(A)">TIO(A)</SelectItem>
                      <SelectItem value="AVÔ(Ó)">AVÔ(Ó)</SelectItem>
                      <SelectItem value="OUTROS">OUTROS</SelectItem>
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
                      <SelectItem value="PARTICULAR">PARTICULAR</SelectItem>
                      <SelectItem value="FUNERARIA">FUNERÁRIA</SelectItem>
                      <SelectItem value="PLANO DESCONTO">
                        PLANO DESCONTO
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          {/* Seção do Combobox e tabela de exames */}
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
          </div>
          <Button className="ml-auto mt-6" type="submit">
            {registro?.id_exame ? "Atualizar" : "Cadastrar"}
          </Button>
        </form>
        
      </DialogContent>
    </Dialog>
  );
}
