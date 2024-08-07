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



interface ModalProps{
    closeModal:()=>void;
    planos:Array<PlanosProps>
    listarLancamentos:()=>Promise<void>
    grupo:Array<GruposProps>

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
export function ModalLancamentosCaixa({closeModal,planos,listarLancamentos,grupo}:ModalProps){
    const {usuario,mov}=useContext(AuthContext)
    const [descricao,setDescricao]=useState('');
    const[conta,setConta] =useState('');
    const [idSetor,setSetor] = useState('')
    const[tipo,setTipo]=useState<string>('');
    const[datalanc,setData] =useState(new Date());
    const[historico,setHistorico]= useState('');
    const[valor,setValor]=useState<number>()
    

   useEffect(()=>{
        
        mov.descricao &&  setDescricao(mov.descricao)
        mov.conta && setConta(mov.conta)
        mov.tipo && setTipo(mov.tipo)
        mov.data && setData(mov.data)
        mov.historico && setHistorico(mov.historico)
        mov.valor && setValor(mov.valor)

       
   },[])

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
        closeModal()
        
     }

    return(
    <div  className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full ">
       
    <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-20 bg-gray-100 ">
    <div className="fixed flex flex-col  w-2/4 p-4 rounded-lg  shadow bg-gray-800">
    <button  type="button" onClick={closeModal} className="absolute cursor-pointer top-0 right-0 text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
    <IoIosClose size={30}/>
        </button>
        <form>
        
<label className="flex flex-row justify-start mb-4 border-b-[1px] text-lg border-gray-500 font-semibold mt-2 gap-2 text-white">NOVO LANÇAMENTO</label>
<div className="inline-flex gap-4 w-full">
<div className="ml-2 justify-start w-2/12">
<label  className="block mb-1 text-xs font-medium  text-white">DATA</label>
<DatePicker  selected={datalanc} onChange={e=>e && setData(e)}  dateFormat={"dd/MM/yyyy"} locale={"pt"}  required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
</div>
<div className=" mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">USUÁRIO</label>
    <input required type="text" disabled value={usuario?.nome}  className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>

<div className="mb-1 col-span-2">
    <label  className="block mb-1 text-xs font-medium  text-white">SETOR</label>
    <select  value={idSetor} onChange={e=>{
       setSetor(e.target.value)
    
       
        }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
    <option value={''}></option>
        {grupo.map((item,index)=>
            
            (
                <option key={index} value={item.id_grupo?.toString()}>{item.descricao.toUpperCase()}</option>
            )
        )}

    </select>

</div>


</div>

        <div className="p-2   grid mt-2 gap-2 grid-flow-row-dense grid-cols-4">
   
<div className="mb-1 col-span-1 ">
<label  className="block mb-1 text-xs font-medium  text-white">CONTA</label>
<input disabled type="text" value={conta}  className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-2">
    <label  className="block mb-1 text-xs font-medium  text-white">DESCRIÇÃO</label>
    <select  value={descricao} onChange={e=>{
        const tipo = planos.find((item)=>item.descricao===e.target.value)
        setDescricao(e.target.value)
        setTipo(String(tipo?.tipo))
        setConta(String(tipo?.conta))
        }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
    <option value={''}></option>
        {planos.map((item,index)=>
            
            (
              item.perm_lanc==='S' &&  <option key={index} value={item.descricao}>{item.descricao.toUpperCase()}</option>
            )
        )}

    </select>

</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">TIPO</label>
    <input required disabled value={tipo}  className="block w-full  pt-1 pb-1 pl-2 pr-2 border  rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>


<div className="mb-1 col-span-3">
    <label  className="block mb-1 text-xs font-medium  text-white">HISTÓRICO</label>
    <input type="text" value={historico} onChange={e=>setHistorico(e.target.value.toUpperCase())}  className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">VALOR</label>
    <input value={valor} onChange={e=>e && setValor(Number(e.target.value))}  type="number"  inputMode="decimal"  className="block w-full  pt-1 pb-1 pl-2 pr-2 border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className=" gap-2 col-span-4  flex flex-row justify-end">

{mov.num_seq ?<div className="inline-flex w-full justify-between"> <button onClick={()=>lancarMovimentacao()} type="button" disabled={!!mov.notafiscal} className={`flex flex-row justify-center ${mov.notafiscal?"bg-gray-500":"bg-blue-600"}  rounded-lg p-2 gap-2 text-white`}><MdSaveAlt size={22}/>EXCLUIR</button>
<button disabled={!!mov.notafiscal} onClick={()=>editarMovimentacao()} type="button" className={`flex flex-row justify-center ${mov.notafiscal?"bg-gray-500":"bg-blue-600"}  rounded-lg p-2 gap-2 text-white`}><MdSaveAlt size={22}/>Editar</button>
 </div>:
<button onClick={()=>lancarMovimentacao()} type="button" className="flex flex-row justify-center  bg-blue-600 rounded-lg p-2 gap-2 text-white"><MdSaveAlt size={22}/>SALVAR</button>}
</div>
    </div>

</form>
</div>
</div>
</div>)
}