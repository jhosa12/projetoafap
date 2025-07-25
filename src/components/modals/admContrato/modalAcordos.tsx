

import { useEffect, useState } from "react";
import { api } from "@/lib/axios/apiClient";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { useForm,SubmitHandler, Controller } from 'react-hook-form';
import { Button, Label, Modal, Select, Table, TextInput } from "flowbite-react";
import { AcordoProps, MensalidadeProps } from "@/types/financeiro";
import { ConsultoresProps } from "@/types/consultores";
import { MdClose } from "react-icons/md";
import { toast } from "sonner";



interface DadosAcordoProps{
    acordo:Partial<AcordoProps>,
    open:boolean,
    close:Function,
 
    mensalidades:Array<Partial<MensalidadeProps>>
    id_contrato_global:number|null,
    id_global:number|null,
    id_empresa:string,
    id_contrato:number|undefined,
    id_associado:number|undefined,
    consultores:Array<Partial<ConsultoresProps>>
    carregarDados:(id:number)=>Promise<void>
}
export function ModalAcordos({acordo,id_empresa,open,close,mensalidades,carregarDados,id_contrato_global,id_global,id_associado,id_contrato,consultores}:DadosAcordoProps){
 
 const [mensalidadeSelect,setMensalidade] = useState<number|null>(null)

    const {register,handleSubmit,watch,setValue,control} = useForm<AcordoProps>({
        defaultValues:{...acordo,total_acordo:acordo.mensalidade?.reduce((acc,at)=>{
            return acc+Number(at?.valor_principal)
        },0)}
    });

    const gatilho = watch('mensalidade')





    useEffect(()=>{
        const soma = gatilho?.reduce((acc,at)=>{
            return acc+Number(at?.valor_principal)
        },0)
        setValue('total_acordo',soma)
     
    },[gatilho])






    const handleRemove = async(id_mensalidade_global:number)=>{
        if(acordo.id_acordo){
         
                 toast.promise(
                    api.put(`/acordo/removerMensalidade`,{id_mensalidade:id_mensalidade_global,id_acordo:null}),
                    {
                        loading: 'Removendo...',
                        success: async()=>{
                            id_global && await carregarDados(id_global);
                            const array = watch('mensalidade')||[];
                            const newArray = array.filter(item => item.id_mensalidade_global !== id_mensalidade_global);
                            setValue('mensalidade',newArray)
                            
                            return'Mensalidade removida com sucesso!'},
                        error: 'Erro ao remover mensalidade'
                    }
                )

             
        
    
          return;      
    }


    const array = watch('mensalidade')||[];
    const newArray = array.filter(item => item.id_mensalidade_global !== id_mensalidade_global);
    setValue('mensalidade',newArray)
    }






const handleNovaRef = async()=>{
 
    const mensalidade = mensalidades.find(mensalidade=>mensalidade.id_mensalidade_global===mensalidadeSelect)
   
    const mensalidadeArray = watch('mensalidade')||[];
    const isExists =mensalidadeArray?.some(item => item.referencia === mensalidade?.referencia);
    if(isExists){
    toast.info("Referência já inclusa no acordo!")
    return;
    }

    if(mensalidade?.id_acordo){
        toast.info("Mensalidade ja vinculada a outro acordo!")
        return
    }


    if(acordo.id_acordo){
     
             toast.promise(
                api.put(`/acordo/removerMensalidade`,{id_mensalidade:mensalidade?.id_mensalidade_global,id_acordo:acordo.id_acordo}),
                {
                    loading: 'Adicionando...',
                    success:async(response)=>{
                        id_global && await carregarDados(id_global);
                        const array = watch('mensalidade')||[];
                        array.push(response.data);
                        setValue('mensalidade',array)
                        return'Mensalidade adicionada com sucesso!'},
                    error: 'Erro ao adicionar mensalidade'}
            )

           
      

      return;      
}

    if(mensalidade){
        const array = [...mensalidadeArray];
        array.push(mensalidade);
        array.sort((a,b)=>Number(a.id_mensalidade_global)-Number(b.id_mensalidade_global))
          setValue('mensalidade',array)
    }
    
}

const handleConsultorSelect = (id_consultor:number)=>{
    setValue('id_consultor',id_consultor)
    setValue('realizado_por',consultores?.find(consultor=>consultor.id_consultor===id_consultor)?.nome)
}




const onSubmit:SubmitHandler<AcordoProps> = (data) => {
    acordo.id_acordo?editarAcordo(data):criarAcordo(data)
}


       const criarAcordo = async (data:AcordoProps) => {
     
        if(!data.data_inicio||!data.data_fim||!data.descricao||!data.id_consultor){
            toast.info("Preencha todos os campos!")
            return;
        }
       

        const dt_criacao= new Date();
        const dt_prev = new Date(data.data_fim);
        dt_criacao.setTime(dt_criacao.getTime() - dt_criacao.getTimezoneOffset() * 60 * 1000);
        dt_prev.setTime(dt_prev.getTime() - dt_prev.getTimezoneOffset() * 60 * 1000);
     
        
          toast.promise(
                api.post('/novoAcordo',{
                  
                    id_empresa,
                    id_contrato_global,
                    id_global,
                    id_consultor:Number(data.id_consultor),
                    status:'A',
                    data_inicio:dt_criacao.toISOString(),
                    data_fim:dt_prev.toISOString(),
                    total_acordo:Number(data.total_acordo),
                    realizado_por:data.realizado_por,
                    descricao:data.descricao,
                    metodo:data.metodo,
                    dt_criacao:new Date() ,
                    mensalidades:data.mensalidade,
                    id_contrato:id_contrato,
                    id_associado:id_associado
                }),
                {
                    error:'Erro na requisição',
                    success:()=>{
                        id_global && carregarDados(id_global);
                        close()
                        return 'Acordo criado com sucesso'},
                    loading:'Criando acordo'
                }
            )
          //  toast.success("Acordo criado com sucesso")
         

     
    }
    
     

   

      async function editarAcordo(data:AcordoProps){
          

     
         toast.promise(
                api.put('/editarAcordo',{
               id_acordo:data.id_acordo,
                //status:'A',
                //dt_pgto:new Date(),
                data_inicio:data.data_inicio,
                data_fim:data.data_fim,
                descricao:data.descricao.toUpperCase(),
                metodo:data.metodo,
                total_acordo:data.total_acordo,
                realizado_por:data.realizado_por,
                id_consultor:Number(data.id_consultor),
                //mensalidade:novasMensalidades
                //mensalidades:data.mensalidade
                }),
                {
                error:'Erro ao efetuar atualização',
               loading:'Efetuando atualização',
                success:'Atualização Efetuada com sucesso!'
                }
            )


    
        
      }
     
    return(
   
  <Modal show={open} size={'5xl'} onClose={()=>close()}>
    <Modal.Header>Administrar Acordo</Modal.Header>
    <Modal.Body>
        <form className="font-semibold" onSubmit={handleSubmit(onSubmit)}>
       
        <div className="  border-gray-600 grid mb-1 gap-2 grid-flow-row-dense grid-cols-4">
       
        <div className="flex flex-col w-full">
       
          <Label htmlFor="startDate" value="Data Criação" />


          <Controller
            control={control}
            name="data_inicio"
            render={({ field: { onChange, value } }) => (
                 <DatePicker selected={watch('data_inicio')} showMonthDropdown  onChange={e=>e && setValue('data_inicio',e)}  dateFormat={"dd/MM/yyyy"} locale={pt}   required className="flex w-full  sm:text-xs  border  rounded-lg bg-gray-50 
      border-gray-300 placeholder-gray-400  "/>
            )}
          />
    
       
      </div>

      <div  className="flex flex-col w-full">
       
       <Label  htmlFor="endDate" value="Data Prevista" />
 <Controller
 control={control}
 name="data_fim"
 render={({ field: { onChange, value } }) => (
       <DatePicker selected={value} showMonthDropdown  onChange={e=>e && onChange(e)} dateFormat={"dd/MM/yyyy"} locale={pt}   required className="flex w-full  sm:text-xs  border  rounded-lg bg-gray-50 
      border-gray-300 placeholder-gray-400  "/>
 )}
 />
   
   </div>

   <div  className="flex flex-col w-full">
       
       <Label  htmlFor="total" value="Total Acordo" />
 
    <TextInput required disabled {...register("total_acordo")} sizing={'sm'}/>
   </div>

   <div  className=" flex flex-col w-full">
       
       <Label  htmlFor="metodo" value="Realizado Por" />

       <Select value={watch('id_consultor')} onChange={(e)=>handleConsultorSelect(Number(e.target.value))}  required sizing={'sm'} >
        <option value="">SELECIONE</option>
        {consultores.map((item,index)=>(<option key={index} value={item.id_consultor}>{item.nome}</option>))}
       </Select>
   </div>


   <div className="col-span-3 flex flex-col w-full">
       
       <Label  htmlFor="descricao" value="Descrição" />
 
    <TextInput required  className="uppercase" placeholder="Descreve os detalhers do acordo" {...register("descricao")} sizing={'sm'}/>
   </div>
 



   <div  className=" flex flex-col w-full">
       
       <Label  htmlFor="metodo" value="Método" />

       <Select required sizing={'sm'} {...register("metodo")} >
        <option value="">SELECIONE</option>

        <option value="DINHEIRO">DINHEIRO</option>
        <option value="CARTAO">CARTÃO</option>
        <option value="PIX">PIX</option>
        <option value="TRANSFERENCIA">TRANSFERÊNCIA</option>

       </Select>
 
 
   </div>

   <div className="col-span-4">
   {acordo.id_acordo && <Button className="ml-auto" type="submit" size="sm">{'EDITAR'}</Button>}
   </div>
 


</div>

<Modal.Footer className="flex flex-col w-full">
<label className="flex w-full justify-center  font-semibold ">REFERÊNCIAS</label>

<div className="flex w-full gap-2">
        <Select value={mensalidadeSelect??undefined} onChange={e=>setMensalidade(Number(e.target.value))} sizing={'sm'} className="ml-auto">
            <option value="">REFERÊNCIA</option>
            {mensalidades.map((item,index)=>(<option key={index} value={item.id_mensalidade_global}>{item.referencia}</option>))}
        </Select>
        <Button onClick={handleNovaRef} size="xs">ADICIONAR</Button>
</div>


<div className=" max-h-[350px] overflow-y-auto w-full">
    <Table theme={{root:{shadow:'none'},body:{cell:{base:"px-6 py-1 text-xs"}},head:{cell:{base:"px-6 py-1"}}}}   >
    <Table.Head >
          
                <Table.HeadCell>
                    NP
                </Table.HeadCell>
                <Table.HeadCell >
                    DATA VENC.
                </Table.HeadCell>
                <Table.HeadCell >
                    REF
                </Table.HeadCell>
                <Table.HeadCell >
                    DATA AGEND.
                </Table.HeadCell>
                <Table.HeadCell>
                    VALOR
                </Table.HeadCell>
                <Table.HeadCell>
                    status
                </Table.HeadCell>
                <Table.HeadCell>
                    
                </Table.HeadCell>
           
        </Table.Head>
        <Table.Body className="divide-y" >
            {watch('mensalidade')?.map((item,index)=>(  
                <Table.Row key={index} 
                className="text-gray-900 font-semibold "
               >
                <Table.Cell >
                    {item.parcela_n}
                </Table.Cell>
                <Table.Cell>
                   {new Date(item.vencimento || '').toLocaleDateString('pt-BR',{timeZone:'UTC'})}
                   
                </Table.Cell>
                <Table.Cell >
                   {item.referencia}
                </Table.Cell>
                <Table.Cell >
                {new Date(item.cobranca || '').toLocaleDateString('pt-BR',{timeZone:'UTC'})}
                </Table.Cell>
                <Table.Cell >
               {Number(item.valor_principal).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
                </Table.Cell>
                <Table.Cell >
                  {item.status}
                </Table.Cell>
                <Table.Cell>
                   <button type="button" onClick={()=>handleRemove(Number(item.id_mensalidade_global))}> 
                   <MdClose className="text-red-600" size={15}/>
                    </button> 
                </Table.Cell>
            </Table.Row>
                
            ))}


<Table.Row 
                className="text-gray-900 font-semibold"
               >
                <Table.Cell >
                    TOTAL
                </Table.Cell>
                <Table.Cell>
                   {}
                   
                </Table.Cell>
                <Table.Cell >
                   {}
                </Table.Cell>
                <Table.Cell >
                {}
                </Table.Cell>
                <Table.Cell className="font-semibold text-blue-600" >
               {Number(watch('total_acordo')).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
                </Table.Cell>
                <Table.Cell >
                  {}
                </Table.Cell>

            </Table.Row>
            
        </Table.Body>
    
    </Table>
    </div>

    <div className="flex w-full">
{!acordo.id_acordo && <Button className="ml-auto" type="submit" size="sm">{'CRIAR'}</Button>}
    </div>
   
    </Modal.Footer>

</form>
</Modal.Body>

    </Modal>
)
}