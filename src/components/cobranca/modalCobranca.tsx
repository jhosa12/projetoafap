
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { HiFilter } from "react-icons/hi"
import { Button, Checkbox, Dropdown, Label, Modal, Select } from "flowbite-react";
import {  useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FormProps } from "@/pages/cobranca";
import { Controller, SubmitHandler, useForm} from "react-hook-form";
import { ConsultoresProps } from "@/types/consultores";



interface DataProps {
  show: boolean,
  empresa:string,
  setFiltro: (open: boolean) => void,
  loading: boolean,
  listarCobranca: SubmitHandler<FormProps>,
  selectCobrador: Array<ConsultoresProps>
  arrayBairros: Array<Partial<{ bairro: string, check: boolean,id_empresa:string }>>
  setArrayBairros: (array: Array<Partial<{ bairro: string, check: boolean,id_empresa:string }>>) => void
}

export function ModalFiltroCobranca({ loading, setFiltro, show, listarCobranca, selectCobrador, arrayBairros, empresa }: DataProps) {
  const [dropCobrador, setDropCobrador] = useState<boolean>(false)
  const { register, watch, handleSubmit, control, setValue } = useForm<FormProps>({
    defaultValues: {
      cobrador:selectCobrador,
      id_empresa: empresa,
    }
  })



  const toggleBairro = (index: number)=> {
    
    setValue('bairros',
      watch('bairros').map((item,i)=> i===index ? {...item,check:!item.check}:item)
    )
  }


  const toggleCobrador = (index: number) =>
    setValue(
      "cobrador",
      watch("cobrador").map((item, i) =>
        i === index ? { ...item, check: !item.check } : item
      )
    );








 useEffect(()=>{
   if(empresa){
      setValue('bairros',(arrayBairros.filter(item=>item.id_empresa===empresa)))
   }else setValue('bairros',[])
    
  },[empresa]) 








  return (
    <Modal dismissible size={'lg'} show={show} onClose={() => setFiltro(false)}>
      <Modal.Header >
        <div className='inline-flex items-center'>
          <HiFilter color='gray' size={30} />
          Filtro
        </div>

      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(listarCobranca)} className='space-y-2'>


          <div className="inline-flex gap-4 w-full">
         
            <div className="w-full">
              <div className=" block">
                <Label htmlFor="email1" value="Status" />
              </div>

              <Select sizing={'sm'} {...register('status')}>
                <option value="A,R" >ABERTO/REAGENDADO</option>
                <option value="A" >ABERTO</option>
                <option value="R" >REAGENDADO</option>
              </Select>
            </div>

          </div>




          <div className="inline-flex gap-4 w-full">

            <div className="w-full h-full">
              <div className=" block">
                <Label value="Bairros" />
              </div>
              <Dropdown dismissOnClick={false} placement="bottom" label="Bairros" renderTrigger={() => (

                <button type="button"
                  className="flex w-full h-full justify-between items-center py-2 pl-2 pr-2 uppercase border rounded-lg  text-xs bg-gray-50 border-gray-300 placeholder-gray-400 text-gray-500 ">

                 SELECIONE OS BAIRROS
                  <IoIosArrowDown size={16} />


                </button>

              )}>
                <ul className="max-h-64 overflow-y-auto  px-2"> {/* Limite de altura com rolagem */}

           
                  {watch('bairros')?.map((item, index) => (

                    <li key={index}  className="flex  items-center gap-4 p-2">
                      <Checkbox onChange={() => toggleBairro(index)} checked={item.check} id={`bairro-${index}`} />
                      <Label className="hover:cursor-pointer" htmlFor={`bairro-${index}`}>{item.bairro}</Label>
                    </li>

                  ))}
                </ul>



              </Dropdown>
            </div>




            <div className="w-full">
              <div className=" block">
                <Label htmlFor="cobrador" value="Cobrador" />
              </div>


              <div>
                <button type="button" onClick={() => setDropCobrador(!dropCobrador)}
                  className="flex w-full h-full justify-between items-center py-2 pl-2 pr-2 uppercase border rounded-lg  text-xs bg-gray-50 border-gray-300 placeholder-gray-400 text-gray-500 ">

                  COBRADOR
                  <IoIosArrowDown size={16} />
                </button>
                {dropCobrador && <ul className="flex bg-white flex-col w-3/6 absolute z-50 top-[230px]  left-60 max-h-64 overflow-y-auto   p-1 rounded-lg  border-[1px] border-gray-300">
                
                  {watch('cobrador')?.map((item, index) => {
                    return (
                     item.funcao==='COBRADOR (RDA)' && <li key={item.id_consultor} className="flex items-center px-2 py-1">
                        <input onChange={() => toggleCobrador(index)} type="checkbox" checked={item.check}  />
                        <label className="ms-2 font-semibold text-xs whitespace-nowrap ">{item?.nome.toUpperCase()}</label>
                      </li>
                    )
                  })}
                </ul>}



              </div>
            </div>

          </div>



          <div className='inline-flex gap-4 w-full justify-between'>
            <div  className=" flex flex-col w-full" >
              <div className=" block">
                <Label value="Data inicio" />
              </div>
              <Controller
                control={control}
                name="startDate"
                render={({ field: { onChange, value } }) => (
                  <DatePicker selected={value} onChange={e => { e && onChange(e) }} dateFormat={"dd/MM/yyyy"} locale={pt} className="flex w-full    text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                )}
              />

            </div>
            <div className="flex flex-col w-full" >
              <div className=" block">
                <Label value="Data Fim" />
              </div>
              <Controller
                control={control}
                name="endDate"
                render={({ field: { onChange, value } }) => (
                  <DatePicker selected={value} onChange={e => { e && onChange(e) }} dateFormat={"dd/MM/yyyy"} locale={pt} className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                )}
              />
            </div>
          </div>

          <Button type="submit" isProcessing={loading} className='cursor-pointer ml-auto' size={'sm'}>Aplicar Filtro</Button>


        </form>
      </Modal.Body>
    </Modal>

  )

}