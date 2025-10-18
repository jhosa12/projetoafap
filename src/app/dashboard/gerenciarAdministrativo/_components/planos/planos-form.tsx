import { PlanosProps } from "@/types/planos";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/store/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { normalizarValor } from "@/utils/normalizarValor";
import { formatarComVirgula } from "@/utils/normalizarValorEditar";



interface PlanosFormProps {
  plano?: PlanosProps | null
  onSave: SubmitHandler<PlanosProps>
  onCancel: () => void
}


type PlanosValores = Omit<PlanosProps, 'valor' | 'acrescimo'> & {

  valor: string,
  acrescimo: string
}


export function PlanosForm({ plano, onSave, onCancel }: PlanosFormProps) {
  const { limparDados } = useContext(AuthContext)
  const form = useForm<PlanosValores>({
    defaultValues: {
      descricao: '',
      limite_dep: 0,
      valor: '',
      acrescimo: '',
      informacoes_plano: ''
    }
  })


  const { register, watch, handleSubmit, reset } = form

  useEffect(() => {
    if (plano) {

      const valor = formatarComVirgula(plano.valor)
      const acrescimo = formatarComVirgula(plano.valor)

      reset({
        id_plano: plano.id_plano,
        descricao: plano.descricao,
        limite_dep: plano.limite_dep,
        valor: valor,
        acrescimo: acrescimo,
        informacoes_plano: plano.informacoes_plano
      });
      limparDados()
    }
  }, [plano, reset]);

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit((data) => {

        const valor = normalizarValor(data.valor)

        const acrescimo = normalizarValor(data.acrescimo)

        const payload = {
          ...data,
          valor: valor,
          acrescimo: acrescimo
        };

        onSave(payload);

      })}>
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
          <div className="grid grid-cols-3 gap-4 items-end align-bottom">
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
                  min: 0
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
                type="text"
                inputMode="decimal"
                pattern="^[0-9]+([.,]?[0-9]{1,2})?$"
                step="0.01"
                {...register('valor')}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="acrescimo">
                Acréscimo
              </FieldLabel>
              <Input
                id="acrescimo"
                type="text"
                inputMode="decimal"
                pattern="^[0-9]+([.,]?[0-9]{1,2})?$"
                step="0.01"
                {...register('acrescimo')}
                required
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="informacoes_plano">
              Informações do Plano
            </FieldLabel>
            <Textarea
              id="informacoes_plano"
              {...register('informacoes_plano')}
              placeholder="Digite aqui..."
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