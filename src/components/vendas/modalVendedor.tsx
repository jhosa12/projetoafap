
import { Avatar, List, Modal, Spinner, Table } from "flowbite-react";
import { HiCheckCircle } from "react-icons/hi2";
import { ConsultorLeads, VendasProps } from "./acompanhamento";
import useApiPost from "@/hooks/useApiPost";
import { useEffect } from "react";

interface DataProps{
    show:boolean,
    setModalVend:(open:boolean)=>void
    vendedor:VendasProps,
    startDate:Date,
    endDate:Date,
    leads:Array<ConsultorLeads>
}



interface ResumoVendedorProps{
    adesoes:Array<{
        id_contrato:number,
        dt_adesao:Date,
        situacao:string,
        associado:{nome:string},
        valor_mensalidade:number
    }>,
    leads:Array<{
        id_lead:number,
        data:Date,
        status:string,
        nome:string
    }>
}








export function ModalVendedor({endDate,setModalVend,show,startDate,vendedor,leads}:DataProps){


    const {data,postData,loading} = useApiPost<ResumoVendedorProps,{startDate:Date,endDate:Date,id_consultor:number|null,consultor:string}>("/vendas/resumoVendedor")



    useEffect(()=>{

        postData({startDate,endDate,id_consultor:vendedor.id_consultor,consultor:vendedor.consultor})

    },[])


  

    return(
        <Modal dismissible size={'2xl'} show={show} onClose={() => setModalVend(false)}>
        <Modal.Header >
           
           
            <div className='flex flex-col'>
           <span>{vendedor?.consultor}</span> 
           <span className='text-xs'>Periodo: {new Date(startDate).toLocaleDateString('pt-BR',{timeZone:'UTC'})} - {new Date(endDate).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
            </div>
        
           
           
            </Modal.Header>
        <Modal.Body>
       {loading?<Spinner/>:<div>
        <Table theme={{ body: { cell: { base: " px-6 py-2  text-xs text-black" } } }} >
        <Table.Head style={{fontSize:'9px'}} >
        <Table.HeadCell>CONTRATO</Table.HeadCell>
          <Table.HeadCell>DATA</Table.HeadCell>
          <Table.HeadCell>NOME</Table.HeadCell>
          <Table.HeadCell>STATUS</Table.HeadCell>
          <Table.HeadCell>VALOR</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {data?.adesoes?.map((item) => (
            <Table.Row key={item.id_contrato}>
                 <Table.Cell>{item.id_contrato}</Table.Cell>
              <Table.Cell>{new Date(item.dt_adesao).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</Table.Cell>   
              <Table.Cell>{item.associado.nome}</Table.Cell>
              <Table.Cell>{item.situacao}</Table.Cell>
              <Table.Cell>{Number(item.valor_mensalidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
       </div> }
        </Modal.Body>
    </Modal>

    )
}