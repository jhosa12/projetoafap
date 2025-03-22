
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { HiFilter } from "react-icons/hi"
import {  Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { IoIosArrowDown } from "react-icons/io";
import { Controller, SubmitHandler, useForm} from "react-hook-form";
import { ConsultoresProps } from "@/types/consultores";
import { FormProps } from "./cobranca/cobranca";
import { MultiSelect } from "../../multi-select";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Button } from "../../ui/button";




interface DataProps {
  show: boolean,
  empresa:string,
  setFiltro: (open: boolean) => void,
  loading: boolean,
  listarCobranca: SubmitHandler<FormProps>,
  selectCobrador: Array<ConsultoresProps>
  arrayBairros: Array<Partial<{ bairro: string, check: boolean,id_empresa:string }>>
  setArrayBairros: (array: Array<Partial<{ bairro: string, check: boolean,id_empresa:string }>>) => void,
  inad:boolean
}

export function ModalFiltroCobranca({ loading, setFiltro, show, listarCobranca, selectCobrador, arrayBairros, empresa,inad }: DataProps) {
  const [dropCobrador, setDropCobrador] = useState<boolean>(false)
  const { register, watch, handleSubmit, control, setValue } = useForm<FormProps>({
    defaultValues: {
      status:'A,R',
     // cobrador:selectCobrador,
      id_empresa: empresa,
      startDate:new Date(),
      endDate:new Date(), 
     
    }
  })
 
 



 


  /*const toggleBairro = (index: number)=> {
    
    setValue('bairros',
      watch('bairros').map((item,i)=> i===index ? {...item,check:!item.check}:item)
    )
  }*/


 /* const toggleCobrador = (index: number) =>
    setValue(
      "cobrador",
      watch("cobrador").map((item, i) =>
        i === index ? { ...item, check: !item.check } : item
      )
    );*/


 /*useEffect(()=>{
   if(empresa){
      setValue('bairros',(arrayBairros.filter(item=>item.id_empresa===empresa)))
   }else setValue('bairros',[])
    
  },[empresa]) */



  return (
    <Modal dismissible size={'lg'} show={show} onClose={() => setFiltro(false)}>
      <Modal.Header >
        <div className='inline-flex items-center'>
          <HiFilter color='gray' size={30} />
          Filtro
        </div>

      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(listarCobranca)} className='flex flex-col space-y-2 w-full'>
{/*
          <div className="inline-flex gap-6 w-full">
          <div className="flex items-center gap-2">
        <Radio onChange={() => setValue('radio', true)} id="cobranca" name="countries" value="cobranca" checked={watch('radio')} />
        <Label htmlFor="united-state">Cobrança Resumida</Label>
      </div>
      <div className="flex items-center gap-2">
        <Radio onChange={() => setValue('radio', false)} id="inadimplencia" name="countries" value="inadimplencia" checked={!watch('radio')} />
        <Label htmlFor="united-state">Inadimplência</Label>
      </div>
          </div>*/}


          <Controller
            control={control}
            name="bairros"
            render={({ field }) => (
              <MultiSelect
              options={arrayBairros?.map((item, index) => ({ label: item.bairro?? '', value: item.bairro??'' }))??[]}
              onValueChange={field.onChange}
              defaultValue={field.value}
              placeholder="Selececione o bairro"
              variant="default"
              animation={undefined}
              maxCount={3}
            
            />
            )}
          />
   


   
   <Controller
            control={control}
            name="cobrador"
            render={({ field }) => (
              <MultiSelect
              options={selectCobrador?.map((item, index) => ({ label: item.nome?? '', value: item.nome??'' }))??[]}
              onValueChange={field.onChange}
              defaultValue={field.value}
              placeholder="Selececione o Cobrador"
              variant="default"
              animation={undefined}
              maxCount={3}
            
            />
            )}
          />

          <div className="inline-flex gap-4 w-full">
         
            <div className="w-full">
              <div className=" block">
                <Label className="text-xs" htmlFor="email1" value="Status" />
              </div>

              <Controller
              name="status"
              control={control}
              render={({ field: { onChange, value } }) => (
                  <Select  value={value} onValueChange={onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A,R">ABERTO/REAGENDADO</SelectItem>
                      <SelectItem value="A">ABERTO</SelectItem>
                      <SelectItem value="R">REAGENDADO</SelectItem>
                    </SelectContent>
                  </Select>
              )}
              />
            {/*  <Select sizing={'sm'} onChange={e => setValue('status', e.target.value)}>
                <option value="A,R" >ABERTO/REAGENDADO</option>
                <option value="A" >ABERTO</option>
                <option value="R" >REAGENDADO</option>
              </Select>*/}
            </div>

          </div>

 
          <div className='inline-flex gap-4 w-full justify-between'>
            <div  className=" flex flex-col w-full" >
              <div className=" block">
                <Label className="text-xs" value="Data inicio" />
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
                <Label className="text-xs" value="Data Fim" />
              </div>
              <Controller
                control={control}
                name="endDate"
                render={({ field: { onChange, value } }) => (
                  <DatePicker selected={value} onChange={e => { e && onChange(e) }} dateFormat={"dd/MM/yyyy"} locale={pt} className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                )}
              />
            </div>

                <div className="flex items-center mt-6 w-full gap-2 ">
                <Checkbox onChange={() =>setValue('periodo',!watch('periodo'))} checked={watch('periodo')} id={'periodo'} />
                <Label className="hover:cursor-pointer" htmlFor={`bairro`}>Todo Periodo</Label>
                </div>
           
          </div>

      { inad &&   <div className="inline-flex gap-4 w-full">
         
         <div className="w-full">
           <div className=" block">
             <Label className="text-xs" htmlFor="email1" value="Numero de parcelas" />
           </div>
                <div className="flex flex-row w-full gap-4">

                <Controller
              name="param_nparcela"
              control={control}
              render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="=">Igual a</SelectItem>
                      <SelectItem value=">">Maior que</SelectItem>
                      <SelectItem value="<">Menor que</SelectItem>
                    </SelectContent>
                  </Select>
              )}
              />
             

           <TextInput {...register('numeroParcelas')} placeholder="numero de parcelas" sizing={'sm'}  type="number"/>
                </div>
       
         </div>

       </div>}












          <Button variant={'outline'} type="submit" className='ml-auto' size={'sm'}>Aplicar Filtro</Button>
         
        
         


        </form>
      </Modal.Body>
    </Modal>

  )

}