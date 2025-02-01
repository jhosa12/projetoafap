import { Button, Label, Popover, Select, TextInput } from "flowbite-react"
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { useState } from "react";
import { HiFilter } from "react-icons/hi";
import { MedicoProps } from "@/pages/afapSaude";
import { set } from "date-fns";
import { FiltroForm } from "./exames";
import { useForm,Controller, SubmitHandler } from "react-hook-form";

interface DataProps{
    openModal:boolean
    setOpenModal:()=>void
    loading:boolean
    filtroExames:({endDate,nome,startDate,status}:FiltroForm)=>Promise<void>
  
}




export function FiltroExames({openModal,setOpenModal,filtroExames,loading}:DataProps){

    const {register,handleSubmit,setValue,watch,control,reset} = useForm<FiltroForm>({
      defaultValues: { endDate:undefined,
        nome:undefined,
        startDate:undefined,
        status:''}
    })

    const handleOnSubmit:SubmitHandler<FiltroForm> = (data)=>{
        filtroExames(data)
    }

    return(

        <Popover
        theme={{ content: 'flex w-full z-10 overflow-hidden rounded-[7px]' }}
        aria-labelledby="area-popover"
        open={openModal}
        onOpenChange={setOpenModal}
        content={
          <form onSubmit={handleSubmit(handleOnSubmit)} className="flex w-64 flex-col gap-4 p-2 text-sm ">

         
          <TextInput className="font-semibold" sizing={'sm'} {...register('nome')} id="NOME" placeholder="NOME" />
           

            <Select {...register('status')} className="font-semibold" sizing={'sm'}>
            <option value="">STATUS</option>
              <option className="font-semibold" >ORÇAMENTO</option>
              <option className="font-semibold" >RECEBIDO</option>
    
            </Select>
        
            <div className=" flex w-full gap-4">

              <div className="flex flex-col w-full">
              <Label className="text-xs" htmlFor="dateIn" value="Data Inicial"/>

                <Controller
                  control={control}
                  name="startDate"
                  render={({ field:{onChange,value} }) => (
                    <DatePicker
                    showMonthDropdown
                    showYearDropdown
                    dateFormat={"dd/MM/yyyy"}
                    locale={pt}
                    selected={value}
                    onChange={(date) => date && onChange(date)}
                    
                    className="flex w-full py-1.5 text-xs font-semibold pl-2 text-black  border rounded-lg  bg-gray-100 border-gray-300    "
                  />
                  )}

                
                />



                
              </div>
             

              <div className="flex flex-col w-full">
                <Label className="text-xs" htmlFor="date" value="Data Final"/>

                <Controller
                  control={control}
                  name="endDate"
                  render={({ field:{onChange,value} }) => (
                    <DatePicker
                    showMonthDropdown
                    showYearDropdown
                    dateFormat={"dd/MM/yyyy"}
                    locale={pt}
                    selected={value}
                    onChange={(date) => date && onChange(date)}
                    
                    className="flex w-full py-1.5 text-xs font-semibold pl-2 text-black  border rounded-lg  bg-gray-100 border-gray-300    "
                  />
                  )}
                />
             
              </div>
            </div>

           





            <Button size="sm" type="submit" className="ml-auto" color="success" isProcessing={loading} >
              Aplicar Filtro
            </Button>

          </form>
        }
      >
        <Button color="gray" size={'xs'} onClick={()=>reset()}>  <HiFilter className="mr-2 h-4 w-4" /> Filtro</Button>
      </Popover>






    )
    
    }