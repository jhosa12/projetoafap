import { Button, Card, FloatingLabel, Modal } from "flowbite-react";
import { FechamentoProps } from "./conferencia";



interface DataProps{
    openModal:boolean,
    setOpenModal:(open:boolean)=>void,
    dadosCaixa:FechamentoProps|null
}




export function ModalConferencia({openModal,setOpenModal,dadosCaixa}:DataProps){

    return(
        <Modal size={'3xl'} show={openModal} onClose={()=>setOpenModal(false)} popup>
            <Modal.Header/>
            <Modal.Body>
                <div className="inline-flex w-full justify-between">
                    <Card>
                        <h5>Caixa Cadastrado </h5>
                        <FloatingLabel value={dadosCaixa?.caixaCad.cedulas}  variant="standard" label="CEDULA"/>
                        <FloatingLabel value={dadosCaixa?.caixaCad.pix} variant="standard" label="PIX"/>
                        <FloatingLabel value={dadosCaixa?.caixaCad.cartao} variant="standard" label="CARTÃO"/>
                        <FloatingLabel value={dadosCaixa?.caixaCad.transferencia} variant="standard" label="TRANSFERÊNCIA"/>

                      

                    </Card>

                    <Card>
                        <h5>Caixa Real</h5>
                        <FloatingLabel value={dadosCaixa?.caixaReal.cedulas} variant="standard" label="CEDULA"/>
                        <FloatingLabel value={dadosCaixa?.caixaReal.pix} variant="standard" label="PIX"/>
                        <FloatingLabel value={dadosCaixa?.caixaReal.cartao} variant="standard" label="CARTÃO"/>
                        <FloatingLabel value={dadosCaixa?.caixaReal.transferencia} variant="standard" label="TRANSFERÊNCIA"/>
                       

                    </Card>
                    <Card>
                        <h5>Caixa Verificado</h5>
                        <FloatingLabel variant="standard" label="CEDULA"/>
                        <FloatingLabel variant="standard" label="PIX"/>
                        <FloatingLabel variant="standard" label="CARTÃO"/>
                        <FloatingLabel variant="standard" label="TRANSFERÊNCIA"/>
                       

                    </Card>
       


                </div>
                
                <Button className="ml-auto mt-2">Salvar</Button>
            </Modal.Body>
        </Modal>
    )
}