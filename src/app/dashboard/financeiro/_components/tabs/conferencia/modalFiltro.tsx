import { Modal } from "flowbite-react";



interface ModalFiltroProps{
    show:boolean,
    onClose:()=>void
}


export function ModalFiltroConferencia({onClose,show}:ModalFiltroProps){







    return(
        <Modal show={show} onClose={onClose} popup>
            <Modal.Header  > Filtro </Modal.Header>

            <Modal.Body>

            </Modal.Body>

        </Modal>
    )
}
