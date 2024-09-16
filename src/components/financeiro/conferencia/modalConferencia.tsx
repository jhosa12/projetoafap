import { Button, Card, FloatingLabel, Modal } from "flowbite-react";
import { FechamentoProps } from "./conferencia";



interface DataProps{
    openModal:boolean,
    setOpenModal:(open:boolean)=>void,
    dadosCaixa:Partial<FechamentoProps>,
    setDadosCaixa:(fields:Partial<FechamentoProps>)=>void,
    handleAtualizar:()=>Promise<void>
}




export function ModalConferencia({openModal,setOpenModal,dadosCaixa,setDadosCaixa,handleAtualizar}:DataProps){





    return(
        <Modal size={'3xl'} show={openModal} onClose={()=>setOpenModal(false)} popup>
            <Modal.Header/>
            <Modal.Body>
                <div className="inline-flex w-full justify-between">
                    <Card>
                        <h5>Caixa Cadastrado </h5>
                        <FloatingLabel onChange={e=>setDadosCaixa({...dadosCaixa,caixaCad:{...dadosCaixa?.caixaCad,cedulas:Number(e.target.value)}})} value={dadosCaixa?.caixaCad?.cedulas}  variant="standard" label="CEDULA"/>
                        <FloatingLabel value={dadosCaixa?.caixaCad?.pix}  onChange={e=>setDadosCaixa({...dadosCaixa,caixaCad:{...dadosCaixa?.caixaCad,pix:Number(e.target.value)}})}  variant="standard" label="PIX"/>
                        <FloatingLabel value={dadosCaixa?.caixaCad?.cartao} onChange={e=>setDadosCaixa({...dadosCaixa,caixaCad:{...dadosCaixa?.caixaCad,cartao:Number(e.target.value)}})} variant="standard" label="CARTÃO"/>
                        <FloatingLabel value={dadosCaixa?.caixaCad?.transferencia} onChange={e=>setDadosCaixa({...dadosCaixa,caixaCad:{...dadosCaixa?.caixaCad,transferencia:Number(e.target.value)}})} variant="standard" label="TRANSFERÊNCIA"/>

                      

                    </Card>

                    <Card>
                        <h5>Caixa Real</h5>
                        <FloatingLabel value={dadosCaixa?.caixaReal?.cedulas}  onChange={e=>setDadosCaixa({...dadosCaixa,caixaReal:{...dadosCaixa?.caixaReal,cedulas:Number(e.target.value)}})} variant="standard" label="CEDULA"/>
                        <FloatingLabel value={dadosCaixa?.caixaReal?.pix}  onChange={e=>setDadosCaixa({...dadosCaixa,caixaReal:{...dadosCaixa?.caixaReal,pix:Number(e.target.value)}})}  variant="standard" label="PIX"/>
                        <FloatingLabel value={dadosCaixa?.caixaReal?.cartao}  onChange={e=>setDadosCaixa({...dadosCaixa,caixaReal:{...dadosCaixa?.caixaReal,cartao:Number(e.target.value)}})}  variant="standard" label="CARTÃO"/>
                        <FloatingLabel value={dadosCaixa?.caixaReal?.transferencia}  onChange={e=>setDadosCaixa({...dadosCaixa,caixaReal:{...dadosCaixa?.caixaReal,transferencia:Number(e.target.value)}})}  variant="standard" label="TRANSFERÊNCIA"/>
                       

                    </Card>
                    <Card>
                        <h5>Caixa Verificado</h5>
                        <FloatingLabel value={dadosCaixa.caixaVerif?.cedulas}  onChange={e=>setDadosCaixa({...dadosCaixa,caixaVerif:{...dadosCaixa?.caixaVerif,cedulas:Number(e.target.value)}})}  variant="standard" label="CEDULA"/>
                        <FloatingLabel value={dadosCaixa.caixaVerif?.pix} onChange={e=>setDadosCaixa({...dadosCaixa,caixaVerif:{...dadosCaixa?.caixaVerif,pix:Number(e.target.value)}})} variant="standard" label="PIX"/>
                        <FloatingLabel value={dadosCaixa.caixaVerif?.cartao} onChange={e=>setDadosCaixa({...dadosCaixa,caixaVerif:{...dadosCaixa?.caixaVerif,cartao:Number(e.target.value)}})} variant="standard" label="CARTÃO"/>
                        <FloatingLabel value={dadosCaixa.caixaVerif?.transferencia} onChange={e=>setDadosCaixa({...dadosCaixa,caixaVerif:{...dadosCaixa?.caixaVerif,transferencia:Number(e.target.value)}})} variant="standard" label="TRANSFERÊNCIA"/>
                       

                    </Card>
       


                </div>
                
                <Button onClick={handleAtualizar} className="ml-auto mt-2">Salvar</Button>
            </Modal.Body>
        </Modal>
    )
}