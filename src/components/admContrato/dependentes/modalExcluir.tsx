
import { AuthContext } from "@/contexts/AuthContext";
import { Button, Modal, TextInput } from "flowbite-react";
import { useContext } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { toast } from "react-toastify";


interface DataProps {
    openModal: boolean,
    setOpenModal: (open: boolean) => void
    excluirDep:()=>Promise<void>
}


export function ModalExcluirDep({ openModal, setOpenModal,excluirDep }: DataProps) {
const {data,closeModa}= useContext(AuthContext)


    return (
        <Modal dismissible show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
            <Modal.Header />
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    {`Realmente deseja deletar ${data.dependente?.nome} ?`}
                    </h3>
                    <div className="flex flex-col justify-center gap-4">
                            <TextInput placeholder="Informe o motivo da exclusão" autoComplete='off' value={data.dependente?.exclusao_motivo} onChange={e => closeModa({ dependente: { ...data.dependente, exclusao_motivo: e.target.value } })} type="text" required  />
                        
                       

<div className="inline-flex  justify-between">
                        <Button color="failure" onClick={() => {
                        if(!data.dependente?.exclusao_motivo){
                            toast.info('Informe o motivo!')
                            return
                        }
                            excluirDep()
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