
import { AuthContext } from "@/store/AuthContext";
import { Button, Modal, TextInput } from "flowbite-react";
import { useContext, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { toast } from "react-toastify";


interface DataProps {
    openModal: boolean,
    setOpenModal: (open: boolean) => void
    excluirDep:(motivo:string)=>Promise<void>
    nome:string
    
}


export function ModalExcluirDep({ openModal, setOpenModal,excluirDep,nome }: DataProps) {
const [motivoExclusao, setMotivoExclusao] = useState('')


    return (
        <Modal dismissible show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
            <Modal.Header />
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    {`Realmente deseja deletar ${nome} ?`}
                    </h3>
                    <div className="flex flex-col justify-center gap-4">
                            <TextInput placeholder="Informe o motivo da exclusão" autoComplete='off' value={motivoExclusao} onChange={e => setMotivoExclusao(e.target.value)} type="text" required  />
                        
                       

<div className="inline-flex  justify-between">
                        <Button color="failure" onClick={() => {
                        if(!motivoExclusao){
                            toast.info('Informe o motivo!')
                            return
                        }
                            excluirDep(motivoExclusao)
                        }
                            }>
                            {"Sim, tenho certeza"}
                        </Button>
                        <Button color="gray" onClick={() => setOpenModal(false)}>
                            Não, cancelar
                        </Button>
                        </div>
                        </div>
                   
                </div>
            </Modal.Body>
        </Modal>
    )
}