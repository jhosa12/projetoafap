
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { HiFilter } from "react-icons/hi"
import {  Label, Modal, Select, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { MedicoProps } from "@/pages/dashboard/afapSaude";
import { Button } from "@/components/ui/button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { status } from "../consultas";
import { ConsultoresProps } from "@/types/consultores";
registerLocale('pt-br', pt)

interface DataProps{
    show:boolean,
    setFiltro:(open:boolean)=>void,
    buscarConsultas:({startDate,endDate,id_med}:{startDate:Date|undefined,endDate:Date|undefined,id_med?:number,status:string|undefined,buscar?:string,nome?:string,id_consultor?:number})=>Promise<void>,
    loading:boolean,
    medicos:Array<MedicoProps> 
    consultores:Array<Partial<ConsultoresProps>>

}


interface FiltroProps{
  startDate:Date|undefined,
  endDate:Date|undefined,
  id_med?:number,
  status:string|undefined,
  buscar?:string,
  nome?:string,
  id_consultor?:number
}

export function ModalFiltroConsultas({loading,setFiltro,show,buscarConsultas,medicos,consultores}:DataProps){

    const {register,handleSubmit,control} = useForm<FiltroProps>()

    const handleOnSubmit:SubmitHandler<FiltroProps>=(data:FiltroProps)=>{
   
      buscarConsultas({...data})
    }
    return(
        <Modal dismissible popup size={'md'} show={show} onClose={() => setFiltro(false)}>
          <Modal.Header/>
               {/* <Modal.Header >
                    <div className='inline-flex items-center'>
                    <HiFilter color='gray' size={30}/>
                    Filtro
                    </div>
                   
                    </Modal.Header>*/}
                <Modal.Body>
                 <form onSubmit={handleSubmit(handleOnSubmit)} className='space-y-2 flex flex-col w-full'>
                 <div >
                        <div className=" block">
          <Label className="text-xs"  value="Especialista" />
        </div>
                       <Select {...register('id_med')} sizing={'sm'}>
                        <option value={''}>Selecione</option>
                        {medicos.map((item,index)=>(<option key={index} value={item.id_med}>{item.nome}-{item.espec}</option>))}
                       </Select>
                        </div>



                        <div >
                        
          <Label className="text-xs"  value="Nome Cliente" />
        
                       <TextInput sizing="sm" {...register('nome')} type="text" placeholder="Nome" />
                        </div>

                        <div className="flex flex-col w-full" >
                        <div className="block">
          <Label className="text-xs"  value="Consultor" />
        </div>
                       <Select {...register('id_consultor')} sizing={'sm'}>
                        <option value={''}>Selecione o consultor</option>
                      {consultores.filter(item=>item.funcao=='PROMOTOR(A) DE VENDAS').map((item,index)=>(<option key={item.id_consultor} value={item.id_consultor}>{item.nome}</option>))}
                       </Select>
                        </div>


<div className="inline-flex w-full gap-2" >

<div className="flex flex-col w-full" >
                        <div className="block">
          <Label className="text-xs"  value="Status" />
        </div>
                       <Select {...register('status')} sizing={'sm'}>
                        <option value={''}>Selecione o status</option>
                      {status.map((item,index)=>(<option key={index} value={item}>{item}</option>))}
                       </Select>
                        </div>


                 


                        <div className="flex flex-col w-full" >
                        <div className="block">
          <Label className="text-xs"  value="Buscar ?" />
        </div>
                       <Select {...register('buscar')} sizing={'sm'}>
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

        <Controller
        name="startDate"
        control={control}
        render={({ field:{onChange,value} }) => (
          <DatePicker selected={value} onChange={onChange} dateFormat={"dd/MM/yyyy"} locale={pt} className="flex w-full  text-xs   border  rounded-lg   bg-gray-50 border-gray-300   " />
        )}
        />
                            
                        </div>
                        <div  >
                        <div className=" block">
          <Label className="text-xs"  value="Data Fim" />
        </div>

        <Controller
          name="endDate"
          control={control}
          render={({ field:{onChange,value} }) => (
            <DatePicker selected={value} onChange={onChange} dateFormat={"dd/MM/yyyy"} locale={pt} className="flex w-full  text-xs   border  rounded-lg   bg-gray-50 border-gray-300   " />
          )}
        />
                        </div>
                        </div>


                    
                        <Button variant={'outline'}  className='ml-auto'  type="submit" size={'sm'}>{loading && <Spinner color="gray" />}Aplicar Filtro</Button>
                  
                        </form>
                </Modal.Body>
            </Modal>

    )

}