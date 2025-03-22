
import { Button, Label, Modal, Radio, Select, Table, TextInput } from "flowbite-react"
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { MetasProps, SetorProps } from "./acompanhamento";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { api } from "@/lib/axios/apiClient";
import { toast } from "react-toastify";
import { useContext } from "react";
import { PlanoContasProps } from "@/pages/dashboard/financeiro";
import { watch } from "fs";

interface DataProps{
    planoContas?:Array<PlanoContasProps>
    show:boolean,
    setModalMetas:(open:boolean)=>void
    arraySetores:Array<SetorProps>
    meta:Partial<MetasProps>
    arrayMetas :Array<MetasProps>
    id_empresa:string,
    handleNovaMeta:(data:FormProps)=>Promise<void>
}
export interface FormProps{
    date:Date,
    id_meta:number,
    dateFimMeta:Date,
    valor:number|null,
    descricao:string,
    setor:string,
    id_grupo:number|null,
    radio:string
}

export function ModalMetas({show,setModalMetas,meta,arraySetores,arrayMetas,id_empresa,handleNovaMeta,planoContas}
:DataProps){
    const {register,control,handleSubmit,watch,setValue} = useForm<FormProps>({
        defaultValues:meta
    })
    




    const handleOnSubmit:SubmitHandler<FormProps> = (data) => {
        meta.id_meta ? handleEdit(data) : handleNovaMeta(data)
    }




    const handleEdit= async(data:FormProps)=>{

    }


  


        return(
            <Modal dismissible size={'lg'} show={show} onClose={() => setModalMetas(false)}>

            <Modal.Body>
                <form onSubmit={handleSubmit(handleOnSubmit)} className='grid grid-cols-2 gap-2 '>


                    <div className="col-span-2 inline-flex justify-around">
                    <div className="flex items-center gap-2">
        <Radio id="united-state"  value="VENDAS" {...register('radio')} checked={watch('radio') === 'VENDAS'} />
        <Label htmlFor="united-state">Meta Vendas</Label>
      </div>

      <div className="flex items-center gap-2">
        <Radio id="united-state" value='GASTOS'  {...register('radio')}  checked={watch('radio') === 'GASTOS'}  />
        <Label htmlFor="united-state">Meta Gastos</Label>
      </div>
     
                    </div>
{watch('radio')==='GASTOS' &&
                <div className="col-span-2">
                        
                        <Label htmlFor="email1" value="Plano de Contas" />
               
    
                    <Select sizing={'sm'} {...register('id_grupo')} onChange={e => {
                        const item = planoContas?.find(item => item.id_grupo === Number(e.target.value))
                      
    
                    }}>
                        <option value={0}>PLANO DE CONTAS</option>
    
                        {planoContas?.map((item, index) => (
                            <option className="text-xs" key={index} value={item.id_grupo}>
                                {item.descricao}
                            </option>
    
                        ))}
                    </Select>
                </div>}




                    <div>
                        
                            <Label htmlFor="email1" value="Setor" />
                   
        
                        <Select sizing={'sm'} {...register('id_grupo')} onChange={e => {
                            const item = arraySetores?.find(item => item.id_grupo === Number(e.target.value))
                          
        
                        }}>
                            <option value={0}>SETOR (TODOS)</option>
        
                            {arraySetores?.map((item, index) => (
                                <option className="text-xs" key={index} value={item.id_grupo}>
                                    {item.descricao}
                                </option>
        
                            ))}
                        </Select>
                    </div>



                    <div >
                 
        <Label  value="Descrição" />
        
        
        <TextInput sizing="sm" {...register('descricao')}  type="text" placeholder="DESCRIÇÃO" required />
                      
                    </div>






        
                    <div className='flex flex-col w-full'>
                 
        <Label  value="Data inicio" />
     <Controller
        control={control}
        name="date"
        render={({ field:{onChange,value} }) => (
                 <DatePicker selected={value} onChange={e => { e && onChange( e ) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
        )}                        
     />
                       
                    </div>
        
        
                    <div className='flex flex-col w-full' >
                
        <Label  value="Data Fim" />
        <Controller
        control={control}
        name="dateFimMeta"
        render={({ field:{onChange,value} }) => (
             <DatePicker selected={value} onChange={e => { e && onChange(e) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase  text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
        )}
        />
                       
                    </div>
        
                    <div className='flex flex-col w-full'>
                 
        <Label  value="Valor" />
        
        
        <TextInput sizing="sm" {...register('valor')}  type="number" placeholder="Valor" required />
                      
                    </div>
                    <Button className="col-span-2" type="submit" size={'sm'}>{meta?.id_meta ? "Atualizar" : "Adicionar"}</Button>
                    
        
                </form>
        
             
        
        
            </Modal.Body>
        </Modal>
        )
   

}