
import { api } from "@/services/apiClient";
import { Button, FloatingLabel, Modal, ModalHeader } from "flowbite-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LancamentosProps } from "../../pages/caixa";
import { ajustarData } from "@/utils/ajusteData";


interface DataProps{
    openModal:boolean,
    listar:Function
    setOpenModal:(open:boolean)=>void,
    id_usuario:string,
    id_empresa:string,
    lancamentos:Array<LancamentosProps>
    dataCaixa:Date
    dataCaixaEnd:Date
}


interface ValoresProps{
    pix:number,
    cedulas:number,
    cartao:number,
    transferencia:number
}


export function ModalFechamento({openModal,setOpenModal,id_usuario,lancamentos,id_empresa,dataCaixa,dataCaixaEnd,listar}:DataProps){
    const [valores,setValores] = useState<ValoresProps>({cartao:0,cedulas:0,pix:0,transferencia:0})
    const [valoresCaixa,setValorCaixa] = useState<ValoresProps>({cartao:0,cedulas:0,pix:0,transferencia:0})
 // const [observacao,setObs] = useState<string>('')
    


useEffect(
    ()=>{
    
      const real:ValoresProps = lancamentos?.reduce((acc,at)=>{
     if(at.tipo==='RECEITA'){
        acc.cedulas+=Number(at.valor)
     }
     if(at.tipo==='DESPESA'){
        acc.cedulas-=Number(at.valor)
     }
     if(at.notafiscal==='PIX' ){
       at.tipo==='RECEITA' ? acc.pix-=Number(at.valor):acc.pix+=Number(at.valor)
     }
     if(at.descricao==='CARTAO' ){
        at.tipo==='RECEITA' ? acc.cartao-=Number(at.valor):acc.cartao+=Number(at.valor)
      }
      if(at.descricao==='TRANSFERENCIA' ){
        at.tipo==='RECEITA' ? acc.transferencia-=Number(at.valor):acc.transferencia+=Number(at.valor)
      }
        return acc
      },{cartao:0,cedulas:0,pix:0,transferencia:0} as ValoresProps)

     setValorCaixa(real)
    },[lancamentos]
)


    const handleFecharCaixa =async()=>{

        if(dataCaixa>dataCaixaEnd){
            toast.error('Data de fechamento inválida!')
            return
        }

        const dtFecha = new Date()
        const data = new Date(dataCaixa)

        data.setTime(data.getTime() - data.getTimezoneOffset() * 60 * 1000);
        dtFecha.setTime(dtFecha.getTime() - dtFecha.getTimezoneOffset() * 60 * 1000);



       const {dataIni,dataFim} =  ajustarData(data,data)

       

        try {
            const response = await api.post('/caixa/fechar',{
                id_usuario,
                id_empresa,
                caixaCad:valores,
                data:data.toISOString(),
                observacao:'teste',
                caixaReal:valoresCaixa,
                dataFecha:dtFecha.toISOString(),
                startDate:dataIni,
                endDate:dataFim
              
            })
            toast.success('Caixa Fechado!')
           // setFechamento(true)
            listar()
            setOpenModal(false)
        } catch (error:any) {
            console.log(error)
            toast.error(error.response?.data?.error || 'Erro inesperado!')
        }
        
    }
   
    return(
        <>
        <Modal show={openModal} onClose={()=>setOpenModal(false)}>
            <ModalHeader>Fechar Caixa</ModalHeader>
            <Modal.Body>
                <div className="space-x-8 inline-flex text-black font-semibold mb-2">
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