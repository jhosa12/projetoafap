import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { useForm, Controller, Control, UseFormReset, UseFormHandleSubmit } from "react-hook-form";
import { DatePickerInput } from '@/components/DatePickerInput';

export interface FiltroForm {
  endDate?: Date;
  nome?: string;
  startDate?: Date;
  status: string;
}

interface FiltroExamesProps {
  filtroExames: (filtro: FiltroForm) => Promise<void>;
  loading: boolean;
  openModal: boolean;
  setOpenModal: () => void;
  control:Control<FiltroForm,any>
  reset:UseFormReset<FiltroForm>
  handleSubmit:UseFormHandleSubmit<FiltroForm>
}

export function FiltroExames({ 
  filtroExames, 
  loading, 
  openModal, 
  setOpenModal,
  control,
  handleSubmit,
  reset
}: FiltroExamesProps) {


  const onSubmit = async (data: FiltroForm) => {
    await filtroExames(data);
    setOpenModal();
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
   
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filtrar Exames</DialogTitle>
          <DialogDescription>Defina os parametros para filtrar os exames</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Controller
              name="nome"
              control={control}
              render={({ field }) => (
                <Input
                  id="nome"
                  placeholder="Nome do paciente"
                  {...field}
                  value={field.value || ''}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="ORÇAMENTO">ORÇAMENTO</SelectItem>
                      <SelectItem value="RECEBIDO">RECEBIDO</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                
                    
                      <Controller
                        control={control}
                        name="startDate"
                        render={({ field }) => (
                        <DatePickerInput
                        onChange={field.onChange}
                        value={field.value}
                        />
                        )}
                      />
                   
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Data Final</Label>
              <Controller
                control={control}
                name="endDate"
                render={({ field }) => (
                 
                    <Controller
                        control={control}
                        name="endDate"
                        render={({ field }) => (
                        <DatePickerInput
                        onChange={field.onChange}
                        value={field.value}
                        />
                        )}
                      />
                  
                )}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            Aplicar Filtro
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
