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
import { Textarea } from "@/components/ui/textarea";
import { ProdutosProps } from "@/types/produtos";

interface ProdutoFormProps {
  produto?: ProdutosProps | null
  onSave: SubmitHandler<ProdutosProps>
  onCancel: () => void
}

export function ProdutoForm({ produto, onSave, onCancel }: ProdutoFormProps) {
  const { limparDados } = useContext(AuthContext)
  const form = useForm<ProdutosProps>({
    defaultValues: {
      descricao: '',
      unidade: '',
      valor_custo: 0,
      valor_venda: 0,
      quantidade: 0,
      margem_lucro: 0,
      tipo: "P"
    }
  })

  const { register, watch, handleSubmit, reset } = form

  useEffect(() => {
    if (produto) {

      reset({
        id_produto: produto.id_produto,
        descricao: produto.descricao,
        unidade: produto.unidade,
        valor_custo: produto.valor_custo,
        valor_aluguel: produto.valor_aluguel,
        quantidade: produto.quantidade,
        margem_lucro: produto.margem_lucro,
      });

      limparDados()

    }
  }, [produto, reset]);

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSave)}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="descricao">
              Descrição do Produto
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
              <FieldLabel htmlFor="unidade">
                Unidade
              </FieldLabel>
              <Input
                id="unidade"
                placeholder="Digite aqui..."
                {...register('unidade')}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="valor_custo">
                Valor Custo
              </FieldLabel>
              <Input
                id="valor_custo"
                type="number"
                {...register('valor_custo', {
                  valueAsNumber: true,
                  min: 0
                })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="valor_venda">
                Valor Venda
              </FieldLabel>
              <Input
                id="valor_venda"
                type="number"
                {...register('valor_venda', {
                  valueAsNumber: true,
                  min: 0
                })}
                required
              />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4 items-end align-bottom">
            <Field>
              <FieldLabel htmlFor="quantidade">
                Quantidade
              </FieldLabel>
              <Input
                id="quantidade"
                placeholder="Digite aqui..."
                type="number"
                {...register('quantidade',{
                  valueAsNumber: true,
                  min: 0
                })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="margem_lucro">
                Margem de Lucro
              </FieldLabel>
              <Input
                id="margem_lucro"
                type="number"
                {...register('margem_lucro', {
                  valueAsNumber: true,
                  min: 0
                })}
                required
              />
            </Field>
          </div>
          <Field>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">{produto?.id_produto ? "Atualizar" : "Salvar"} Produto</Button>
            </div>
          </Field>
        </FieldGroup>

      </form>
    </FormProvider >
  )



}