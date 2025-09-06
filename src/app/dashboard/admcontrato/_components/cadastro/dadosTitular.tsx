import { useContext } from "react";
import { AuthContext } from "@/store/AuthContext";

import {
  Controller,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { ChildrenProps } from "@/app/dashboard/admcontrato/_components/cadastro/modalCadastro";
import { CepMaskInput } from "@/components/CepMaskInput";
import { CPFInput } from "@/components/CpfMaskInput";
import { PhoneMaskInput } from "@/components/PhoneMaskInput";
import { Input } from "@/components/ui/input";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DadosTitular({
  register,
  setValue,
  watch,
  control,
}: ChildrenProps) {
  const { cidades } = useContext(AuthContext);

  return (
    <div className="flex flex-col w-full h-full ">
      <div className="grid gap-2   grid-cols-4">
        <div className="col-span-2">
          <div>
            <Label className="text-xs" htmlFor="nome">
              Nome
            </Label>
          </div>
          <Input id="nome" {...register("name")} type="text" required />
        </div>

        <div className="flex flex-col w-full">
          <div>
            <Label className="text-xs" htmlFor="nome">
              Nascimento
            </Label>
          </div>
          <Controller
            name="nasc"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePickerInput
                className="h-9"
                value={value}
                onChange={onChange}
              />
            )}
          />
        </div>
        <div className="col-span-1">
          <Label className="text-xs" htmlFor="sexo">
            Sexo
          </Label>
          <Controller
            name="sexo"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="col-span-1">
          <div>
            <Label className="text-xs" htmlFor="cep">
              CEP
            </Label>
          </div>
          <CepMaskInput controlName={"cep"} register={register} />
        </div>
        <div className="col-span-2">
          <div>
            <Label className="text-xs" htmlFor="endereco">
              Endereço
            </Label>
          </div>
          <Input id="endereco" {...register("endereco")} type="text" required />
        </div>

        <div className="col-span-1">
          <div>
            <Label className="text-xs" htmlFor="numero">
              Número
            </Label>
          </div>
          <Input id="numero" {...register("numero")} type="number" />
        </div>

        <div className="col-span-1">
          <div>
            <Label className="text-xs" htmlFor="bairro">
              Bairro
            </Label>
          </div>
          <Input id="bairro" {...register("bairro")} type="text" required />
        </div>

        <div className="col-span-2">
          <div>
            <Label className="text-xs" htmlFor="ref">
              Referência
            </Label>
          </div>
          <Input id="referencia" {...register("referencia")} type="text" />
        </div>

        <div className="col-span-1">
          <Label className="text-xs" htmlFor="uf">
            UF
          </Label>
          <Controller
            name="uf"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "AC",
                    "AL",
                    "AM",
                    "AP",
                    "BA",
                    "CE",
                    "DF",
                    "ES",
                    "GO",
                    "MA",
                    "MG",
                    "MS",
                    "MT",
                    "PA",
                    "PB",
                    "PE",
                    "PI",
                    "PR",
                    "RJ",
                    "RN",
                    "RO",
                    "RR",
                    "RS",
                    "SC",
                    "SE",
                    "SP",
                    "TO",
                  ].map((uf) => (
                    <SelectItem className="text-[11px]" key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="col-span-1">
          <Label className="text-xs" htmlFor="cidade">
            Cidade
          </Label>
          <Controller
            name="cidade"
            control={control}
            render={({ field }) => (
              <Select
                required
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {cidades
                    ?.filter((item) => item.uf === watch("uf"))
                    .map((item) => (
                      <SelectItem className="text-[11px]" key={item.id_cidade} value={item.cidade}>
                        {item.cidade}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="col-span-1">
          <div>
            <Label className="text-xs" htmlFor="rg">
              RG
            </Label>
          </div>
          <Input id="rg" {...register("rg")} type="number" />
        </div>

        <div className="col-span-1">
          <div>
            <Label className="text-xs">CPF</Label>
          </div>

          <CPFInput register={register} controlName={"cpf"} />
        </div>

        <div className="col-span-1">
          <div>
            <Label className="text-xs" htmlFor="naturalidade">
              Naturalidade
            </Label>
          </div>
          <Input id="rg" {...register("naturalidade")} type="text" />
        </div>

        <div className="col-span-1">
          <div>
            <Label className="text-xs">E-mail</Label>
          </div>
          <Input id="email" {...register("email")} type="text" />
        </div>

        <div className="col-span-1">
          <div>
            <Label className="text-xs">Celular 1</Label>
          </div>

          <PhoneMaskInput register={register} controlName={"celular1"} />
        </div>
        <div className="col-span-1">
          <div>
            <Label className="text-xs">Celular 2</Label>
          </div>

          <PhoneMaskInput register={register} controlName={"celular2"} />
        </div>
        <div className="col-span-1">
          <div>
            <Label className="text-xs">Telefone</Label>
          </div>

          <PhoneMaskInput register={register} controlName={"telefone"} />
        </div>
      </div>
    </div>
  );
}
