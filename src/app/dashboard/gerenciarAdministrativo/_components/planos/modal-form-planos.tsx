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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Dispatch, SetStateAction, useState } from "react"
import { PlanosForm } from "./planos-form"
import { SubmitHandler } from "react-hook-form"
import { PlanosProps } from "@/types/planos"

interface ModalFormPlanosProps {
  isFormOpen: boolean,
  setIsFormOpen: (open: boolean) => void
  selectedPlano: PlanosProps | null
  setSelectedPlano: Dispatch<SetStateAction<PlanosProps | null>>
  onSave: SubmitHandler<PlanosProps>
}


export default function ModalFormPlanos({isFormOpen, setIsFormOpen, selectedPlano, setSelectedPlano, onSave }: ModalFormPlanosProps) {

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="modal-description"
      >
        <DialogHeader>
          <DialogTitle>{selectedPlano ? "Editar Plano" : "Novo Plano"}</DialogTitle>
          <DialogDescription>
            {selectedPlano ?
              "Altere os dados desejados e clique em salvar para atualizar o plano."
              : "Preencha as informações abaixo para cadastrar um novo plano."}
          </DialogDescription>
        </DialogHeader>

        <PlanosForm
          plano={selectedPlano}
          onSave={onSave}
          onCancel={() => {
            setIsFormOpen(false)
            setSelectedPlano(null)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}