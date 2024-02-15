import { IoIosClose } from "react-icons/io";
import { MdSaveAlt } from "react-icons/md";
import { RiAddCircleFill } from "react-icons/ri";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import DatePicker,{registerLocale, setDefaultLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
registerLocale('pt', pt)
export function ModalDependentes(){
    const {closeModa,data}=useContext(AuthContext)
 

    return(
    <div  className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full ">
       
    <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-20 bg-gray-100 ">
    <div className="fixed flex flex-col  w-2/4  rounded-lg  shadow bg-gray-800">
    <button  type="button" onClick={()=>closeModa({dependente:{close:false}})} className="absolute cursor-pointer right-0 text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
    <IoIosClose size={30}/>
        </button>
        <form>
        <div className="p-2  border-b border-gray-600 grid mt-2 gap-2 grid-flow-row-dense grid-cols-4">
        <div className="grid grid-cols-subgrid gap-4 col-span-4">
<label className="flex flex-row justify-center col-start-1 font-semibold  gap-2 text-white">ADMINISTRAR DEPENDENTE</label>
</div>
<div className="mb-1 col-span-2 ">
<label  className="block mb-1 text-xs font-medium  text-white">NOME</label>
<input type="text" value={data.dependente?.nome} onChange={e=>closeModa({dependente:{...(data.dependente || {}),nome:e.target.value}})}  className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">DATA NASC.</label>
    <DatePicker dateFormat={"dd/MM/yyyy"} locale={"pt"}  selected={data.dependente?.data_nasc} onChange={e=>e && closeModa({dependente:{...(data.dependente || {}),data_nasc:e}})}  className="block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">GRAU PARENTESCO</label>
    <select className="block w-full pt-1 pb-1 pl-2 pr-2  sm:text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  >
                    <option selected className="text-gray-200">PARENTESCO</option>
                    <option>CONJUGE</option>
                    <option>PAI</option>
                    <option>MÃE</option>
                    <option>FILHO(A)</option>,
                    <option>IRMÃO(Ã)</option>
                    <option>PRIMO(A)</option>
                    <option>SOBRINHA(A)</option>
                    <option>NORA</option>
                    <option>GENRO</option>
                    <option>TIO(A)</option>
                    <option>AVÔ(Ó)</option>
                    <option>OUTROS</option>
                </select>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">DATA ADESÃO</label>
    <DatePicker dateFormat={"dd/MM/yyyy"} locale={"pt"}  selected={data.dependente?.data_adesao} onChange={e=>e && closeModa({dependente:{...(data.dependente || {}),data_adesao:e}})}  className="block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">FIM DA CARÊNCIA</label>
    <DatePicker dateFormat={"dd/MM/yyyy"} locale={"pt"}  selected={data.dependente?.carencia} onChange={e=>e && closeModa({dependente:{...(data.dependente || {}),carencia:e}})}  className="block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>


<div className=" gap-2 col-span-4  flex flex-row justify-end">
<button type="button" className="flex flex-row justify-center  bg-blue-600 rounded-lg p-2 gap-2 text-white"><MdSaveAlt size={22}/>SALVAR</button>
<button type="button" className="flex flex-row justify-center  bg-blue-600 rounded-lg p-2 gap-2 text-white"><RiAddCircleFill size={22}/>ADICIONAR</button>

</div>
    </div>

</form>
</div>
</div>
</div>)
}