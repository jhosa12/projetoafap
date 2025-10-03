'use client';

import React, { useContext, useEffect, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, Trash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox";
import { RowSelectionState } from "@tanstack/react-table";


import { getColumns, Dependente } from "../../_components/convalescentes/colunas-dependentes";

import { TabelaCompleta } from "./data-table";
import { AssociadoProps } from "@/app/dashboard/admcontrato/_types/associado";
import { ModalBusca } from "@/components/modals/modalBusca/modalBusca";
import { VerificarSituacao } from "@/app/dashboard/admcontrato/_utils/verificarSituacao";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ModalCadastro from "@/app/dashboard/admcontrato/_components/cadastro/modalCadastro";
import { usePrintDocsAssociado } from "@/hooks/usePrintDocsAssociado";
import { Textarea } from "@/components/ui/textarea";
import { ConvProps } from "../../_types/convalescente";
import { ListaMaterial } from "@/app/dashboard/admcontrato/_types/lista-material";
import { EstoqueNovoRegistroProps } from "@/app/dashboard/estoque/types/estoque";
import { SelectProps } from "flowbite-react";
import { UfProps } from "@/types/ufs";
import { useParams, useRouter } from "next/navigation";
import { truncate } from "fs/promises";
import { ProdutosProps } from "@/app/dashboard/admcontrato/_types/produtos";
import { Separator } from "@/components/ui/separator";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { AuthContext } from "@/store/AuthContext";
import { ModalSelecaoDependente } from "../modal-dependentes";
import { useFormularioConv } from "../../_hooks/useFormularioConv";

interface FormularioConvProps {
  listarProdutos: ProdutosProps[];
  dadosassociado: AssociadoProps | Partial<AssociadoProps> | null;
  ufs: UfProps[];
  isEditMode: boolean;
  isModalOpen: boolean;
  rowSelection: RowSelectionState;
  setIsModalOpen: (isOpen: boolean) => void;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
}


export default function FormularioConv({
  listarProdutos,
  dadosassociado,
  ufs,
  isEditMode,
  isModalOpen,
  rowSelection,
  setIsModalOpen,
  setRowSelection,
}: FormularioConvProps) {

  const { infoEmpresa, usuario, limparDados } = useContext(AuthContext);
  const { register, control, reset, watch, setValue } = useFormContext<ConvProps>();
  const { fields: produtos, append, remove } = useFieldArray({
    control,
    name: "convalescenca_prod"
  });
  const [produtoSelecionado, setProdutoSelecionado] = React.useState<string>("");
  const [quantidadeSelecionada, setQuantidadeSelecionada] = React.useState<number>(1);
  const [modalDependente, setModalDependente] = React.useState(false);
  const prevTipoSelecionadoRef = useRef<'TITULAR' | 'DEPENDENTE' | 'PARTICULAR' | null>(null)
  const tipoSelecionado = watch('tipo_convalescente')
  const subtotal = watch('subtotal')
  const descontos = watch('descontos')
  const { handleConfirmarSelecao } = useFormularioConv({
    rowSelection,
    dadosassociado,
    reset,
    watch,
    setModalDependente,
    setRowSelection,
  })

  useEffect(() => {

    console.log("Está sendo disparado", tipoSelecionado)
    if (isEditMode) return

    const limparCamposPessoais = () => {
      reset({
        ...watch(),
        nome: "",
        data_nasc: null,
        cpf_cnpj: '',
        logradouro: '',
        numero: null,
        complemento: '',
        bairro: '',
        cep: '',
        cidade: '',
        uf: '',
      })
    }

    const limparCamposParticular = () => {

      reset({
        ...watch(),
        id_associado: null,
        nome: '',
        cpf_cnpj: '',
        data_nasc: null,
        logradouro: '',
        numero: null,
        complemento: '',
        bairro: '',
        cep: '',
        cidade: '',
        uf: '',
      })
    }
    const prevTipo = prevTipoSelecionadoRef.current

    if (tipoSelecionado === 'TITULAR') {

      if (!dadosassociado?.id_global) {
        toast.error("Nenhum associado selecionado para buscar os dados")
        reset({ ...watch(), tipo_convalescente: null })
        return
      }

      const dadosMapeados = {

        //Informações Pessoais
        nome: dadosassociado.nome,
        data_nasc: dadosassociado.data_nasc,
        logradouro: dadosassociado.endereco,
        numero: dadosassociado.numero,
        bairro: dadosassociado.bairro,
        cep: dadosassociado.cep,
        cidade: dadosassociado.cidade,
        uf: dadosassociado.uf,

        id_associado: dadosassociado.id_associado,
        id_global: dadosassociado.id_global

      }

      reset({ ...watch(), ...dadosMapeados })
      toast.success("Dados do titular foram preenchidos!")

    } else if (tipoSelecionado === "DEPENDENTE") {

      setModalDependente(true)

    } else if (tipoSelecionado === "PARTICULAR") {

      if (!infoEmpresa?.id) {
        toast.error("A seleção da empresa é obrigatória")
        reset({ ...watch(), tipo_convalescente: null })
        return
      }

      if (tipoSelecionado !== prevTipo && prevTipo !== null) {
        limparDados();
        limparCamposPessoais();
      }

    } else {
      if (tipoSelecionado !== prevTipo && prevTipo !== null) {
        limparDados();
        limparCamposPessoais()

      }
    }

    prevTipoSelecionadoRef.current = tipoSelecionado

  }, [tipoSelecionado, dadosassociado, watch, reset, limparDados, infoEmpresa])

  // Preencher automaticamente o usuário logado
  useEffect(() => {
    if (usuario?.nome && !isEditMode) {
      setValue('usuario', usuario.nome);
    }
  }, [usuario, setValue, isEditMode]);

  // Cálculo automático do total
  useEffect(() => {
    const subtotalValue = Number(subtotal) || 0;
    const descontosValue = Number(descontos) || 0;
    const totalCalculado = subtotalValue - descontosValue;

    // Garantir que o total não seja negativo
    const totalFinal = Math.max(0, totalCalculado);

    setValue('total', totalFinal);
  }, [subtotal, descontos, setValue]); const columns = React.useMemo(
    () => getColumns({ setModalDependente, reset, watch }),
    [setModalDependente, reset, watch]
  );

  return (
    <>
      <div className="flex-col w-full mt-2 flex-1">
        <ScrollArea className="h-[calc(100vh-200px)] rounded-md">
          <Card>
            <CardHeader>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <div className="flex justify-start w-full gap-10">
                  <CardTitle className="text-xl">Informações Pessoais</CardTitle>
                  <Controller
                    control={control}
                    name="tipo_convalescente"
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isEditMode}
                        className="flex items-center gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="TITULAR" id="titular" />
                          <Label htmlFor="titular">TITULAR</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="DEPENDENTE" id="dependente" />
                          <Label htmlFor="dependente">DEPENDENTE</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="PARTICULAR" id="particular" />
                          <Label htmlFor="particular">PARTICULAR</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
              </Dialog>

              <CardDescription>
              </CardDescription>
            </CardHeader>

            {/* Formulário de Usuário */}
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

              <div className="grid gap-2 lg:col-span-2">
                <Label htmlFor="nome">Nome do Usuário</Label>
                <Input
                  id="nome"
                  {...register('nome')}
                  placeholder="Nome Completo"


                />
              </div>

              <div className="grid gap-2 ">
                <Label htmlFor="data_nasc">Data de Nascimento</Label>
                <Controller
                  control={control}
                  name="data_nasc"
                  render={({ field }) =>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date_nasc"
                          className="lg:col-span-1 justify-between font-normal text-gray-500"
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione um data</span>
                          )}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          captionLayout="dropdown"
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  }

                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cpf_cnpj">CPF</Label>
                <Input
                  id="cpf_cnpj"
                  {...register('cpf_cnpj')}
                  placeholder="000.000.000-00"


                />
              </div>

              <div className="grid gap-2 lg:col-span-2">
                <Label htmlFor="tabs-demo-name">Endereço</Label>
                <Input
                  id="tabs-demo-name"
                  {...register('logradouro')}
                  placeholder="Digite aqui..."


                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  type="number"
                  {...register('numero', { valueAsNumber: true })}
                  placeholder="Nº"


                />
              </div>
              <div className="grid gap-2 lg:col-span-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  {...register('bairro')}
                  placeholder="Digite o bairro"


                />
              </div>
              <div className="grid gap-2 lg:col-span-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  {...register('complemento')}
                  placeholder="Apartamento, bloco, ponto de referência"


                />
              </div>
              <div className="grid gap-2">
                <div className="grid gap-3 w-64">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    {...register('cep')}
                    placeholder="00000-000"


                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  {...register('cidade')}
                  placeholder="Digite a cidade" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="uf">UF</Label>
                <Controller
                  control={control}
                  name="uf"
                  render={({ field }) => (
                    <Select
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="uf" className="w-[180px]">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ufs && ufs.length > 0 ? (
                          ufs.map((uf) => (
                            <SelectItem key={uf.id} value={uf.sigla}>
                              {uf.sigla}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="loading" disabled>
                            Carregando UFs...
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* ------------------- Nova Seção ---------------------- */}
              <CardTitle className="text-xl col-span-full mt-4 border-t pt-8 pb-2">
                Outras Informações
              </CardTitle>
              <div className="grid gap-2">
                <Label htmlFor="tipo_entrada">Tipo de Entrada</Label>
                <Controller

                  control={control}
                  name="tipo_entrada"
                  render={({ field }) =>

                    <Select
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de atendimento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CONVENIO">Convênio</SelectItem>
                        <SelectItem value="PARTICULAR">Particular</SelectItem>
                        <SelectItem value="CORTESIA">Cortesia</SelectItem>
                        <SelectItem value="EMPRESA">Empresa</SelectItem>
                      </SelectContent>
                    </Select>
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="data">Data de Entrega</Label>
                <Controller
                  control={control}
                  name="data"
                  render={({ field }) =>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="data"
                          className="w-full justify-between font-normal text-gray-500"
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione um data</span>
                          )}
                          <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  {...register('status')}
                  disabled
                />
              </div>

              <div className="grid gap-2 lg:col-span-2">
                <Label htmlFor="forma_pag">Formas de Pagamento</Label>
                <Controller
                  control={control}
                  name="forma_pag"
                  render={({ field }) =>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="forma_pag">
                        <SelectValue
                          placeholder="Selecione a forma de pagamento"
                        />
                      </SelectTrigger>
                      <SelectContent>

                        <SelectItem value="PIX">Pix</SelectItem>
                        <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                        <SelectItem value="CARTAO CREDITO">Cartão Crédito</SelectItem>
                        <SelectItem value="CARTAO DEBITO">Cartão Débito</SelectItem>
                        <SelectItem value="DEPOSITO">Depósito</SelectItem>
                        <SelectItem value="BOLETO">Boleto</SelectItem>
                      </SelectContent>
                    </Select>
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subtotal">Subtotal</Label>
                <Input
                  id="subtotal"
                  type="number"
                  placeholder="R$ 0,00"
                  {...register('subtotal', { valueAsNumber: true })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="descontos">Descontos</Label>
                <Input
                  id="descontos"
                  type="number"
                  placeholder="R$ 0,00"
                  {...register('descontos', { valueAsNumber: true })}
                />
              </div>

              <div className="grid gap-2 lg:col-span-2">
                <Label htmlFor="total">Total</Label>
                <Input
                  id="total"
                  type="number"
                  placeholder="R$ 0,00"
                  {...register('total')}
                  readOnly
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="data_inc">Data de Inclusão</Label>
                <Input
                  id="data_inc"
                  {...register('data_inc')}
                  disabled
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="hora_inc">Hora de Inclusão</Label>
                <Input
                  id="hora_inc"
                  {...register('hora_inc')}
                  disabled
                />
              </div>

              <div className="grid gap-2 lg:col-span-2">
                <Label htmlFor="usuario">Usuário Responsável</Label>
                <Input
                  id="usuario"
                  {...register('usuario')}
                  disabled
                />
              </div>

              {/* --- Seção de Observações --- */}
              <div className="grid gap-2 col-span-full">
                <Label htmlFor="obs">Observações</Label>
                <Textarea
                  id="obs"
                  placeholder="Digite as observações aqui..."
                  {...register('obs')}
                  className="min-h-[100px]"
                />
              </div>

              {/* ------------------- Nova Seção ---------------------- */}

              <CardTitle className="text-xl col-span-full mt-4 border-t pt-8 pb-2">
                Materiais
              </CardTitle>


              <div className="col-span-full justify-between">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Table>
                    <TableCaption>Lista de Produtos Adicionados</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produtos</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {produtos.map((produto, index) => (
                        <TableRow key={produto.id_produto || index}>
                          <TableCell>
                            <Input
                              value={produto.descricao}
                              disabled
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={produto.quantidade}
                              disabled
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={produto.status}
                              disabled
                            />
                          </TableCell>
                          <TableCell>
                            <button
                              data-tooltip-id="toolId"
                              data-tooltip-content={'Excluir'}
                              onClick={() => remove(index)}
                              className="text-red-500 hover:bg-red-500 p-1 rounded-lg hover:text-white"
                              type="button"
                            >
                              <Trash />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>


                  <div className="flex flex-col justify-between gap-4">
                    <div className="flex w-full items-end gap-4">
                      <div className="flex-grow ">
                        <Label htmlFor="produto-select">Adicione o Produto</Label>
                        <Select
                          value={produtoSelecionado}
                          onValueChange={setProdutoSelecionado}
                        >
                          <SelectTrigger id="produto-select">
                            <SelectValue placeholder="Selecione um produto do estoque" />
                          </SelectTrigger>
                          <SelectContent>
                            {listarProdutos && listarProdutos.length > 0 ? (
                              listarProdutos.map((produto) => (
                                <SelectItem
                                  key={produto.id_produto}
                                  value={produto.id_produto.toString()}
                                >
                                  {produto.descricao}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="loading" disabled>
                                Carregando Produtos...
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-36 flex-shrink-0">
                        <Label>Adicione a Quantidade</Label>
                        <Input
                          id="quantidade-produto"
                          type="number"
                          placeholder="Quantidade"
                          value={quantidadeSelecionada}
                          min={1}
                          onChange={e => setQuantidadeSelecionada(Number(e.target.value))}
                          disabled={!produtoSelecionado}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 justify-end">
                      <Button
                        className="w-32"
                        type="button"
                        onClick={() => {
                          const produto = listarProdutos.find(p => p.id_produto.toString() === produtoSelecionado);
                          if (produto) {
                            const novoProduto = {
                              ...produto,
                              quantidade: quantidadeSelecionada,
                              status: "ABERTO"
                            };
                            console.log('Adicionando produto:', novoProduto);
                            append(novoProduto);
                            console.log('Produtos após adicionar:', watch('convalescenca_prod'));
                            setProdutoSelecionado("");
                            setQuantidadeSelecionada(1);
                          }
                        }}
                        disabled={!produtoSelecionado}
                      >
                        Adicionar Produto
                      </Button>
                    </div>
                  </div>

                </div>
              </div>

              {/* ------------------- Nova Seção ---------------------- */}

              <CardTitle className="text-xl col-span-full mt-4 border-t pt-8 pb-2">
                Endereço de Retirada
              </CardTitle>

              <div className="grid gap-2 lg:col-span-2">
                <Label htmlFor="logradouro_r">Endereço</Label>
                <Input
                  id="logradouro_r"
                  {...register('logradouro_r')}
                  placeholder="Digite aqui o endereço"

                />
              </div>
              <div className="grid gap-3 w-64">
                <Label htmlFor="numero_r">Número</Label>
                <Input
                  id="numero_r"
                  type="number"
                  {...register('numero_r', { valueAsNumber: true })}
                  placeholder="Nº"

                />
              </div>
              <div className="grid gap-2 lg:col-span-2">
                <Label htmlFor="bairro_r">Bairro</Label>
                <Input
                  id="bairro_r"
                  {...register('bairro_r')}
                  placeholder="Digite aqui o bairro"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cidade_r">Cidade</Label>
                <Input
                  id="cidade_r"
                  {...register('cidade_r')}
                  placeholder="Digite aqui a cidade"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="uf-select">UF</Label>
                <Controller
                  control={control}
                  name="uf_r"
                  render={({ field }) =>
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger id="uf_r" className="w-[180px]">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ufs && ufs.length > 0 ? (
                          ufs.map((uf) => (
                            <SelectItem key={uf.id} value={uf.sigla}>
                              {uf.sigla}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="loading" disabled>
                            Carregando UFs...
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  }
                />
              </div>

            </CardContent>
          </Card>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>


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