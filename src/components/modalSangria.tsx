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
import { BiTransfer } from "react-icons/bi";


interface ModalProps{
    closeModalSangria:()=>void;
    listarLancamentos:()=>Promise<void>

}
interface PlanosProps{
    conta:string,
    descricao:string,
    tipo:string,
    perm_lanc:string,
}
export function ModalSangria({closeModalSangria,listarLancamentos}:ModalProps){
    const {usuario,mov}=useContext(AuthContext)
    const [descricao,setDescricao]=useState('');
    const[conta,setConta] =useState('');
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
            ccustos_id:usuario?.id,
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
        await toast.promise(
            api.post('/novoLancamento',{
            id_user:usuario?.id,
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
        listarLancamentos()
        
     }

    return(
    <div  className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full ">
       
    <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-20 bg-gray-100 ">
    <div className="relative  rounded-lg  shadow bg-gray-800">
    <button  type="button" onClick={closeModalSangria} className="absolute  cursor-pointer right-0 text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8  inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
    <IoIosClose size={30}/>
        </button>
        
        <div  className="flex fle-row  justify-center p-2 items-center w-full">
    <div className="flex p-4 w-full max-w-md max-h-full">
        
        <div className="flex flex-col bg-white rounded-lg shadow dark:bg-gray-700">
         
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Autenticação Origem
                </h3>
               
            </div>
          
            <div className="p-4 md:p-5">
                <form className="space-y-4" action="#">
                    <div>
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Usuário</label>
                        <input  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"  required />
                    </div>
                    <div>
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                        <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                   
                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Verificar</button>
                   
                </form>
            </div>
        </div>
    </div>

<BiTransfer  color='white' size={45}/>

    <div className="flex p-4 w-full max-w-md max-h-full">
        
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
         
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Autenticação Destino
                </h3>
               
            </div>
            <div className="p-4 md:p-5">
                <form className="space-y-4" action="#">
                    <div>
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Usuário</label>
                        <input  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"  required />
                    </div>
                    <div>
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                        <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <button type="button" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Verificar</button>
                </form>
            </div>
        </div>
    </div>
    
</div> 
<div className=" flex flex-col w-full justify-center items-center pb-2">
    <div className="flex w-full justify-center pb-2 pr-2 pl-2 gap-2 ">
           <div className="w-1/5">
          <label  className="block mb-1 text-xs font-medium  text-white">DATA FINAL</label>
          <DatePicker selected={new Date()} onChange={()=>{}}   dateFormat={"dd/MM/yyyy"} locale={"pt"}  required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="flex flex-col w-7/12 ">
          <label  className="block mb-1 text-xs font-medium  text-white">DESCRIÇÃO</label>
          <input value={descricao} onChange={e=>setDescricao(e.target.value)} className="uppercase block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-sm bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"></input>
                   </div>
                   <div className="flex flex-col  ">
          <label  className="block mb-1 text-xs font-medium  text-white">VALOR</label>
          <input value={descricao} onChange={e=>setDescricao(e.target.value)} className="uppercase block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-sm bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"></input>
                   </div>
                   </div>
<button disabled  type="button" className={`w-1/2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}>Realizar Transação</button>
</div>
</div>
</div>
</div>)
}