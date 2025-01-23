import { Button, ButtonGroup, Table } from "flowbite-react";
import useApiPost from "@/hooks/useApiPost";
import {  useCallback, useEffect, useState } from "react";
import { themeLight } from "@/components/admContrato/acordos/screen";
import { FaFilter } from "react-icons/fa6";
import { IoPrint } from "react-icons/io5";
import { IoMdAddCircle, IoMdTrash } from "react-icons/io";
import { EmpresaProps } from "@/types/empresa";
import { MdEdit } from "react-icons/md";


import { VeiculoProps } from "@/types/veiculo";
import { ModalVeiculo } from "./modalVeiculo";


interface DataProps {
  id_empresa:string
  empresas:Array<EmpresaProps>,
 
}



export function Veiculos({}:DataProps) {

    const [modalFiltro,setModalFiltro] = useState(false)
    const [modalVeiculo,setModalVeiculo] = useState(false)
    const [veiculo,setVeiculo] = useState<VeiculoProps|null>(null)
    const {data,postData,loading} = useApiPost<VeiculoProps,VeiculoProps>("/gerenciarAdmnistrativo/novoVeiculo")
    const {data:veiculos,postData:postDataVeiculos,loading:loadingVeiculos} = useApiPost<Array<VeiculoProps>>("/gerenciarAdmnistrativo/listarVeiculos")



    const handleListarVeiculos = async() => {

        postDataVeiculos(undefined)

    }


    useEffect(()=>{
        handleListarVeiculos()
    },[])


    const handleNovo =useCallback( async(data:VeiculoProps) => {
        postData({
            ano:'2024',
            chassi:'123456789',
            cor:'vermelho',
            id_veiculo:0,
            marca:'Fiat',
            modelo:'Uno',
            placa:'AAA-1234',
        })
    },[]
)



  
    return(

        <div className="flex flex-col w-full h-full px-4">
           {modalVeiculo && <ModalVeiculo handleNovoVeiculo={handleNovo} openModal={modalVeiculo} veiculo={veiculo} onClose={()=>setModalVeiculo(false)}  />}
            
   <ButtonGroup className="ml-auto">
                <Button theme={themeLight} onClick={()=>{}} type="button" color='light' size='xs'><FaFilter className='mr-1 h-4 w-4' />FILTRAR</Button>

                <Button theme={themeLight} onClick={()=>setModalVeiculo(true)} type="button" color='light' size='xs'><IoMdAddCircle className='mr-1 h-4 w-4' />NOVA META</Button>

                
                <Button theme={themeLight}  onClick={()=>{
                 
                }} color='light' size='xs'>  <MdEdit className='mr-1 h-4 w-4' />EDITAR</Button>

                <Button theme={themeLight}  onClick={()=>window.print()} color='light' size='xs'>  <IoMdTrash className='mr-1 h-4 w-4' />EXCLUIR</Button>

                <Button theme={themeLight}  onClick={()=>window.print()} color='light' size='xs'>  <IoPrint className='mr-1 h-4 w-4' /> IMPRIMIR</Button>
              
           
            
            </ButtonGroup>
       
        <div className="w-full  max-h-[calc(100vh-160px)] overflow-y-auto mt-1">
                            <Table
                             theme={{root:{shadow:'none'},body:{cell:{base:"px-6 py-1"}},head:{cell:{base:"px-6 py-1"}}}}>
                                <Table.Head >
                                        <Table.HeadCell>
                                            MODELO
                                        </Table.HeadCell>
                                        <Table.HeadCell >
                                            MARCA
                                        </Table.HeadCell>
                                        <Table.HeadCell >
                                            ANO
                                        </Table.HeadCell>
                                        <Table.HeadCell >
                                            COR
                                        </Table.HeadCell>
                                        <Table.HeadCell >
                                            PLACA
                                        </Table.HeadCell>
                                        <Table.HeadCell >
                                            CHASSI
                                        </Table.HeadCell>
                                        <Table.HeadCell >
                                            STATUS
                                        </Table.HeadCell>
                                    
                                </Table.Head>
                                <Table.Body className="divide-y text-black"  >
                                    {Array.isArray(veiculos) && veiculos?.map((item, index) => (
                                        <Table.Row 
                                        onClick={() => {}}
                                        key={index}>
                                            <Table.Cell >
                                                {item.modelo}
                                            </Table.Cell>
                                            <Table.Cell >
                                                {item.marca}
                
                                            </Table.Cell>

                                            <Table.Cell >
                                                {item.ano}
                
                                            </Table.Cell>
                
                                            <Table.Cell >
                                                {item.cor}
                                            </Table.Cell>
                                            <Table.Cell >
                                                {item.placa}
                                            </Table.Cell>
                                            <Table.Cell >
                                                {item.chassi}
                                            </Table.Cell>
                                            <Table.Cell >
                                                {item.status}
                                            </Table.Cell>
                                        </Table.Row>
                
                                    ))}
                
                                </Table.Body>
                
                            </Table>
                        </div>

                        </div>
    )
}