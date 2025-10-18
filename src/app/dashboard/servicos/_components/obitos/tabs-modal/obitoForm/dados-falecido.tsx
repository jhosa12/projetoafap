import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Controller, useFormContext } from "react-hook-form";
import { ObitoProps } from "@/app/dashboard/servicos/_types/obito";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Dependente, getColumnsDepObito } from "../../colunas-dependentes-obitos";
import { AuthContext } from "@/store/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RowSelectionState } from "@tanstack/react-table";
import { ModalSelecaoDependente } from "../../../modal-dependentes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useConfirmarSelecaoFalecido } from "@/app/dashboard/servicos/_hooks/obitos/useConfirmarSelecaoFalecido";
import { DatePickerInput } from "@/components/DatePickerInput";


export const OSDadosFalecido = ({ isEditing }: { isEditing: boolean }) => {
  const { control, watch, register, reset } = useFormContext<ObitoProps>()
  const [modalDependente, setModalDependente] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const { dadosassociado, infoEmpresa } = useContext(AuthContext)
  const prevTipoSelecionadoRef = useRef<'TITULAR' | 'DEPENDENTE' | 'PARTICULAR' | ''>('')



  const tipoSelecionado = watch('falecido')
  const dependenteJaSelecionado = !!watch('id_dependente_global');


  const { handleConfirmarSelecao } = useConfirmarSelecaoFalecido({
    rowSelection,
    dadosassociado,
    reset,
    watch,
    setModalDependente,
    setRowSelection
  })

  useEffect(() => {

    console.log("Está sendo disparado", tipoSelecionado)
    if (isEditing) return

    const limparCamposPessoais = () => {
      reset({
        ...watch(),
        nome_falecido: "",
        data_nascimento: undefined,

      })
    }

    const limparDadosDoDependente = () => {
      reset({
        ...watch(),
        id_dependente_global: undefined
      })
    }
    const prevTipo = prevTipoSelecionadoRef.current

    if (tipoSelecionado === 'TITULAR') {

      if (!dadosassociado?.id_global) {
        toast.error("Nenhum associado selecionado para buscar os dados.")
        reset({ ...watch(), falecido: '' })
        return
      }

      const dadosMapeados = {
        nome_falecido: dadosassociado.nome,
        data_nascimento: dadosassociado.data_nasc,
        id_titular: dadosassociado.id_associado,
        id_associado_global: dadosassociado.id_global

      }

      reset({ ...watch(), ...dadosMapeados })
      limparDadosDoDependente()
      toast.success("Dados do titular foram preenchidos!")

    } else if (tipoSelecionado === "DEPENDENTE") {

      if (!dadosassociado?.id_global) {
        toast.error("Nenhum associado selecionado para buscar os dados dos dependentes.")
        reset({ ...watch(), falecido: '' })
        return
      }

      if (!dependenteJaSelecionado) {
        setModalDependente(true)
      }

    } else if (tipoSelecionado === "PARTICULAR") {

      if (!infoEmpresa?.id) {
        toast.error("A seleção da empresa é obrigatória.")
        reset({ ...watch(), falecido: '' })
        return
      }

      if (tipoSelecionado !== prevTipo && prevTipo) {
        limparCamposPessoais();
        limparDadosDoDependente()
      }



    } else {
      if (tipoSelecionado !== prevTipo && prevTipo) {

        limparCamposPessoais()

      }
    }

    prevTipoSelecionadoRef.current = tipoSelecionado

  }, [tipoSelecionado, dadosassociado, watch, reset])

  const columns = useMemo(() => getColumnsDepObito({
    setModalDependente,
    reset,
    watch
  }), [reset, watch])

  return (
    <>
      <Card className="bg-white border-gray-200 shadow-none ">
        <CardHeader>
          <CardTitle className="text-gray-900">Dados do Falecido</CardTitle>
          <CardDescription className="text-gray-600">Informações pessoais do falecido</CardDescription>
          <Controller
            name="falecido"
            control={control}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value || ''}
                disabled={isEditing}
                className="flex gap-6 mt-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="TITULAR" id="TITULAR" />
                  <Label htmlFor="TITULAR">Titular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DEPENDENTE" id="DEPENDENTE" />
                  <Label htmlFor="DEPENDENTE">Dependente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PARTICULAR" id="PARTICULAR" />
                  <Label htmlFor="PARTICULAR">Particular</Label>
                </div>
              </RadioGroup>
            )}
          />
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="nome_falecido">Nome Completo *</Label>
            <Input
              id="nome_falecido"
              {...register('nome_falecido')}
              placeholder="Nome completo do falecido"
              required
            />
          </div>
          <div className="grid gap-2 ">
            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
            <Controller
              control={control}
              name="data_nascimento"
              render={({ field }) =>
                <DatePickerInput
                  onChange={field.onChange}
                  value={field.value}
                />
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sexo">Sexo</Label>
            <Controller
              control={control}
              name="sexo"
              render={({ field }) =>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MASCULINO">MASCULINO</SelectItem>
                    <SelectItem value="FEMININO">FEMININO</SelectItem>
                  </SelectContent>
                </Select>
              }
            />

          </div>
          <div className="space-y-2">
            <Label htmlFor="estado_civil">Estado Civil</Label>
            <Controller
              control={control}
              name="estado_civil"
              render={({ field }) =>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado civil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="Casado">Casado(a)</SelectItem>
                    <SelectItem value="Viúvo">Viúvo(a)</SelectItem>
                    <SelectItem value="Divorciado">Divorciado(a)</SelectItem>
                  </SelectContent>
                </Select>
              }
            />

          </div>
          <div className="space-y-2">
            <Label htmlFor="profissao">Profissão</Label>
            <Input
              id="profissao"
              {...register('profissao')}
              placeholder="Profissão do falecido"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rg">RG</Label>
            <Input
              id="rg"
              {...register('rg')}
              placeholder="00.000.000-0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              {...register('cpf')}
              placeholder="000.000.000-00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="religiao">Religião</Label>
            <Input
              id="religiao"
              {...register('religiao')}
              placeholder="Religião do falecido"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="naturalidade">Naturalidade</Label>
            <Input
              id="naturalidade"
              {...register('naturalidade')}
              placeholder="Cidade de nascimento"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="uf_naturalidade">UF Naturalidade</Label>
            <Input
              id="uf_naturalidade"
              {...register('uf_naturalidade')}
              placeholder="SP"
              maxLength={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nome_pai">Nome do Pai</Label>
            <Input
              id="nome_pai"
              {...register('nome_pai')}
              placeholder="Nome completo do pai"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nome_mae">Nome da Mãe</Label>
            <Input
              id="nome_mae"
              {...register('nome_mae')}
              placeholder="Nome completo da mãe"
            />
          </div>
        </CardContent>
      </Card>

      <ModalSelecaoDependente
        isOpen={modalDependente}
        onClose={() => setModalDependente(false)}
        onConfirm={handleConfirmarSelecao}
        dependentes={dadosassociado?.dependentes?.filter(d => !d.excluido) || []}
        columns={columns}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />

    </>
  )
}