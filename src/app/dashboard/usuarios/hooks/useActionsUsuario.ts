import { useEffect, useState } from "react";
import { ConsultoresProps } from "@/types/consultores";
import { toast } from "sonner";
import { api } from "@/lib/axios/apiClient";
import { UsuarioProps } from "../_types/editar-usuario";
import { success } from "zod";
import { ActionsFunctionsApi } from "@/types/actions";

interface ActionsProps {

  // --- Estados que a UI irá ler ---
  userDados: UsuarioProps[] | undefined;
  isLoading: boolean;
  dadosUser: Partial<UsuarioProps>;
  dadosFuncionario: Partial<ConsultoresProps>;
  isModalOpen: boolean;
  pendingChange: { id_user: string; status: 'ATIVO' | 'INATIVO' } | null;

  // --- Funções para alterar o estado (setters) ---
  setarDadosUsuario: (fields: Partial<UsuarioProps>) => void;
  setarDadosFuncionario: (fields: Partial<ConsultoresProps>) => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPendingChange: React.Dispatch<React.SetStateAction<{ id_user: string; status: 'ATIVO' | 'INATIVO' } | null>>;
  setDadosUser: React.Dispatch<React.SetStateAction<Partial<UsuarioProps>>>;

  // --- Funções de Ação (handlers) ---
  handlePermission: (permission: string) => void;
  handleNovoCadastro: () => Promise<void>;
  handleEditarCadastro: () => Promise<void>;
  handleConfirmarStatus: () => Promise<void>;

}


const useActionsUsuario = () => {
  const [userDados, setUserDados] = useState<Array<UsuarioProps>>()
  const [dadosUser, setDadosUser] = useState<Partial<UsuarioProps>>({});
  const [dadosFuncionario, setDadosFuncionario] = useState<
    Partial<ConsultoresProps>
  >({});
  const [dadosPermissoes, setDadosPermissoes] = useState<Array<string>>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [pendingChange, setPendingChange] = useState<{ id_user: string; status: 'ATIVO' | 'INATIVO' } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("")
  // const [currentPage, setCurrentPage] = useState(1)
  // const itemsPerPage = 10


  async function handleNovoCadastro({actions}:ActionsFunctionsApi) {
    const data = new FormData();
    data.append("nome", dadosUser.nome ?? "");
    data.append("usuario", dadosUser.usuario ?? "");
    data.append("password", dadosUser.password ?? "");
    data.append("cargo", dadosUser.cargo ?? "");
    // Usar as permissões atualmente selecionadas no objeto do usuário
    data.append("permissoes", JSON.stringify(dadosUser.permissoes ?? []) ?? "");

    if (dadosUser.file) {
      data.append("file", dadosUser.file);
    }

    toast.promise(api.post("/user", data), {
      error: ()=>{
        actions?.error?.()
        return "ERRO AO REALIZAR CADASTRO"},
      loading: "CADASTRANDO NOVO FUNCIONÁRIO",
      success: async () => {
        await getUsers();
        actions?.success()
        return "FUNCIONÁRIO CADASTRADO COM SUCESSO";
      },
    });
  }

  async function handleEditarCadastro() {
    if (dadosUser.password && dadosUser.password !== dadosUser.repSenha) {
      toast.error("Senhas não coincidem !");
      return;
    }

    if (dadosUser.senhaAtual && (!dadosUser.password || !dadosUser.repSenha)) {
      toast.info("Insira a nova senha");
      return;
    }

    const data = new FormData();
    dadosUser.id_user && data.append("id", dadosUser.id_user?.toString());
    dadosFuncionario.id_consultor &&
      data.append("id_consultor", dadosFuncionario.id_consultor?.toString());
    dadosUser.nome && data.append("nome", dadosUser.nome);
    dadosUser.usuario && data.append("usuario", dadosUser.usuario);
    dadosUser.password && data.append("password", dadosUser.password);
    dadosUser.senhaAtual && data.append("senhaAtual", dadosUser.senhaAtual);
    dadosUser.cargo && data.append("cargo", dadosUser.cargo);
    dadosFuncionario.nome &&
      data.append("nomeCompleto", dadosFuncionario?.nome);
    dadosFuncionario.cpf && data.append("cpf", dadosFuncionario.cpf);
    dadosFuncionario.rg && data.append("rg", dadosFuncionario.rg);
    dadosFuncionario.data_nascimento &&
      data.append("nascimento", dadosFuncionario.data_nascimento?.toString());
    dadosFuncionario.cep && data.append("cep", dadosFuncionario.cep);
    dadosFuncionario.endereco &&
      data.append("endereco", dadosFuncionario.endereco);
    dadosFuncionario.numero && data.append("numero", dadosFuncionario.numero);
    dadosFuncionario.bairro && data.append("bairro", dadosFuncionario.bairro);
    dadosFuncionario.cidade && data.append("cidade", dadosFuncionario.cidade);
    dadosFuncionario.uf && data.append("uf", dadosFuncionario.uf);
    dadosFuncionario.telefone &&
      data.append("telefone", dadosFuncionario.telefone);
    dadosFuncionario.email && data.append("email", dadosFuncionario.email);
    dadosFuncionario.dt_admissao &&
      data.append("dataAdmissao", dadosFuncionario.dt_admissao?.toString());
    dadosFuncionario.cnh_categoria &&
      data.append("CNH_categoria", dadosFuncionario.cnh_categoria);
    dadosFuncionario.titulo_eleitor &&
      data.append("titulo_eleitor", dadosFuncionario.titulo_eleitor);
    dadosFuncionario.zona &&
      data.append("zona", dadosFuncionario.zona?.toString());
    dadosFuncionario.secao &&
      data.append("secao", dadosFuncionario.secao?.toString());
    dadosFuncionario.pis_pasep &&
      data.append("PIS_PASEP", dadosFuncionario.pis_pasep);
    dadosFuncionario.grau_instrucao &&
      data.append("escolaridade", dadosFuncionario.grau_instrucao);
    dadosFuncionario.nome_conjuge &&
      data.append("nome_conjuge", dadosFuncionario.nome_conjuge);
    dadosFuncionario.n_dependentes &&
      data.append("n_dep", dadosFuncionario.n_dependentes?.toString());
    dadosFuncionario.menores_14 &&
      data.append("n_dep14", dadosFuncionario.menores_14?.toString());
    dadosFuncionario.caso_emergencia &&
      data.append("caso_emergencia", dadosFuncionario.caso_emergencia);
    dadosFuncionario.salario &&
      data.append("salario", dadosFuncionario.salario?.toString());
    dadosFuncionario.contrato_exp &&
      data.append("contrato_exp", dadosFuncionario.contrato_exp?.toString());
    dadosFuncionario.prorrogacao_cont &&
      data.append("prorrogacao", dadosFuncionario.prorrogacao_cont?.toString());
    dadosFuncionario.situacao &&
      data.append("situacao", dadosFuncionario.situacao);
    data.append("permissoes", JSON.stringify(dadosUser.permissoes));

    if (dadosUser.file) {
      data.append("file", dadosUser.file);
    }

    toast.promise(api.put("/user/editar", data), {
      loading: "ALTERANDO DADOS.....",
      success: async (res) => {
        await getUsers();
        return "DADOS ALTERADOS COM SUCESSO";
      },
      error: (err) => {
        return "ERRO AO REALIZAR ALTERAÇÃO";
      },
    });


  }

  const handlePermission = (permission: string) => {
    setDadosUser((prev) => {
      const current = prev?.permissoes ?? [];
      const has = current.includes(permission);
      const next = has
        ? current.filter((item) => item !== permission)
        : [...current, permission];
      return { ...(prev ?? {}), permissoes: next };
    });
  };

  const setarDadosUsuario = (fields: Partial<UsuarioProps>) => {
    setDadosUser((prev: Partial<UsuarioProps>) => {
      if (prev) {
        return { ...prev, ...fields };
      } else {
        return { ...fields };
      }
    });
  };

  const setarDadosFuncionario = (fields: Partial<ConsultoresProps>) => {
    setDadosFuncionario((prev: Partial<ConsultoresProps>) => {
      if (prev) {
        return { ...prev, ...fields };
      } else {
        return { ...fields };
      }
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    setIsLoading(true);
    try {
      const response = await api.get("/getUser");
      setUserDados(response.data);
    } catch (error) {
      toast.error("Erro ao carregar usuários");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleConfirmarStatus = async () => {

    if (!pendingChange) return;


    const payload = {
      id_user: pendingChange.id_user,
      status: pendingChange.status
    }

    toast.promise(
      api.patch('/user/status', payload),
      {
        loading: 'ALTERANDO DADOS.....',
        success: async (response) => {
          getUsers();
          setIsModalOpen(false);
          return 'Status alterado com sucesso!';
        },
        error: (err) => {
          //console.error("Detalhes do erro:", err.response); // Log para depuração
          setIsModalOpen(false);
          return 'Erro ao alterar o status.';
        }
      }
    )
    setPendingChange(null);
  }

  return {

    // Estados que a UI precisa ler
    userDados,
    isLoading,
    dadosUser,
    dadosFuncionario,
    isModalOpen,
    pendingChange,

    // Setters e handlers que a UI precisa para interagir
    setarDadosUsuario,
    setarDadosFuncionario,
    setIsModalOpen,
    setPendingChange,
    handlePermission,
    handleNovoCadastro,
    handleEditarCadastro,
    handleConfirmarStatus,
    setDadosUser

  }
}


export default useActionsUsuario;