import { ClientProps, EventProps, MedicoProps } from "@/pages/agenda"
import {  Modal, Table,FloatingLabel, Label, TextInput,Select, Button } from "flowbite-react"
import { IoLogoWhatsapp } from "react-icons/io";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import ReactInputMask from "react-input-mask";
import { MdAdd } from "react-icons/md";
import { AuthContext } from "@/contexts/AuthContext";





interface DataProps {
    pre: Array<ClientProps>
    arrayMedicos:Array<MedicoProps>
    setPre:(array:Array<ClientProps>)=>void
    events:Array<EventProps>
    setArrayEvent:(array:Array<EventProps>)=>void
}


interface DadosInputs{
    id_agcli:number,
    nome:string,
    celular:string,
    id_agmed:number,
    espec:string,
    endereco:string,
    title:string,
    start:Date,
    end:Date,
}

export default function PreAgend({ arrayMedicos,pre,setPre,events,setArrayEvent }: DataProps) {
    const [isOpen,setIsOpen] =useState<boolean>(false)
    const [dados,setDados]  =useState<Partial<DadosInputs>>()
    const [loading,setLoading] = useState<boolean>(false)
    const [intervals,setIntervalo] = useState<Array<{
        start:Date,
        end:Date,
        reserv:boolean
    }>>([])
    const { usuario } = useContext(AuthContext)


    const editarEvento = async () => {
        try {
          const evento = await toast.promise(
            api.put("/agenda/editarEvento", {
              id_agcli: dados?.id_agcli,
              id_agmed:dados?.id_agmed,
              nome: dados?.nome,
              start: dados?.start,
              end: dados?.end,
              title: dados?.title,
              tipoAg:'ct',
              celular: dados?.celular,
              endereco: dados?.endereco
    
            }),
            {
              error: 'Erro na requisição',
              pending: 'Gerando Evento..',
              success: 'Evento Gerado com sucesso'
            }
    
          )
          let novo:Array<ClientProps> = [...pre]
          const index  =  pre.findIndex(item=>item.id_agcli===dados?.id_agcli)
          if( index!==-1 && index!==undefined){
            if(dados?.id_agmed ){
                const indexEvent = events.findIndex(item=>item.id_agmed===dados.id_agmed)
                const arrayEvent = [...events]
                arrayEvent[indexEvent].clientes.push(evento.data)
                 novo.splice(Number(index),1)
            }else{
                
                novo[index] = {...evento.data}
            }
            setPre(novo)

          }
         
    
         
       
        } catch (error) {
          toast.error('Erro ao gerar evento')
        }
      }
    




    const novoEvento = async () => {
     
   
        try {
    
        setLoading(true)
            const evento = await toast.promise(
              api.post("/agenda/novoEvento", {
                data: new Date(),
                id_usuario: Number(usuario?.id),
                nome: dados?.nome,
                endereco: dados?.endereco,
                celular: dados?.celular,
                start: dados?.start,
                end: dados?.end,
                title: dados?.title,
                status: 'AB',
               // obs: dataEvent.obs,
                tipoAg: 'ct'
    
              }),
              {
                error: 'Erro na requisição',
                pending: 'Gerando Evento..',
                success: 'Evento Gerado com sucesso'
              }
    
            )
            setLoading(false)
           setPre([...pre,evento.data])
   
            toggleDrawer()
    
          
    
          /*  */
        } catch (error) {
          toast.error('Erro ao gerar evento')
        }
      
      }
    









    const selectMed = (e:ChangeEvent<HTMLSelectElement>) =>{
        if(e.target.value){
            const evento = events.find(item=>item.id_agmed===Number(e.target.value))
            const medico = arrayMedicos.find(item=>item.id_med===evento?.id_med)
 
            setDados({...dados,id_agmed:Number(e.target.value)})
 
            if(evento && medico)
            gerarIntervalos({clientes:evento.clientes,start:evento.start,end:evento.end,time:medico.time})

        }
        else setIntervalo([]) 
    }


    const gerarIntervalos = ({start,end,time,clientes}:{start: Date, end: Date,time:number,clientes:Array<ClientProps>}) => {     
        
        const startTime =new Date(start);
      
        const endTime =new Date(end);
        const intervals = [];
 
        while (startTime < endTime) {
          const intervalStart = new Date(startTime);
          startTime.setMinutes(startTime.getMinutes() + Number(time));
          const intervalEnd = new Date(startTime);
    
          if (intervalEnd <= endTime) {
            
            intervals.push({
              start: intervalStart,
              end: intervalEnd,
              reserv:clientes?.some(item=>new Date(item.start).getTime()===intervalStart.getTime())
            });
          }
        
    }
        setIntervalo(intervals);
    
      };



    useEffect(()=>{
        console.log(pre)
    },[])
    const deletarEvento=async ()=>{

    }

    const toggleDrawer = () =>{
        setIsOpen(!isOpen)
    }

    const handleDeletarEvent = async(id:number)=>{
        try {
            const deletado =await toast.promise(
                api.delete(`/agenda/deletarEvento/ct/${id}`)
               

,
{
    error:'Erro ao deletar dados',
    pending:'Deletando Pre Agendamento',
    success:'Deletado com sucesso!'
}

            )
            
            const novoArray = [...pre]
            const index = novoArray.findIndex(item=>item.id_agmed===dados?.id_agmed)
              novoArray.splice(index,1)
              setPre(novoArray)    
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
    <Modal dismissible show={isOpen} onClose={()=>setIsOpen(!isOpen)}>
        <Modal.Header>Cadastrar Pré Agendamento</Modal.Header>
        <Modal.Body >
            <div className="flex flex-col gap-3 w-full">
            
      <div >
        <div className="mb-1 block">
          <Label htmlFor="small" value="Nome" />
        </div>
        <TextInput value={dados?.nome} onChange={e=>setDados({...dados,nome:e.target.value})} id="small" type="text" sizing="large" />
      </div>
            <div className="inline-flex gap-4 w-full">
            <div className="w-full">
        <div className="mb-1 block">
          <Label htmlFor="small" value="Celular" />
        </div>
        <ReactInputMask mask={'(99) 9 9999-9999'} value={dados?.celular} onChange={e=>setDados({...dados,celular:e.target.value})} className="block py-2 px-2 w-full rounded-lg border 0  text-base border-gray-300 " ></ReactInputMask>
      </div>
      <div className="w-full">
        <div className="mb-1 block">
          <Label htmlFor="small" value="Endereço" />
        </div>
        <TextInput value={dados?.endereco} onChange={e=>setDados({...dados,endereco:e.target.value})}  type="text" sizing="large" />
      </div>
            </div>
            <div className="w-full">
        <div className="mb-1 block">
          <Label htmlFor="small" value="Especialista" />
        </div>
        <Select value={dados?.title} onChange={e=>setDados({...dados,title:e.target.value})}  sizing="large" >
            <option value={''}></option>
          { arrayMedicos.map((item,index)=>(
                <option key={item.id_med} value={`${item.nome}-(${item.espec})`}>{`${item.nome}-(${item.espec})`}</option>
          ))}
        </Select>
      </div>
     { dados?.id_agcli &&
        <div>
            <div className="w-full">
        <div className="mb-1 block">
          <Label htmlFor="small" value="Consulta/Data" />
        </div>
        <Select id="small" onChange={e=>selectMed(e)}  sizing="large" >
            <option value={''}></option>
          { events.map((item,index)=>(
                <option key={item.id_agmed} value={item.id_agmed}>{item.title}-{new Date(item.start).toLocaleDateString('pt-BR',{timeZone:'America/Fortaleza'})}</option>
          ))}
        </Select>
      </div>
      <div className="w-full">
        <div className="mb-1 block">
          <Label htmlFor="small" value="Horário" />
        </div>
        <Select id="small" onChange={e=>{
            setDados({...dados,start:intervals[Number(e.target.value)].start,end:intervals[Number(e.target.value)].end})
        }}  sizing="large" >
            <option value={''}></option>
          { intervals?.map((item,index)=>(
                <option disabled={item.reserv} key={index} value={index}>{new Date(item.start).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</option>
          ))}
        </Select>
      </div>
      </div>}
              </div>
        </Modal.Body>
        <Modal.Footer>
            {!dados?.id_agcli?<Button isProcessing={loading} onClick={()=>novoEvento()}>Salvar</Button>:<Button isProcessing={loading} onClick={()=>editarEvento()}>Editar</Button>}
        </Modal.Footer>
    </Modal>





    {/* TABELA DE PRE AGENDAMENTOS */}
        <div className="overflow-x-auto overflow-y-auto">
          <button onClick={()=>{setIsOpen(true),setDados({celular:'',end:undefined,start:undefined,endereco:'',espec:'',id_agmed:undefined,nome:'',title:'',id_agcli:undefined})}}  className="flex ml-auto mb-2 focus:outline-none mr-1 p-2 bg-gray-200 rounded-md text-gray-600 font-semibold"><MdAdd size={24}/> Adicionar</button>
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
                    {pre.map((item, index) => 
(
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
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
                                <button onClick={()=>handleDeletarEvent(Number(item.id_agcli))} className="hover:text-red-500">
                                <MdDelete size={22}/>
                                </button>
                                <button onClick={()=>{
                                   // setarDataEvent({...item,start:undefined,end:undefined})
                                   setDados({...dados,celular:item.celular,endereco:item.endereco,nome:item.nome,title:item.title,id_agcli:item.id_agcli,id_agmed:undefined})
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