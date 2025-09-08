<<<<<<< HEAD
'use client'
import { api } from "@/lib/axios/apiClient"
import { useEffect, useState, useMemo } from "react"
import { Edit2, Plus, Loader2 } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ModalNovoUsuario } from "@/app/dashboard/usuarios/_components/modalNovoUsuario"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { ConsultoresProps } from "@/types/consultores"
import { DataTable } from "@/components/ui/data-table"
import { Switch } from "@/components/ui/switch"
import useActionsPerfil from "./hooks/useActionsPerfil"
=======
"use client";
import { api } from "@/lib/axios/apiClient";
import { useEffect, useState, useMemo } from "react";
import { Edit2, Plus, Loader2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ModalNovoUsuario } from "@/app/dashboard/usuarios/_components/modalNovoUsuario";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ConsultoresProps } from "@/types/consultores";
import { DataTable } from "@/components/ui/data-table";
>>>>>>> 6367e8b64647ede03dda90ae0664aee7f0fc3f89

export interface UsuarioProps {
  id: number;
  nome: string;
  usuario: string;
  password: string;
  senhaAtual: string;
  image: string;
  id_user: string;
  cargo: string;
  file: File | undefined;
  avatarUrl: string;
  editar: boolean;
  repSenha: string;
  permissoes: Array<string>;
  consultor: Array<ConsultoresProps>;
  situacao: string;
}

<<<<<<< HEAD
export default function Usuario({  }: UsuarioProps) {
  const [userDados, setUserDados] = useState<Array<UsuarioProps>>()
  const [isLoading, setIsLoading] = useState(true)
=======
export default function Usuario() {
  const [userDados, setUserDados] = useState<Array<UsuarioProps>>();
  const [isLoading, setIsLoading] = useState(true);
>>>>>>> 6367e8b64647ede03dda90ae0664aee7f0fc3f89
  // const [searchTerm, setSearchTerm] = useState("")
  // const [currentPage, setCurrentPage] = useState(1)
  // const itemsPerPage = 10
  const [modalAdicionar, setModalAdicionar] = useState<boolean>(false);
  const [dadosUser, setDadosUser] = useState<Partial<UsuarioProps>>({});
  const [dadosFuncionario, setDadosFuncionario] = useState<
    Partial<ConsultoresProps>
  >({});
  const [dadosPermissoes, setDadosPermissoes] = useState<Array<string>>([]);


  async function handleNovoCadastro() {
    const data = new FormData();
    data.append("nome", dadosUser.nome ?? "");
    data.append("usuario", dadosUser.usuario ?? "");
    data.append("password", dadosUser.password ?? "");
    data.append("cargo", dadosUser.cargo ?? "");
    data.append("nomeCompleto", dadosFuncionario?.nome ?? "");
    data.append("cpf", dadosFuncionario.cpf ?? "");
    data.append("rg", dadosFuncionario.rg ?? "");
    data.append(
      "nascimento",
      dadosFuncionario.data_nascimento?.toString() ?? ""
    );
    data.append("cep", dadosFuncionario.cep ?? "");
    data.append("endereco", dadosFuncionario.endereco ?? "");
    data.append("numero", dadosFuncionario.numero ?? "");
    data.append("bairro", dadosFuncionario.bairro ?? "");
    data.append("cidade", dadosFuncionario.cidade ?? "");
    data.append("uf", dadosFuncionario.uf ?? "");
    data.append("telefone", dadosFuncionario.telefone ?? "");
    data.append("email", dadosFuncionario.email ?? "");
    data.append("dataAdmissao", dadosFuncionario.dt_admissao?.toString() ?? "");
    data.append("CNH_categoria", dadosFuncionario.cnh_categoria ?? "");
    data.append("titulo_eleitor", dadosFuncionario.titulo_eleitor ?? "");
    data.append("zona", dadosFuncionario.zona?.toString() ?? "");
    data.append("secao", dadosFuncionario.secao?.toString() ?? "");
    data.append("PIS_PASEP", dadosFuncionario.pis_pasep ?? "");
    data.append("escolaridade", dadosFuncionario.grau_instrucao ?? "");
    data.append("nome_conjuge", dadosFuncionario.nome_conjuge ?? "");
    data.append("n_dep", dadosFuncionario.n_dependentes?.toString() ?? "");
    data.append("n_dep14", dadosFuncionario.menores_14?.toString() ?? "");
    data.append("caso_emergencia", dadosFuncionario.caso_emergencia ?? "");
    data.append("salario", dadosFuncionario.salario?.toString() ?? "");
    data.append(
      "contrato_exp",
      dadosFuncionario.contrato_exp?.toString() ?? ""
    );
    data.append(
      "prorrogacao",
      dadosFuncionario.prorrogacao_cont?.toString() ?? ""
    );
    data.append("situacao", dadosFuncionario.situacao ?? "");
    data.append("permissoes", JSON.stringify(dadosPermissoes) ?? "");

    if (dadosUser.file) {
      data.append("file", dadosUser.file);
    }

<<<<<<< HEAD
    toast.promise(api.post("/user", data), {
      error: "ERRO AO REALIZAR CADASTRO",
      loading: "CADASTRANDO NOVO FUNCIONÁRIO",
      success: async () => {
        await getUsers();
        return "FUNCIONÁRIO CADASTRADO COM SUCESSO";
      },
    });
=======

    toast.promise(
      api.post('/user', data),
      {
        error: 'ERRO AO REALIZAR CADASTRO',
        loading: 'CADASTRANDO NOVO FUNCIONÁRIO',
        success: async () => {
          await getUsers()
          return 'FUNCIONÁRIO CADASTRADO COM SUCESSO'
        }
      }
    )



    // await getUsers()

>>>>>>> 822589c900b6ff336d58441319ae799215394bb0
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
<<<<<<< HEAD
    dadosUser.id_user && data.append('id_user', dadosUser.id_user?.toString());
    dadosFuncionario.id_consultor && data.append('id_consultor', dadosFuncionario.id_consultor?.toString());
    dadosUser.nome && data.append('nome', dadosUser.nome);
    dadosUser.usuario && data.append('usuario', dadosUser.usuario);
    dadosUser.password && data.append('password', dadosUser.password);
    dadosUser.senhaAtual && data.append('senhaAtual', dadosUser.senhaAtual);
    dadosUser.cargo && data.append('cargo', dadosUser.cargo);
    dadosFuncionario.nome && data.append('nomeCompleto', dadosFuncionario?.nome);
    dadosFuncionario.cpf && data.append('cpf', dadosFuncionario.cpf);
    dadosFuncionario.rg && data.append('rg', dadosFuncionario.rg);
    dadosFuncionario.data_nascimento && data.append('nascimento', dadosFuncionario.data_nascimento?.toString());
    dadosFuncionario.cep && data.append('cep', dadosFuncionario.cep);
    dadosFuncionario.endereco && data.append('endereco', dadosFuncionario.endereco);
    dadosFuncionario.numero && data.append('numero', dadosFuncionario.numero);
    dadosFuncionario.bairro && data.append('bairro', dadosFuncionario.bairro);
    dadosFuncionario.cidade && data.append('cidade', dadosFuncionario.cidade);
    dadosFuncionario.uf && data.append('uf', dadosFuncionario.uf);
    dadosFuncionario.telefone && data.append('telefone', dadosFuncionario.telefone);
    dadosFuncionario.email && data.append('email', dadosFuncionario.email);
    dadosFuncionario.dt_admissao && data.append('dataAdmissao', dadosFuncionario.dt_admissao?.toString());
    dadosFuncionario.cnh_categoria && data.append('CNH_categoria', dadosFuncionario.cnh_categoria);
    dadosFuncionario.titulo_eleitor && data.append('titulo_eleitor', dadosFuncionario.titulo_eleitor);
    dadosFuncionario.zona && data.append('zona', dadosFuncionario.zona?.toString());
    dadosFuncionario.secao && data.append('secao', dadosFuncionario.secao?.toString());
    dadosFuncionario.pis_pasep && data.append('PIS_PASEP', dadosFuncionario.pis_pasep);
    dadosFuncionario.grau_instrucao && data.append('escolaridade', dadosFuncionario.grau_instrucao);
    dadosFuncionario.nome_conjuge && data.append('nome_conjuge', dadosFuncionario.nome_conjuge);
    dadosFuncionario.n_dependentes && data.append('n_dep', dadosFuncionario.n_dependentes?.toString());
    dadosFuncionario.menores_14 && data.append('n_dep14', dadosFuncionario.menores_14?.toString());
    dadosFuncionario.caso_emergencia && data.append('caso_emergencia', dadosFuncionario.caso_emergencia);
    dadosFuncionario.salario && data.append('salario', dadosFuncionario.salario?.toString());
    dadosFuncionario.contrato_exp && data.append('contrato_exp', dadosFuncionario.contrato_exp?.toString());
    dadosFuncionario.prorrogacao_cont && data.append('prorrogacao', dadosFuncionario.prorrogacao_cont?.toString());
    dadosFuncionario.situacao && data.append('situacao', dadosFuncionario.situacao);
    data.append('permissoes', JSON.stringify(dadosUser.permissoes));
=======
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
>>>>>>> 6367e8b64647ede03dda90ae0664aee7f0fc3f89

    if (dadosUser.file) {
      data.append("file", dadosUser.file);
    }

<<<<<<< HEAD
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
=======

    toast.promise(
      api.put('/user/editar', data),
      {
        loading: 'ALTERANDO DADOS.....',
        success: async (res) => {
          await getUsers()
          return 'DADOS ALTERADOS COM SUCESSO'
        },
        error: (err) => {
          return 'ERRO AO REALIZAR ALTERAÇÃO'
        }
      }
    )

<<<<<<< HEAD
  }


=======




>>>>>>> 822589c900b6ff336d58441319ae799215394bb0
  }

>>>>>>> 6367e8b64647ede03dda90ae0664aee7f0fc3f89
  const handlePermission = (permission: string) => {
    if (dadosUser.permissoes && dadosUser.permissoes.includes(permission)) {
      setDadosUser({
        ...dadosUser,
        permissoes: dadosUser.permissoes.filter((item) => item !== permission),
      });
    } else {
      setDadosUser({
        ...dadosUser,
        permissoes: [...(dadosUser.permissoes ?? []), permission],
      });
    }
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

  // Define columns for the data table
  const columns: ColumnDef<UsuarioProps>[] = useMemo(
    () => [
      {
        accessorKey: "nome",
        header: "Nome",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            {row.original.avatarUrl ? (
              <img
                src={row.original.avatarUrl}
                alt={row.getValue("nome")}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                {String(row.getValue("nome")).charAt(0).toUpperCase()}
              </div>
            )}
            <div className="font-medium">{row.getValue("nome")}</div>
          </div>
        ),
      },
      {
        accessorKey: "usuario",
        header: "Usuário",
      },
      {
        accessorKey: "cargo",
        header: "Cargo",
        cell: ({ row }) => (
          <Badge variant="outline">
            {row.getValue("cargo") || "Não definido"}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const situacao = row.getValue("status") as string;
          return (
            <div className="flex items-center">
              <span
                className={`h-2.5 w-2.5 rounded-full mr-2 ${
                  situacao === "ATIVO" ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              {situacao || "INATIVO"}
            </div>
<<<<<<< HEAD
          )}
          <div className="font-medium">{row.getValue('nome')}</div>
        </div>
      ),
    },
    {
      accessorKey: 'usuario',
      header: 'Usuário',
    },
    {
      accessorKey: 'cargo',
      header: 'Cargo',
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue('cargo') || 'Não definido'}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <div className="flex items-center">
            <span className={`h-2.5 w-2.5 rounded-full mr-2 ${status?.toUpperCase() === 'ATIVO' ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {status || 'INATIVO'}
            <Switch
              checked={row.original.situacao === 'ATIVO'}
              onCheckedChange={(novoStatus) => {

                const statusAtualizado = novoStatus ? 'ATIVO' : 'INATIVO';

                const payload = {
                  id_user: row.original.id_user,
                  status: statusAtualizado
                }


                toast.promise(
                  api.patch('/user/status', payload),
                  {
                    loading: 'ALTERANDO DADOS.....',
                    success: async (response) => {
                      getUsers(); // Atualiza a tabela com os novos dados
                      return 'Status alterado com sucesso!';
                    },
                    error: (err) => {
                      console.error("Detalhes do erro:", err.response); // Log para depuração
                      return 'Erro ao alterar o status.';
                    }
                  }
                )

              }
              }

            />
          </div>
        );
=======
          );
        },
>>>>>>> 6367e8b64647ede03dda90ae0664aee7f0fc3f89
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setDadosUser({
                    ...user,
                    editar: true,
                    senhaAtual: "",
                    repSenha: "",
                  });
                  if (user.consultor && user.consultor[0]) {
                    setarDadosFuncionario({ ...user.consultor[0] });
                  }
                  setModalAdicionar(true);
                }}
              >
                <Edit2 className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );


  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Usuários do Sistema</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie os usuários do sistema
            </p>
          </div>
          <Button
            onClick={() => {
              setarDadosUsuario({
                cargo: "",
                consultor: [],
                editar: false,
                id_user: "",
                nome: "",
                permissoes: [],
                password: "",
                usuario: "",
                image: "",
                repSenha: "",
                file: undefined,
                avatarUrl: "",
              });
              setModalAdicionar(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="relative w-full">
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <DataTable
                    columns={columns}
                    data={userDados || []}
                    maxHeight="h-[calc(100vh-300px)]"
                  >
                    <Button variant="outline" size="sm" className="h-8">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Filtro
                    </Button>
                  </DataTable>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <ModalNovoUsuario
        handleEditarCadastro={handleEditarCadastro}
        handleNovoCadastro={handleNovoCadastro}
        handlePermission={handlePermission}
        dadosUser={dadosUser}
        setModal={setModalAdicionar}
        setarDadosUsuario={setarDadosUsuario}
        show={modalAdicionar}
      />
    </div>
  );
}
