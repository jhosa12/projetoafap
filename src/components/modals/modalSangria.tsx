import { IoIosClose } from "react-icons/io";
import { AuthContext } from "@/store/AuthContext";
import { FormEvent, useContext, useEffect, useState } from "react";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { api } from "@/lib/axios/apiClient";
import { BiTransfer } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { GiConfirmed } from "react-icons/gi";
import { toast } from "sonner";

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
    const {usuario}=useContext(AuthContext)
    const [descricao,setDescricao]=useState('');
    const[datalanc,setData] =useState(new Date());
    const[historico,setHistorico]= useState('');
    const[valor,setValor]=useState<number>();
    const[usuarioOrigem,setUserOrigem]=useState('');
    const[passwordOrigem,setPasswordOrigem] =useState('')
    const[usuarioDestino,setUserDestino]=useState('');
    const[passwordDestino,setPasswordDestino] =useState('')
    const[loadingOrigem,setLoadingOrigem] = useState(false)
    const[loadingDestino,setLoadingDestino] = useState(false)
    const[verificadoOrigem,setVerificadoOrigem]=useState(false)
    const[verificadoDestino,setVerificadoDestino]=useState(false)
    

   useEffect(()=>{
    
       
   },[])

   async function userOrigem(e:FormEvent){
    e.preventDefault()
    if(!descricao || !valor || !datalanc){
        toast.warning("Preencha todos os campos!")
        return;
    }
try{
    setLoadingOrigem(true)
 const login =   await api.post('/sangria/userOrigem',{
        usuario:usuarioOrigem,
        password:passwordOrigem
        })
        console.log(login.data)
        setVerificadoOrigem(true)




         
       
}catch(err){
   setLoadingOrigem(false)
   console.log(err)
}

   }

   async function userDestino(e:FormEvent){
    e.preventDefault()
try{
    setLoadingDestino(true)
 const login =   await api.post('/sangria/userOrigem',{
        usuario:usuarioDestino,
        password:passwordDestino
        })
        setVerificadoDestino(true)
}catch(err){
   setLoadingDestino(false)
}
    
   }

     async function lancarMovimentacao() {
        if(!verificadoDestino || !verificadoOrigem){
            toast.warning("Realize a etapa de autenticação!")
            return;
        }
       // if(!descricao || !valor || !datalanc){
         //   toast.warn("Preencha todos os campos!")
         //   return;
     //   }
        toast.promise(
            api.post('/novoLancamento',{
          //  id_usuario:Number(usuario?.id),
            datalanc:new Date(),
            conta:'1.02.003',
            conta_n:'1.02.003',
            descricao:"SANGRIA",
            historico:`${historico.toUpperCase()} RECEBIDO POR:${usuarioDestino}`,
            valor:valor,
            //usuario:usuario?.nome.toUpperCase(),
            data:new Date(datalanc),
            tipo:"DESPESA"
            }),
            {
                error:'Erro realizar Lançamento',
                loading:'Realizando Lançamento',
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
                <form onSubmit={userOrigem} className="space-y-4" action="#">
                    <div>
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Usuário</label>
                        <input value={usuarioOrigem} onChange={e=>setUserOrigem(e.target.value)}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"  required />
                    </div>
                    <div>
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                        <input value={passwordOrigem}  onChange={e=>setPasswordOrigem(e.target.value)} type="password" name="password"  placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                   
                    <button type="submit" className={`flex w-full justify-center items-center text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${verificadoOrigem?"bg-green-600":"bg-blue-600"}  hover:bg-blue-700`}>{!loadingOrigem ?"Validar":!verificadoOrigem?<AiOutlineLoading3Quarters size={25} className="animate-spin"/>:<GiConfirmed size={22}/>}</button>
                   
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
                <form onSubmit={userDestino} className="space-y-4" action="#">
                    <div>
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Usuário</label>
                        <input value={usuarioDestino} onChange={e=>setUserDestino(e.target.value)}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"  required />
                    </div>
                    <div>
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                        <input  value={passwordDestino}  onChange={e=>setPasswordDestino(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <button type="submit" className={`flex w-full justify-center items-center text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${verificadoDestino?"bg-green-600":"bg-blue-600"}  hover:bg-blue-700`}>{!loadingDestino ?"Validar":!verificadoDestino?<AiOutlineLoading3Quarters size={22} className="animate-spin"/>:<GiConfirmed size={22}/>}</button>
                </form>
            </div>
        </div>
    </div>
    
</div> 
<div className=" flex flex-col w-full justify-center items-center pb-2">
    <div className="flex w-full justify-center pb-2 pr-2 pl-2 gap-2 ">
           <div className="w-1/5">
          <label  className="block mb-1 text-xs font-medium  text-white">DATA FINAL</label>
          <DatePicker selected={datalanc} onChange={e=>e&&setData(e)}   dateFormat={"dd/MM/yyyy"} locale={"pt"}  required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="flex flex-col w-7/12 ">
          <label  className="block mb-1 text-xs font-medium  text-white">DESCRIÇÃO</label>
          <input value={descricao} onChange={e=>setDescricao(e.target.value)} className="uppercase block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-sm bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"></input>
                   </div>
                   <div className="flex flex-col  ">
          <label  className="block mb-1 text-xs font-medium  text-white">VALOR</label>
          <input value={valor} onChange={e=>setValor(Number(e.target.value))} className="uppercase block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-sm bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"></input>
                   </div>
                   </div>
<button onClick={()=>lancarMovimentacao()}  type="button" className={`w-1/2 text-white    font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 `}>Realizar Transação</button>
</div>
</div>
</div>
</div>)
}