import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProdutosProps } from "@/types/produtos"
import { Dispatch, SetStateAction } from "react"
import { SubmitHandler } from "react-hook-form"
import { ProdutoForm } from "./produto-form"

interface ModalFormPlanosProps {
  isFormOpen: boolean,
  setIsFormOpen: (open: boolean) => void
  selectedProduto: ProdutosProps | null
  setSelectedProduto: Dispatch<SetStateAction<ProdutosProps | null>>
  onSave: SubmitHandler<ProdutosProps>
}


export default function ModalFormProduto({ isFormOpen, setIsFormOpen, selectedProduto, setSelectedProduto, onSave }: ModalFormPlanosProps) {

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="modal-description"
      >
        <DialogHeader>
          <DialogTitle>{selectedProduto ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          <DialogDescription>
            {selectedProduto ?
              "Altere os dados desejados e clique em salvar para atualizar o produto."
              : "Preencha as informações abaixo para adicionar um novo produto."}
          </DialogDescription>
        </DialogHeader>

        <ProdutoForm
          produto={selectedProduto}
          onSave={onSave}
          onCancel={() => {
            setIsFormOpen(false)
            setSelectedProduto(null)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}