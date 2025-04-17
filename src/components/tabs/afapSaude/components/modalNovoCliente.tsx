// components/ClienteModal.tsx
'use client'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Controller, useForm } from "react-hook-form"
import { useState } from "react"
import { MdAdd } from "react-icons/md"
import useApiPost from "@/hooks/useApiPost"
import { ClienteFormProps, ClientePayload } from "@/types/afapSaude"
import { removerFusoDate } from "@/utils/removerFusoDate"
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';


export function ClienteModal() {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ClienteFormProps>()

  const {postData} = useApiPost<any,ClientePayload>('/afapSaude/cliente/cadastro')

  const onSubmit = async (data: ClienteFormProps) => {
   const { newDate } = removerFusoDate(data.data_nasc)
  // const {dataIni} =ajustarData(data.data_nasc,data.data_nasc)

    const { newDate:atualDate } = removerFusoDate(new Date())
    const payload = {...data,data_nasc:newDate,data_cadastro:atualDate}
     
    try {
      await postData(payload)
      setOpen(false)
      reset()
    } catch (error) {
      console.log(error)
    }
   
    
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm' variant="outline">
             <MdAdd/>
            Cadastrar Cliente
            </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
          <DialogDescription>Preencha os dados abaixo</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <Label>Nome *</Label>
              <Input {...register("nome", { required: "Nome é obrigatório" })} />
              {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
            </div>
            <div className="col-span-2">
              <Label>Endereço</Label>
              <Input {...register("endereco")} />
            </div>
            <div>
              <Label>Bairro</Label>
              <Input {...register("bairro")} />
            </div>
            <div>
              <Label>Número</Label>
              <Input type="number" {...register("numero", { valueAsNumber: true })} />
            </div>
            <div>
              <Label>Cidade</Label>
              <Input {...register("cidade")} />
            </div>
            <div>
              <Label>UF</Label>
              <Input maxLength={2} {...register("uf")} />
            </div>
            <div>
              <Label>CEP</Label>
              <Input {...register("cep")} />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input {...register("telefone")} />
            </div>
            <div>
              <Label>Celular</Label>
              <Input {...register("celular")} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" {...register("email", {
                pattern: {
                  value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                  message: "Email inválido"
                }
              })} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div >
          <div className="block">
            <Label  >Nascimento</Label>
          </div>

          <Controller
            name="data_nasc"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePicker selected={value} onChange={onChange} dateFormat={"dd/MM/yyyy"} locale={pt} className="flex w-full  text-sm h-9 border border-gray-200 shadow-sm rounded-md " />
            )}
          />

        </div>
            <div>
  <Label>CPF</Label>
  <Input
    {...register("cpf", {
      pattern: {
        value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        message: "CPF inválido",
      },
    })}
  />
  {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf.message}</p>}
</div>

            <div>
              <Label>Identidade</Label>
              <Input {...register("identidade")} />
            </div>
            <div className="col-span-4">
              <Label>Observações</Label>
              <Input {...register("obs")} />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
