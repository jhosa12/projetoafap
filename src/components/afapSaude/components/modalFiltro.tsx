
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { HiFilter } from "react-icons/hi"
import { Button, Label, Modal, Select } from "flowbite-react";
import { useState } from "react";
import { MedicoProps } from "@/pages/afapSaude";
import { Stringifier } from "postcss";

interface DataProps{
    show:boolean,
    setFiltro:(open:boolean)=>void,
    buscarConsultas:({startDate,endDate,id_med}:{startDate:Date|undefined,endDate:Date|undefined,id_med?:number,status:string|undefined,buscar?:string})=>Promise<void>,
    loading:boolean,
    medicos:Array<MedicoProps>  

}

export function ModalFiltroConsultas({loading,setFiltro,show,buscarConsultas,medicos}:DataProps){
    const [startDate,setStartDate] = useState<Date|undefined>(undefined)
    const [endDate,setEndDate] = useState<Date|undefined>(undefined)
    const [id_med,setId] = useState<number|undefined>(undefined)
    const [status,setStatus] = useState('')
    const [buscar,setBuscar] = useState('')
    return(
        <Modal dismissible size={'md'} show={show} onClose={() => setFiltro(false)}>
                <Modal.Header >
                    <div className='inline-flex items-center'>
                    <HiFilter color='gray' size={30}/>
                    Filtro
                    </div>
                   
                    </Modal.Header>
                <Modal.Body>
                 <div className='space-y-2'>
                 <div >
                        <div className=" block">
          <Label className="text-xs"  value="Especialista" />
        </div>
                       <Select value={id_med??''} onChange={(e) =>setId(e.target.value ? Number(e.target.value) : undefined)} sizing={'sm'}>
                        <option value={''}>Selecione</option>
                        {medicos.map((item,index)=>(<option key={index} value={item.id_med}>{item.nome}-{item.espec}</option>))}
                       </Select>
                        </div>


<div className="inline-flex w-full gap-2" >

<div className="flex flex-col w-full" >
                        <div className="block">
          <Label className="text-xs"  value="Status" />
        </div>
                       <Select value={status} onChange={(e) =>setStatus(e.target.value)} sizing={'sm'}>
                        <option value={''}>Selecione o status</option>
                        <option value={'AGENDADO'}>AGENDADO</option>
                        <option value={'CANCELADO'}>CANCELADO</option>
                        <option value={'AGUARDANDO DATA'}>AGUARDANDO DATA</option>
                        <option value={'RECEBIDO'}>RECEBIDO</option>
                        <option value={'CONFIRMADO'}>CONFIRMADO</option>
                       </Select>
                        </div>





                        <div className="flex flex-col w-full" >
                        <div className="block">
          <Label className="text-xs"  value="Buscar ?" />
        </div>
                       <Select value={buscar} onChange={(e) =>setBuscar(e.target.value)} sizing={'sm'}>
                        <option value={''}>Selecione o status</option>
                        <option value={'SIM'}>SIM</option>
                        <option value={'NAO'}>NÃO</option>
                       
                       </Select>
                        </div>

</div>
                    







                       <div className='inline-flex gap-2'>
                         <div >
                        <div className="block">
          <Label className="text-xs"  value="Data inicio" />
        </div>
                            <DatePicker selected={startDate} onChange={e => { e && setStartDate(e) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full  text-xs   border  rounded-lg   bg-gray-50 border-gray-300   " />
                        </div>
                        <div  >
                        <div className=" block">
          <Label className="text-xs"  value="Data Fim" />
        </div>
                            <DatePicker selected={endDate} onChange={e => { e && setEndDate(e) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full  text-xs   border  rounded-lg   bg-gray-50 border-gray-300  " />
                        </div>
                        </div>

                        <Button  isProcessing={loading} className='cursor-pointer' as={'span'} onClick={()=>buscarConsultas({startDate,endDate,id_med,status,buscar})} size={'sm'}>Aplicar Filtro</Button>
                        

                        </div>
                </Modal.Body>
            </Modal>

    )

}