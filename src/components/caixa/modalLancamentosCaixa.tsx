import { IoIosClose } from "react-icons/io";
import { MdSaveAlt } from "react-icons/md";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { GiReturnArrow } from "react-icons/gi";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { LancamentosProps } from "@/pages/caixa";



interface ModalProps{
    
    planos:Array<PlanosProps>
    grupo:Array<GruposProps>
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
    mov:Partial<LancamentosProps>
    setMov:(fields:Partial<LancamentosProps>)=>void
    arrayLanc:Array<LancamentosProps>,
    setLancamentos:(array:Array<LancamentosProps>)=>void,
    empresaAPI:string,
    listarLancamentos:()=>Promise<void>

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
export function ModalLancamentosCaixa({listarLancamentos,planos,grupo,openModal,setOpenModal,mov,setMov,arrayLanc,setLancamentos}:ModalProps){
    const {usuario}=useContext(AuthContext)
   

  
    



   async function editarMovimentacao(){
    try {
      await toast.promise(
        api.put('/atualizarLancamento',{
        lanc_id:mov.lanc_id,
        num_seq:mov.num_seq,
        conta:mov.conta,
        descricao:mov.descricao,
        historico:mov.historico,
        ccustos_desc:usuario?.nome,
        ccustos_id:undefined,
        valor:mov.valor,
        usuario:usuario?.nome,
        data:mov.data,
        tipo:mov.tipo,
        empresa:mov.empresa
        }),
        {pending:'Atualizando.....',
        error:'Erro ao atualizar',
        success:'Atualizado com sucesso!'
    }
    )
      listarLancamentos()
    } catch (error) {
      toast.warning('Consulte o TI')
      
    }
      
    
   }

     async function lancarMovimentacao() {

      if(!mov.empresa){
        toast.info('Selecione a empresa')
        return;
      }
      if(!mov.id_grupo){
        toast.info('Selecione o setor')
        return;
      }

       if(!mov.descricao||!mov.historico){
            toast.warn('Preencha todos os campos obrigatórios')
            return;
      }

        if(mov.descricao==='SANGRIA'){
            await toast.promise(
                api.post('/notification/adicionar',{
                    titulo:'Sangria',
                    descricao:`Sangria - Descrição: ${mov.historico} - Origem: ${usuario?.nome} - Valor: ${mov.valor}`,
                    id_usuario:'2',
                    id_destino:'3',
                    data:new Date(),
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
            id_grupo:Number(mov.id_grupo),
            datalanc:new Date().toISOString(),
            conta:mov.conta,
            conta_n:mov.conta_n,
            descricao:mov.descricao,
            historico:mov?.historico?.toUpperCase(),
            valor:mov.valor,
            usuario:usuario?.nome.toUpperCase(),
            data:mov.data  && new Date(mov.data).toISOString(), 
            tipo:mov.tipo,
            empresa:mov.empresa
            }),
            {
                error:'Erro realizar Lançamento',
                pending:'Realizando Lançamento',
                success:'Lançado com sucesso!'
            }
        )
        

        listarLancamentos()
         // setLancamentos([...arrayLanc,response.data])
        } catch (error) {
          
        }
    
        
     }

    return(
   
       
 
  <Modal  show={openModal} onClose={()=>setOpenModal(false)}>
    <Modal.Header>Adminstrar Lançamento</Modal.Header>
    <Modal.Body>

        <form> 

<div className="inline-flex gap-4 w-full">



<div >
        <div className=" block">
          <Label  value="Data" />
        </div>
       <DatePicker  onChange={e=>e && setMov({...mov,data:e})}  selected={mov.data}  dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
      </div>


      <div >
        <div className=" block">
          <Label  value="Empresa" />
        </div>
     <Select value={mov.empresa} onChange={e=>setMov({...mov,empresa:e.target.value})} disabled={!!mov.lanc_id} sizing={'sm'}>
        <option value={''}></option>
        <option value={'AFAP CEDRO'}>AFAP CEDRO</option>
        <option value={'AFAP LAVRAS'}>AFAP LAVRAS</option>
        <option value={'OTICA FREITAS'}>OTICA FREITAS</option>
        <option value={'AFAP VIVAMAIS'}>AFAP VIVAMAIS</option>
        <option value={'AFAP SAUDE'}>AFAP SAUDE</option>
     </Select>
      </div>

      <div  >
        <div className=" block">
          <Label  value="Setor" />
        </div>
        <Select value={Number(mov.id_grupo)} onChange={e=>setMov({...mov,id_grupo:Number(e.target.value)})} sizing={'sm'}    >
                    <option value={''}></option>
        {grupo.map((item,index)=>
            
            (
                <option key={index} value={Number(item.id_grupo)}>{item.descricao.toUpperCase()}</option>
            )
        )}
                  </Select >
      </div> 




</div>

        <div className="p-2   grid mt-2 gap-2 grid-flow-row-dense grid-cols-4">


        <div className=" col-span-1 " >
        <div className=" block">
          <Label  value="Conta" />
        </div>
        <TextInput disabled sizing={'sm'} required type="text" value={mov.conta}     />
      </div> 
   


      <div className=" col-span-2" >
        <div className=" block">
          <Label  value="Descrição" />
        </div>
        <Select value={mov.conta}  onChange={e=>{
        const tipo = planos.find((item)=>item.conta===e.target.value)
        setMov({...mov,descricao:tipo?.descricao,tipo:tipo?.tipo,conta:tipo?.conta})
        }} sizing={'sm'}    >
      <option value={''}></option>
        {planos.map((item,index)=>
            
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
        <TextInput disabled sizing={'sm'} required type="text" value={mov.tipo}     />
      </div> 


      <div className="col-span-3 " >
        <div className=" block">
          <Label  value="Histórico" />
        </div>
        <TextInput  sizing={'sm'} required type="text" value={mov.historico} onChange={e=>setMov({...mov,historico:e.target.value.toUpperCase()})}    />
      </div> 


      <div className="col-span-1 " >
        <div className=" block">
          <Label  value="Valor" />
        </div>
        <TextInput  sizing={'sm'} required type="number"  value={Number(mov.valor)} onChange={e=>e && setMov({...mov,valor:Number(e.target.value)})}   />
      </div> 


<div className=" gap-2 col-span-4  flex flex-row justify-end">

{mov.num_seq ?
<Button size={'sm'}   onClick={()=>editarMovimentacao()} >Editar</Button>
 :
<Button size={'sm'}  onClick={()=>lancarMovimentacao()} >Salvar</Button>}
</div>
    </div>

</form>
</Modal.Body>
</Modal>
)
}