import { IoIosClose } from "react-icons/io";
import { MdSaveAlt } from "react-icons/md";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { GiReturnArrow } from "react-icons/gi";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";

interface MensalidadeProps{
    parcela_n:number,
    vencimento:Date,
    cobranca:Date,
    valor_principal:number,
    close:boolean,
    status:string,
    usuario:string,
    id_mensalidade:number,
    valor_total:number,
    motivo_bonus: string,
    data_pgto:Date | string,
    referencia:string,
    index:number
}

export function ModalAcordos(){
    const {closeModa,data,usuario,carregarDados,dadosassociado}=useContext(AuthContext)
    const [desconto,setDesconto] = useState(false)
    const [componentMounted, setComponentMounted] = useState(false);
    const [status,setStatus]=useState('')
   
    const [user,setUser] = useState<string>('')



        useEffect(()=>{

       const valor_total =data.acordo?.mensalidade && data.acordo?.mensalidade.reduce((total,mensalidade)=>total+Number(mensalidade.valor_principal),0)
        
        if(!data.acordo?.total_acordo)  closeModa({acordo:{...data.acordo,total_acordo:valor_total}});
       setUser(usuario?.nome ||'')
      
       
     
      },[])
     

   
     
    return(
    <div  className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full ">
       
    <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-20 bg-gray-100 ">
    <div className="fixed flex flex-col  w-2/4  max-h-[calc(100vh-150px)] rounded-lg  shadow bg-gray-800">
    <button  type="button" onClick={()=>closeModa({acordo:{closeAcordo:false}})} className="absolute cursor-pointer right-0 text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
    <IoIosClose size={30}/>
        </button>
        <form>
        <div className="p-2  border-b border-gray-600 grid mt-2 gap-2 grid-flow-row-dense grid-cols-4">
        <div className="grid grid-cols-subgrid gap-4 col-span-4">
<label className="flex flex-row justify-center col-start-1 font-semibold  gap-2 text-white">ADMINISTRAR ACORDO</label>
</div>

<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">DATA INICIO</label>
    <input type="text" value={data.acordo?.data_inicio? new Date(data?.acordo?.data_inicio).toLocaleDateString():''}   className="block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">DATA FIM</label>
    <input type="text"value={data.acordo?.data_fim? new Date(data?.acordo?.data_fim).toLocaleDateString():''}   className="block w-full  pt-1 pb-1 pl-2 pr-2 border  rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">TOTAL ACORDO</label>
    <input disabled type="text" value={data.acordo?.total_acordo}  className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">REALIZADO POR</label>
    <input disabled type="text" value={data.acordo?.realizado_por} className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>


<div className="mb-1 col-span-4">
    <label  className="block mb-1 text-xs font-medium  text-white">DESCRIÇÃO</label>
    <input type="text" placeholder="Descreva aqui todos os detalhes do acordo" className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className=" gap-2 col-span-4  flex flex-row justify-end">
<button type="button" className="flex flex-row justify-center  bg-blue-600 rounded-lg p-2 gap-2 text-white"><MdSaveAlt size={22}/>APLICAR</button>


</div>
    </div>

</form>
<label className="flex w-full justify-center text-white font-semibold p-1">REFERÊNCIAS</label>
<div className="flex-col overflow-auto w-full justify-center items-center max-h-[350px] bg-gray-800 rounded-lg mb-4 pl-2 pr-2">
    <table 
    className="flex-col w-full p-2 overflow-y-auto overflow-x-auto  text-xs text-center rtl:text-center border-collapse  rounded-lg text-gray-400">
    <thead className=" text-xs uppercase bg-gray-700 text-gray-400">
            <tr >
                <th scope="col" className="px-2 py-1">
                    NP
                </th>
                <th scope="col" className=" px-2 py-1">
                    DATA VENC.
                </th>
                <th scope="col" className=" px-2 py-1">
                    REF
                </th>
                <th scope="col" className="px-4 py-1">
                    DATA AGEND.
                </th>
                <th scope="col" className="px-2 py-1">
                    VALOR
                </th>
                <th scope="col" className="px-2 py-1">
                    status
                </th>
            </tr>
        </thead>
        <tbody  >
            {data.acordo?.mensalidade && data.acordo?.mensalidade.map((item,index)=>(  
                <tr key={index} 
                className={` border-b "bg-gray-800"} border-gray-700 `}>
                <th scope="row" className={`px-5 py-1 font-medium  whitespace-nowrap  `}>
                    {item.parcela_n}
                </th>
                <td className={`px-2 py-1 `}>
                   {new Date(item.vencimento || '').toLocaleDateString()}
                   
                </td>
                <td className="px-2 py-1">
                   {item.referencia}
                </td>
                <td className="px-5 py-1">
                {new Date(item.cobranca || '').toLocaleDateString()}
                </td>
                <td className="px-3 py-1">
               {`R$${item.valor_principal}`}
                </td>
                <td className={`px-4 py-1 font-bold text-red-600`}>
                  {item.status}
                </td>

            </tr>
                
            ))}
            
        </tbody>
    
    </table>
    </div>
</div>
</div>
</div>)
}