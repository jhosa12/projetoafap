import { Button } from "@/components/ui/button"
import { HiOutlineExclamationCircle } from "react-icons/hi2"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


interface DataProps{
    openModal:boolean
    setOpenModal:()=>void,
   handleConfirmar:()=>Promise<void>
   pergunta:string,
   children?:React.ReactNode
}

export function ModalConfirmar({ openModal, setOpenModal, handleConfirmar, pergunta, children }: DataProps) {

  return (
    <AlertDialog open={openModal} onOpenChange={setOpenModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
          <div className="text-center space-y-4">
          <HiOutlineExclamationCircle color="red" className="mx-auto h-14 w-14" />
            Confirmar ação
            </div>
            </AlertDialogTitle>
          <AlertDialogDescription className="flex justify-center">
            
             
              {pergunta}
              
            
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter className="sm:justify-center gap-4">
          <AlertDialogAction asChild>
            <Button color="red" size={'sm'} variant={'destructive'} onClick={handleConfirmar}>
              {"Sim, tenho certeza"}
            </Button>
          </AlertDialogAction>
          <AlertDialogCancel asChild>
            <Button size={'sm'} variant={'outline'} onClick={setOpenModal}>
              {"Não, cancelar"}
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}