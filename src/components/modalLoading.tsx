import { Modal, Spinner } from "flowbite-react";



interface LoadingProps {
    show: boolean;
}



export function ModalLoading({show}:LoadingProps) {





    return(
        <Modal theme={{content:{inner:"bg-transparent"}}} show={show} >
            <Modal.Body className="flex justify-center">
          
                <Spinner color="gray" size="xl" />
            
            </Modal.Body>

        </Modal>
    )
}