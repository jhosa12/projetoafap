import { Button } from "@/components/ui/button"
import { HiOutlineExclamationCircle } from "react-icons/hi2"
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog"


interface DataProps{
    openModal:boolean
    setOpenModal:()=>void,
   handleConfirmar:()=>Promise<void>
   pergunta:string,
   children?:React.ReactNode
}

export function ModalConfirmar({openModal,setOpenModal,handleConfirmar,pergunta,children}:DataProps) {

  


    return (
        <Dialog  open={openModal} onOpenChange={setOpenModal}>
       
        <DialogContent >
          <DialogHeader />
          <div className="text-center space-y-4">
            <HiOutlineExclamationCircle color="red" className="mx-auto  h-14 w-14  " />
            <h3 className=" text-sm font-normal  dark:text-gray-400">
             {pergunta}
            </h3>
            {children}
            <div className="flex justify-center w-full gap-8">
              <Button size={'sm'} variant={'destructive'} onClick={handleConfirmar}>
                {"Sim, tenho certeza"}
              </Button>
              <Button size={'sm'} variant={'outline'} onClick={setOpenModal}>
                Não, cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    )

}