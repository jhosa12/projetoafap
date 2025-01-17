
import { Button, Label, Modal, Select, Table, TextInput } from "flowbite-react"
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { MetasProps, SetorProps } from "./acompanhamento";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";

interface DataProps{
    show:boolean,
    setModalMetas:(open:boolean)=>void
    arraySetores:Array<SetorProps>
    meta:Partial<MetasProps>
    arrayMetas :Array<MetasProps>
    id_empresa:string
}
interface FormProps{
    date:Date,
    id_meta:number,
    dateFimMeta:Date,
    valor:number|null,
    descricao:string,
    setor:string,
    id_grupo:number|null
}

export function ModalMetas({show,setModalMetas,meta,arraySetores,arrayMetas,id_empresa}
:DataProps){
    const {register,control,handleSubmit} = useForm<FormProps>({
        defaultValues:meta
    })




    const handleOnSubmit:SubmitHandler<FormProps> = (data) => {
        meta.id_meta ? handleEdit(data) : handleNovo(data)
    }




    const handleEdit= async(data:FormProps)=>{

    }


   const handleNovo = async (data:FormProps) => {
        try {
         const response =   await toast.promise(
                api.post('/vendas/novaMeta', {
                    id_grupo: 1,
                    id_empresa,
                    date: data.date,
                    dateFimMeta: data.dateFimMeta,
                    valor: data.valor,
                    descricao: `META SETOR ${data.setor}`,
                }),
                {
                    error: 'Erro ao salvar dados',
                    pending: 'Salvando Dados....',
                    success: 'Dados Salvos com Sucesso',
                }
            );
          //  setMetas([...arrayMetas,response.data])
        } catch (error) {
            console.log(error)
            toast.error('Erro ao salvar nova meta');
        }
    };


        return(
            <Modal dismissible size={'sm'} show={show} onClose={() => setModalMetas(false)}>

            <Modal.Body>
                <form onSubmit={handleSubmit(handleOnSubmit)} className='flex flex-col gap-2 '>
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



                    <div className='flex flex-col w-full'>
                 
        <Label  value="Descrição" />
        
        
        <TextInput sizing="sm" {...register('descricao')}  type="text" placeholder="Descrição" required />
                      
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
                    <Button type="submit" size={'sm'}>{meta?.id_meta ? "Atualizar" : "Adicionar"}</Button>
                    
        
                </form>
        
             
        
        
            </Modal.Body>
        </Modal>
        )
   

}