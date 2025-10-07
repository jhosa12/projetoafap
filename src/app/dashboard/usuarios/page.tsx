'use client'
import { useState, useMemo } from "react"
import { Edit2, Plus} from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader } from "@/components/ui/card"
import { ModalNovoUsuario } from "@/app/dashboard/usuarios/_components/modalNovoUsuario"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from "@/components/ui/data-table"
import { Switch } from "@/components/ui/switch"
import { ModalConfirmar } from "@/components/modals/modalConfirmar"
import useActionsUsuario from "./hooks/useActionsUsuario"
import { UsuarioProps } from "./_types/editar-usuario"

export default function Usuario() {
  
  const [modalAdicionar, setModalAdicionar] = useState<boolean>(false);

  const {
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

  } = useActionsUsuario()
  
  
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
              <Switch
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                checked={situacao === 'ATIVO'}
                onCheckedChange={(novoStatus: boolean) => {

                  const statusAtualizado = novoStatus ? 'ATIVO' : 'INATIVO';

                  setPendingChange({
                    id_user: row.original.id_user,
                    status: statusAtualizado
                  });

                  setIsModalOpen(true);
                }
                }
              />
            </div>
          );
        },
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

      <ModalConfirmar
        openModal={isModalOpen}
        setOpenModal={() => setIsModalOpen(false)}
        handleConfirmar={handleConfirmarStatus}
        pergunta={`Tem certeza que deseja alterar o status do usuário para ${pendingChange?.status}?`}
        children={"Essa ação pode afetar o acesso do usuário ao sistema."}
      />
    </div>
  );
}
