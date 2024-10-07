import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";


interface DataProps {
    openModal: boolean
    setOpenModal: any
    handleExcluirMensalidade: ()=>Promise<void>
}


export function ModalExcluirMens({openModal,setOpenModal,handleExcluirMensalidade}:DataProps) {
    return (
        <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
            <Modal.Header>
               
            </Modal.Header> 
            <Modal.Body>
            <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-4 text-lg font-normal text-gray-500 dark:text-gray-400">
              Realmente deseja excluir a(s) mensalidade(s)?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleExcluirMensalidade()}>
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