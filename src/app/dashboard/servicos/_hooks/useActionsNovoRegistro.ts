import DocumentTemplateComprovante from "@/Documents/convalescenca/comprovante/DocumentTemplate";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ConvProps } from "../_types/convalescente";
import { toast } from "sonner";
import { api } from "@/lib/axios/apiClient";
import { ListaMaterial } from "../../admcontrato/_types/lista-material";
import { AssociadoProps } from "../../admcontrato/_types/associado";
import { DadosCadastroProps } from "../../admcontrato/_types/dados-cadastro";
import { AuthContext } from "@/store/AuthContext";
import { useReactToPrint } from "react-to-print";
import DocumentTemplate from '@/Documents/cobranca/DocumentTemplate';
import { SelectProps } from '../../admcontrato/_types/select';
import { EstoqueNovoRegistroProps } from '../../estoque/types/estoque';
import DocumentTemplateContrato from "@/Documents/convalescenca/contrato/DocumentTemplate";

interface ActionsProps {

  // --- Estados que a UI irá ler ---

  dataInputs: Partial<ListaMaterial>;
  estoque: Array<EstoqueNovoRegistroProps>;
  listaMaterial: Array<Partial<ListaMaterial>>;
  indexProd: number;
  dadosAssociado: AssociadoProps | undefined;
  data: Partial<DadosCadastroProps>;
  listaConv: Partial<ConvProps>;
  titular: boolean;
  selectProdutos: Array<SelectProps>;
  componentRefComprovante: React.RefObject<DocumentTemplateComprovante>;
  componentRefContrato: React.RefObject<DocumentTemplate>;
  isLoading: boolean;


  // --- Funções para alterar o estado  ---

  setTitular: (value: boolean) => void;
  closeModa: (fields: Partial<DadosCadastroProps>) => void;
  setMaterial: (value: Array<Partial<ListaMaterial>>) => void;
  setIndex: (value: number) => void;



  // --- Funções de Ação ---
  setarListaConv: (fields: Partial<ConvProps>) => void;
  imprimirComprovante: () => void;
  imprimirContrato: () => void;
  setInputs: (fields: Partial<ListaMaterial>) => void;
  adicionarProduto: () => Promise<void>;
  receberDev: (status: string) => Promise<void>;
  carregarDados: () => Promise<void>;
  editarRegistro: () => Promise<void>;
  adicionarNovoRegistro: () => Promise<void>;

}

const useActionsNovoResgistro = () => {
  const { usuario } = useContext(AuthContext)
  const [dataInputs, setDataInputs] = useState<Partial<ListaMaterial>>({})
  const [listaConv, setLista] = useState<Partial<ConvProps>>({ convalescenca_prod: [] });
  const [listaMaterial, setMaterial] = useState<Array<Partial<ListaMaterial>>>([]);
  const [indexProd, setIndex] = useState<number>(0);
  const [data, closeModa] = useState<Partial<DadosCadastroProps>>({});
  const [dadosAssociado, setDadosAssociado] = useState<AssociadoProps>();
  const componentRefComprovante = useRef<DocumentTemplateComprovante>(null);
  const componentRefContrato = useRef<DocumentTemplateContrato>(null);
  const [componenteMounted, setMounted] = useState(false);
  const [selectProdutos, setSelect] = useState<Array<SelectProps>>([]);
  const [estoque, setEstoque] = useState<Array<EstoqueNovoRegistroProps>>([])
  const [titular, setTitular] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setarListaConv = useCallback((fields: Partial<ConvProps>) => {
    setLista(prev => ({ ...prev, ...fields }));
  }, []);

  const imprimirComprovante = useReactToPrint({
    content: () => componentRefComprovante.current
  })

  const imprimirContrato = useReactToPrint({
    content: () => componentRefContrato.current
  })

  const setInputs = (fields: Partial<ListaMaterial>) => {
    setDataInputs((prev: Partial<ListaMaterial>) => {
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
      toast.info('SALVE OS DADOS DO SOLICITANTE!')
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
          hora: new Date(),
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

  async function receberDev(status: string) {

    if (status === 'ABERTO') {
      const novoArray = [...listaMaterial]
      novoArray[indexProd].id_estoque = dataInputs.id_estoque
      setMaterial(novoArray)
    }

    toast.promise(
      api.put('/convalescencia/receber', {
        id_conv_prod: listaMaterial[indexProd].id_conv_prod,
        id_estoque: status === 'ABERTO' ? listaMaterial[indexProd].id_estoque : undefined,
        status
      }),
      {
        error: 'Erro ao Atualizar Dados',
        loading: 'Atualizando Dados....',
        success: (response) => {
          const novoArray = [...listaMaterial]
          novoArray[indexProd] = response.data
          setMaterial(novoArray)

          return 'Dados Atualizados com sucesso!'
        }

      }



    )



  }

  async function carregarDados() {
    try {
      const response = await api.post('/associado', {
        
        id_associado: Number(data.id_associado),
        empresa: data.empresa

      })

      setDadosAssociado(response.data);

    } catch (error) {
      toast.error('Erro na requisição')
    }
  }

  async function editarRegistro() {

    if (!listaConv.nome || !listaConv.logradouro) {
      toast.info('Preencha os campos obrigatórios');
      return;
    }

    //  if (listaConv.convalescenca_prod) {
    //    toast.info('Adicione o Produto Desejado!');
    //  return;
    //  }

    //const produto = {...listaConv.convalescenca_prod} ??{}

    toast.promise(

      api.put('/convalescencia/editar', {

        id_conv: listaConv.id_conv,
        id_contrato: listaConv.id_contrato,
        id_associado: listaConv.id_associado,
        id_contrato_st: listaConv.id_contrato_st,
        tipo_entrada: listaConv.tipo_entrada,
        nome: listaConv.nome,
        cpf_cnpj: listaConv.cpf_cnpj,
        data: new Date(listaConv.data ?? ''),
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
        data_inc: listaConv.data && new Date(listaConv.data_inc ?? ''),
        hora_inc: new Date(listaConv.hora_inc ?? ''),
        usuario: listaConv.usuario,
        obs: listaConv.obs,
        convalescenca_prod: listaMaterial



      }),
      {
        error: 'Erro ao atualizar dados',
        loading: 'Atualizando Dados',
        success: (response) => {

          setarListaConv({ ...response.data })
          setMaterial(response.data.convalescenca_prod)
          return 'Dados Atualizados com Sucesso'
        }
      }
    )






  }

  async function adicionarNovoRegistro() {


    if (!listaConv.nome || !listaConv.logradouro) {
      toast.info('Preencha os campos obrigatórios');
      return;
    }


    toast.promise(
      api.post('/convalescencia/novo', {
        id_contrato: dadosAssociado?.contrato.id_contrato,
        id_associado: dadosAssociado?.id_associado,
        id_dependente: listaConv.id_dependente,
        id_contrato_st: listaConv.id_contrato_st,
        tipo_entrada: listaConv.tipo_entrada,
        nome: listaConv.nome,
        cpf_cnpj: listaConv.cpf_cnpj,
        data: listaConv.data,
        status: "ABERTO",
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
        data_inc: listaConv.data_inc,
        hora_inc: listaConv.hora_inc,
        usuario: usuario?.nome,
        obs: listaConv.obs,


      }),
      {
        error: 'Erro ao cadastrar',
        loading: 'Salvando Dados',
        success: 'Dados Registrados com Sucesso'
      }
    )




  }

  useEffect(() => {
    closeModa({ id_associado: undefined })
    const novoArray = listaConv.convalescenca_prod && [...listaConv.convalescenca_prod];
    // novoArray.push({ ...listaConv.convalescenca_prod})
    novoArray && setMaterial(novoArray)
    if (!componenteMounted) {
      try {
        const selectMateriais = async () => {
          const response = await api.get('/estoque/listar')
          setSelect(response.data.produtos)
          setEstoque(response.data.estoque)

        }
        selectMateriais()

      } catch (error) {
        console.log(error)
      }


    }



    setMounted(true)
  }, [])

  useEffect(() => {

    closeModa({ ...data, closeModalPlano: false })

    if (data.id_associado && componenteMounted) {

      carregarDados();

    }

  }, [data.id_associado])

  useEffect(() => {

    if (titular) {
      setarListaConv({
        nome: dadosAssociado?.nome ?? '',
        data: dadosAssociado?.data_nasc ?? new Date(),
        logradouro: dadosAssociado?.endereco ?? '',
        bairro: dadosAssociado?.bairro ?? '',
        numero: dadosAssociado?.numero ?? null,
        cidade: dadosAssociado?.cidade ?? '',
        id_dependente: null
      })

    }

  }, [titular])


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/seus-dados');
        closeModa(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados", error);
      } finally {
        // ✅ Garante que o loading termina, mesmo se der erro
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return {

    dataInputs,
    estoque,
    listaMaterial,
    indexProd,
    dadosAssociado,
    data,
    listaConv,
    titular,
    selectProdutos,
    componentRefComprovante,
    componentRefContrato,
    isLoading,

    setTitular,
    closeModa,
    setMaterial,
    setIndex,

    setarListaConv,
    imprimirComprovante,
    imprimirContrato,
    setInputs,
    adicionarProduto,
    receberDev,
    carregarDados,
    editarRegistro,
    adicionarNovoRegistro,

  }
}

export default useActionsNovoResgistro;