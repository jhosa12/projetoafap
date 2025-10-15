

import React, { useEffect } from 'react';

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EmpresaProps } from "@/types/empresa";
import { ConveniadosProps } from '../../../../conveniados/page';
import { PremioProps } from '../../../_types/premio';


interface CadastroProps {

  listarPremios: () => Promise<void>
  setPremios: (fields: Array<Partial<PremioProps>>) => void
  arrayPremios: Array<Partial<PremioProps>>
  modal: boolean
  setModal: (modal: boolean) => void
  empresas: Array<EmpresaProps>
  conveniados: Array<ConveniadosProps>
  itemEdit?: Partial<PremioProps> | null
  handleSalvar: SubmitHandler<PremioProps>
}

export default function ModalPremio({ modal, setModal, empresas, conveniados, itemEdit, handleSalvar }: CadastroProps) {

  const { register, setValue, handleSubmit, watch, reset, control } = useForm<PremioProps>({
    defaultValues: itemEdit || {},
  })

  useEffect(() => {

    if (modal && itemEdit) {
      reset(itemEdit)
    } else if (!modal) {
      reset({
        descricao: '',
        id_empresa: '',
        id_conveniados: undefined,

      })
    }

  }, [modal, reset, itemEdit])

  return (

    <Dialog open={true} onOpenChange={() => setModal(false)}>
      <DialogContent className="max-w-md w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{itemEdit ? 'Editar Prêmio' : 'Novo Prêmio'}</DialogTitle>
          <DialogDescription>
            {itemEdit ? 'Use os campos abaixo para alterar os detalhes do prêmio.' :
              'Informe os detalhes do prêmio a ser sorteado.'}
          </DialogDescription>
        </DialogHeader>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit(handleSalvar)}>
          <div className="md:col-span-2">
            <Label htmlFor="descricao" className="mb-1 block">Descrição do Prêmio</Label>
            <Input id="descricao" {...register('descricao')} required />
          </div>
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="flex flex-col">
              <Label htmlFor="id_empresa" className="mb-1 block">Empresa</Label>
              <Controller
                name="id_empresa"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    required
                  >
                    <SelectTrigger className="whitespace-nowrap truncate min-w-[180px]">
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {empresas?.map((item) => (
                        <SelectItem
                          value={String(item.id)}
                          key={item.id}
                          className="whitespace-nowrap truncate"
                        >
                          {item.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="id_conveniados" className="mb-1 block">Conveniado</Label>
              <Controller
                name="id_conveniados"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={field.onChange}
                    required
                  >
                    <SelectTrigger className="whitespace-nowrap truncate min-w-[180px]">
                      <SelectValue placeholder="Selecione um conveniado" />
                    </SelectTrigger>
                    <SelectContent>
                      {conveniados?.map((item) => (
                        item.id_conveniados &&
                        <SelectItem
                          value={String(item.id_conveniados)}
                          key={item.id_conveniados}
                          className="whitespace-nowrap truncate"
                        >
                          {item.conveniado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter className="col-span-2">
            <Button type="submit">{itemEdit ? 'Alterar Prêmio' : 'Adicionar Prêmio'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

  )
}