import { EmpresaProps } from "@/contexts/AuthContext";
import { Button, Label, Modal, Select } from "flowbite-react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { useState } from "react";
import { EstoqueProps } from "@/pages/estoque";

interface DataProps{
    empresas:Array<EmpresaProps>
    openModal:boolean,
    setOpenModal:(open:boolean)=>void,
    handleFiltro:({startDate,endDate,id_empresa}:{startDate:Date,endDate:Date,id_empresa:string})=>Promise<void>
   
}







export function ModalFiltroMov({empresas,openModal,setOpenModal,handleFiltro}:DataProps){
    const [startDate,setStartDate] = useState<Date>(new Date())
    const [endDate,setEndDate] = useState(new Date())
    const [id_empresa,setId] = useState<string>('')
   
    return(
        <Modal size={'sm'} show={openModal} onClose={()=>setOpenModal(false)} popup>
            <Modal.Header/>
            <Modal.Body className="space-y-4 ">

            <Select onChange={e=>setId(e.target.value)} className="font-semibold" sizing={'sm'}>
                        <option value={''}>EMPRESA</option>
                       {empresas.map(item=>(
                        <option value={item.id} className="font-semibold" key={item.id}>{item.nome}</option>
                       ))}

                    </Select>


                    <div className="inline-flex gap-4">
                    <div >
                        <div className=" block">
          <Label  value="Data inicio" />
        </div>
                            <DatePicker selected={startDate} onChange={e => { e && setStartDate(e) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase font-semibold  text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                        </div>


                        <div >
                        <div className=" block">
          <Label  value="Data fim" />
        </div>
                            <DatePicker selected={endDate} onChange={e => { e && setEndDate(e) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase font-semibold  text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                        </div>
                    </div>

                    <Button size={'sm'} onClick={()=>handleFiltro({endDate,id_empresa,startDate})} className="ml-auto">Aplicar Filtro</Button>
                   

            </Modal.Body>
        </Modal>
    )
}