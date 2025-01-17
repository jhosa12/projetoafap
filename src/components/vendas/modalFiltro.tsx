
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { HiFilter } from "react-icons/hi"
import { Button, Label, Modal, Select } from "flowbite-react";
import { MetasProps, SetorProps } from "./acompanhamento";

interface DataProps{
    show:boolean,
    setFiltro:(open:boolean)=>void,
    startDate:Date,
    setStartDate:(start:Date)=>void
    endDate:Date,
    setEndDate:(end:Date)=>void
    filtrar:()=>Promise<void>
    loading:boolean,
    arraySetores:Array<SetorProps>,
   
   
}

export function ModalFiltroMetas({arraySetores,filtrar,endDate,loading,setEndDate,setFiltro,setStartDate,show,startDate}:DataProps){

    return(
        <Modal dismissible size={'sm'} show={show} onClose={() => setFiltro(false)}>
                <Modal.Header >
                    <div className='inline-flex items-center'>
                    <HiFilter color='gray' size={30}/>
                    Filtro
                    </div>
                   
                    </Modal.Header>
                <Modal.Body>
                 <div className='space-y-2'>
                        <div>
                            <div className="mb-1 block">
                                <Label htmlFor="email1" value="Setor" />
                            </div>

                            <Select sizing={'sm'} value={''} onChange={e => {
                                const item = arraySetores.find(item => item.id_grupo === Number(e.target.value))
                               

                            }}>
                                <option value={0}>SETOR (TODOS)</option>

                                {arraySetores?.map((item, index) => (
                                    <option className="text-xs" key={index} value={item.id_grupo}>
                                        {item.descricao}
                                    </option>

                                ))}
                            </Select>
                        </div>

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

                        <Button  isProcessing={loading} className='cursor-pointer' as={'span'} onClick={()=>filtrar()} size={'sm'}>Aplicar Filtro</Button>
                        

                        </div>
                </Modal.Body>
            </Modal>

    )

}