
import { AuthContext } from "@/store/AuthContext";
import { useContext, useEffect} from "react";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { api } from "@/lib/axios/apiClient";
import { Label, Modal, Select, TextInput } from "flowbite-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ajustarData } from "@/utils/ajusteData";
import { Button } from "../../ui/button";
import { removerFusoDate } from "@/utils/removerFusoDate";
import { toast } from "sonner";
import { LancamentosProps } from "@/types/caixa";



interface ModalProps{
    handleFiltro:()=>void,
    planos:Array<PlanosProps>
    id_empresa:string
    grupo:Array<GruposProps>
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
    mov:Partial<LancamentosProps>
   // setMov:(fields:Partial<LancamentosProps>)=>void
  //  arrayLanc:Array<LancamentosProps>,
    //setLancamentos:(array:Array<LancamentosProps>)=>void,
  //  listarLancamentos:()=>Promise<void>,
  


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
export function ModalLancamentosCaixa({id_empresa,planos,grupo,openModal,setOpenModal,mov,handleFiltro}:ModalProps){
    const {usuario}=useContext(AuthContext)
    const {register,setValue,handleSubmit,watch,control} = useForm<LancamentosProps>(
      {
        defaultValues:{...mov,datalanc:mov.datalanc??new Date()}
      }
    )
   
    useEffect(()=>{
   setValue('conta',mov.conta??'')
    setValue('descricao',mov.descricao??'')
    
  setValue('valor',mov.valor??null)
      setValue('historico',mov?.historico??'')
   setValue('data',mov.data??new Date())
   setValue('tipo',mov.tipo??'')
    
    
    },[mov.lanc_id])


  const handleSubmitForm:SubmitHandler<LancamentosProps> = (data)=>{

    if(mov.lanc_id){
      editarMovimentacao(data)
    }else{
      lancarMovimentacao(data)
    }

  }
    



   async function editarMovimentacao(data:LancamentosProps){
      let dt_lanc =undefined
    if(data.data!==mov.data){
      const{newDate} =removerFusoDate(new Date(data.data))
      dt_lanc = newDate
    }
   
  
      toast.promise(
        api.put('/atualizarLancamento',{
        lanc_id:mov.lanc_id,
        num_seq:mov.num_seq,
        conta:data.conta,
        descricao:data.descricao,
        historico:data.historico,
        valor:data.valor,
        usuario:usuario?.nome,
        data:dt_lanc,
        tipo:data.tipo,
        empresa:id_empresa
        }),
        {loading:'Atualizando.....',
        error:'Erro ao atualizar',
        success:()=>{
          handleFiltro()
          setOpenModal(false)
          return 'Atualizado com sucesso!'}
    }
    )
 
 
      
    
   }

     async function lancarMovimentacao(data:LancamentosProps){ 
      const valorString = data.valor?.toString()??'';
      const valorConvertido = parseFloat(valorString?.replace(',', '.'));
          const {newDate:dt_lanc} = removerFusoDate(new Date(data.data))
            const{newDate:dt_real} = removerFusoDate(new Date())

      if(!id_empresa){
        toast.info('Selecione a empresa')
        return;
      }
     // if(!data?.id_grupo){
     //   toast.info('Selecione o setor')
      //  return;
    //  }

       if(!data.descricao||!data.historico){
            toast.warning('Preencha todos os campos obrigatórios')
            return;
      }
      
      if(!data.conta){
        toast.warning('Preencha todos os campos obrigatórios')
        return;
  }

       

        toast.promise(
            api.post('/novoLancamento',{
            id_usuario:usuario?.id,
            id_grupo:data.id_grupo?Number(data.id_grupo):undefined,
            datalanc:dt_real,
            conta:data.conta,
            conta_n:data.conta_n,
            descricao:data.descricao,
            historico:data?.historico?.toUpperCase(),
            valor:Number(valorConvertido),
            usuario:usuario?.nome.toUpperCase(),
            data:dt_lanc, 
            tipo:data.tipo,
            empresa:id_empresa
            }),
            {
                error:'Erro realizar Lançamento',
                loading:'Realizando Lançamento',
                success:()=>{
                  handleFiltro()
                  setOpenModal(false)
                    return 'Lançado com sucesso!'}
            }
        )
        
    
     //   listarLancamentos()
         // setLancamentos([...arrayLanc,response.data])
     
  //  handleFiltro()
        
     }

    return(
   
  <Modal size={'2xl'} show={openModal} popup onClose={()=>setOpenModal(false)}>
    <Modal.Header/>
    <Modal.Body>
      <h1 className="text-base font-semibold mb-2">LANÇAMENTO</h1>
        <form className="text-[10px]" onSubmit={handleSubmit(handleSubmitForm)}> 

<div className="inline-flex gap-4 w-full text-black ">
  
<div >
        <div className=" block">
          <Label className="text-[12px]"  value="Data" />
        </div>
        <Controller
        control={control}
        name="data"
        render={({ field:{onChange,value} }) => (
          <DatePicker  onChange={e=>e && onChange(e)}  selected={value}  dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
        )}

        />
      
      </div>



      <div  >
        <div className=" block">
          <Label className="text-[12px]"  value="Setor" />
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

        <div className="p-2   grid mt-2 gap-2 grid-flow-row-dense grid-cols-4 text-black">


        <div className=" col-span-1 " >
        <div className=" block">
          <Label className="text-[12px]"  value="Conta" />
        </div>
        <TextInput disabled sizing={'sm'} required type="text" {...register('conta')}     />
      </div> 
   


      <div className=" col-span-2" >
        <div className=" block">
          <Label className="text-[12px]"  value="Descrição" />
        </div>
        <Select  value={watch('conta')}    onChange={e=>{
        const tipo = planos.find((item)=>item.conta===e.target.value)
       
     if(tipo){ setValue('descricao',tipo.descricao)
        setValue('tipo',tipo.tipo)
        setValue('conta',e.target.value)}
        }} sizing={'sm'}    >
      <option value={''}></option>
        {planos?.map((item,index)=>
            
            (
              item.perm_lanc==='S' &&  <option className="text-black text-[10px]" key={index} value={item.conta}>{item.descricao.toUpperCase()}</option>
            )
        )}

                  </Select >
      </div> 

      <div className="col-span-1 " >
        <div className=" block">
          <Label className="text-[12px]"  value="Tipo" />
        </div>
        <TextInput disabled sizing={'sm'} required type="text" value={watch('tipo')}     />
      </div> 


      <div className="col-span-3 " >
        <div className=" block">
          <Label className="text-[12px]"  value="Histórico" />
        </div>
        <TextInput  sizing={'sm'} required type="text" value={watch('historico')?.toUpperCase()} {...register('historico')}    />
      </div> 


      <div className="col-span-1 " >
        <div className=" block">
          <Label className="text-[12px]"  value="Valor" />
        </div>
        <TextInput  sizing={'sm'} required   {...register('valor')}   />
      </div> 


<div className=" gap-2 col-span-4 mt-2 flex flex-row justify-end">


<Button variant={'outline'} size={'sm'}   type="submit" >
  {mov.lanc_id ? 'Alterar':'Cadastrar'}
</Button>
 

</div>
    </div>

</form>
</Modal.Body>
</Modal>
)
}