import { useState } from "react"
import { MdAddCircle, MdDeleteForever } from "react-icons/md";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { Table } from "flowbite-react";
import { ChildrenProps } from "@/app/dashboard/admcontrato/_components/cadastro/modalCadastro";
import { Control, Controller, useForm, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PhoneMaskInput } from "@/components/PhoneMaskInput";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parentescos } from "@/utils/arrayParentesco";
registerLocale('pt', pt)

interface UserProps {
  nome: string,
  data_nasc: Date | undefined | null,
  grau_parentesco: string,
  data_adesao: Date,
  celular: string,
  carencia: Date,
  cad_dh: Date
}

export function DadosDependentes({ register, setValue, watch, trigger }: ChildrenProps) {

  const { register: registerDep, setValue: setValueDep, watch: watchDep, reset: resetDep, control } = useForm<UserProps>()





  function adicionar() {
    if (watchDep('nome') !== '') {
      const dados = {
        nome: watchDep('nome'), data_nasc: watchDep('data_nasc') || null, grau_parentesco: watchDep('grau_parentesco'), data_adesao: watchDep('data_adesao'), carencia: watchDep('carencia'), cad_dh: new Date(), celular: watchDep('celular')
      }

      const currentItens = watch('arraydep') || []
      setValue('arraydep', [...currentItens, dados]);
      // trigger('arraydep')
      resetDep({
        nome: '', data_nasc: null, grau_parentesco: '', data_adesao: new Date(), carencia: new Date(), celular: ''
      })
    }
  }
  const handleExcluirDependente = (index: number) => {
    const currentArray = watch("arraydep") || []; // Obtendo o array atual

    // Criando um novo array com o item removido
    const novoArray = [...currentArray];
    novoArray.splice(index, 1);

    // Atualizando o valor do array no formulário
    setValue("arraydep", novoArray);
  };

  return (

    <div className="flex flex-col divide-x-2 max-h-96 gap-2  rounded-lg w-full">
      <ModalAddDep adicionar={adicionar} register={registerDep} control={control} setValue={setValueDep} />
      <h1 className="font-semibold">Dependentes: {watch('arraydep')?.length}</h1>



      <div></div>

      <div className="flex w-full overflow-x-auto">
        <Table theme={{ root: { shadow: 'none' }, body: { cell: { base: " px-6 py-1  text-[11px] text-black" } }, head: { cell: { base: "px-6 py-1 text-xs text-black font-semibold" } } }}>
          <Table.Head>
            <Table.HeadCell>
              Nome
            </Table.HeadCell>
            <Table.HeadCell>
              Nasc
            </Table.HeadCell>
            <Table.HeadCell>
              Parentesco
            </Table.HeadCell>
            <Table.HeadCell>
              Celular
            </Table.HeadCell>
            <Table.HeadCell>
              Adesão
            </Table.HeadCell>
            <Table.HeadCell>
              Carência
            </Table.HeadCell>
            <Table.HeadCell>
              Ações
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {watch('arraydep')?.map((usuario, index) => (
              <Table.Row key={index} >
                <Table.Cell className="whitespace-nowrap" scope="row" >{usuario.nome}</Table.Cell>
                <Table.Cell>{usuario.data_nasc?.toLocaleDateString()}</Table.Cell>
                <Table.Cell>{usuario.grau_parentesco}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{usuario.celular}</Table.Cell>
                <Table.Cell >{usuario.data_adesao?.toLocaleDateString()}</Table.Cell>
                <Table.Cell>{usuario.carencia?.toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  <div className="flex gap-3">

                    <button type="button" onClick={() => handleExcluirDependente(index)} className="flex justify-center items-center  hover:text-red-600 " ><MdDeleteForever size={18} /></button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}

          </Table.Body>
        </Table>


      </div>
    </div>

  )
}


interface DepProps {
  register: UseFormRegister<UserProps>
  control: Control<UserProps, any>
  setValue: UseFormSetValue<UserProps>
  adicionar: () => void
}

export const ModalAddDep = ({ control, register, setValue, adicionar }: DepProps) => {
  const [show, setShow] = useState(false)
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mr-auto"
        >
          <MdAddCircle size={20} />
          Adicionar
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()} // impede fechar ao clicar fora
        onEscapeKeyDown={(e) => e.preventDefault()}  // impede fechar com ESC
      >
        <DialogHeader>
          <DialogTitle>Adicionar Dependente</DialogTitle>
        </DialogHeader>

        <div className="grid pb-3 gap-2 grid-cols-2">
          <div className="col-span-2">
            <Label className="text-xs">Nome</Label>
            <Input
              type="text"
              {...register("nome")}
            />
          </div>

          <div>
            <Label className="text-xs">Nascimento</Label>
            <Controller
              name="data_nasc"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePickerInput
                  value={value}
                  className="h-9"
                  onChange={onChange} />
              )}
            />
          </div>

          <div>
            <Label className="text-xs">Parentesco</Label>
            <Controller
              control={control}
              name="grau_parentesco"
              render={({ field: { onChange, value } }) => (
                <Select
                  onValueChange={onChange}
                  value={value}
                  defaultValue={value}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentescos.map((parentesco) => (
                      <SelectItem key={parentesco.value} value={parentesco.value}>
                        {parentesco.label}
                      </SelectItem>
                    ))}

                  </SelectContent>
                </Select>
              )}
            />

          </div>

          <div>
            <label className="text-xs">Celular</label>
            <PhoneMaskInput controlName="celular" register={register} />
          </div>

          <div>
            <label className="text-xs">Adesão</label>
            <Controller
              name="data_adesao"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePickerInput
                  value={value}
                  className="h-9"
                  onChange={onChange} />
              )}
            />
          </div>

          <div>
            <label className="text-xs">Carência</label>
            <Controller
              name="carencia"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePickerInput
                  value={value}
                  className="h-9"
                  onChange={onChange} />
              )}
            />
          </div>

          <div className="col-span-2 flex justify-end mt-2">
            <Button type="button" onClick={adicionar} size="sm">
              Adicionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}