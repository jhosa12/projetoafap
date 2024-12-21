import { IoIosClose } from "react-icons/io";
import { MdSaveAlt } from "react-icons/md";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { useForm,SubmitHandler } from 'react-hook-form';
import { Button, Label, Modal, Select, Table, TextInput } from "flowbite-react";


interface MensalidadeProps {
    id_mensalidade_global: number,
    id_acordo: number,
    parcela_n: number,
    vencimento: Date,
    cobranca: Date,
    valor_principal: number,
    status: string,
    usuario: string,
    id_mensalidade: number,
    valor_total: number,
    motivo_bonus: string,
    data_pgto: Date,
    referencia: string,
    index: number
}

interface FormProps{
    total_acordo: number,
    data_inicio: Date,
    data_fim: Date,
    realizado_por: string,
    dt_pgto: Date,
  // mensalidade: Array<MensalidadeProps>,
    status: string,
    descricao: string,
    metodo: string
    closeAcordo: boolean,
    id_acordo: number,
    visibilidade: boolean
}

interface AcordoProps {
    total_acordo: number,
    data_inicio: Date,
    data_fim: Date,
    realizado_por: string,
    dt_pgto: Date,
    mensalidade: Array<Partial<MensalidadeProps>>,
    status: string,
    descricao: string,
    metodo: string
    closeAcordo: boolean,
    id_acordo: number,
    visibilidade: boolean
}
interface DadosAcordoProps{
    closeModal:(fields:{open:boolean,visible:boolean})=>void,
    openModal:{open:boolean,visible:boolean}
    acordo:Partial<AcordoProps>,
    usuario:{nome:string,id:number},
    mensalidade:Array<Partial<MensalidadeProps>>
    contrato:number,
    id_contrato_global:number,
    id_global:number,
    associado:number
    carregarDados:(id:number)=>Promise<void>
}
export function ModalAcordos({closeModal,acordo,usuario,mensalidade,contrato,associado,carregarDados,openModal,id_contrato_global,id_global}:DadosAcordoProps){
 const [mensalidadesAcordo, setMensalidadesAcordo] = useState<Array<Partial<MensalidadeProps>>>(acordo.mensalidade??[]);

    const {register,handleSubmit,formState:{errors},watch,setValue} = useForm<FormProps>({
        defaultValues:{...acordo,total_acordo:acordo.mensalidade?.reduce((acc,at)=>{
            return acc+Number(at?.valor_principal)
        },0)}
    });







const onSubmit:SubmitHandler<FormProps> = (data) => {
    console.log(data)
   
    
}

    function adicionarProxima() {
        const ultimoIndex = mensalidade.findLastIndex((item) => item.status === 'E');
        if (ultimoIndex >= 0) {
            setMensalidadesAcordo((prevState) =>
                prevState ? [...prevState, mensalidade[ultimoIndex + 1]] : [mensalidade[ultimoIndex + 1]]
            );
        }
    }

        
            
            
        
       const valor_total =mensalidadesAcordo.reduce((total,mensalidade)=>total+Number(mensalidade.valor_principal),0)
       // if(!arrayAcordo.total_acordo && !arrayAcordo?.data_inicio) 
          //   closeModa({acordo:{...data.acordo, mensalidade:data.acordo?.mensalidade,total_acordo:valor_total,//data_inicio:new Date()}});

       const criarAcordo:SubmitHandler<FormProps> = async (data) => {
        const novasMensalidades = mensalidadesAcordo?.map(mensal=>{
            return {...mensal,status:'E',cobranca:watch('data_fim')}
        })
        if(!mensalidadesAcordo){
        toast.info("Selecione as referências do acordo!")
        return;
        }
        if(!data.data_inicio||!data.data_fim||!data.descricao||!data.realizado_por){
            toast.info("Preencha todos os campos!")
            return;
        }
        try{
            const response = await toast.promise(
                api.post('/novoAcordo',{
                    id_contrato:contrato,
                    id_contrato_global,
                    id_global,
                    status:'A',
                    id_associado:associado,
                    data_inicio:data.data_inicio,
                    data_fim:data.data_fim,
                    total_acordo:data.total_acordo,
                    realizado_por:data.realizado_por ,
                    descricao:data.descricao,
                    metodo:data.metodo,
                    dt_criacao:new Date() ,
                    mensalidades:novasMensalidades
                }),
                {
                    error:'Erro na requisição',
                    success:'Acordo criado com sucesso',
                    pending:'Criando acordo'
                }
            )
            toast.success("Acordo criado com sucesso")
            closeModal({open:false,visible:false})

        }catch(err){
            console.log(err)
        }
    }
    
     

      async function baixarAcordo(){
        const novasMensalidades = mensalidadesAcordo?.map(mensal=>{
            return {...mensal,status:'P',data_pgto:new Date(),usuario:usuario.nome,valor_total:mensal.valor_principal}
        }
        )
        try{
            const response = await toast.promise(
                api.put('/editarAcordo',{
               id_acordo:watch('id_acordo'),
               id_usuario:usuario?.id,
               id_contrato:contrato,
                status:'P',
                dt_pgto:new Date(),
                mensalidade:novasMensalidades
                }),
                {
                error:'Erro ao efetuar baixa',
                pending:'Efetuando Baixa',
                success:'Baixa Efetuada com sucesso!'
                }
            )

        }catch(err){

            console.log(err)
            
        }
        await carregarDados(associado);
      }

      async function editarAcordo(){
        const novasMensalidades = mensalidadesAcordo?.map(mensal=>{
            return {...mensal,status:'E'}
        }
        )

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
                mensalidade:novasMensalidades
                }),
                {
                error:'Erro ao efetuar atualização',
                pending:'Efetuando atualização',
                success:'Atualização Efetuada com sucesso!'
                }
            )


        }catch(err){
            console.log(err)
            
        }
        
      }
     
    return(
   
  <Modal show size={'4xl'} onClose={()=>closeModal({open:false,visible:false})}>
    <Modal.Header>Administrar Acordo</Modal.Header>
    <Modal.Body>
        <form className="font-semibold" onSubmit={handleSubmit(criarAcordo)}>
       
        <div className="  border-gray-600 grid  gap-2 grid-flow-row-dense grid-cols-4">
       
        <div className="flex flex-col w-full">
       
          <Label htmlFor="startDate" value="Data Início" />
    
        <DatePicker selected={watch('data_inicio')} showMonthDropdown  onChange={e=>e && setValue('data_inicio',e)}  dateFormat={"dd/MM/yyyy"} locale={pt}   required className="flex w-full  sm:text-xs  border  rounded-lg bg-gray-50 
      border-gray-300 placeholder-gray-400  "/>
      </div>

      <div  className="flex flex-col w-full">
       
       <Label  htmlFor="endDate" value="Data Fim" />
 
     <DatePicker selected={watch('data_fim')} showMonthDropdown  onChange={e=>e && setValue('data_fim',e)} dateFormat={"dd/MM/yyyy"} locale={pt}   required className="flex w-full  sm:text-xs  border  rounded-lg bg-gray-50 
      border-gray-300 placeholder-gray-400  "/>
   </div>

   <div  className="flex flex-col w-full">
       
       <Label  htmlFor="total" value="Total Acordo" />
 
    <TextInput {...register("total_acordo")} sizing={'sm'}/>
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
<div className=" gap-2 col-span-4 mt-2 flex flex-row justify-end">
{openModal.visible?(
<Button size={'sm'} color={'success'}  type="submit" ><MdSaveAlt size={22}/>Criar Acordo</Button>):(
<div className=" inline-flex w-full justify-between">
<Button size={'sm'} color={'blue'} onClick={()=>editarAcordo()} type="button" ><MdSaveAlt className="mr-2 h-5 w-5"/>SALVAR</Button>
<Button size={'sm'} onClick={()=>baixarAcordo()} type="button" ><IoIosArrowDropdownCircle className="mr-2 h-5 w-5"/>BAIXAR ACORDO</Button>
</div>
)}
</div>
   

</form>
</Modal.Body>
<Modal.Footer className="flex flex-col w-full">
<label className="flex w-full justify-center  font-semibold pt-1">REFERÊNCIAS</label>

<div className="flex w-full justify-end">
<Button disabled={!!!acordo.id_acordo} color={'blue'}  size={'xs'}  onClick={adicionarProxima}  >
   Incluir Parcela
  </Button>
</div>




<div className=" max-h-[350px] overflow-y-auto w-full">
    <Table theme={{ body: { cell: { base: " px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs text-black" } } }}   >
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
            {mensalidadesAcordo?.map((item,index)=>(  
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
    </Modal.Footer>
    </Modal>
)
}