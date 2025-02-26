
import { Modal, Spinner, Table } from "flowbite-react";
import { ConsultorLeads, VendasProps } from "./acompanhamento";
import useApiPost from "@/hooks/useApiPost";
import { useEffect, useRef, useState } from "react";
import { MdCall, MdPrint } from "react-icons/md";
import { BiSolidUserPlus } from "react-icons/bi";
import { IoArchive } from "react-icons/io5";
import ResumoVendedor from "@/Documents/vendas/ResumoVendedor";
import { useReactToPrint } from "react-to-print";
import pageStyle from "@/utils/pageStyle";
import { Button } from "../ui/button";

interface DataProps{
    show:boolean,
    setModalVend:(open:boolean)=>void
    vendedor:VendasProps,
    startDate:Date,
    endDate:Date,
    leads:Array<ConsultorLeads>
    usuario:string
}


export interface AdesaoProps{
    id_contrato:number,
    dt_adesao:Date,
    situacao:string,
    associado:{nome:string},
    valor_mensalidade:number
}



interface ResumoVendedorProps{
    adesoes:Array<AdesaoProps>,
    leads:Array<{
        id_lead:number,
        data:Date,
        status:string,
        nome:string
    }>

}


export function ModalVendedor({endDate,setModalVend,show,startDate,vendedor,usuario}:DataProps){


    const {data,postData,loading} = useApiPost<ResumoVendedorProps,{startDate:Date,endDate:Date,id_consultor:number|null,consultor:string}>("/vendas/resumoVendedor")
    const componenteRef = useRef<ResumoVendedor>(null);
    const [print,setPrint] = useState(false)


    useEffect(()=>{

        postData({startDate,endDate,id_consultor:vendedor.id_consultor,consultor:vendedor.consultor})

    },[])


    useEffect(()=>{
        print && handlePrint()

    },[print])


    const handlePrint = useReactToPrint({
        content:()=>componenteRef.current,
        pageStyle:pageStyle,
        onBeforeGetContent:()=>setPrint(false),
    })


    return(
        <>

        <div style={{display:'none'}}>
          {print &&  <ResumoVendedor usuario={usuario} endDate={endDate} startDate={startDate} vendedor={vendedor.consultor} adesoes={data?.adesoes??[]} ref={componenteRef} />}
        </div>
        <Modal dismissible size={'3xl'} show={show} onClose={() => setModalVend(false)}>
        <Modal.Header >
           
           
          {  <div className='flex flex-col'>
           <span>{vendedor?.consultor}</span> 
           <span className='text-xs'>Periodo: {new Date(startDate).toLocaleDateString('pt-BR',{timeZone:'UTC'})} - {new Date(endDate).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
            </div>}
        
           
           
            </Modal.Header>
        <Modal.Body>
       {loading?<Spinner/>
       :
       <div className="space-y-2">
        <div>
            <ul className="inline-flex w-full justify-between text-xs">
                
                   
                        <li className=" inline-flex gap-2 justify-center items-center bg-blue-600 p-2 text-white rounded-lg">

                            <div className="border-[1px] p-1 rounded-lg">
                            <MdCall  size={20}/>
                            </div>
                            

                            <div className="flex flex-col ">
                            <span>LEADS</span>
                            {data?.leads.reduce((total, lead) => {
                                if (lead.status === 'LEAD') {
                                    return total + 1;
                                }
                                return total;
                            },0)}
                            </div>
                        </li>

                        <li className=" inline-flex gap-2 justify-center items-center bg-blue-600 p-2 text-white rounded-lg">

                        <div className="border-[1px] p-1 rounded-lg">
                            <BiSolidUserPlus  size={21}/>
                            </div>
                            <div className="flex flex-col">
                                <span>PROSPECÇÕES</span>
                                {data?.leads.reduce((total, lead) => {
                                if (lead.status === 'PROSPECCAO') {
                                    return total + 1;
                                }
                                return total;
                            },0)}
                            </div>
                           
                            </li>

                        <li className=" inline-flex gap-2 justify-center items-center bg-blue-600 p-2 text-white rounded-lg">
                        <div className="border-[1px] p-1 rounded-lg">
                            <IoArchive  size={21}/>
                            </div>
                            <div className="flex flex-col">
                            <span>PRÉ VENDAS</span> 
                            {data?.leads.reduce((total, lead) => {
                                if (lead.status === 'PREV VENDA') {
                                    return total + 1;
                                }
                                return total;
                            },0)}
                            </div>
                           
                        </li>
                   
                
            </ul>
        </div>
        <Table theme={{ body: { cell: { base: " px-6 py-2  text-[10px] text-black" } },root:{shadow:'none'},head:{cell:{base:"px-6 py-2 text-[9px] text-black font-semibold"}} }} >
        <Table.Head  >
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

        <Table.Row >
                 <Table.Cell>TOTAL: {data?.adesoes?.length}</Table.Cell>
              <Table.Cell>{}</Table.Cell>   
              <Table.Cell>{}</Table.Cell>
              <Table.Cell>{}</Table.Cell>
              <Table.Cell>{}</Table.Cell>
            </Table.Row>
       
      </Table>
       </div> }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" className="ml-auto" onClick={()=>setPrint(!print)}>
            <MdPrint />
            Imprimir Resumo
            </Button>
        </Modal.Footer>
    </Modal>
    </>
    )
}