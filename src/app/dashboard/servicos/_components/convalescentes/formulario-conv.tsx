'use client';

import React, { useContext, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import "react-datepicker/dist/react-datepicker.css";
import { TbAlertTriangle, TbWheelchair } from "react-icons/tb";
import { toast } from "sonner";
import useActionsNovoResgistro from "../../_hooks/useActionsNovoRegistro";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronDownIcon, FileText, Search, Shield, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RowSelectionState } from "@tanstack/react-table";

// Importe a função que gera as colunas e o tipo
import { getColumns, Dependente } from "../../_components/convalescentes/colunas-dependentes";
// Importe o componente da tabela
import { TabelaDependentesCompleta } from "../../_components/convalescentes/data-table";
import { AuthContext } from "@/store/AuthContext";
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

interface FormularioConvProps {

  // Estados (Dados)
  listaConv: Partial<ConvProps>;
  produtosAdicionados: ProdutosProps[];
  listarProdutos: ProdutosProps[];
  selecionarProduto: ProdutosProps | null;
  dadosassociado: AssociadoProps | Partial<AssociadoProps> | null;
  ufs: UfProps[];
  isEditMode: boolean;
  usarDadosTitular: boolean;
  isDependenteSelecionado: boolean;
  isModalOpen: boolean;
  rowSelection: RowSelectionState;

  // Funções (Handlers de Evento com os mesmos nomes)
  setarListaConv: (dados: Partial<ConvProps>) => void;
  handleAdicionarProdutoNaLista: () => void; // Renomeado de onAdicionarProduto
  handleSelecionarProduto: (descricao: string) => void; // Renomeado de onSelecaoChange
  handleCheckboxTitularChange: (checked: boolean) => void;
  handleConfirmarSelecaoDependente: () => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setDependenteSelecionado: (isSelected: boolean) => void;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  setUsarDadosTitular: (value: boolean) => void;

}


export default function FormularioConv({
  // Desestruturando as props para facilitar o uso no JSX
  listaConv,
  produtosAdicionados,
  listarProdutos,
  selecionarProduto,
  dadosassociado,
  ufs,
  isEditMode,
  usarDadosTitular,
  setUsarDadosTitular,
  isDependenteSelecionado,
  isModalOpen,
  rowSelection,
  setarListaConv,
  handleAdicionarProdutoNaLista, // Nome original
  handleSelecionarProduto, // Nome original
  handleCheckboxTitularChange,
  handleConfirmarSelecaoDependente,
  setIsModalOpen,
  setDependenteSelecionado,
  setRowSelection
}: FormularioConvProps) {

  const [modalDependente, setModalDependente] = useState(false);
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true);
 
  const dependentesVisiveis = React.useMemo(
    () => dadosassociado?.dependentes?.filter((d: Dependente) => d.excluido !== true) || [],
    [dadosassociado]
  )


  const columns = React.useMemo(
    () => getColumns({ setarListaConv, setModalDependente }),
    [setarListaConv, setModalDependente]

  )



  if (isLoading) {
    return ("Carregando...")
  }

  return (
    <div className="flex-col w-full mt-2 ">
      <ScrollArea className="h-[300px] md:h-[500px] lg:h-[70vh] rounded-md">
        <Card>
          <CardHeader>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <form>
                <div className="flex justify-start w-full gap-10">
                  <CardTitle className="text-xl">Informações Pessoais</CardTitle>


                  <div className="flex items-center gap-2">
                    <Checkbox id="titular"
                      disabled={isEditMode || isDependenteSelecionado}
                      checked={usarDadosTitular}
                      onCheckedChange={handleCheckboxTitularChange}
                    />
                    <Label htmlFor="titular">TITULAR</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="dependente"
                      checked={isDependenteSelecionado}
                      // A lógica de clique é a seguinte:
                      onCheckedChange={(checked) => {

                        if (checked) {
                          setIsModalOpen(true)
                        } else {
                          setDependenteSelecionado(false)
                        }
                      }}
                      disabled={isEditMode || usarDadosTitular}
                    />
                    <Label htmlFor="dependente">DEPENDENTES</Label>

                  </div>
                </div>
                <DialogContent className="sm:max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Selecione o Dependente</DialogTitle>
                    <DialogDescription>
                      Selecione o dependente desejado na lista abaixo.
                      Clique em 'Salvar Mudanças' para finalizar a seleção.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <TabelaDependentesCompleta
                      columns={columns}
                      data={dependentesVisiveis}
                      rowSelection={rowSelection}
                      setRowSelection={setRowSelection}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      onClick={handleConfirmarSelecaoDependente}
                    >Salvar Mudanças</Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>

            <CardDescription>
            </CardDescription>
          </CardHeader>

          {/* Formulário de Usuário */}
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="grid gap-2 lg:col-span-2">
              <Label htmlFor="tabs-demo-name">Nome do Usuário</Label>
              <Input
                id="tabs-demo-name"
                value={listaConv.nome}
                onChange={e => setarListaConv({ nome: e.target.value })}
              />
            </div>

            {/* Data atual  */}
            <div className="grid gap-2 ">
              <Label htmlFor="tabs-demo-username">Data de Nascimento</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="lg:col-span-1 justify-between font-normal text-gray-500"
                  >
                    {listaConv.data ? new Date(listaConv.data).toLocaleDateString('pt-BR') : 'Data não definida'}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={listaConv.data ?? undefined}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      if (date) {

                        setarListaConv({ data: date });

                        setDate(date);
                      }
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tabs-demo-name">CPF</Label>
              <Input
                id="tabs-demo-name"
                value={listaConv.cpf_cnpj}
                onChange={e => setarListaConv({ cpf_cnpj: e.target.value })}
              />
            </div>

            <div className="grid gap-2 lg:col-span-2">
              <Label htmlFor="tabs-demo-name">Endereço</Label>
              <Input
                id="tabs-demo-name"
                value={listaConv.logradouro}
                onChange={e => setarListaConv({ logradouro: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tabs-demo-name">Número</Label>
              <Input
                id="tabs-demo-name"
                value={listaConv.numero ?? ''}
                onChange={e => setarListaConv({ numero: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2 lg:col-span-2">
              <Label htmlFor="tabs-demo-name">Bairro</Label>
              <Input
                id="tabs-demo-name"
                value={listaConv.bairro ?? ''}
                onChange={e => setarListaConv({ bairro: e.target.value })}
              />
            </div>
            <div className="grid gap-2 lg:col-span-2">
              <Label htmlFor="tabs-demo-name">Complemento</Label>
              <Input
                id="tabs-demo-name"
                value={listaConv.complemento ?? ''}
                onChange={e => setarListaConv({ complemento: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <div className="grid gap-3 w-64">
                <Label htmlFor="tabs-demo-name">CEP</Label>
                <Input
                  id="tabs-demo-name"
                  value={listaConv.cep}
                  onChange={e => setarListaConv({ cep: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tabs-demo-name">Cidade</Label>
              <Input
                id="tabs-demo-name"
                value={listaConv.cidade}
                onChange={e => setarListaConv({ cidade: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="uf-select">UF</Label>
              <Select
                onValueChange={(valorUf) => {
                  setarListaConv({ uf: valorUf })
                }}>
                <SelectTrigger id="uf-select" className="w-[180px]">
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
                    // Mostra uma mensagem de carregamento enquanto os dados não chegam
                    <SelectItem value="loading" disabled>
                      Carregando UFs...
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* ------------------- Nova Seção ---------------------- */}
            <CardTitle className="text-xl col-span-full mt-4 border-t pt-8 pb-2">
              Outras Informações
            </CardTitle>
            <div className="grid gap-2">
              <Label>Tipo de Entrada</Label>
              <Select
                // O valor selecionado é lido do estado 'listaConv'
                value={listaConv.tipo_entrada || ''}
                // Quando o usuário muda a seleção, o estado 'listaConv' é atualizado
                onValueChange={(novoValor) => {
                  setarListaConv({ tipo_entrada: novoValor });
                }}
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="data-solicitacao">Data de Entrega</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="data-solicitacao"
                    className="w-full justify-between font-normal text-gray-500"
                  >
                    {listaConv.data ? new Date(listaConv.data).toLocaleDateString('pt-BR') : "Selecione a data"}
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={listaConv.data ? new Date(listaConv.data) : undefined}
                    onSelect={(date) => setarListaConv({ data: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status-solicitacao">Status</Label>
              <Select onValueChange={(value) => setarListaConv({ status: value })} value={listaConv.status}>
                <SelectTrigger id="status-solicitacao">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ABERTO">Aberto</SelectItem>
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                  <SelectItem value="FECHADO">Fechado</SelectItem>
                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 lg:col-span-2">
              <Label htmlFor="forma-pagamento">Formas de Pagamento</Label>
              <Select onValueChange={(value) => setarListaConv({ forma_pag: value })} value={listaConv.forma_pag}>
                <SelectTrigger id="forma-pagamento">
                  <SelectValue placeholder="Selecione a forma de pagamento" />
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subtotal">Subtotal</Label>
              <Input
                id="subtotal"
                type="number"
                placeholder="R$ 0,00"
                value={listaConv.subtotal ?? ''}
                onChange={e => setarListaConv({ subtotal: Number(e.target.value) })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descontos">Descontos</Label>
              <Input
                id="descontos"
                type="number"
                placeholder="R$ 0,00"
                value={listaConv.descontos ?? ''}
                onChange={e => setarListaConv({ descontos: Number(e.target.value) })}
              />
            </div>

            <div className="grid gap-2 lg:col-span-2">
              <Label htmlFor="total">Total</Label>
              <Input
                id="total"
                type="number"
                placeholder="R$ 0,00"
                value={(listaConv.subtotal || 0) - (listaConv.descontos || 0)}
                readOnly
                onChange={e => setarListaConv({ total: Number(e.target.value) })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="data-inc">Data de Inclusão</Label>
              <Input
                id="data-inc"
                value={listaConv.data_inc ? new Date(listaConv.data_inc).toLocaleDateString('pt-BR') : 'Não definido'}
                disabled
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hora-inc">Hora de Inclusão</Label>
              <Input
                id="hora-inc"
                value={listaConv.hora_inc ? new Date(listaConv.hora_inc).toLocaleTimeString('pt-BR') : 'Não definido'}
                disabled
              />
            </div>

            <div className="grid gap-2 lg:col-span-2">
              <Label htmlFor="usuario">Usuário Responsável</Label>
              <Input
                id="usuario"
                value={listaConv.usuario ?? 'Não definido'}
                disabled
              />
            </div>

            {/* --- Seção de Observações --- */}
            <div className="grid gap-2 col-span-full">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Digite as observações aqui..."
                value={listaConv.obs ?? ''}
                onChange={e => setarListaConv({ obs: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            {/* ------------------- Nova Seção ---------------------- */}

            <CardTitle className="text-xl col-span-full mt-4 border-t pt-8 pb-2">
              Materiais
            </CardTitle>


            <div className="grid gap-2 lg:col-span-2">

              <Label>Lista de Produtos Adicionados</Label>

              <ul>
                {produtosAdicionados.map(produto => (
                  <li key={produto.id_produto}>
                    {produto.descricao}
                  </li>
                ))}
              </ul>

              <Label htmlFor="produto-select">Produto</Label>
              <Select
                value={selecionarProduto ? selecionarProduto.descricao : ""}
                onValueChange={handleSelecionarProduto}
              >
                <SelectTrigger id="produto-select">
                  <SelectValue placeholder="Selecione um produto do estoque" />
                </SelectTrigger>
                <SelectContent>
                  {listarProdutos && listarProdutos.length > 0 ? (
                    listarProdutos.map((produto) => (
                      <SelectItem
                        key={produto.id_produto}
                        value={produto.descricao}
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
              <Button
              onClick={handleAdicionarProdutoNaLista}
              >
                Adicionar Produto 
              </Button>


            </div>

            {/* ------------------- Nova Seção ---------------------- */}

            <CardTitle className="text-xl col-span-full mt-4 border-t pt-8 pb-2">
              Endereço de Retirada
            </CardTitle>

            <div className="grid gap-2 lg:col-span-2">
              <Label htmlFor="tabs-demo-name">Endereço</Label>
              <Input
                id="tabs-demo-name"
                value={listaConv.logradouro_r}
                onChange={e => setarListaConv({ logradouro_r: e.target.value })}
              />
            </div>
            <div className="grid gap-3 w-64">
              <Label htmlFor="tabs-demo-name">Número</Label>
              <Input
                id="tabs-demo-name"
                value={listaConv.numero_r ?? ''}
                onChange={e => setarListaConv({ numero_r: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2 lg:col-span-2">
              <Label htmlFor="tabs-demo-name">Bairro</Label>
              <Input
                id="tabs-demo-name"
                value={listaConv.bairro_r ?? ''}
                onChange={e => setarListaConv({ bairro_r: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tabs-demo-name">Cidade</Label>
              <Input
                id="tabs-demo-name"
                value={listaConv.cidade_r}
                onChange={e => setarListaConv({ cidade_r: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="uf-select">UF</Label>
              <Select
                onValueChange={(valorUf) => {
                  setarListaConv({ uf: valorUf })
                }}>
                <SelectTrigger id="uf-select" className="w-[180px]">
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
                    // Mostra uma mensagem de carregamento enquanto os dados não chegam
                    <SelectItem value="loading" disabled>
                      Carregando UFs...
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

          </CardContent>
        </Card>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  )
}