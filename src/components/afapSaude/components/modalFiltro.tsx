import { MetasProps, SetorProps } from "@/pages/vendas"
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { HiFilter } from "react-icons/hi"
import { Button, Label, Modal, Select } from "flowbite-react";
import { useState } from "react";

interface DataProps{
    show:boolean,
    setFiltro:(open:boolean)=>void,
    buscarConsultas:({startDate,endDate}:{startDate:Date,endDate:Date})=>Promise<void>,
    loading:boolean,

}

export function ModalFiltroConsultas({loading,setFiltro,show,buscarConsultas}:DataProps){
    const [startDate,setStartDate] = useState<Date>(new Date())
    const [endDate,setEndDate] = useState<Date>(new Date())
    return(
        <Modal dismissible size={'sm'} show={show} onClose={() => setFiltro(false)}>
                <Modal.Header >
                    <div className='inline-flex items-center'>
                    <HiFilter color='gray' size={30}/>
                    Filtro
                    </div>
                   
                    </Modal.Header>
                <Modal.Body>
                 <div className='space-y-4'>
                    

                       <div className='inline-flex gap-2'>
                         <div >
                        <div className="mb-1 block">
          <Label  value="Data inicio" />
        </div>
                            <DatePicker selected={startDate} onChange={e => { e && setStartDate(e) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                        </div>
                        <div  >
                        <div className="mb-1 block">
          <Label  value="Data Fim" />
        </div>
                            <DatePicker selected={endDate} onChange={e => { e && setEndDate(e) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase  text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                        </div>
                        </div>

                        <Button  isProcessing={loading} className='cursor-pointer' as={'span'} onClick={()=>buscarConsultas({startDate,endDate})} size={'sm'}>Aplicar Filtro</Button>
                        

                        </div>
                </Modal.Body>
            </Modal>

    )

}