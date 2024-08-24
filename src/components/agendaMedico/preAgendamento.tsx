import { EventProps, MedicoProps } from "@/pages/agenda"
import {  Table } from "flowbite-react"
import { IoLogoWhatsapp } from "react-icons/io";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react"
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { ModalDrawer } from "./drawer";

interface DataProps {
    events: Array<Partial<EventProps>>
    arrayMedicos:Array<MedicoProps>
    setarDataEvent :(fields:Partial<EventProps>)=>void
    dataEvent:Partial<EventProps>
    setArrayEvent:(array:Array<Partial<EventProps>>)=>void
}

export default function PreAgend({ events,arrayMedicos,dataEvent,setArrayEvent,setarDataEvent }: DataProps) {
    const [isOpen,setIsOpen] =useState<boolean>(false)




    const deletarEvento=async ()=>{

    }

    const toggleDrawer = () =>{
        setIsOpen(!isOpen)
    }

    const handleDeletarEvent = async(id:number)=>{
        try {
            const deletado =await api.delete(`/agenda/deletarEvento/${id}`)
            const novoArray = [...events]
    const index = novoArray.findIndex(item=>item.id_agmed===dataEvent.id_agmed)
    novoArray.splice(index,1)
    setArrayEvent(novoArray)
    toggleDrawer()
            toast.success('DELETADO COM SUCESSO')
            
        } catch (error) {
                console.log(error)
        }
    }


 

    const formatPhoneNumber = (phoneNumber:string) => {
        // Remove todos os caracteres que não sejam números
        let cleaned = phoneNumber.replace(/\D/g, '');
      
        // Verifica se o telefone tem 11 dígitos (2 dígitos DDD + 9 dígitos número)
        if (cleaned.length === 11) {
          // Adiciona o código do país (Brasil: +55)
          return `+55${cleaned}`;
        } else {
          console.error('Número de telefone inválido:', phoneNumber);
          return null;
        }
      };

      const handleWhatsAppClick = (phoneNumber:string) => {
        const formattedNumber = formatPhoneNumber(phoneNumber);
        if (formattedNumber) {
          const message = encodeURIComponent("Olá, gostaria de agendar uma consulta ?");
          const whatsappURL = `https://web.whatsapp.com/send?phone=${formattedNumber}&text=${message}`;
          window.open(whatsappURL);
        }
      };






    return (
        <>
        <ModalDrawer deletarEvento={deletarEvento}  arrayMedicos={arrayMedicos} dataEvent={dataEvent} events={events} isOpen={isOpen} setArrayEvent={setArrayEvent} setarDataEvent={setarDataEvent} toggleDrawer={toggleDrawer} />
        <div className="overflow-x-auto">
            <Table>
                <Table.Head>
                    <Table.HeadCell>Nome</Table.HeadCell>
                    <Table.HeadCell>Medico</Table.HeadCell>
                    <Table.HeadCell>Telefone</Table.HeadCell>
                    <Table.HeadCell>Data Solicitação</Table.HeadCell>
                    <Table.HeadCell>
                        <span className="sr-only">Edit</span>
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {events.map((item, index) => 
(
                      item.tipoAg ==='tp' &&  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {item.nome}
                            </Table.Cell>
                            <Table.Cell>{item.title}</Table.Cell>
                            <Table.Cell>{item.celular}</Table.Cell>
                            <Table.Cell>{item.data && new Date(item.data).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</Table.Cell>
                            <Table.Cell>
                               <div className="inline-flex gap-4">
                                <button onClick={()=>handleWhatsAppClick(item.celular??'')} className="hover:text-green-400">
                                <IoLogoWhatsapp size={20}/>
                                </button>
                                <button onClick={()=>handleDeletarEvent(Number(item.id_agmed))} className="hover:text-red-500">
                                <MdDelete size={22}/>
                                </button>
                                <button onClick={()=>{
                                    setarDataEvent({...item,start:undefined,end:undefined})
                                    toggleDrawer()
                                }} className="hover:text-blue-500">
                                <BsFillCalendarDateFill size={20}/>
                                </button>
                               
                               </div>
                            </Table.Cell>
                        </Table.Row>)

                    )}

                </Table.Body>
            </Table>
        </div>
        </>
    )
}