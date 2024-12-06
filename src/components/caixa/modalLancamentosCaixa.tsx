
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { LancamentosProps } from "@/pages/caixa";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { EmpresaProps } from "@/types/empresa";
import { ajustarData } from "@/utils/ajusteData";



interface ModalProps{
    handleFiltro:()=>void,
    planos:Array<PlanosProps>
    grupo:Array<GruposProps>
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
    mov:Partial<LancamentosProps>
   // setMov:(fields:Partial<LancamentosProps>)=>void
    arrayLanc:Array<LancamentosProps>,
    setLancamentos:(array:Array<LancamentosProps>)=>void,
  //  listarLancamentos:()=>Promise<void>,
    empresas:Array<EmpresaProps>


}
interface PlanosProps{
    conta:string,
    descricao:string,
    tipo:string,
    perm_lanc:string,
}
interface GruposProps{
    id_grupo:number|null,
    descricao:string
}
export function ModalLancamentosCaixa({planos,grupo,openModal,setOpenModal,mov,empresas,handleFiltro}:ModalProps){
    const {usuario}=useContext(AuthContext)
    const {register,setValue,handleSubmit,watch,control} = useForm<LancamentosProps>()
   



    useEffect(()=>{
   setValue('conta',mov.conta??'')
    setValue('descricao',mov.descricao??'')
    
  setValue('valor',mov.valor??null)
      setValue('historico',mov?.historico??'')
   setValue('data',mov.data??new Date())
   setValue('tipo',mov.tipo??'')
      setValue('empresa',mov.empresa??'')
    
    },[mov.lanc_id])


  const handleSubmitForm:SubmitHandler<LancamentosProps> = (data)=>{

    if(mov.lanc_id){
      editarMovimentacao(data)
    }else{
      lancarMovimentacao(data)
    }

  }
    



   async function editarMovimentacao(data:LancamentosProps){
    const{dataIni:dt_lanc} = ajustarData(data.datalanc)
   
    try {
      await toast.promise(
        api.put('/atualizarLancamento',{
        lanc_id:mov.lanc_id,
        num_seq:mov.num_seq,
        conta:data.conta,
        descricao:data.descricao,
        historico:data.historico,
        valor:data.valor,
        usuario:usuario?.nome,
        datalanc:dt_lanc,
        tipo:data.tipo,
        empresa:data.empresa
        }),
        {pending:'Atualizando.....',
        error:'Erro ao atualizar',
        success:'Atualizado com sucesso!'
    }
    )
    handleFiltro()
    } catch (error) {
      toast.warning('Consulte o TI')
      
    }
      
    
   }

     async function lancarMovimentacao(data:LancamentosProps){ 


      const{dataIni:dt_lanc} = ajustarData(data.datalanc)
      const{dataIni:dt_real} = ajustarData(new Date())

      if(!data?.empresa){
        toast.info('Selecione a empresa')
        return;
      }
      if(!data?.id_grupo){
        toast.info('Selecione o setor')
        return;
      }

       if(!data.descricao||!data.historico){
            toast.warn('Preencha todos os campos obrigatórios')
            return;
      }

        if(data.descricao==='SANGRIA'){
            await toast.promise(
                api.post('/notification/adicionar',{
                    titulo:'Sangria',
                    descricao:`Sangria - Descrição: ${data.historico} - Origem: ${usuario?.nome} - Valor: ${data.valor}`,
                    id_usuario:'2',
                    id_destino:'3',
                    data:dt_real,
                    datalanc:dt_lanc,
                    status:'PENDENTE',
                    sangria:true,
                   
                }),
                {
                    error:'Erro na requisição',
                    pending:'Gerando Notificação',
                    success:'Pendência Enviada com Sucesso, Aguarde a confirmação do financeiro',
                   
                }
             )
             return;
        }


        try {

        const response =   await toast.promise(
            api.post('/novoLancamento',{
            id_usuario:usuario?.id,
            id_grupo:Number(data.id_grupo),
            datalanc:dt_lanc,
            conta:data.conta,
            conta_n:data.conta_n,
            descricao:data.descricao,
            historico:data?.historico?.toUpperCase(),
            valor:data.valor,
            usuario:usuario?.nome.toUpperCase(),
            data:dt_real, 
            tipo:data.tipo,
            empresa:data.empresa
            }),
            {
                error:'Erro realizar Lançamento',
                pending:'Realizando Lançamento',
                success:'Lançado com sucesso!'
            }
        )
        

     //   listarLancamentos()
         // setLancamentos([...arrayLanc,response.data])
        } catch (error) {

          console.log(error)
          
        }
    handleFiltro()
        
     }

    return(
   
       
 
  <Modal size={'3xl'} show={openModal} onClose={()=>setOpenModal(false)}>
    <Modal.Header>Adminstrar Lançamento</Modal.Header>
    <Modal.Body>

        <form onSubmit={handleSubmit(handleSubmitForm)}> 

<div className="inline-flex gap-4 w-full text-black font-semibold">



<div >
        <div className=" block">
          <Label  value="Data" />
        </div>
        <Controller
        control={control}
        name="datalanc"
        render={({ field:{onChange,value} }) => (
          <DatePicker  onChange={e=>e && onChange(e)}  selected={value}  dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
        )}

        />
      
      </div>


      <div >
        <div className=" block">
          <Label  value="Empresa" />
        </div>
     <Select {...register('empresa')} disabled={!!mov.lanc_id} sizing={'sm'}>
        <option value={''}></option>
       {empresas?.map(item=>(
        <option key={item.id} value={item.id}>{item.nome}</option>
       ))}
     </Select>
      </div>

      <div  >
        <div className=" block">
          <Label  value="Setor" />
        </div>
        <Select {...register('id_grupo')} sizing={'sm'}    >
                    <option value={''}></option>
        {grupo?.map((item,index)=>
            
            (
                <option key={index} value={Number(item.id_grupo)}>{item.descricao.toUpperCase()}</option>
            )
        )}
                  </Select >
      </div> 




</div>

        <div className="p-2   grid mt-2 gap-2 grid-flow-row-dense grid-cols-4 text-black font-semibold">


        <div className=" col-span-1 " >
        <div className=" block">
          <Label  value="Conta" />
        </div>
        <TextInput disabled sizing={'sm'} required type="text" {...register('conta')}     />
      </div> 
   


      <div className=" col-span-2" >
        <div className=" block">
          <Label  value="Descrição" />
        </div>
        <Select value={watch('conta')} className="text-black"   onChange={e=>{
        const tipo = planos.find((item)=>item.conta===e.target.value)
       
     if(tipo){ setValue('descricao',tipo.descricao)
        setValue('tipo',tipo.tipo)
        setValue('conta',e.target.value)}
        }} sizing={'sm'}    >
      <option value={''}></option>
        {planos?.map((item,index)=>
            
            (
              item.perm_lanc==='S' &&  <option key={index} value={item.conta}>{item.descricao.toUpperCase()}</option>
            )
        )}

                  </Select >
      </div> 

      <div className="col-span-1 " >
        <div className=" block">
          <Label  value="Tipo" />
        </div>
        <TextInput disabled sizing={'sm'} required type="text" value={watch('tipo')}     />
      </div> 


      <div className="col-span-3 " >
        <div className=" block">
          <Label  value="Histórico" />
        </div>
        <TextInput  sizing={'sm'} required type="text" value={watch('historico')?.toUpperCase()} {...register('historico')}    />
      </div> 


      <div className="col-span-1 " >
        <div className=" block">
          <Label  value="Valor" />
        </div>
        <TextInput  sizing={'sm'} required   {...register('valor')}   />
      </div> 


<div className=" gap-2 col-span-4  flex flex-row justify-end">


<Button size={'sm'}   type="submit" >
  {mov.lanc_id ? 'Alterar':'Cadastrar'}
</Button>
 

</div>
    </div>

</form>
</Modal.Body>
</Modal>
)
}