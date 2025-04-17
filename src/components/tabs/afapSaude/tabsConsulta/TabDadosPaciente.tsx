import { Label } from "@/components/ui/label";
import { TabsConsultaProps } from "./TabsConsulta";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AiOutlineClockCircle } from "react-icons/ai";
import { Controller } from "react-hook-form";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import ReactInputMask from "react-input-mask";
import { useState } from "react";
import BuscarClienteModal from "@/components/modals/afapSaude/modalBuscaClientes";
import { calcularIdade } from "@/utils/calcIdade";


const tiposBusca = [
  { value: "nome", label: "Nome" },
  { value: "cpf", label: "CPF" },
  { value: "endereco", label: "Endereço" },
  { value: "bairro", label: "Bairro" },
]


export default function TabDadosPaciente({ register, control, watch, setValue }: TabsConsultaProps) {

    const [modalBusca, setBusca] = useState(false);

    const nascimento = watch('nascimento');
    const idade = calcularIdade(nascimento);

    return (
        <>
       
        <div className="grid grid-cols-4 gap-4 ">
        <div className="col-span-2 ">
          <Label className="text-xs" htmlFor="nome" >Nome Paciente</Label>
          {/* readOnly onClick={() => setBusca(true)} */}
          <Input   className=" cursor-pointer bg-white" id="nome" placeholder="Nome" {...register('nome',{required:'Nome é Obrigatório'})} />
         
         
        </div>

        <div >
          <div className="block">
            <Label className="text-xs" >Nascimento</Label>
          </div>

          <Controller
            name="nascimento"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePicker selected={value} onChange={onChange} dateFormat={"dd/MM/yyyy"} locale={pt} className="flex w-full  text-sm h-9 border border-gray-200 shadow-sm rounded-md " />
            )}
          />

        </div>

        <div className="w-full">


          <Label className="text-xs" htmlFor="celular">Celular</Label>

          <Controller
            control={control}
            name="celular"
            render={({ field: { onChange, value } }) => (
              <ReactInputMask value={value} onChange={e => onChange(e.target.value)} id="celular" placeholder="Celular" className="px-2 h-9 focus:outline-none  w-full text-sm  border border-gray-200 shadow-sm rounded-md " mask={'(99) 9 9999-9999'} />
            )}
          />


        </div>
        <div className="w-full">
          <Label className="text-xs" htmlFor="cpf" >CPF</Label>
          <Controller
            control={control}
            name="cpf"
            render={({ field: { onChange, value } }) => (
              <ReactInputMask value={value} onChange={e => onChange(e.target.value)} id="cpf" placeholder="CPF" className="flex px-2 h-9 focus:outline-none  w-full text-sm  border border-gray-200 shadow-sm rounded-md " mask={'999.999.999-99'} />
            )}
          />
        </div>

        <div >
          <Label className="text-xs" htmlFor="identidade" >Identidade</Label>
          <Input  {...register('identidade')} className="focus:outline-none " id="identidade" placeholder="Identidade"/>
        </div>


        <div className="col-span-2 ">

          <Label className="text-xs" htmlFor="email" >Nome Responsável (se for menor)</Label>

          <Input  {...register('responsavel',{
    validate: value => {
      if (idade !== null && idade < 18 && !value) {
        return "Nome do responsável é obrigatório para menores de 18 anos";
      }
      return true;
    }
  })} className="focus:outline-none " placeholder="Responsável, caso paciente seja menor de idade" />
        </div>


        <div >

          <Label className="text-xs" >Parentesco</Label>
            <Controller
            control={control}
            name="grau_parentesco"
            rules={{
              validate: value => {
                if (idade !== null && idade < 18 && !value) {
                  return "Parentesco é obrigatório"
                }
                return true;
              }
            }}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onValueChange={onChange}  >
                <SelectTrigger className="">
                  <SelectValue placeholder="Parentesco" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem className="text-xs" value={'CONJUGE'}>CONJUGE</SelectItem>
                      <SelectItem className="text-xs" value={'PAI'}>PAI</SelectItem>
                      <SelectItem className="text-xs" value={'MÂE'}>MÂE</SelectItem>
                      <SelectItem className="text-xs" value={'FILHO(A)'}>FILHO(A)</SelectItem>
                      <SelectItem className="text-xs" value={'NETO(A)'}>NETO(A)</SelectItem>
                      <SelectItem className="text-xs" value={'IRMÂO(Ã)'}>IRMÂO(Ã)</SelectItem>
                      <SelectItem className="text-xs" value={'PRIMO(A)'}>PRIMO(A)</SelectItem>
                      <SelectItem className="text-xs" value={'SOBRINHO(A)'}>SOBRINHO(A)</SelectItem>
                      <SelectItem className="text-xs" value={'NORA'}>NORA</SelectItem>
                      <SelectItem className="text-xs" value={'GENRO'}>GENRO</SelectItem>
                      <SelectItem className="text-xs" value={'TIO(A)'}>TIO(A)</SelectItem>
                      <SelectItem className="text-xs" value={'AVÔ(Ó)'}>AVÔ(Ó)</SelectItem>
                      <SelectItem className="text-xs" value={'OUTRO'}>OUTRO</SelectItem>
                 </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
            )}
            />
        </div>

        <div className="col-span-2" >

<Label className="text-xs" >Endereço</Label>

<Input {...register('endereco')} className="focus:outline-none " id="email" placeholder="Endereço" />
</div>
<div >

<Label className="text-xs" >Numero</Label>

<Input {...register('numero')} className="focus:outline-none " id="email" placeholder="Numero" />
</div>

<div >

<Label className="text-xs" >Bairro</Label>

<Input {...register('bairro')} className="focus:outline-none " id="email" placeholder="Bairro" />
</div>

<div >

<Label className="text-xs" >Cidade</Label>

<Input {...register('cidade')} className="focus:outline-none " id="email" placeholder="Cidade" />
</div>

<div className="col-span-2" >

<Label className="text-xs" >Complemento</Label>

<Input {...register('complemento')} className="focus:outline-none " placeholder="Complemento" />
</div>

<div >

<Label className="text-xs" id="peso" >Peso</Label>

<Input  {...register('peso')} className="focus:outline-none" id="peso" placeholder="Peso" />
</div>


<div >

<Label className="text-xs" >Altura</Label>

<Input  {...register('altura')} className="focus:outline-none" id="email" placeholder="Altura" />
</div>

<div >

<Label className="text-xs" >Temperatura</Label>

<Input {...register('temperatura')} className="focus:outline-none" id="email" placeholder="Temperatura" />
</div>



        </div>

        <BuscarClienteModal setValue={setValue} open={modalBusca} setOpen={setBusca} tiposBusca={tiposBusca} onBuscar={async (tipoBusca, termo) => {
          setBusca(false)
        }}/>
        </>
    );
  }
  