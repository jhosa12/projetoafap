import { Modal, ModalHeader, TextInput } from "flowbite-react";
import { ChangeEvent } from "react";



interface DataProps{
    openModal:boolean,
    setOpen:(open:boolean)=>void
    produto:string,
    quantidade:number,
    setQuantidade:(quant:number)=>void
    handleQuantidadeChange:(e:ChangeEvent<HTMLInputElement>)=>void
}


export function ModalQuant({produto,quantidade,setQuantidade,handleQuantidadeChange,openModal,setOpen}:DataProps){


    return (
        <Modal dismissible show={openModal} onClose={()=>setOpen(false)} >
            <ModalHeader>{produto}</ModalHeader>
            <Modal.Body>
            <TextInput  value={quantidade===0?'':quantidade} onChange={e=>handleQuantidadeChange(e)}  placeholder="Alterar quantidade"  />
            </Modal.Body>
        </Modal>
    )
}