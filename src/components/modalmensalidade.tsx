import { IoIosClose } from "react-icons/io";
import { MdSaveAlt } from "react-icons/md";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { GiReturnArrow } from "react-icons/gi";

export function ModalMensalidade(){
    return(
    <div  className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full  ">
  
    <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-10 bg-white ">
    <div className="fixed flex flex-col  w-2/4  rounded-lg shadow bg-gray-800">
    <button  type="button" onClick={()=>closeModa({closeModalPlano:false})} className="absolute right-0 text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                    <IoIosClose size={30}/>
        </button>
        <form>
        
        <div className="p-2 border-solid border-b-[1px] grid mt-2 gap-2 grid-flow-row-dense grid-cols-4">
        <div className="grid grid-cols-subgrid gap-4 col-span-4">
<label className="flex flex-row justify-center col-start-1 font-semibold  gap-2 text-white">EDITAR MENSALIDADE</label>
</div>
<div className="mb-1 col-span-1 ">
<label  className="block mb-1 text-xs font-medium  text-white">NP</label>
<input type="text"  className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-500 border-gray-400 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">VENCIMENTO</label>
    <input type="text"  className="block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-500 border-gray-400 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">COBRANÇA</label>
    <input type="text"  className="block w-full  pt-1 pb-1 pl-2 pr-2 border  rounded-lg  sm:text-xs bg-gray-500 border-gray-400 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">VALOR</label>
    <input type="text"  className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs  bg-gray-500 border-gray-400 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">STATUS</label>
    <input type="text"  className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-500 border-gray-400 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">BAIXADA POR</label>
    <input type="text"  className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-500 border-gray-400 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">AGENDADA POR</label>
    <input type="text"  className="block w-full  pt-1 pb-1 pl-2 pr-2 border rounded-lg  sm:text-xs bg-gray-500 border-gray-400 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="grid grid-cols-subgrid gap-4 col-span-4">
<button className="flex flex-row justify-center col-start-12 bg-blue-600 rounded-lg p-2 gap-2 text-white"><MdSaveAlt size={22}/> SALVAR</button>
</div>

    </div>
    <div className="p-2  grid gap-2 grid-flow-row-dense grid-cols-4">
    <div className="grid grid-cols-subgrid gap-4 col-span-4">
<label className="flex flex-row justify-center col-start-1 font-semibold p-2 gap-2 text-white">BAIXA/STORNO</label>
</div>
<div className="mb-1 col-span-1">
<label  className="block mb-1 text-xs font-medium  text-white">VALOR PAGO</label>
<input type="text"  className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs focus:ring-blue-500 focus:border-blue-500 bg-gray-500 border-gray-400 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">RECEBIDO POR</label>
    <input type="text"  className="block w-full pt-1 pb-1 pl-2 pr-2 text-gray-700 border  rounded-lg  sm:text-xs focus:ring-blue-500 focus:border-blue-500 bg-gray-500 border-gray-400 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">FORMA PAG.</label>
    <input type="text"  className="block w-full  pt-1 pb-1 pl-2 pr-2 text-gray-900 border  rounded-lg  sm:text-xs focus:ring-blue-500 focus:border-blue-500 bg-gray-500 border-gray-400 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">DATA PAG.</label>
    <input type="text"  className="block w-full  pt-1 pb-1 pl-2 pr-2 text-gray-900 border  rounded-lg  sm:text-xs focus:ring-blue-500 focus:border-blue-500 bg-gray-500 border-gray-400 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
</div>
<button className="flex flex-row justify-center  bg-green-600 rounded-lg p-2 gap-2 text-white"><IoIosArrowDropdownCircle size={25}/>BAIXAR</button>
<button className="flex flex-row justify-center  bg-red-600 rounded-lg p-2 gap-2 text-white"><GiReturnArrow size={22}/> ESTORNAR</button>
</div>
</form>
       
    </div>
    </div>
    </div>
    )
}