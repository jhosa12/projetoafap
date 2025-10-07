
import { Button, Modal, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import { ContaProps } from "./contasPagarReceber";
import { PlanoContasProps } from "../../../_types/types";



interface DataProps{
    planoContas:Array<PlanoContasProps>
    openModal:boolean,
    setOpen:(open:boolean)=>void
    dadosConta:Partial<ContaProps>
}



export function ModalRecPag({openModal,planoContas,setOpen,dadosConta}:DataProps){

    const [conta,setConta]  =useState<string>()


    return(
        <Modal show={openModal} onClose={()=>setOpen(false)} popup>
            <Modal.Header/>
            <Modal.Body>
                <div className="space-y-4">
                <h1>Selecione a conta de destino</h1>
                <Select value={conta} onChange={e=>setConta(e.target.value)}>
                    <option value={''}>Conta</option>
                    {planoContas?.map(item=>(
                        <option value={item.conta} key={item.conta}>{item.descricao}</option>
                    ))}
                </Select>
                <Button className="ml-auto">{dadosConta?.tipo}</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}