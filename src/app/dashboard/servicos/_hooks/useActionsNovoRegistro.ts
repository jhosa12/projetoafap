import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios/apiClient";
import { AuthContext } from "@/store/AuthContext";
import { ProdutosProps } from '../../admcontrato/_types/produtos';
import { useRouter } from 'next/navigation';

const useActionsNovoResgistro = () => {
  const { usuario, dadosassociado, infoEmpresa } = useContext(AuthContext);
  const [listarProdutos, setListarProdutos] = useState<Array<ProdutosProps>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Função helper para editar registro, recebe id e dados do formulário
  async function editarRegistro(id: string, dadosForm: any) {
    const { convalescenca_prod, ...rest } = dadosForm;
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
      status: produto.status
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

    const { convalescenca_prod, ...rest } = dadosForm;
    
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
      status: produto.status
    }));
    const payload = {
      ...rest,
      id_contrato: rest.id_contrato || dadosassociado?.contrato?.id_contrato,
      id_associado: rest.id_associado || dadosassociado?.id_associado,
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

  return {
    listarProdutos,
    isLoading,
    enviarNovoRegistro,
    editarRegistro,
    adicionarProduto,
    deletarProdutoConv,
  };
};

export default useActionsNovoResgistro;
