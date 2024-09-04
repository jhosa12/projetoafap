import { VendasProps } from "@/pages/vendas";
import { Avatar, List, Modal } from "flowbite-react";
import { HiCheckCircle } from "react-icons/hi2";

interface DataProps{
    show:boolean,
    setModalVend:(open:boolean)=>void
    vendedor:VendasProps,
    startDate:Date,
    endDate:Date,
}

export function ModalVendedor({endDate,setModalVend,show,startDate,vendedor}:DataProps){



    return(
        <Modal dismissible size={'md'} show={show} onClose={() => setModalVend(false)}>
        <Modal.Header >
            <div className='inline-flex items-center gap-2'>
            <Avatar size={'md'} rounded img={'/fototeste.jpeg'}/>
            <div className='flex flex-col'>
           <span>{vendedor?.consultor}</span> 
           <span className='text-xs'>Periodo: {new Date(startDate).toLocaleDateString('pt-BR',{timeZone:'UTC'})} - {new Date(endDate).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
            </div>
        
            </div>
           
            </Modal.Header>
        <Modal.Body>
        <List>
<List.Item icon={HiCheckCircle}>{vendedor?._sum.valor_mensalidade}</List.Item>
<List.Item icon={HiCheckCircle}>At least one lowercase character</List.Item>
<List.Item icon={HiCheckCircle}>Inclusion of at least one special character, e.g., ! @ # ?</List.Item>
</List>
        </Modal.Body>
    </Modal>

    )
}