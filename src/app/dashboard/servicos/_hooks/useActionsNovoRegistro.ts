import { Navigation } from 'lucide-react';
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
import { converterDataParaISO } from "@/utils/converterDataParaIso";
import { useParams } from 'next/navigation'

interface ActionsProps {

  // --- Estados que a UI irá ler ---

  dataInputs: Partial<ListaMaterial>;
  estoque: Array<EstoqueNovoRegistroProps>;
  listaMaterial: Array<Partial<ListaMaterial>>;
  indexProd: number;
  data: Partial<DadosCadastroProps>;
  listaConv: Partial<ConvProps>;
  titular: boolean;
  selectProdutos: Array<SelectProps>;
  componentRefComprovante: React.RefObject<HTMLDivElement>;
  componentRefContrato: React.RefObject<HTMLDivElement>;
  isLoading: boolean;


  // --- Funções para alterar o estado  ---

  setTitular: (value: boolean) => void;
  closeModa: (fields: Partial<DadosCadastroProps>) => void;
  setMaterial: (value: Array<Partial<ListaMaterial>>) => void;
  setIndex: (value: number) => void;
  handleSalvar: (value: boolean) => void;



  // --- Funções de Ação ---
  setarListaConv: (fields: Partial<ConvProps>) => void;
  imprimirComprovante: () => void;
  imprimirContrato: () => void;
  setInputs: (fields: Partial<ListaMaterial>) => void;
  adicionarProduto: () => Promise<void>;
  receberDev: (status: string) => Promise<void>;
  editarRegistro: () => Promise<void>;
  adicionarNovoRegistro: () => Promise<void>;

}

const useActionsNovoResgistro = () => {
  const { usuario, dadosassociado } = useContext(AuthContext)
  const [dataInputs, setDataInputs] = useState<Partial<ListaMaterial>>({})
  const [listaConv, setLista] = useState<Partial<ConvProps>>({ convalescenca_prod: [] });
  const [listaMaterial, setMaterial] = useState<Array<Partial<ListaMaterial>>>([]);
  const [indexProd, setIndex] = useState<number>(0);
  const [data, closeModa] = useState<Partial<DadosCadastroProps>>({});
  const componentRefComprovante = useRef<HTMLDivElement>(null);
  const componentRefContrato = useRef<HTMLDivElement>(null);
  const [componenteMounted, setMounted] = useState(false);
  const [selectProdutos, setSelect] = useState<Array<SelectProps>>([]);
  const [estoque, setEstoque] = useState<Array<EstoqueNovoRegistroProps>>([])
  const [titular, setTitular] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const id = params.id as string | undefined;
  const isEditMode = !!id;

  const setarListaConv = useCallback((fields: Partial<ConvProps>) => {
    setLista(prev => ({ ...prev, ...fields }));
  }, []);


  const imprimirComprovante = useReactToPrint({
    contentRef: componentRefComprovante,
    documentTitle: "Comprovante de Atendimento",
    onAfterPrint: () => toast.success("Comprovante gerado com sucesso!"),
  });

  // --- Contrato ---
  const imprimirContrato = useReactToPrint({
    contentRef: componentRefContrato,
    documentTitle: "Contrato de Convalescente",
    onAfterPrint: () => toast.success("Contrato gerado com sucesso!"),
  });


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

  async function editarRegistro() {

    if (!listaConv.nome || !listaConv.logradouro) {
      toast.info('Preencha os campos obrigatórios');
      return;
    }

    const dataIso = converterDataParaISO(listaConv.data)
    const dataIsoInc = converterDataParaISO(listaConv.data_inc)


    if (!dataIso || !dataIsoInc) {
      toast.error("Formato de data inválido para 'Data' ou 'Data de Nascimento'. Use DD/MM/AAAA.");
      return;
    }

    toast.promise(

      
      api.put(`/convalescencia/editar/${id}`, {

        //id_conv: id,
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

    const dataISO = converterDataParaISO(listaConv.data);
    const dataIsoNasc = converterDataParaISO(listaConv.data_inc);


    if (!dataISO) {
      toast.error("Formato de data inválido para 'Data' ou 'Data de Nascimento'. Use DD/MM/AAAA.");
      return;
    }

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
      hora_inc: new Date().toISOString(), // Hora de inclusão
      usuario: usuario?.nome,
      obs: listaConv.obs,
    };

    const promise = api.post('/convalescencia/novo', payload);


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
        // Se não há associado (ex: o usuário limpou a busca), limpamos o formulário
        setarListaConv({});
      }
    }

  }, [titular, dadosassociado, setarListaConv]);



  useEffect(() => {
    const selectMateriais = async () => {
      setIsLoading(true);
      try {
        const response = await api.post('/estoque/listar', {});
        // ... sua lógica para tratar a resposta da API de estoque ...
        setSelect(response.data.produtos || []);
        setEstoque(response.data.estoque || []);
      } catch (error) {
        console.error("Falha ao buscar dados do estoque:", error);
        toast.error("Não foi possível carregar os materiais.");
      } finally {
        setIsLoading(false);
      }
    };
    selectMateriais();
  }, []); // Roda apenas uma vez

  useEffect(() => {

    if (isEditMode) {
      const fetchDadosParaEdicao = async () => {
        setIsLoading(true);
        try {

          const response = await api.get(`/convalescencia/${id}`);

          // Usa sua função existente para preencher o estado do formulário
          setarListaConv(response.data);
          // Também preenche a lista de materiais/produtos
          setMaterial(response.data.convalescenca_prod || []);

        } catch (error) {
          console.error("Erro ao buscar dados para edição:", error);
          toast.error("Falha ao carregar os dados do registro.");
          // Opcional: redirecionar para a lista se o ID for inválido
          // router.push('/dashboard/servicos/convalescencia');
        } finally {
          setIsLoading(false);
        }
      };

      fetchDadosParaEdicao();
    } else {
      setarListaConv({ usuario: usuario?.nome, status: "ABERTO" });
      setIsLoading(false);
    }
  }, [id, isEditMode, setarListaConv, usuario?.nome]);

  const handleSalvar = () => {
    if (isEditMode) {
      editarRegistro()
    } else {
      adicionarNovoRegistro()
      
    }
  }

  return {

    dataInputs,
    estoque,
    listaMaterial,
    indexProd,
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
    handleSalvar,

    setarListaConv,
    imprimirComprovante,
    imprimirContrato,
    setInputs,
    adicionarProduto,
    receberDev,
    editarRegistro,
    adicionarNovoRegistro,

  }
}

export default useActionsNovoResgistro;
