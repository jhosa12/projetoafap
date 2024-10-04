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
import { Button, Label, Modal, Table, TextInput } from "flowbite-react";




interface MensalidadeProps {
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
    mensalidade: Array<MensalidadeProps>,
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
    mensalidade:Array<MensalidadeProps>
    contrato:number
    associado:number
    carregarDados:(id:number)=>Promise<void>
}
export function ModalAcordos({closeModal,acordo,usuario,mensalidade,contrato,associado,carregarDados,openModal}:DadosAcordoProps){
 const [mensalidadesAcordo, setMensalidadesAcordo] = useState<MensalidadeProps[]>(acordo.mensalidade??[]);

    const {register,handleSubmit,formState:{errors},watch,setValue} = useForm<FormProps>({
        defaultValues:acordo
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
        const novasMensalidades = mensalidadesAcordo.map(mensal=>{
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
                    status:'A',
                    id_associado:associado,
                    data_inicio:data.data_inicio,
                    data_fim:data.data_fim,
                    total_acordo:data.total_acordo,
                    realizado_por:data.realizado_por ,
                    descricao:data.descricao,
                    metodo:data.metodo,
                    dt_criacao:new Date() ,
                    mensalidade:novasMensalidades
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
        const novasMensalidades = mensalidadesAcordo.map(mensal=>{
            return {...mensal,status:'P',data_pgto:new Date(),usuario:usuario,valor_total:mensal.valor_principal}
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
        const novasMensalidades = mensalidadesAcordo.map(mensal=>{
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
                descricao:watch('descricao')?watch('descricao'):acordo.descricao,
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
        <form  onSubmit={handleSubmit(criarAcordo)}>
       
        <div className="  border-gray-600 grid  gap-2 grid-flow-row-dense grid-cols-4">
       
        <div>
       
          <Label  htmlFor="startDate" value="Data Início" />
    
        <DatePicker selected={watch('data_inicio')} showMonthDropdown  onChange={e=>e && setValue('data_inicio',e)}  dateFormat={"dd/MM/yyyy"} locale={pt}   required className="flex w-full  sm:text-xs  border  rounded-lg bg-gray-50 
      border-gray-300 placeholder-gray-400  "/>
      </div>

      <div>
       
       <Label  htmlFor="endDate" value="Data Fim" />
 
     <DatePicker selected={watch('data_fim')} showMonthDropdown  onChange={e=>e && setValue('data_fim',e)} dateFormat={"dd/MM/yyyy"} locale={pt}   required className="flex w-full  sm:text-xs  border  rounded-lg bg-gray-50 
      border-gray-300 placeholder-gray-400  "/>
   </div>

   <div>
       
       <Label  htmlFor="total" value="Total Acordo" />
 
    <TextInput {...register("total_acordo")} sizing={'sm'}/>
   </div>

   <div>
       
       <Label  htmlFor="realizado" value="Realizado Por" />
 
    <TextInput {...register("realizado_por")} sizing={'sm'}/>
   </div>




   
   <div className="col-span-3">
       
       <Label  htmlFor="descricao" value="Descrição" />
 
    <TextInput placeholder="Descreve os detalhers do acordo" {...register("descricao")} sizing={'sm'}/>
   </div>
 



   <div>
       
       <Label  htmlFor="metodo" value="Método" />
 
    <TextInput{...register("metodo")} sizing={'sm'}/>
   </div>



</div>
<div className=" gap-2 col-span-4 mt-2 flex flex-row justify-end">
{openModal.visible?(
<Button size={'sm'} color={'success'}  type="submit" ><MdSaveAlt size={22}/>Criar Acordo</Button>):(
<div className=" inline-flex w-full justify-between">
<button onClick={()=>editarAcordo()} type="button" className="flex flex-row justify-center  bg-blue-600 rounded-lg p-2 gap-2 "><MdSaveAlt size={22}/>SALVAR</button>
<button onClick={()=>baixarAcordo()} type="button" className="flex flex-row justify-center  bg-green-600 rounded-lg p-2 gap-2 "><IoIosArrowDropdownCircle size={22}/>BAIXAR ACORDO</button>
</div>
)}
</div>
   

</form>
</Modal.Body>
<Modal.Footer className="flex flex-col">
<label className="flex w-full justify-center  font-semibold pt-1">REFERÊNCIAS</label>
<div className="inline-flex w-full justify-start  rounded-md shadow-sm pl-2 pb-2">
  <button disabled={!!!acordo.id_acordo} onClick={adicionarProxima}  type="button" className="inline-flex items-center px-2 py-1 gap-1 text-sm font-medium  border  rounded-lg  focus:z-10 focus:ring-2  bg-gray-700 border-gray-600  hover: hover:bg-gray-600 focus:ring-blue-500 focus:">
    Adicionar Próxima
  </button>

 
</div>
<div className=" max-h-[350px] overflow-y-auto w-full">
    <Table >
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
            {mensalidadesAcordo.map((item,index)=>(  
                <Table.Row key={index} 
                className="text-gray-900"
               >
                <Table.Cell >
                    {item.parcela_n}
                </Table.Cell>
                <Table.Cell>
                   {new Date(item.vencimento || '').toLocaleDateString('pt',{timeZone:'UTC'})}
                   
                </Table.Cell>
                <Table.Cell >
                   {item.referencia}
                </Table.Cell>
                <Table.Cell >
                {new Date(item.cobranca || '').toLocaleDateString('pt',{timeZone:'UTC'})}
                </Table.Cell>
                <Table.Cell >
               {`R$${item.valor_principal}`}
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