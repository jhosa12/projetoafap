import { Button, ButtonGroup, Table } from "flowbite-react";
import { MetasProps, SetorProps } from "../acompanhamento";
import useApiPost from "@/hooks/useApiPost";
import { useEffect, useState } from "react";
import { themeLight } from "@/components/admContrato/acordos/screen";
import { FaFilter } from "react-icons/fa6";
import { IoPrint } from "react-icons/io5";
import { ModalMetas } from "../modalMetas";
import { IoMdAddCircle } from "react-icons/io";
import { ModalFiltroMetas } from "../modalFiltro";


interface DataProps {
  
  
}



export function MetasVendas({}:DataProps) {

    const [modalFiltro,setModalFiltro] = useState(false)
    const [modalNovaMeta,setModalNovaMeta] = useState(false)
    const {data,postData} = useApiPost<Array<MetasProps>>("/vendas/filtroMetas")



    const handleFiltro = async (start:Date,end:Date) => {
        const payload = {
            start:start,
            end:end
        }
        await postData(payload)
    }






    return(

        <div className="flex flex-col w-full h-full px-4">
            {modalNovaMeta &&
             <ModalMetas 
            arrayMetas={[]}
            arraySetores={[]}
            dadosMetas={{}}
            novaMeta={async()=>{}}
            setModalMetas={setModalNovaMeta}
            show={modalNovaMeta}
            setarDadosMetas={()=>{}}/>}

            {
                modalFiltro && <ModalFiltroMetas
                dadosVendas={async()=>{}}
                endDate={new Date()}
                loading={false}
                setEndDate={()=>{}}
                setFiltro={setModalFiltro}
setStartDate={()=>{}}
startDate={new Date()}

                arraySetores={[]}
                dadosMetas={{}}
                show={modalFiltro}
                setarDadosMetas={()=>{}}/>
                }
            
   <ButtonGroup className="ml-auto">
                <Button theme={themeLight} onClick={()=>setModalFiltro(true)} type="button" color='light' size='xs'><FaFilter className='mr-1 h-4 w-4' />FILTRAR</Button>

                <Button theme={themeLight} onClick={()=>setModalNovaMeta(true)} type="button" color='light' size='xs'><IoMdAddCircle className='mr-1 h-4 w-4' />NOVA META</Button>

             

                <Button theme={themeLight}  onClick={()=>window.print()} color='light' size='xs'>  <IoPrint className='mr-1 h-4 w-4' /> IMPRIMIR</Button>
              
           
            
            </ButtonGroup>
       
        <div className="w-full  max-h-[350px]">
                            <Table
                             theme={{root:{shadow:'none'},body:{cell:{base:"px-6 py-1"}},head:{cell:{base:"px-6 py-1"}}}}>
                                <Table.Head >
                                        <Table.HeadCell>
                                            DESCRIÇÃO
                                        </Table.HeadCell>
                                        <Table.HeadCell >
                                            DATA INICIO
                                        </Table.HeadCell>
                                        <Table.HeadCell >
                                            DATA FIM.
                                        </Table.HeadCell>
                                        <Table.HeadCell >
                                            VALOR
                                        </Table.HeadCell>
                                        <Table.HeadCell >
                                            AÇÕES
                                        </Table.HeadCell>
                                    
                                </Table.Head>
                                <Table.Body  >
                                    {data?.map((item, index) => (
                                        <Table.Row key={index}>
                                            <Table.Cell >
                                                {item.descricao}
                                            </Table.Cell>
                                            <Table.Cell >
                                                {new Date(item.date || '').toLocaleDateString()}
                
                                            </Table.Cell>
                
                                            <Table.Cell >
                                                {new Date(item.dateFimMeta || '').toLocaleDateString()}
                                            </Table.Cell>
                                            <Table.Cell >
                                                {Number(item.valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
                                            </Table.Cell>
                                            <Table.Cell >
                                                {item.id_grupo}
                                            </Table.Cell>
                
                                        </Table.Row>
                
                                    ))}
                
                                </Table.Body>
                
                            </Table>
                        </div>

                        </div>
    )
}