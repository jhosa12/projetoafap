





import { Button, Modal } from "flowbite-react"
import { HiOutlineExclamationCircle } from "react-icons/hi2"



interface DataProps{
    openModal:boolean,
    setOpenModal:(open:boolean)=>void,
    handleRenovar:()=>Promise<void>
}

export function ModalRenovar({openModal,setOpenModal,handleRenovar}:DataProps){
    return(
        <Modal dismissible show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Confirma a renovação dos contratos na tabela?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() =>handleRenovar()}>
                {"Sim, tenho certeza"}
              </Button>
              <Button  color="gray" onClick={() => setOpenModal(false)}>
                Não, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
}