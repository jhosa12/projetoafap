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
import { date } from "zod";
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

export default function FormularioConv() {

  const [modalDependente, setModalDependente] = useState(false);
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [usarDadosTitular, setUsarDadosTitular] = useState(false);
  const [isDependenteSelecionado, setDependenteSelecionado] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter()
  const params = useParams()
  const id = params.id as string | undefined;
  const isEditMode = !!id;
  



  const {

    dataInputs,
    estoque,
    listaMaterial,
    indexProd,
    listaConv,
    isLoading,
    selectProdutos,
    handleSalvar,


    setarListaConv,
    imprimirComprovante,
    imprimirContrato,
    setInputs,
    adicionarProduto,
    receberDev,
    editarRegistro,
    adicionarNovoRegistro

  } = useActionsNovoResgistro()

  const {

    infoEmpresa,
    ufs,
    dadosassociado,
    carregarDados,


  } = useContext(AuthContext);

  const dependentesVisiveis = React.useMemo(
    () => dadosassociado?.dependentes?.filter((d: Dependente) => d.excluido !== true) || [],
    [dadosassociado]
  )

  const handleConfirmarSelecaoDependente = () => {
    // 1. Pega os índices das linhas selecionadas
    const indicesSelecionados = Object.keys(rowSelection).map(Number);

    // 2. Verifica se APENAS UM foi selecionado
    if (indicesSelecionados.length === 1 && dadosassociado?.dependentes) {
      const indice = indicesSelecionados[0];
      const dependentesVisiveis = dadosassociado.dependentes.filter(d => !d.excluido);
      const dependenteEscolhido = dependentesVisiveis[indice];

      // 3. Se tivermos um dependente, chame a função do seu hook principal
      if (dependenteEscolhido) {

        const dataNascimento = dependenteEscolhido.data_nasc
          ? new Date(dependenteEscolhido.data_nasc)
          : undefined;
        
        const dadosParaSetar= {
          nome: dependenteEscolhido.nome,
          data: dataNascimento,
          id_dependente: dependenteEscolhido.id_dependente,
        };

        
        console.log('--- PASSO A: DEPENDENTE SELECIONADO ---');
        console.log('Estou setando o seguinte ID de dependente:', dadosParaSetar.id_dependente);

        

        setarListaConv(dadosParaSetar)

        setDependenteSelecionado(true);
        setIsModalOpen(false);
      }
    } else {
      // 5. Mostra um aviso se nenhum ou mais de um for selecionado
      toast.info("Por favor, selecione apenas um dependente.");
    }
  };

  const columns = React.useMemo(
    () => getColumns({ setarListaConv, setModalDependente }),
    [setarListaConv, setModalDependente]

  )



  const handleCheckboxTitularChange = (checked: boolean) => {
    const isChecked = !!checked;
    setUsarDadosTitular(checked); // Atualiza o estado do checkbox

    if (isChecked) {
      // Se o checkbox foi MARCADO

      // Validação: só preenche se houver um associado carregado
      if (!dadosassociado?.id_global) {
        toast.error("Nenhum associado selecionado. Por favor, busque um primeiro.");
        setUsarDadosTitular(false); // Desmarca o checkbox se não houver dados
        return;
      }

      setDependenteSelecionado(false);

      // Preenche o formulário usando `setarListaConv` com os dados de `dadosassociado`
      toast.info("Preenchendo formulário com dados do titular...");
      setarListaConv({
        nome: dadosassociado.nome,
        data: new Date(dadosassociado.data_nasc ?? ''), // Converta a data se necessário
        cpf_cnpj: dadosassociado.cpfcnpj,
        logradouro: dadosassociado.endereco,
        numero: dadosassociado.numero,
        bairro: dadosassociado.bairro,
        complemento: dadosassociado.guia_rua, // ou o campo correspondente
        cep: dadosassociado.cep,
        cidade: dadosassociado.cidade,
        uf: dadosassociado.uf,
        id_dependente: null, 
      });

    } else {
      // Se o checkbox foi DESMARCADO, limpa o formulário
      toast.info("Limpando formulário.");
      setarListaConv({
        nome: "",
        data: undefined,
        cpf_cnpj: "",
        logradouro: "",
        numero: undefined,
        bairro: "",
        complemento: "",
        cep: "",
        cidade: "",
        uf: "",
        id_dependente: null,
      });
    }
  };

  useEffect(() => {

    if (isEditMode && listaConv.id_conv) {
      if (listaConv.id_dependente !== null) {
        setDependenteSelecionado(true)
        setUsarDadosTitular(false)
      } else {
        setDependenteSelecionado(false)
        setUsarDadosTitular(true)
      }
    }
  }, [listaConv, isEditMode])

  if (isLoading) {
    return <p>Carregando...</p>;
  }


  return (
    <div className="flex-col w-full mt-2 ">
      <Tabs defaultValue="usuario" className="w-full">
        <TabsList className="flex items-center border">
          <TabsTrigger value="usuario">Nova Solicitação</TabsTrigger>
          <TabsTrigger value="material">Material</TabsTrigger>
          <TabsTrigger value="gravar">Gravar Alterações</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[300px] md:h-[500px] lg:h-[70vh] rounded-md">
          {/* Informações de Usuário */}
          <TabsContent value="usuario">

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
                        {listaConv.data ? new Date(listaConv.data).toLocaleDateString('pt-BR'): 'Data não definida'}
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
                  <Label htmlFor="forma-pagamento">Forma de Pagamento</Label>
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
              <CardFooter>
                <Button onClick={handleSalvar}>
                  {isEditMode ? 'Salvar Alterações' : 'Criar Registro'}
                </Button>
              </CardFooter>
            </Card>


          </TabsContent>

          <TabsContent value="material">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Informações do Material</CardTitle>
                <CardDescription>

                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="grid gap-2 lg:col-span-2">
                  <Label htmlFor="produto-select">Produto</Label>
                  <Select
                    onValueChange={(value) => {
                      // Dica: Ao selecionar um produto, você pode buscar os dados dele
                      // e preencher outros campos automaticamente.
                      const produtoSelecionado = selectProdutos.find(p => p.id_produto === Number(value));
                      setInputs({
                        id_produto: Number(value),
                        descricao: produtoSelecionado?.descricao,
                        grupo: produtoSelecionado?.grupo,
                        unidade: produtoSelecionado?.unidade
                      });
                    }}
                  >
                    <SelectTrigger id="produto-select">
                      <SelectValue placeholder="Selecione um produto do estoque" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectProdutos.map((produto) => (
                        <SelectItem key={produto.id_produto} value={String(produto.id_produto)}>
                          {produto.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="produto-unidade">Unidade</Label>
                  <Input id="produto-unidade" value={dataInputs.unidade ?? ''} onChange={e => setInputs({ unidade: e.target.value })} placeholder="Ex: UN, CX" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="produto-grupo">Grupo</Label>
                  <Input id="produto-grupo" value={dataInputs.grupo ?? ''} onChange={e => setInputs({ grupo: e.target.value })} placeholder="Ex: Cadeira de Rodas" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="data-retirada">Data de Retirada</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" id="data-retirada" className="w-full justify-between font-normal">
                        {dataInputs.data ? new Date(dataInputs.data).toLocaleDateString('pt-BR') : "Selecione..."}
                        <ChevronDownIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dataInputs.data ? new Date(dataInputs.data) : undefined} onSelect={(date) => setInputs({ data: date })} /></PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="data-devolucao">Data Prev. Devolução</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" id="data-devolucao" className="w-full justify-between font-normal">
                        {dataInputs.data_dev ? new Date(dataInputs.data_dev).toLocaleDateString('pt-BR') : "Selecione..."}
                        <ChevronDownIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dataInputs.data_dev ? new Date(dataInputs.data_dev) : undefined} onSelect={(date) => setInputs({ data_dev: date })} /></PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="hora-retirada">Hora da Retirada</Label>
                  <Input id="hora-retirada" type="time"
                    value={
                      dataInputs.hora instanceof Date
                        ? dataInputs.hora.toTimeString().slice(0, 5)
                        : ''
                    }

                    // Converte o texto "HH:mm" do input para um novo objeto Date antes de salvar no estado
                    onChange={e => {
                      if (e.target.value) {
                        const [hours, minutes] = e.target.value.split(':');
                        const newDate = new Date(); // Cria uma data com o dia de hoje
                        newDate.setHours(Number(hours), Number(minutes), 0, 0); // Ajusta a hora e os minutos
                        setInputs({ hora: newDate });
                      } else {
                        setInputs({ hora: undefined }); // Limpa o estado se o campo for apagado
                      }
                    }} />

                </div>

                <div className="grid gap-2">
                  <Label htmlFor="produto-status">Status do Item</Label>
                  <Select onValueChange={(value) => setInputs({ status: value })} value={dataInputs.status}>
                    <SelectTrigger id="produto-status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDENTE">Pendente</SelectItem>
                      <SelectItem value="ENTREGUE">Entregue</SelectItem>
                      <SelectItem value="DEVOLVIDO">Devolvido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                {/* --- Seção Financeira --- */}
                <div className="grid gap-2">
                  <Label htmlFor="produto-quantidade">Quantidade</Label>
                  <Input id="produto-quantidade" type="number" value={dataInputs.quantidade ?? ''} onChange={e => setInputs({ quantidade: Number(e.target.value) })} placeholder="0" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="produto-valor">Valor (Unitário)</Label>
                  <Input id="produto-valor" type="number" step="0.01" value={dataInputs.valor ?? ''} onChange={e => setInputs({ valor: Number(e.target.value) })} placeholder="R$ 0,00" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="produto-descontos">Descontos</Label>
                  <Input id="produto-descontos" type="number" step="0.01" value={dataInputs.descontos ?? ''} onChange={e => setInputs({ descontos: Number(e.target.value) })} placeholder="R$ 0,00" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="produto-total">Total</Label>
                  <Input
                    id="produto-total"
                    type="number"
                    readOnly
                    disabled
                    value={((dataInputs.quantidade || 0) * (dataInputs.valor || 0) - (dataInputs.descontos || 0)).toFixed(2)}
                    placeholder="R$ 0,00"
                  />
                </div>

                {/* --- Seção de Opções --- */}
                <div className="grid gap-2">
                  <Label>Cortesia</Label>
                  <Select onValueChange={(value) => setInputs({ cortesia: value })} value={dataInputs.cortesia}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Retornável</Label>
                  <Select onValueChange={(value) => setInputs({ retornavel: value })} value={dataInputs.retornavel}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSalvar}>{isEditMode ? 'Salvar Alterações' : 'Criar Registro' }</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <ScrollBar orientation="vertical" />
        </ScrollArea>



      </Tabs>
    </div>
  )
}