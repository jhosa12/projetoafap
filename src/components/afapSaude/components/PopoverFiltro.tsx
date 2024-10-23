import { Button, Label, Popover, Select } from "flowbite-react"
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { useState } from "react";
import { HiFilter } from "react-icons/hi";
import { MedicoProps } from "@/pages/afapSaude";
import { set } from "date-fns";

interface DataProps{
    openModal:boolean
    arrayMedicos:Array<MedicoProps>
    setOpenModal:()=>void
    loading:boolean
    filtroAgenda:()=>Promise<void>
}

interface FiltroForm {
    startDate:Date|undefined
    endDate:Date|undefined
    id_medico:number,
    status:string
}


export function PopoverFiltro({openModal,setOpenModal,filtroAgenda,loading,arrayMedicos}:DataProps){

    const [formData,setFormData] = useState<FiltroForm>({
        endDate:undefined,
        id_medico:0,
        startDate:undefined,
        status:''
    })

    return(

        <Popover
        theme={{ content: 'flex w-full z-10 overflow-hidden rounded-[7px]' }}
        aria-labelledby="area-popover"
        open={openModal}
        onOpenChange={setOpenModal}
        content={
          <div className="flex w-64 flex-col gap-4 p-2 text-sm ">

         

            <Select onChange={e=>setFormData({...formData,id_medico:+e.target.value})} className="font-semibold" sizing={'sm'}>
            <option value="">ESPECIALISTAS</option>
            {arrayMedicos.map(item=>(
              <option value={item.id_med} className="font-semibold" key={item.id_med}>{item.nome}</option>
            ))}

            </Select>

            <Select onChange={e=>setFormData({...formData,id_medico:+e.target.value})} className="font-semibold" sizing={'sm'}>
            <option value="">STATUS</option>
           
              <option className="font-semibold" >AGENDADO</option>
              <option className="font-semibold" >AGUARDANDO DATA</option>
              <option className="font-semibold" >CONFIRMADO</option>
              <option className="font-semibold" >CANCELADO</option>
        

            </Select>
        
            <div className=" flex w-full gap-4">

              <div className="flex flex-col w-full">
              <Label htmlFor="dateIn" value="Data Inicial"/>
                <DatePicker
                  showMonthDropdown
                  showYearDropdown
                  dateFormat={"dd/MM/yyyy"}
                  locale={pt}
                  selected={formData.startDate}
                  onChange={(date) => date && setFormData({...formData,startDate:date})}
                  
                  className="flex w-full py-2 text-xs font-semibold pl-2 text-black  border rounded-lg  bg-gray-100 border-gray-300    "
                />
              </div>
             



            

              <div className="flex flex-col w-full">
                <Label htmlFor="date" value="Data Final"/>
                <DatePicker
                  showMonthDropdown
                  showYearDropdown
                  dateFormat={"dd/MM/yyyy"}
                  locale={pt}
                  selected={formData.endDate}
                  onChange={(date) => date && setFormData({...formData,endDate:date})}
                  selectsEnd
                  className=" flex w-full text-xs font-semibold py-2 pl-2 text-black  border rounded-lg  bg-gray-100 border-gray-300   "
                />
              </div>
            </div>

           





            <Button className="ml-auto" color="success" isProcessing={loading} onClick={() => filtroAgenda()}>
              Aplicar Filtro
            </Button>

          </div>
        }
      >
        <Button color={'light'} theme={{ color: { light: 'border border-gray-300 bg-white text-gray-900  enabled:hover:bg-gray-100' } }} size={'sm'}>
          <HiFilter className="mr-2 w-5 h-5" />   Filtrar
        </Button>
      </Popover>






    )
       




    }