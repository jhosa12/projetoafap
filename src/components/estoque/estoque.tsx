import { ConvProps } from "@/pages/estoque"
import { Button, Select, Table, TextInput } from "flowbite-react"
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";


interface DataProps{
    arrayEstoque:Array<ConvProps>
}

export function Estoque({arrayEstoque}:DataProps){
    const [abertos, setAbertos] = useState<{ [key: number]: boolean }>({});

    const toogleAberto = (index: number) => {
        setAbertos((prev: { [key: number]: boolean }) => ({
          ...Object.keys(prev).reduce((acc, key) => {
            acc[Number(key)] = false;
            return acc;
          }, {} as { [key: number]: boolean }),
          [index]: !prev[index]
        }));
      };


    return(
        <div className="flex-col w-full px-2 rounded-lg shadow  ">
                <div className="inline-flex w-full justify-end items-end gap-4">
                    <Select sizing={'sm'}>
                        <option>Categoria de Estoque</option>
                    </Select>
                    <TextInput className="w-2/12" placeholder="Descrição" sizing={'sm'}/>
                    <Button size={'sm'}>Buscar</Button>
                    <Button color={'success'} size={'sm'}>Movimentar</Button>
                </div>

        <div className="overflow-y-auto mt-1 px-2 max-h-[79vh] ">
        <Table hoverable theme={{ body: { cell: { base: " px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs text-black" } } }}  >
                    <Table.Head >
                            <Table.HeadCell >
                                DESCRIÇÃO
                            </Table.HeadCell>
                            <Table.HeadCell >
                                QUANTIDADE
                            </Table.HeadCell> 
                            <Table.HeadCell >
                                AÇÕES
                            </Table.HeadCell>
                        
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {arrayEstoque?.map((item,index)=>(
                           
                
                     <Table.Row className="bg-white  " key={index} onClick={()=>toogleAberto(index)} >
                      
                        <Table.Cell>
                           {item.descricao} 
                        </Table.Cell>   
                    
                    
                        <Table.Cell >
                           {item.estoque?.reduce((acumulador,atual)=>{
                            if(item.descricao===atual.produto){
                                acumulador+=1
                            }
                            return acumulador
                                
                           },0)}
                        </Table.Cell>
                        <Table.Cell >
                            <button onClick={()=>{}} className="font-semibold rounded-lg w-full px-2 py-1 text-white hover:underline"><IoIosArrowDown /> </button>
                          
                        </Table.Cell>
                       </Table.Row>
                       ))}
            
                        
                       
                    </Table.Body>
                
                </Table>
        
        
        
        </div>
              
                </div>
    )
}