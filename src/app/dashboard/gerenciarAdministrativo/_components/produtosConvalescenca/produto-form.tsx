import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/store/AuthContext";
import { Button } from "@/components/ui/button";
import { ProdutosProps } from "@/types/produtos";
import { formatarComVirgula } from "@/utils/normalizarValorEditar";
import { normalizarValor } from "@/utils/normalizarValor";

interface ProdutoFormProps {
  produto?: ProdutosProps | null
  onSave: SubmitHandler<ProdutosProps>
  onCancel: () => void
}

type ProdConvValores = Omit<ProdutosProps, 'valor_custo' | 'valor_venda' | 'margem_lucro'> & {

  valor_custo: string,
  valor_venda: string,
  margem_lucro: string,

}

export function ProdutoForm({ produto, onSave, onCancel }: ProdutoFormProps) {
  const { limparDados } = useContext(AuthContext)
  const form = useForm<ProdConvValores>({
    defaultValues: {
      descricao: '',
      unidade: '',
      valor_custo: '',
      valor_venda: '',
      quantidade: 0,
      margem_lucro: '',
      tipo: "P"
    }
  })

  const { register, watch, handleSubmit, reset } = form

  useEffect(() => {
    if (produto) {

      const valor_custo = formatarComVirgula(produto.valor_custo)
      const valor_venda = formatarComVirgula(produto.valor_venda)
      const margem_lucro = formatarComVirgula(produto.margem_lucro)

      reset({
        id_produto: produto.id_produto,
        descricao: produto.descricao,
        unidade: produto.unidade,
        valor_custo: valor_custo,
        valor_venda: valor_venda,
        quantidade: produto.quantidade,
        margem_lucro: margem_lucro,
      });

      limparDados()

    }
  }, [produto, reset]);

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit((data) => {

        const stringValorCusto = String(data.valor_custo)
        const valor_custo = normalizarValor(stringValorCusto)

        const stringValorVenda = String(data.valor_venda)
        const valor_venda = normalizarValor(stringValorVenda)

        const stringMargemLucro = String(data.margem_lucro)
        const margem_lucro = normalizarValor(stringMargemLucro)

        const payload = {
          ...data,
          valor_custo: valor_custo,
          valor_venda: valor_venda,
          margem_lucro: margem_lucro
        }

        onSave(payload)

      })}>
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
                type="text"
                {...register('valor_custo')}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="valor_venda">
                Valor Venda
              </FieldLabel>
              <Input
                id="valor_venda"
                type="text"
                {...register('valor_venda')}
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
                {...register('quantidade', {
                  valueAsNumber: true,
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
                type="text"
                {...register('margem_lucro')}
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