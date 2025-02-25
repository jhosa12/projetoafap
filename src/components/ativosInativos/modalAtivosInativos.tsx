
import { Controller, useForm } from "react-hook-form"
import { Dialog, DialogTrigger,DialogContent, DialogHeader } from "../ui/dialog"
import { useEffect, useRef, useState } from "react"
import { Select, SelectItem,SelectContent, SelectTrigger } from "../ui/select"
import { SelectValue } from "@radix-ui/react-select"
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { Button } from "../ui/button"
import useApiPost from "@/hooks/useApiPost"
import { AtivosInativos } from "@/Documents/ativosInativos/ListaAtivosInativos"
import { useReactToPrint } from "react-to-print"
import pageStyle from "@/utils/pageStyle"
import { ajustarData } from "@/utils/ajusteData"

interface ModalProps{
    open:boolean
    onClose:()=>void,
    id_empresa:string
}

interface FormProps{
    startDate:Date,
    endDate:Date,
    tipo:string
}


interface RequestProps{
    startDate?:string,
    endDate?:string,
    tipo:string
}

interface ResponseProps{
    id_contrato:number,
    dt_adesao:Date,
    dt_cancelamento:Date,
    associado:{
            nome:string,
            endereco:string,
            bairro:string,
            cidade:string,
            celular1:string,
        
    }
}

export const ModalAtivosInativos = ({open,onClose,id_empresa}:ModalProps) => {
    const currentRef = useRef<AtivosInativos>(null)
    const {register,watch,setValue,handleSubmit,reset,control} = useForm<FormProps>({
        defaultValues: {
            startDate: new Date(new Date().setDate(1)),
            endDate: new Date(),
          
        }
    })
    const {data,loading,postData,setData} = useApiPost<Array<ResponseProps>,RequestProps>('/listarAtivosInativos')

    const onSubmit = async (data:FormProps) => {
        const {dataIni,dataFim} = ajustarData(data.startDate,data.endDate)
        await postData({
            ...data,
            startDate:dataIni,
            endDate:dataFim
        })
       // onClose()
    }

    useEffect(()=>{

        if(data) imprimir()
          //  console.log(data)   
    },[data])

    const imprimir = useReactToPrint({
        pageStyle:pageStyle,
        content:()=>currentRef.current,
        onAfterPrint:()=>setData(null)
    })
    
  
    return(
        <Dialog open={open} onOpenChange={onClose} >
           
            <DialogContent className="max-w-sm">
                <DialogHeader>Ativos/Inativos</DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3 w-full">

                    <div>
                        <label className="text-xs  font-semibold">Tipo</label>

                        <Controller
                        control={control}
                        name="tipo"
                        render={({ field }) => (
                            <Select required value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="text-[11px] h-9">
                                    <SelectValue placeholder="SELECIONE"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem className="text-[11px]" value="ATIVO">ATIVOS</SelectItem>
                                    <SelectItem className="text-[11px]" value="INATIVO">INATIVOS</SelectItem>
                                </SelectContent>

                            </Select>
                        )}
                        />
                   

                    </div>

                        <div className="inline-flex w-full gap-4">
                      <div className="flex flex-col">
                            
                              <label className="text-xs font-semibold">Data Inicial</label>
                          
                            <Controller
                            control={control}
                            name="startDate"
                            render={({ field:{ onChange, value} }) => (
                                <DatePicker selected={value} onChange={e=>e && onChange(e)}  dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full shadow-sm uppercase  z-50 text-[11px] leading-[14px]   border  rounded-sm    border-gray-200 placeholder-gray-400  " />
                            )}
                            />
                          
                          </div>


                          <div className="flex flex-col">
                            
                            <label className="text-xs  font-semibold">Data Final</label>
                        
                          <Controller
                          control={control}
                          name="endDate"
                          render={({ field:{ onChange, value} }) => (
                              <DatePicker selected={value} onChange={e=>e && onChange(e)}  dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full shadow-sm uppercase  z-50 text-[11px] leading-[14px]   border  rounded-sm    border-gray-200 placeholder-gray-400  " />
                          )}
                          />
                        
                        </div>

                          </div>


                          <Button type="submit"  size={'sm'} className="ml-auto">Aplicar</Button>
                        {data && data?.length>1 && <div style={{display:'none'}}>
                            <AtivosInativos ref={currentRef} dados={data??[]} usuario=""   />
                          </div>}
                </form>
            </DialogContent>
        </Dialog>
    )
}