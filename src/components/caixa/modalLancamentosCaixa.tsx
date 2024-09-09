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

const utcToLocal = (dateStr:Date) => {
    const date = new Date(dateStr);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

interface ModalProps{
    
    planos:Array<PlanosProps>
    listarLancamentos:()=>Promise<void>
    grupo:Array<GruposProps>
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
    mov:Partial<LancamentosProps>
    setMov:(fields:Partial<LancamentosProps>)=>void

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
export function ModalLancamentosCaixa({planos,listarLancamentos,grupo,openModal,setOpenModal,mov,setMov}:ModalProps){
    const {usuario}=useContext(AuthContext)
    const [descricao,setDescricao]=useState('');
    const[conta,setConta] =useState('');
    const [idSetor,setSetor] = useState('')
    const[tipo,setTipo]=useState<string>('');
    const[datalanc,setData] =useState(new Date());
    const[historico,setHistorico]= useState('');
    const[valor,setValor]=useState<number>()
    



   async function editarMovimentacao(){
        await toast.promise(
            api.put('/atualizarLancamento',{
            num_seq:mov.num_seq,
            conta:conta,
            descricao:descricao,
            historico:historico,
            ccustos_desc:usuario?.nome,
            ccustos_id:Number(usuario?.id),
            valor:valor,
            usuario:usuario,
            data:datalanc,
            tipo:tipo
            }),
            {pending:'Atualizando.....',
            error:'Erro ao atualizar',
            success:'Atualizado com sucesso!'
        }
        )
        listarLancamentos()
   }

     async function lancarMovimentacao() {

      //  if(!descricao||!idSetor||!historico){
        //    toast.warn('Preencha todos os campos obrigatórios')
        //    return;
     //   }

        if(descricao==='SANGRIA'){
            await toast.promise(
                api.post('/notification/adicionar',{
                    titulo:'Sangria',
                    descricao:`Sangria - Descrição: ${historico} - Origem: ${usuario?.nome} - Valor: ${valor}`,
                    id_usuario:'2',
                    id_destino:'3',
                    data:new Date(),
                    status:'PENDENTE',
                    sangria:true
                }),
                {
                    error:'Erro na requisição',
                    pending:'Gerando Notificação',
                    success:'Pendência Enviada com Sucesso, Aguarde a confirmação do financeiro',
                   
                }
             )
             return;
        }
        await toast.promise(
            api.post('/novoLancamento',{
            id_usuario:Number(usuario?.id),
            id_grupo:Number(idSetor),
            datalanc:new Date(),
            conta,
            conta_n:conta,
            descricao:descricao,
            historico:historico.toUpperCase(),
            valor:valor,
            usuario:usuario?.nome.toUpperCase(),
            data:new Date(datalanc),
            tipo:tipo
            }),
            {
                error:'Erro realizar Lançamento',
                pending:'Realizando Lançamento',
                success:'Lançado com sucesso!'
            }
        )
      await listarLancamentos()
        
        
     }

    return(
   
       
 
  <Modal show={openModal} onClose={()=>setOpenModal(false)}>
    <Modal.Header>Adminstrar Lançamento</Modal.Header>
    <Modal.Body>

        <form> 

<div className="inline-flex gap-4 w-full">



<div >
        <div className=" block">
          <Label  value="Data" />
        </div>
       <DatePicker  onChange={e=>e && setMov({...mov,data:e})}  selected={mov.data ? utcToLocal(mov.data) : new Date()}  dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
      </div>


      <div >
        <div className=" block">
          <Label  value="Usuário" />
        </div>
        <TextInput disabled sizing={'sm'} required type="text" value={usuario?.nome}    />
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

{mov.num_seq ?<div className="inline-flex w-full justify-between"> <Button size={'sm'} onClick={()=>lancarMovimentacao()}  ><MdSaveAlt size={22}/>Excluir</Button>
<Button size={'sm'}   onClick={()=>editarMovimentacao()} ><MdSaveAlt size={22}/>Editar</Button>
 </div>:
<Button size={'sm'}  onClick={()=>lancarMovimentacao()} ><MdSaveAlt size={22}/>Salvar</Button>}
</div>
    </div>

</form>
</Modal.Body>
</Modal>
)
}