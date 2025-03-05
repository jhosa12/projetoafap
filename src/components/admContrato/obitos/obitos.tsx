
import DocumentTemplate from "@/Documents/associado/carteiraAssociado/DocumentTemplate";
import { ObitoProps } from "@/types/associado";
import { Table } from "flowbite-react";
import { IoPrint } from "react-icons/io5";
import {useReactToPrint} from "react-to-print";








interface DadosProps{
    obitos:Array<Partial<ObitoProps>>,
   
  }









export default function ObitosAssociado({obitos}:DadosProps){
   
    
    
    return (
        <div className="flex flex-col w-full p-2">
         
        
          
            <div className="flex max-h-[calc(100vh-250px)]" id="DIV DA TABELA">
            <Table theme={{root:{shadow:'none'}, body: { cell: { base: " px-6 py-2  text-xs text-black font-semibold" } },head:{cell:{base:"px-6 py-2 text-xs text-black font-semibold"}} }}>
                                    <Table.Head className="sticky top-0">
                                       
                                            <Table.HeadCell scope="col" className=" px-2 py-1">
                                                FALECIDO
                                            </Table.HeadCell>
                                          
                                            <Table.HeadCell scope="col" className="px-12 py-1">
                                                DATA NASC.
                                            </Table.HeadCell>
                                            <Table.HeadCell scope="col" className="px-12 py-1">
                                                DATA FALECIMENTO
                                            </Table.HeadCell>
                                            <Table.HeadCell scope="col" className="px-12 py-1">
                                                HORA FALECIMENTO
                                            </Table.HeadCell>
                                            <Table.HeadCell scope="col" className="px-12 py-1">
                                                LOCAL FALECIMENTO
                                            </Table.HeadCell>
                                       
                                      </Table.Head> 
                                      <Table.Body>
                                        {obitos.map((item,index)=>(
                                            <Table.Row  className={`cursor-pointer hover:bg-gray-200  border-b border-gray-300`}>
                                           
                                            <Table.Cell >
                                            {item.nome_falecido}
                                        </Table.Cell>
                                            <Table.Cell >
                                                        {item.data_nascimento
                                                         && new Date(item.data_nascimento).toLocaleDateString()}
                                                    </Table.Cell>
                                          
                                        <Table.Cell >
                                        {item.end_data_falecimento
                                                         && new Date(item.end_data_falecimento).toLocaleDateString()}
                                                    </Table.Cell>
                                                    <Table.Cell >
                                                        {item.end_hora_falecimento && new Date(item.end_hora_falecimento).toLocaleTimeString()}
                                                    </Table.Cell>
                                                    <Table.Cell >
                                        {item.end_local_falecimento}
                                                    </Table.Cell>
                                        </Table.Row>
                                        ))}
                                      </Table.Body>
                                      </Table>
                                      <div className="hidden">
            </div>

            </div>

        
        
    
 


        </div>
    )
}