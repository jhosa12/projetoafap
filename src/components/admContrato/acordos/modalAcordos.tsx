

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { useForm,SubmitHandler, Controller } from 'react-hook-form';
import { Button, Label, Modal, Select, Table, TextInput } from "flowbite-react";
import { AcordoProps, MensalidadeProps } from "@/types/financeiro";







interface DadosAcordoProps{
    acordo:Partial<AcordoProps>,
    open:boolean,
    close:Function,
   usuario:string,
   id_usuario:string
    mensalidades:Array<Partial<MensalidadeProps>>
    id_contrato_global:number|null,
    id_global:number|null,
    id_empresa:string,
    id_contrato:number|undefined,
    id_associado:number|undefined,
    carregarDados:(id:number)=>Promise<void>
}
export function ModalAcordos({acordo,id_empresa,usuario,id_usuario,open,close,mensalidades,carregarDados,id_contrato_global,id_global,id_associado,id_contrato}:DadosAcordoProps){
 
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

const handleNovaRef = ()=>{
 
    const mensalidade = mensalidades.find(mensalidade=>mensalidade.id_mensalidade_global===mensalidadeSelect)
   
    const mensalidadeArray = watch('mensalidade')||[];
    const isExists =mensalidadeArray?.some(item => item.referencia === mensalidade?.referencia);
    if(isExists){
    toast.info("Referência já inclusa no acordo!")
    return;
    }

 

    if(mensalidade){
        const array = [...mensalidadeArray];
        array.push(mensalidade);
        array.sort((a,b)=>Number(a.id_mensalidade_global)-Number(b.id_mensalidade_global))
          setValue('mensalidade',array)
    }
    
}






const onSubmit:SubmitHandler<AcordoProps> = (data) => {
    console.log(data)
}

        
            
            
        
     

       const criarAcordo:SubmitHandler<AcordoProps> = async (data) => {
     
        if(!data.data_inicio||!data.data_fim||!data.descricao||!data.realizado_por){
            toast.info("Preencha todos os campos!")
            return;
        }
        try{
            const response = await toast.promise(
                api.post('/novoAcordo',{
                    usuario,
                    id_usuario,
                    id_empresa,
                    id_contrato_global,
                    id_global,
                    status:'A',
                    data_inicio:data.data_inicio,
                    data_fim:data.data_fim,
                    total_acordo:Number(data.total_acordo),
                    realizado_por:data.realizado_por ,
                    descricao:data.descricao,
                    metodo:data.metodo,
                    dt_criacao:new Date() ,
                    mensalidades:data.mensalidade,
                    id_contrato:id_contrato,
                    id_associado:id_associado
                }),
                {
                    error:'Erro na requisição',
                    success:'Acordo criado com sucesso',
                    pending:'Criando acordo'
                }
            )
          //  toast.success("Acordo criado com sucesso")
           

        }catch(err){
          //  console.log(err)
        }
    }
    
     

      async function baixarAcordo(){
      
        
        try{
            const response = await toast.promise(
                api.put('/editarAcordo',{
               id_acordo:watch('id_acordo'),
               id_usuario:id_usuario,
             
                status:'P',
                dt_pgto:new Date(),
               // mensalidade:novasMensalidades
                }),
                {
                error:'Erro ao efetuar baixa',
                pending:'Efetuando Baixa',
                success:'Baixa Efetuada com sucesso!'
                }
            )

        }catch(err){

           // console.log(err)
            
        }
       id_global && await carregarDados(id_global);
      }

      async function editarAcordo(){
     

        try{
            const response = await toast.promise(
                api.put('/editarAcordo',{
               id_acordo:watch('id_acordo'),
                status:'A',
                dt_pgto:new Date(),
                data_inicio:watch('data_inicio')?watch('data_inicio'):acordo.data_inicio,
                data_fim:watch('data_fim')?watch('data_fim'):acordo.data_fim,
                descricao:watch('descricao').toUpperCase(),
                total_acordo:watch('total_acordo')?watch('total_acordo'):acordo.total_acordo,
                //mensalidade:novasMensalidades
                }),
                {
                error:'Erro ao efetuar atualização',
                pending:'Efetuando atualização',
                success:'Atualização Efetuada com sucesso!'
                }
            )


        }catch(err){
          //  console.log(err)
            
        }
        
      }
     
    return(
   
  <Modal show={open} size={'5xl'} onClose={()=>close()}>
    <Modal.Header>Administrar Acordo</Modal.Header>
    <Modal.Body>
        <form className="font-semibold" onSubmit={handleSubmit(criarAcordo)}>
       
        <div className="  border-gray-600 grid  gap-2 grid-flow-row-dense grid-cols-4">
       
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
       <DatePicker selected={watch('data_fim')} showMonthDropdown  onChange={e=>e && setValue('data_fim',e)} dateFormat={"dd/MM/yyyy"} locale={pt}   required className="flex w-full  sm:text-xs  border  rounded-lg bg-gray-50 
      border-gray-300 placeholder-gray-400  "/>
 )}
 />
   
   </div>

   <div  className="flex flex-col w-full">
       
       <Label  htmlFor="total" value="Total Acordo" />
 
    <TextInput disabled {...register("total_acordo")} sizing={'sm'}/>
   </div>

   <div  className="flex flex-col w-full">
       
       <Label  htmlFor="realizado" value="Realizado Por" />
 
    <TextInput {...register("realizado_por")} sizing={'sm'}/>
   </div>




   
   <div className="col-span-3 flex flex-col w-full">
       
       <Label  htmlFor="descricao" value="Descrição" />
 
    <TextInput value={watch('descricao')?.toUpperCase()} className="uppercase" placeholder="Descreve os detalhers do acordo" {...register("descricao")} sizing={'sm'}/>
   </div>
 



   <div  className=" flex flex-col w-full">
       
       <Label  htmlFor="metodo" value="Método" />

       <Select sizing={'sm'} {...register("metodo")} >
        <option value="">Selecione</option>

        <option value="DINHEIRO">DINHEIRO</option>
        <option value="CARTAO">CARTÃO</option>
        <option value="PIX">PIX</option>
        <option value="TRANSFERENCIA">TRANSFERÊNCIA</option>

       </Select>
 
 
   </div>



</div>

<Modal.Footer className="flex flex-col w-full">
<label className="flex w-full justify-center  font-semibold pt-1">REFERÊNCIAS</label>

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
           
        </Table.Head>
        <Table.Body className="divide-y" >
            {watch('mensalidade')?.map((item,index)=>(  
                <Table.Row key={index} 
                className="text-gray-900 font-semibold"
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

            </Table.Row>
                
            ))}
            
        </Table.Body>
    
    </Table>
    </div>

    <div className="flex w-full">
 <Button className="ml-auto" type="submit" size="sm">FECHAR</Button>
    </div>
   
    </Modal.Footer>

</form>
</Modal.Body>

    </Modal>
)
}