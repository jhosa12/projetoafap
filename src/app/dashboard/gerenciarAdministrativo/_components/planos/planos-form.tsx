import { PlanosProps } from "@/types/planos";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/store/AuthContext";
import { Button } from "@/components/ui/button";

interface PlanosFormProps {
  plano?: PlanosProps | null
  onSave: SubmitHandler<PlanosProps>
  onCancel: () => void
}

export function PlanosForm({ plano, onSave, onCancel }: PlanosFormProps) {
  const { limparDados } = useContext(AuthContext)
  const form = useForm<PlanosProps>({
    defaultValues: {
      descricao:  '',
      limite_dep: 0,
      valor: 0,
      acrescimo: 0
    }
  })

  const { register, watch, handleSubmit, reset } = form

  useEffect(() => {
    if (plano) {

      reset({
        id_plano: plano.id_plano,
        descricao: plano.descricao,
        limite_dep: plano.limite_dep,
        valor: plano.valor
      });
      limparDados()
    }
  }, [plano, reset]);

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSave)}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="descricao">
              Descrição do Plano
            </FieldLabel>
            <Input
              id="descricao"
              placeholder="Digite aqui..."
              value={watch('descricao')?.toUpperCase()}
              {...register('descricao')}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="limite_dep">
              Limite de Dependentes
            </FieldLabel>
            <Input
              id="limite_dep"
              placeholder="Digite aqui..."
              type="number"
              {...register('limite_dep', {
                valueAsNumber: true,
                min:0
              })}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="valor">
              Valor
            </FieldLabel>
            <Input
              id="valor"
              type="number"
              {...register('valor', {
                valueAsNumber: true,
                min: 0
              })}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="acrescimo">
              Acréscimo
            </FieldLabel>
            <Input
              id="acrescimo"
              type="number"
              {...register('acrescimo', {
                valueAsNumber: true,
                min: 0
              })}
              required
            />
          </Field>
          <Field>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">{plano?.id_plano ? "Atualizar" : "Salvar"} Plano</Button>
            </div>
          </Field>
        </FieldGroup>
        
      </form>
    </FormProvider >
  )



}