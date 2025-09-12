
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ObitoProps } from "../../../_types/obito"
import { ObitoForm } from "./obitoForm/obito-form"
import { boolean } from "zod"

interface ModalObitoFormProps{
    isFormOpen:boolean,
    setIsFormOpen:(open:boolean)=>void
    selectedObito:ObitoProps|null
    setSelectedObito:(obito:ObitoProps|null)=>void

}

export const ModalObitoForm = ({isFormOpen,selectedObito,setIsFormOpen,setSelectedObito}:ModalObitoFormProps)=>{


    const handleSaveObito = ()=>{

    }

    return(
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="!max-w-[98vw] !max-h-[93vh] overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle>{selectedObito ? "Editar Óbito" : "Novo Óbito"}</DialogTitle>
            <DialogDescription>
              Preencha os dados do óbito. Todos os campos marcados com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          <ObitoForm
            obito={selectedObito}
            onSave={handleSaveObito}
            onCancel={() => {
              setIsFormOpen(false)
              setSelectedObito(null)
            }}
          />
        </DialogContent>
      </Dialog>

    )
}