"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/app/dashboard/admcontrato/_components/DatePickerWithRange"
import { DateRange } from "react-day-picker"
import { Controller, SubmitHandler, useForm, useFormContext } from "react-hook-form"
import { RotaFilterProps } from "../../rotas/page"

interface FiltersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: { consultor: string; status: string; bairro: string, dateRange: DateRange | undefined }
  getRotas: (data: RotaFilterProps) => Promise<void>
}


export function FiltersDialog({ open, onOpenChange, getRotas, filters }: FiltersDialogProps) {
  // const [tempFilters, setTempFilters] = useState(filters)
  // const {register,handleSubmit,control} = useForm<FormProps>({
  //   defaultValues:filters
  // })
  const methodos = useFormContext<RotaFilterProps>()
  const { register, handleSubmit, control, reset } = methodos

  const handleApply: SubmitHandler<RotaFilterProps> = (data) => {
    // onFiltersChange(data)
    getRotas(data)
    onOpenChange(false)
  }

  const handleClear = () => {
    const clearedFilters = { consultor: "", status: "todos", bairro: "", dateRange: { from: undefined, to: undefined } }
    // setTempFilters(clearedFilters)
    // onFiltersChange(clearedFilters)
    reset(clearedFilters)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
          <DialogDescription>Configure os filtros para encontrar as rotas desejadas</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleApply)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="filter-consultor">Consultor</Label>
              <Input
                id="filter-consultor"
                placeholder="Nome do consultor"
                {...register('consultor')}
              />
            </div>

            <div>
              <Label htmlFor="filter-status">Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field: { value, onChange } }) =>

                  <Select
                    value={value}
                    onValueChange={onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="ativa">Ativa</SelectItem>
                      <SelectItem value="pausada">Pausada</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                }


              />

            </div>

            <div>
              <Label htmlFor="filter-bairro">Bairro</Label>
              <Input
                id="filter-bairro"
                placeholder="Nome do bairro"
                {...register('bairro')}
              />
            </div>


            <div>
              <Label>Periodo</Label>
              <Controller
                control={control}
                name='dateRange'
                render={({ field: { value, onChange } }) =>
                  <DatePickerWithRange
                    dateRange={value}
                    onDateRangeChange={onChange}
                  />
                }

              />

            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClear}>
              Limpar
            </Button>
            <Button type='submit'>Aplicar Filtros</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
