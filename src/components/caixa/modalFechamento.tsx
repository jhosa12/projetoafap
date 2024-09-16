
import { api } from "@/services/apiClient";
import { Button, FloatingLabel, Modal, ModalHeader } from "flowbite-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LancamentosProps } from "../../pages/caixa";





interface DataProps{
    openModal:boolean,
    setOpenModal:(open:boolean)=>void,
    id_usuario:string,
    lancamentos:Array<LancamentosProps>
}


interface ValoresProps{
    pix:number,
    cedulas:number,
    cartao:number,
    transferencia:number
}


export function ModalFechamento({openModal,setOpenModal,id_usuario,lancamentos}:DataProps){
    const [valores,setValores] = useState<ValoresProps>({cartao:0,cedulas:0,pix:0,transferencia:0})
    const [valoresCaixa,setValorCaixa] = useState<ValoresProps>({cartao:0,cedulas:0,pix:0,transferencia:0})
    const [observacao,setObs] = useState<string>('')
    


useEffect(
    ()=>{
    
      const real:ValoresProps = lancamentos?.reduce((acc,at)=>{
        if(at.mensalidade?.form_pagto==='PIX'){
            acc.pix+=Number(at.valor)
        }else   if(at.mensalidade?.form_pagto==='DINHEIRO'){
            acc.cedulas+=Number(at.valor)
        }
        else   if(at.mensalidade?.form_pagto==='CARTAO'){
            acc.cartao+=Number(at.valor)
        }
        else   if(at.mensalidade?.form_pagto==='TRANSFERENCIA'){
            acc.transferencia+=Number(at.valor)
        }
        return acc
      },{cartao:0,cedulas:0,pix:0,transferencia:0} as ValoresProps)

     setValorCaixa(real)
    },[lancamentos]
)


    const handleFecharCaixa =async()=>{

        try {
            const response = await api.post('/caixa/fechar',{
                id_usuario,
                caixaCad:valores,
                data:new Date().toISOString(),
                observacao:'teste',
                caixaReal:valoresCaixa
              
            })
            toast.success('Caixa Fechado!')
        } catch (error) {
            toast.error('Erro ao fechar, consulte o TI')
        }
        
    }
   
    return(
        <>
        <Modal show={openModal} onClose={()=>setOpenModal(false)}>
            <ModalHeader>Fechar Caixa</ModalHeader>
            <Modal.Body>
                <div className="space-x-8 inline-flex">
                    <FloatingLabel variant="standard" value={valores.cedulas} onChange={e=>setValores({...valores,cedulas:Number(e.target.value)})} label="Cédulas (R$)"/>
                    <FloatingLabel variant="standard" value={valores.pix} onChange={e=>setValores({...valores,pix:Number(e.target.value)})}  label="Pix (R$)"/>
                    <FloatingLabel variant="standard" value={valores.cartao} onChange={e=>setValores({...valores,cartao:Number(e.target.value)})}  label="Cartão (R$)"/>
                    <FloatingLabel variant="standard" value={valores.transferencia} onChange={e=>setValores({...valores,transferencia:Number(e.target.value)})} label="Transferência (R$)"/>
                </div>
                <FloatingLabel variant="standard"  label="Observação (opcional)"/>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleFecharCaixa}>Salvar</Button>
            </Modal.Footer>

        </Modal>
        </>
    )
}