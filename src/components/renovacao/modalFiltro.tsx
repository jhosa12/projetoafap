import { Button, Checkbox, Label, Modal, ModalHeader, Radio, Select, TextInput } from "flowbite-react";
import { HiFilter } from "react-icons/hi";




import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { FiltroProps } from "@/pages/dashboard/renovacao";


interface DataProps{
  
    loading:boolean
    openModal:boolean,
    setModal:(open:boolean)=>void
    filtrar:()=>Promise<void>
    dataFiltro:FiltroProps
    setFiltro:(fields:FiltroProps)=>void
}

export function ModalFiltro({loading,openModal,setModal,filtrar,dataFiltro,setFiltro}:DataProps){


    return(
        <Modal size={'lg'} show={openModal} onClose={()=>setModal(false)} popup>
                <ModalHeader>
                <div className='inline-flex items-center'>
                    <HiFilter color='gray' size={30}/>
                    Filtro
                    </div>
                </ModalHeader>

                <Modal.Body>
                <div className='space-y-4'>
              

            <div className="inline-flex gap-2 items-end">
                <span>Consultar</span>
      <span>contratos:</span>

      <TextInput type="number" value={dataFiltro.contratoInicial?Number(dataFiltro.contratoInicial):''} onChange={e=>setFiltro({...dataFiltro,contratoInicial:Number(e.target.value)})}  sizing={'sm'}/>
      <span>a</span>
      <TextInput type="number" value={dataFiltro.contratoFinal?Number(dataFiltro.contratoFinal):''} onChange={e=>setFiltro({...dataFiltro,contratoFinal:Number(e.target.value)})}  sizing={'sm'}/>

            </div>
            <div>
                    <span>Número máximo de mensalidades em aberto</span>
                    <TextInput value={dataFiltro.mensAberto?Number(dataFiltro.mensAberto):''} onChange={e=>setFiltro({...dataFiltro,mensAberto:Number(e.target.value)})} sizing={'sm'}/>
            </div> 

                     <Button  isProcessing={loading} className='cursor-pointer' onClick={()=>filtrar()} size={'sm'}>Aplicar Filtro</Button>
                     </div>
                </Modal.Body>
        </Modal>
    )
}