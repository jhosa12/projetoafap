


import { Button, Modal } from "flowbite-react"
import { HiOutlineExclamationCircle } from "react-icons/hi2"
import { Item } from "./dadosTitular"


interface DataProps{
    openModal:boolean,
    setOpenModal:(open:boolean)=>void,
    handleExcluir:()=>Promise<void>
}

export function ModalExcluir({openModal,setOpenModal,handleExcluir}:DataProps){
    return(
        <Modal dismissible show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Realmente deseja excluir esse lançamento?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() =>handleExcluir()}>
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