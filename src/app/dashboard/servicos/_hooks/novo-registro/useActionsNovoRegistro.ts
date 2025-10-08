import { useContext, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios/apiClient";
import { AuthContext } from "@/store/AuthContext";
import { ProdutosProps } from '../../../../../types/produtos';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { ConvProps } from '../../_types/convalescente';

const useActionsNovoResgistro = (isEditMode?: boolean, id?: string) => {
  const { usuario, dadosassociado, infoEmpresa } = useContext(AuthContext);
  const [listarProdutos, setListarProdutos] = useState<Array<ProdutosProps>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fixDate = (date: any) => {
    if (!date) return undefined;
    const d = new Date(date);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  };

  const toIntOrNull = (val: any) => {
    if (val === undefined || val === null || val === '') return null;
    const n = Number(val);
    return isNaN(n) ? null : n;
  };


  async function editarRegistro(id: string, dadosForm: any) {
    // Tratamento inicial dos dados
    const dadosTratados = {
      ...dadosForm,
      numero_r: toIntOrNull(dadosForm.numero_r),
      data: dadosForm.data ? new Date(dadosForm.data) : null,
      data_inc: fixDate(dadosForm.data_inc),
      hora_inc: fixDate(dadosForm.hora_inc),
    };

    // Remove campos indesejados
    delete (dadosTratados as any).situacao_contrato;
    delete (dadosTratados as any).tipo_contrato;
    delete (dadosTratados as any).id_conv;
    delete (dadosTratados as any).id_conv_global;
    delete (dadosTratados as any).editar;
    delete (dadosTratados as any).contrato;

    // Remove chaves com valor undefined
    Object.keys(dadosTratados).forEach(key => {
      if ((dadosTratados as any)[key] === undefined) {
        delete (dadosTratados as any)[key];
      }
    });

    const { convalescenca_prod, ...rest } = dadosTratados;

    console.log('Dados recebidos no editarRegistro:', dadosTratados);
    console.log('Produtos encontrados:', convalescenca_prod);

    if (!rest.nome || !rest.logradouro) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    if (!convalescenca_prod || convalescenca_prod.length === 0) {
      toast.error('Adicione pelo menos um produto/serviço.');
      return;
    }
    const produtosParaEnviar = convalescenca_prod.map((produto: any) => ({
      id_produto: produto.id_produto,
      descricao: produto.descricao,
      quantidade: produto.quantidade,
      status: produto.status || "ABERTO"
    }));
    const payload = {
      ...rest,
      id_empresa: rest.id_empresa || infoEmpresa?.id,
      usuario: rest.usuario || usuario?.nome,
      convalescenca_prod: produtosParaEnviar
    };
    const promise = api.put(`/convalescencia/editar/${id}`, payload);
    toast.promise(promise, {
      loading: 'Atualizando Dados...',
      success: 'Dados registrados com sucesso!',
      error: (err) => err.response?.data?.message || 'Erro ao atualizar dados. Tente novamente.',
    });
    try {
      await promise;
      router.push('/dashboard/servicos/convalescencia/listagem');
    } catch (error: any) {
      console.log("Falha detalhada ao editar registro:", error.response?.data || error.message || error);
    }
  }

  async function enviarNovoRegistro(dadosForm: any) {
    // Tratamento inicial dos dados
    const dadosTratados = {
      ...dadosForm,
      numero_r: toIntOrNull(dadosForm.numero_r),
      data: dadosForm.data ? new Date(dadosForm.data) : null,
      data_inc: fixDate(dadosForm.data_inc),
      hora_inc: fixDate(dadosForm.hora_inc),
    };

    // Remove campos indesejados
    delete (dadosTratados as any).situacao_contrato;
    delete (dadosTratados as any).tipo_contrato;
    delete (dadosTratados as any).id_conv;
    delete (dadosTratados as any).editar;
    delete (dadosTratados as any).contrato;

    // Remove chaves com valor undefined
    Object.keys(dadosTratados).forEach(key => {
      if ((dadosTratados as any)[key] === undefined) {
        delete (dadosTratados as any)[key];
      }
    });

    const { convalescenca_prod, ...rest } = dadosTratados;

    console.log('Dados recebidos no enviarNovoRegistro:', dadosTratados);
    console.log('Produtos encontrados:', convalescenca_prod);

    if (!rest.nome || !rest.logradouro) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    if (!convalescenca_prod || convalescenca_prod.length === 0) {
      toast.error('Adicione pelo menos um produto/serviço.');
      return;
    }
    const produtosParaEnviar = convalescenca_prod.map((produto: any) => ({
      id_produto: produto.id_produto,
      descricao: produto.descricao,
      quantidade: produto.quantidade,
      status: produto.status || "ABERTO"
    }));



    const payload = {
      ...rest,

      id_contrato_global: dadosassociado.contrato?.id_contrato_global,
      id_associado: dadosassociado?.id_associado,
      id_contrato: dadosassociado.contrato?.id_contrato,
      id_empresa: rest.id_empresa || infoEmpresa?.id,
      status: 'ABERTO',
      data_inc: new Date().toISOString(),
      hora_inc: new Date().toISOString(),
      usuario: rest.usuario || usuario?.nome,
      convalescenca_prod: produtosParaEnviar
    };

    const promise = api.post('/convalescencia/novo', payload);
    toast.promise(promise, {
      loading: 'Salvando dados...',
      success: 'Dados registrados com sucesso!',
      error: (err) => err.response?.data?.message || 'Erro ao cadastrar. Tente novamente.',
    });

    try {

      await promise;
      router.push('/dashboard/servicos/convalescencia/listagem');

    } catch (error: any) {

      console.log("Falha detalhada ao salvar registro:", error.response?.data || error.message || error);

    }
  }

  function adicionarProduto(produtos: any[], novoProduto: any) {
    if (!novoProduto) {
      toast.error('Selecione um produto para adicionar.');
      return produtos;
    }
    const existe = produtos.some((p) => p.id_produto === novoProduto.id_produto);
    if (existe) {
      toast.warning('Este produto já foi adicionado.');
      return produtos;
    }
    toast.success('Produto adicionado!');
    return [...produtos, novoProduto];
  }

  // Função para deletar produto da lista local (array de produtos do formulário)
  function deletarProdutoConv(produtos: any[], idDeletarProduto: number) {
    const novaLista = produtos.filter(
      (produto) => produto.id_produto !== idDeletarProduto
    );
    toast.success("Produto removido da lista!");
    return novaLista;
  }

  useEffect(() => {
    const selectProdutos = async () => {
      setIsLoading(true);
      try {
        const response = await api.post('/produtos/listar');
        setListarProdutos(response.data || []);
      } catch (error) {
        toast.error("Não foi possível carregar os materiais.");
      } finally {
        setIsLoading(false);
      }
    };
    selectProdutos();
  }, []);

  // HandleSubmit unificado
  const handleSubmit: SubmitHandler<ConvProps> = useCallback(async (data: ConvProps) => {
    if (isEditMode && id) {
      await editarRegistro(id, data);
    } else {
      await enviarNovoRegistro(data);
    }
  }, [isEditMode, id]);

  return {
    listarProdutos,
    isLoading,
    enviarNovoRegistro,
    editarRegistro,
    adicionarProduto,
    deletarProdutoConv,
    handleSubmit,
  };
};

export default useActionsNovoResgistro;
