import { roboto_Mono } from "@/fonts/fonts"
import { Button, Modal } from "flowbite-react"
import { HiOutlineExclamationCircle } from "react-icons/hi2"


interface DataProps{
    openModal:boolean
    setOpenModal:(open:boolean)=>void,
   handleConfirmar:()=>Promise<void>
   pergunta:string
}

export function ModalConfirmar({openModal,setOpenModal,handleConfirmar,pergunta}:DataProps) {


    return (
        <Modal className={roboto_Mono.className} show={openModal} size="lg" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle color="red" className="mx-auto mb-4 h-14 w-14  " />
            <h3 className="mb-5 text-lg font-normal  dark:text-gray-400">
             {pergunta}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleConfirmar}>
                {"Sim, tenho certeza"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Não, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

    )

}