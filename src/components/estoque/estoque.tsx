import { ConvProps, ProdutosProps } from "@/pages/estoque"
import { Button, Select, Table, TextInput } from "flowbite-react"
import { useContext, useState } from "react";
import { IoIosArrowDown, IoMdAlert } from "react-icons/io";
import { ModalMov } from "./modalMovimentacao";
import { ModalNovoProduto } from "./modalNovoProduto";
import { AuthContext } from "@/contexts/AuthContext";
import { RiAlertFill, RiAlertLine } from "react-icons/ri";


interface DataProps{
    arrayEstoque:Array<ConvProps>
    arrayProdutos:Array<ProdutosProps>
    setArrayEstoque:(fields:Array<ConvProps>)=>void
    usuario:string,
    id_usuario:string
    reqDadosEstoq:()=>Promise<void>
}

export function Estoque({arrayEstoque,arrayProdutos,setArrayEstoque,id_usuario,usuario,reqDadosEstoq}:DataProps){
    const [abertos, setAbertos] = useState<{ [key: number]: boolean }>({});
    const [mov,setMov]= useState<boolean>(false)
    const [openModal,setOpenModal]= useState<boolean>(false)
    const {empresas} = useContext(AuthContext)
  

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
        <div className="flex-col w-full px-2   ">

      { mov && <ModalMov reqDadosEstoq={reqDadosEstoq} id_usuario={id_usuario} usuario={usuario} empresas={empresas} produtos={arrayEstoque}  setOpenModal={setMov}/>}
      <ModalNovoProduto empresas={empresas} estoque={arrayEstoque} setEstoque={setArrayEstoque} produtos={arrayProdutos} openModal={openModal} setOpenModal={setOpenModal}/>

                <div className="inline-flex w-full justify-end items-end gap-4">
                <Select className="font-semibold" sizing={'sm'}>
                        <option>EMPRESA</option>
                       {empresas.map(item=>(
                        <option  className="font-semibold" key={item.id}>{item.nome}</option>
                       ))}

                    </Select>
                    <Select className="font-semibold" sizing={'sm'}>
                        <option>CATEGORIA DE ESTOQUE</option>
                        <option  className="font-semibold">CONSUMO</option>
                        <option  className="font-semibold">CONVALESCENTE</option>
                        <option  className="font-semibold">FUNEBRE</option>
                        <option  className="font-semibold">ÓTICA</option>

                    </Select>
                    <TextInput className="w-2/12 font-semibold" placeholder="DESCRIÇÃO" sizing={'sm'}/>
                    <Button size={'sm'}>Buscar</Button>
                    <Button onClick={()=>setMov(true)} color={'success'} size={'sm'}>Movimentar</Button>
                    <Button onClick={()=>setOpenModal(true)}  size={'sm'}>Novo Produto</Button>



                </div>

        <div className="overflow-y-auto mt-1 px-2 max-h-[79vh] ">
        <Table hoverable theme={{ body: { cell: { base: " px-6 py-1 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs text-black" } } }}  >
                    <Table.Head >
                            <Table.HeadCell >
                                DESCRIÇÃO
                            </Table.HeadCell>
                            <Table.HeadCell >
                                QUANTIDADE
                            </Table.HeadCell> 
                            <Table.HeadCell >
                               CODIGO PRODUTO
                            </Table.HeadCell> 
                            <Table.HeadCell >
                                EMPRESA
                            </Table.HeadCell>
                        
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {arrayEstoque?.map((item,index)=>(
                           
                
                     <Table.Row className="bg-white  " key={index} onClick={()=>toogleAberto(index)} >
                      
                        <Table.Cell className="font-semibold">
                           {item.descricao} 
                        </Table.Cell>   
                    
                    
                        <Table.Cell className="text-black font-semibold text-[14px] inline-flex items-center gap-2">
                         {item.quantidade} {item.quantidade<=item.alerta?<RiAlertLine size={18} color="red" />:''}
                        </Table.Cell>
                        <Table.Cell className="text-black font-semibold text-[14px]">
                         {item.cod_prod}
                        </Table.Cell>
                        <Table.Cell className="text-black font-semibold text-[14px]" >
                         {empresas.map(emp=>{
                           if( emp.id===item.id_empresa)return emp.nome
                         })}
                          
                        </Table.Cell>
                       </Table.Row>
                       ))}
            
                        
                       
                    </Table.Body>
                
                </Table>
        
        
        
        </div>
              
                </div>
    )
}