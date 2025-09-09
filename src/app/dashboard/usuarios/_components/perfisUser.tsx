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
import { Delete, Edit2 } from "lucide-react"
import { ModalEditarPerfil } from "./modalEditarPerfil"
import { ModalNovoPerfil } from "./modal-novo-perfil"

interface DataProps {
  id: number,
  id_user: string | undefined
  perfis: Array<ConsultoresProps>
}

export function PerfisUser({ id, id_user, perfis }: DataProps) {

  const [modalEditar, setModalEditar] = useState<boolean>(false)
  const [modalNovo, setModalNovo] = useState<boolean>(false)
  const [perfilSelecionado, setPerfilSelecionado] = useState<ConsultoresProps | null>(null)



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
            <DialogDescription>
              Adicione aqui os perfis desse usuário na empresa
            </DialogDescription>
          </DialogHeader>
         
           
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={handleNovoPerfil} // Chama a função para abrir o modal de novo perfil
            >
              Novo Perfil
            </Button>
         

          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {perfis?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item?.funcao}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditarPerfil(item)} // Abre o modal de edição
                      >
                        <Delete color="red" className="h-4 w-4" />
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
      />

      <ModalNovoPerfil
        isOpen={modalNovo}
        onClose={() => setModalNovo(false)}
        id={id}
        perfis={perfis}
      />
    </>
  )
}