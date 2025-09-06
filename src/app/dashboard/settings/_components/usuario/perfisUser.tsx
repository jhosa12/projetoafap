import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import useApiGet from "@/hooks/useApiGet"
import { ConsultoresProps } from "@/types/consultores"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { Edit2 } from "lucide-react"
import { ModalEditarPerfil } from "./modalEditarPerfil"
import { ModalNovoPerfil } from "./modalNovoPerfil"

interface DataProps {
  id_user: string | undefined
  perfis: Array<ConsultoresProps>
}

export function PerfisUser({ id_user, perfis }: DataProps) {
  const { data, postData, loading } = useApiGet<Array<ConsultoresProps>, { id_user: string | undefined }>("/gerenciarAdministrativo/listarPerfis")
  const [modalEditar, setModalEditar] = useState<boolean>(false)
  const [modalNovo, setModalNovo] = useState<boolean>(false)
  const [perfilSelecionado, setPerfilSelecionado] = useState<ConsultoresProps | null>(null)

  useEffect(() => {
    handleListarFuncoes()
  }, [])

  const handleListarFuncoes = async () => {
    await postData({ id_user })
  }

  const handleNovoPerfil = () => {
    setModalNovo(true)
  }

  const handleEditarPerfil = (perfil: ConsultoresProps) => {
    setPerfilSelecionado(perfil)
    setModalEditar(true)
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">Perfis</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader >
            <DialogTitle>Perfis</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-between">
            <DialogDescription>
              Adicione aqui os perfis desse usuário na empresa
            </DialogDescription>
            <Button
              variant="outline"
              size="sm"
              className="ml-4 bg-black text-white"
              onClick={handleNovoPerfil} // Chama a função para abrir o modal de novo perfil
            >
              Novo Perfil
            </Button>
          </div>

          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {perfis?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item?.nome}</TableCell>
                    <TableCell>{item?.funcao}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditarPerfil(item)} // Abre o modal de edição
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
      <ModalEditarPerfil
        isOpen={modalEditar}
        onClose={() => setModalEditar(false)}
        perfil={perfilSelecionado}

        onDataReload={handleListarFuncoes}
      />

      <ModalNovoPerfil
        isOpen={modalNovo}
        onClose={() => setModalNovo(false)}
        onDataReload={handleListarFuncoes}
        perfil={perfilSelecionado}
      />
    </>
  )
}