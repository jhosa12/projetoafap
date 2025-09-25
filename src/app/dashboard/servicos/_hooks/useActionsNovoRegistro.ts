import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ConvProps } from "../_types/convalescente";
import { toast } from "sonner";
import { api } from "@/lib/axios/apiClient";
import { ListaMaterial } from "../../admcontrato/_types/lista-material";
import { DadosCadastroProps } from "../../admcontrato/_types/dados-cadastro";
import { AuthContext } from "@/store/AuthContext";
import { ProdutosProps } from '../../admcontrato/_types/produtos';
import { EstoqueNovoRegistroProps } from '../../estoque/types/estoque';
import { converterDataParaISO } from "@/utils/converterDataParaIso";
import { useParams, useRouter } from 'next/navigation'
import { RowSelectionState } from '@tanstack/react-table';


interface ActionsProps {

  // --- Estados que a UI irá ler ---

  dataInputs: Partial<ListaMaterial>;
  estoque: Array<EstoqueNovoRegistroProps>;
  listaMaterial: Array<Partial<ListaMaterial>>;
  indexProd: number;
  data: Partial<DadosCadastroProps>;
  listaConv: Partial<ConvProps>;
  titular: boolean;
  listarProdutos: Array<ProdutosProps>;
  isLoading: boolean;
  produtosAdicionados: ProdutosProps[]
  selecionarProduto: ProdutosProps | null,


  // --- Funções para alterar o estado  ---

  setTitular: (value: boolean) => void;
  closeModa: (fields: Partial<DadosCadastroProps>) => void;
  setMaterial: (value: Array<Partial<ListaMaterial>>) => void;
  setIndex: (value: number) => void;
  handleSalvar: (value: boolean) => void;
  handleSelecionarProduto: (produtoSelecionado: ProdutosProps) => void
  usarDadosTitular: (value: boolean) => void;
  isDependenteSelecionado: (value: boolean) => void;
  isModalOpen: (value: boolean) => void;
  rowSelection: (value: boolean) => void;
  handleCheckboxTitularChange: (value: boolean) => void;
  handleConfirmarSelecaoDependente: (value: boolean) => void;
  setIsModalOpen: (value: boolean) => void;
  setDependenteSelecionado: (value: boolean) => void;
  setRowSelection: (value: boolean) => void;
  setUsarDadosTitular: (value: boolean) => void;
  setSelecionarProduto: React.Dispatch<React.SetStateAction<ProdutosProps | null>>;
  setProdutosAdicionados: ProdutosProps[]

  // --- Funções de Ação ---
  setarListaConv: (fields: Partial<ConvProps>) => void;
  setInputs: (fields: Partial<ListaMaterial>) => void;
  adicionarProduto: () => Promise<void>;
  editarRegistro: () => Promise<void>;
  adicionarNovoRegistro: () => Promise<void>;
  deletarProdutoConv: (idDeletarProduto: number) => void

}

const useActionsNovoResgistro = () => {
  const { usuario, dadosassociado } = useContext(AuthContext)
  const [dataInputs, setDataInputs] = useState<Partial<ListaMaterial>>({})
  const [listaConv, setLista] = useState<Partial<ConvProps>>({ convalescenca_prod: [] });
  const [listaMaterial, setMaterial] = useState<Array<Partial<ListaMaterial>>>([]);
  const [data, closeModa] = useState<Partial<DadosCadastroProps>>({});
  const [componenteMounted, setMounted] = useState(false);
  const [listarProdutos, setListarProdutos] = useState<Array<ProdutosProps>>([]);
  const [estoque, setEstoque] = useState<Array<EstoqueNovoRegistroProps>>([])
  const [titular, setTitular] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const id = params.id as string | undefined;
  const isEditMode = !!id;
  const [usarDadosTitular, setUsarDadosTitular] = useState(false);
  const [isDependenteSelecionado, setDependenteSelecionado] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selecionarProduto, setSelecionarProduto] = useState<ProdutosProps | null>(null)
  const [produtosAdicionados, setProdutosAdicionados] = useState<ProdutosProps[]>([])
  const router = useRouter()

  const setarListaConv = useCallback((fields: Partial<ConvProps>) => {
    setLista(prev => ({ ...prev, ...fields }));
  }, []);


  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});




  const setInputs = (fields: Partial<ProdutosProps>) => {
    setDataInputs((prev: Partial<ProdutosProps>) => {
      if (prev) {
        return { ...prev, ...fields }
      }
      else {
        return { ...fields }
      }
    })
  }

  async function adicionarProduto() {

    if (!listaConv.id_conv) {
      return;
    }

    toast.promise(
      api.post('/convalescente/novoProduto',
        {
          id_conv: listaConv.id_conv,
          id_produto: dataInputs.id_produto,
          descricao: dataInputs.descricao,
          unidade: '',
          grupo: 'cv',
          data: new Date(),
          data_dev: undefined,
          quantidade: dataInputs.quantidade,
          valor: dataInputs.valor,
          descontos: 0,
          total: dataInputs.quantidade,
          hora: new Date() || null,
          cortesia: '',
          retornavel: '',
          status: 'PENDENTE'
        }
      ),
      {
        error: 'Erro ao Atualizar Dados',
        loading: 'Atualizando Dados....',
        success: (response) => {
          const novoArray = [...listaMaterial]
          novoArray.push(response.data)
          setMaterial(novoArray)

          return 'Dados Atualizados com sucesso!'
        }
      }
    )

  }

  async function editarRegistro() {

    if (!listaConv.nome || !listaConv.logradouro) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }


    if (produtosAdicionados.length === 0) {

      toast.error('Adicione pelo menos um produto/serviço.')
      return

    }

    const dataIso = converterDataParaISO(listaConv.data)
    const dataIsoInc = converterDataParaISO(listaConv.data_inc)


    if (!dataIso || !dataIsoInc) {
      toast.error("Formato de data inválido para 'Data' ou 'Data de Nascimento'. Use DD/MM/AAAA.");
      return;
    }

    const produtosParaEnviar = produtosAdicionados.map(produto => ({
      id_produto: produto.id_produto,
      descricao: produto.descricao,
      quantidade: produto.quantidade,
      status: produto.status
    }))

    toast.promise(


      api.put(`/convalescencia/editar/${id}`, {

        //id_conv: listaConv.id_conv,
        id_contrato: listaConv.id_contrato_global,
        id_associado: listaConv.id_associado,
        id_contrato_st: listaConv.id_contrato_st,
        tipo_entrada: listaConv.tipo_entrada,
        id_dependente: listaConv.id_dependente,
        nome: listaConv.nome,
        cpf_cnpj: listaConv.cpf_cnpj,
        data: new Date(listaConv.data ?? '').toISOString(),
        status: listaConv.status,
        forma_pag: listaConv.forma_pag,
        logradouro: listaConv.logradouro,
        numero: listaConv.numero,
        complemento: listaConv.complemento,
        bairro: listaConv.bairro,
        cep: listaConv.cep,
        cidade: listaConv.cidade,
        uf: listaConv.uf,
        subtotal: listaConv.subtotal,
        descontos: listaConv.descontos,
        total: listaConv.total,
        logradouro_r: listaConv.logradouro_r,
        numero_r: listaConv.numero_r,
        complemento_r: listaConv.complemento_r,
        bairro_r: listaConv.bairro_r,
        cep_r: listaConv.cep_r,
        cidade_r: listaConv.cidade_r,
        uf_r: listaConv.uf_r,
        data_inc: new Date().toISOString(),
        hora_inc: new Date().toISOString(),
        usuario: listaConv.usuario,
        obs: listaConv.obs,
        convalescenca_prod: produtosParaEnviar

      }),
      {
        error: 'Erro ao atualizar dados',
        loading: 'Atualizando Dados',
        success: 'Dados registrados com sucesso!'
      }
    )
  }

  async function adicionarNovoRegistro() {

    if (!listaConv.nome || !listaConv.logradouro) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    if (produtosAdicionados.length === 0) {
      console.log("Os produtos não foram adicionados")
      return

    }

    const dataISO = converterDataParaISO(listaConv.data);
    const dataIsoNasc = converterDataParaISO(listaConv.data_inc);


    if (!dataISO) {
      toast.error("Formato de data inválido para 'Data' ou 'Data de Nascimento'. Use DD/MM/AAAA.");
      return;
    }

    const produtosParaEnviar = produtosAdicionados.map(produto => ({
      id_produto: produto.id_produto,
      descricao: produto.descricao,
      quantidade: produto.quantidade,
      status: produto.status
    }))

    const payload = {

      id_contrato: dadosassociado?.contrato?.id_contrato,
      id_associado: dadosassociado?.id_associado,
      id_dependente: listaConv?.id_dependente,
      id_contrato_st: listaConv.id_contrato_st,
      tipo_entrada: listaConv.tipo_entrada,
      nome: listaConv.nome,
      cpf_cnpj: listaConv.cpf_cnpj,
      data: dataISO,
      data_nasc: dataIsoNasc,
      status: "ABERTO",
      forma_pag: listaConv.forma_pag,
      logradouro: listaConv.logradouro,
      numero: listaConv.numero,
      complemento: listaConv.complemento,
      bairro: listaConv.bairro,
      cep: listaConv.cep,
      cidade: listaConv.cidade,
      uf: listaConv.uf,
      subtotal: listaConv.subtotal || 0,
      descontos: listaConv.descontos || 0,
      total: listaConv.total || 0,
      logradouro_r: listaConv.logradouro_r,
      numero_r: listaConv.numero_r,
      complemento_r: listaConv.complemento_r,
      bairro_r: listaConv.bairro_r,
      cep_r: listaConv.cep_r,
      cidade_r: listaConv.cidade_r,
      uf_r: listaConv.uf_r,
      data_inc: new Date().toISOString(), // Data de inclusão gerada no momento do salvamento
      hora_inc: new Date().toISOString(), // Hora de inclusão gerada no momento do salvamento
      usuario: usuario?.nome,
      obs: listaConv.obs,
      convalescenca_prod: produtosParaEnviar

    };

    const promise = api.post('/convalescencia/novo', payload);


    console.log('Payload dados:', payload)
    toast.promise(promise, {
      loading: 'Salvando dados...',
      success: 'Dados registrados com sucesso!',
      error: (err) => err.response?.data?.message || 'Erro ao cadastrar. Tente novamente.',
    });


    try {
      await promise;
    } catch (error: any) {
      console.error("Falha detalhada ao salvar registro:", error.response?.data || error.message || error);
    }
  }

  async function deletarProdutoConv(idDeletarProduto: number) {


    const novaLista = produtosAdicionados.filter(
      (produto) => produto.id_produto !== idDeletarProduto
    )

    setProdutosAdicionados(novaLista)

    toast.success("Produto removido da lista!");

  }


  useEffect(() => {
    if (titular) {

      if (dadosassociado?.id_global) {

        setarListaConv({
          nome: dadosassociado.nome ?? '',
          data: dadosassociado.data_nasc ? new Date(dadosassociado.data_nasc) : undefined,
          logradouro: dadosassociado.endereco ?? '',
          bairro: dadosassociado.bairro ?? '',
          numero: dadosassociado.numero ?? null,
          cidade: dadosassociado.cidade ?? '',
          cpf_cnpj: dadosassociado.cpfcnpj ?? '',
          uf: dadosassociado.uf ?? '',
          id_dependente: null
        });
      } else {
        
        setarListaConv({});
      }
    }

  }, [titular, dadosassociado, setarListaConv]);



  useEffect(() => {
    const selectProdutos = async () => {
      setIsLoading(true)

      try {
        const response = await api.post('/produtos/listar')

        setListarProdutos(response.data || [])


      } catch (error) {

        toast.error("Não foi possível carregar os materiais.");
      }
    }
    selectProdutos()
  }, [])



  useEffect(() => {

    if (isEditMode) {
      const fetchDadosParaEdicao = async () => {
        setIsLoading(true);
        try {

          const response = await api.get(`/convalescencia/${id}`);


          setarListaConv(response.data);

          setProdutosAdicionados(response.data.convalescenca_prod || []);

        } catch (error) {

          toast.error("Falha ao carregar os dados do registro.");

        } finally {
          setIsLoading(false);
        }
      };

      fetchDadosParaEdicao();
    } else {
      setarListaConv({ usuario: usuario?.nome, status: "ABERTO" });
      setIsLoading(false);
    }
  }, [id, isEditMode, setarListaConv, setProdutosAdicionados, usuario?.nome]);

  const handleSalvar = () => {
    try {
      if (isEditMode) {
        editarRegistro()
      } else {
        adicionarNovoRegistro()
      }

      if (selecionarProduto){
        router.push('/dashboard/servicos/convalescencia/listagem')
      } else {
        toast.error("Por favor, adicione um produto!")
      }
      
    } catch (error) {

      toast.error('A operação falhou!')

    }

  }

  const handleSelecionarProduto = (descricaoSelecionada: string) => {

    const produtoCompleto = listarProdutos.find(
      (p) => p.descricao === descricaoSelecionada,

    )

    if (produtoCompleto) {
      setSelecionarProduto({
        ...produtoCompleto,
        quantidade: 1,
        status: 'ABERTO'
      }

      )
    }

  }

  const handleAdicionarProdutoNaLista = () => {


    if (!selecionarProduto) {
      toast.error('Por favor, selecione um produto para adicionar.')
      return
    }


    const produtoExiste = produtosAdicionados.some(
      produto => produto.id_produto === selecionarProduto.id_produto,

    )

    if (produtoExiste) {
      toast.warning('Este produto já foi adicionado.')
      return
    }

    setProdutosAdicionados(listaAnterior => {

      const novaLista = [
        ...listaAnterior,
        selecionarProduto,
      ]

      return novaLista
    })

    setSelecionarProduto(null)
  }

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

        const dadosParaSetar = {
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

  return {

    dataInputs,
    estoque,
    listaMaterial,
    data,
    listaConv,
    titular,
    listarProdutos,
    isLoading,
    produtosAdicionados,
    selecionarProduto,
    setUsarDadosTitular,
    setSelecionarProduto,
    setProdutosAdicionados,



    setTitular,
    closeModa,
    setMaterial,
    handleSalvar,
    handleSelecionarProduto,
    handleAdicionarProdutoNaLista,
    usarDadosTitular,
    isDependenteSelecionado,
    isModalOpen,
    rowSelection,
    handleCheckboxTitularChange,
    handleConfirmarSelecaoDependente,
    setIsModalOpen,
    setDependenteSelecionado,
    setRowSelection,

    setarListaConv,
    setInputs,
    adicionarProduto,
    editarRegistro,
    adicionarNovoRegistro,
    deletarProdutoConv

  }
}

export default useActionsNovoResgistro;
