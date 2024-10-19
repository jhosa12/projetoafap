import { Modal } from "flowbite-react"




interface DataProps{
    openModal:boolean
    setOpenModal:(open:boolean)=>void
}

export function ModalNovaEmpresa({openModal,setOpenModal}:DataProps) {
    return (
        <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} >
            <Modal.Header>Criar nova empresa</Modal.Header>

        </Modal>
    )


}