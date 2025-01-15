
import { Avatar, List, Modal } from "flowbite-react";
import { HiCheckCircle } from "react-icons/hi2";
import { ConsultorLeads, VendasProps } from "./acompanhamento";

interface DataProps{
    show:boolean,
    setModalVend:(open:boolean)=>void
    vendedor:VendasProps,
    startDate:Date,
    endDate:Date,
    leads:Array<ConsultorLeads>
}

export function ModalVendedor({endDate,setModalVend,show,startDate,vendedor,leads}:DataProps){



    return(
        <Modal dismissible size={'md'} show={show} onClose={() => setModalVend(false)}>
        <Modal.Header >
           
           
            <div className='flex flex-col'>
           <span>{vendedor?.consultor}</span> 
           <span className='text-xs'>Periodo: {new Date(startDate).toLocaleDateString('pt-BR',{timeZone:'UTC'})} - {new Date(endDate).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
            </div>
        
           
           
            </Modal.Header>
        <Modal.Body>
        <List>
<List.Item icon={HiCheckCircle}>LEADS: {}</List.Item>
<List.Item icon={HiCheckCircle}>PROSPECÇÕES</List.Item>
<List.Item icon={HiCheckCircle}>PRE VENDAS</List.Item>
</List>
        </Modal.Body>
    </Modal>

    )
}