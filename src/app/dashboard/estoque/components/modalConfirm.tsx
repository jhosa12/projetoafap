import { Button, Modal } from "flowbite-react"
import { HiOutlineExclamationCircle } from "react-icons/hi2"


interface DataProps{
    open:boolean
    setOpen:(open:boolean)=>void
    status:string
    handleMovimentar:(status:string)=>Promise<void>
}


export function ModalConfirm({open, setOpen,status,handleMovimentar}:DataProps) {


    return (
        <Modal show={open} size="md" onClose={() => setOpen(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Confirma a <span className="font-semibold text-blue-600">{status}</span> do estoque?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleMovimentar(status)}>
                {"Sim, Eu confirmo"}
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                Não, Cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )

}