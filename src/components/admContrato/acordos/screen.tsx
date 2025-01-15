
import React, {  useContext, useEffect, useState } from 'react';
import { MdDeleteForever, MdEdit, MdPrint} from 'react-icons/md';
import { RiAddCircleFill } from 'react-icons/ri';
import { toast } from 'react-toastify'
import { AuthContext } from '@/contexts/AuthContext';
import { Button, ButtonGroup } from 'flowbite-react';
import { AcordoProps, MensalidadeProps } from '@/types/financeiro';
import { ModalAcordos } from './modalAcordos';
import { FaFileArrowDown } from 'react-icons/fa6';
import { FaPrint } from 'react-icons/fa';

export const themeLight = {
    color:{
        light:"border border-gray-300 bg-white text-gray-900 focus:rind-none focus:ring-0 enabled:hover:bg-gray-100"
    }
};


interface DataProps{
    id_empresa:string,
    id_associado:number|undefined,
    id_contrato:number|undefined
    id_contrato_global:number|undefined|null
    id_global:number|undefined|null
    usuario:{nome:string,id:string}
    acordos:Array<AcordoProps>|[]
    mensalidades:Array<MensalidadeProps>|[]
}




export function Acordos({acordos,mensalidades,id_contrato_global,id_global,usuario,id_empresa,id_associado,id_contrato}:DataProps) {
const {permissoes,consultores,carregarDados} = useContext(AuthContext)
const [openAcordo,setOpenAcordo] = useState(false)
const [acordo,setAcordo] = useState<Partial<AcordoProps>>()


useEffect(()=>{
    setAcordo({})
},[id_global])

    return (
        <div className="flex flex-col rounded-lg  max-h-[calc(100vh-190px)]    sm:rounded-lg">

         { openAcordo &&  <ModalAcordos
                id_associado={id_associado}
                id_contrato={id_contrato}
                id_empresa={id_empresa}
               carregarDados={carregarDados} 
               close={()=>setOpenAcordo(false)} 
               acordo={acordo??{}}
               id_contrato_global={id_contrato_global??null}
               id_global={id_global??null}
               mensalidades={mensalidades}
               open={openAcordo}
               usuario={usuario.nome}
               id_usuario={usuario.id}
               consultores={consultores}

                />}

            <div className="flex w-full  gap-2 ml-2">
           
                <ButtonGroup>
                <Button theme={themeLight}  onClick={()=>{setOpenAcordo(true);setAcordo({})}} type="button" color='light' size='xs'><RiAddCircleFill className='mr-1 h-4 w-4' /> Novo Acordo</Button>
                <Button theme={themeLight}  onClick={()=>setOpenAcordo(true)} type="button" color='light' size='xs'><MdPrint className='mr-1 h-4 w-4' />Imprimir</Button>
                <Button theme={themeLight}  onClick={()=>{
                    if(!acordo?.id_acordo){return toast.warning('Selecione um acordo')}
                    setOpenAcordo(true)
                    }} type="button" color='light' size='xs'><MdEdit className='mr-1 h-4 w-4' />Alterar</Button>
                <Button theme={themeLight} onClick={() =>{}} type="button" color='light' size='xs'><MdDeleteForever className='mr-1 h-4 w-4' /> Excluir</Button>
            </ButtonGroup>

            </div>
            <div className="flex w-full p-2 max-h-[calc(100vh-205px)]">
                <table
                    className="block w-full overflow-y-auto overflow-x-auto text-xs text-center rtl:text-center border-collapse  text-gray-600">
                    <thead className="sticky w-full top-0  text-xs   bg-gray-100 text-gray-600">
                        <tr >
                            <th scope="col" className="px-6 py-1">
                                DESCRIÇÃO
                            </th>
                            <th scope="col" className=" px-6 py-1">
                                CONSULTOR
                            </th>
                            <th scope="col" className=" px-6 py-1">
                                VALOR
                            </th>
                            <th scope="col" className="px-6 py-1">
                                METODO DE PAG
                            </th>
                            <th scope="col" className=" px-6 py-1">
                                DATA CRIAÇÃO
                            </th>
                            <th scope="col" className=" px-6 py-1">
                                DATA PREVISTA
                            </th>
                            <th scope="col" className=" px-6 py-1">
                                DATA PAG.
                            </th>
                            <th scope="col" className=" px-6 py-1">
                                HR PAG.
                            </th>
                            <th scope="col" className=" px-6 py-1">
                                USUÁRIO
                            </th>
                            <th scope="col" className=" px-6 py-1">
                                FORMA
                            </th>
                          
                        </tr>
                    </thead>
                    <tbody className='divide-y' >


                        {Array.isArray(acordos) && acordos.map((item, index) => {


                            return (

                                        <tr  key={index}
                                            onClick={() => setAcordo(item)}
                                            className={` hover:cursor-pointer divide-y text-black  }   hover:bg-gray-300 hover:text-black ${item.id_acordo === acordo?.id_acordo && "bg-gray-300 text-black"} `}>
                                            <td className={`px-5 py-1  `}>
                                                {item.descricao}
                                            </td>
                                            <td className={`px-2 py-1 `}>
                                                {item.realizado_por}

                                            </td>
                                            <td className="px-2 py-1">
                                                {Number(item.mensalidade?.reduce((a, b) => a + Number(b.valor_principal), 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </td>
                                            <td className="px-5 py-1">
                                                {item.metodo}
                                            </td>
                                            <td className="px-3 py-1">
                                                {item.data_inicio && new Date(item.data_inicio).toLocaleDateString('pt-BR',{timeZone:"UTC"})}
                                            </td>
                                            <td className="px-3 py-1">
                                                {item.data_fim && new Date(item.data_fim).toLocaleDateString('pt-BR',{timeZone:"UTC"})}
                                            </td>
                                            <td className="px-4 py-1">
                                                {item.dt_pgto && new Date(item.dt_pgto).toLocaleDateString('pt-BR',{timeZone:"UTC"})}
                                            </td>
                                            <td className="px-4 py-1">
                                                {item.dt_pgto && new Date(item.dt_pgto).toLocaleTimeString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-1 whitespace-nowrap">
                                                {item.usuario}
                                            </td>
                                    
                                            <td className="px-4 py-1">
                                                {}
                                            </td>
                                         
                                        </tr>
                                   
                                            )})}
                    </tbody>

                </table>
            </div>

          
        
        
        </div>
    )
}





           
