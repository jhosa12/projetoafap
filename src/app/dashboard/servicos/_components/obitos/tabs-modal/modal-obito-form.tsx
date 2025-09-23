
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ObitoProps } from "../../../_types/obito"
import { ObitoForm } from "./obitoForm/obito-form"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { ModalBusca } from "@/components/modals/modalBusca/modalBusca"
import { Dispatch, SetStateAction, useContext, useState } from "react"
import { AuthContext } from "@/store/AuthContext"
import { SubmitHandler } from "react-hook-form"

interface ModalObitoFormProps{
    isFormOpen:boolean,
    setIsFormOpen:(open:boolean)=>void
    selectedObito:ObitoProps|null
    setSelectedObito:Dispatch<SetStateAction<ObitoProps>>
    selectEmp:string,
    onSave: SubmitHandler<ObitoProps>

}

export const ModalObitoForm = ({isFormOpen,selectedObito,setIsFormOpen,setSelectedObito,selectEmp,onSave}:ModalObitoFormProps)=>{
  const [openBusca,setOpenBusca] = useState(false)
  const {dadosassociado,carregarDados} = useContext(AuthContext)



    return(
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-[95vw] !max-h-[93vh] overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle>{selectedObito ? "Editar Óbito" : "Novo Óbito"}</DialogTitle>

            <DialogDescription asChild>
              <div className="flex w-full justify-between ">
              Preencha os dados do óbito. Todos os campos marcados com * são obrigatórios.
              <Button onClick={()=>setOpenBusca(true)} variant={'outline'} size={'sm'} className="text-black">
                <Search/>
                Buscar Associado
              </Button>
              </div>
              
            </DialogDescription>
          </DialogHeader>
          <ObitoForm
            obito={selectedObito}
            onSave={onSave}
            onCancel={() => {
              setIsFormOpen(false)
              setSelectedObito({} as ObitoProps)
            }}
          />
          <ModalBusca visible={openBusca} carregarDados={carregarDados} selectEmp={selectEmp}  setVisible={()=>setOpenBusca(false)}   />
        </DialogContent>
      </Dialog>

    )
}