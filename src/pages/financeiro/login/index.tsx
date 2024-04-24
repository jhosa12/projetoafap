import Grafico from "@/components/graficos/primeirografico";
import { useState } from "react";
import { GiExpense } from "react-icons/gi";

export default function LoginFinaceiro(){
    const [dropEmpresa,setDropEmpresa] =useState(false)
    return(
        <>
<div className="flex">
    <div className="text-white p-2 pt-4 rounded-sm bg-[#2b2e3b] h-full">
        <h1>Opções</h1>
        
<button  onClick={()=>setDropEmpresa(!dropEmpresa)} className=" text-white whitespace-nowrap  font-medium rounded-lg text-sm px-5 py-2.5 mb-1 text-center inline-flex items-center bg-[#343747] hover:bg-blue-700 focus:ring-blue-800" type="button">Selecione a Empresa<svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
</svg>
</button>



{dropEmpresa && <div  className="z-10  w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
    <ul className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownCheckboxButton">
      <li>
        <div className="flex items-center">
          <input id="checkbox-item-1" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
          <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">AFAP CEDRO</label>
        </div>
      </li>
      <li>
        <div className="flex items-center">
            <input  id="checkbox-item-2" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
            <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">AFAP LAVRAS</label>
          </div>
      </li>
      <li>
        <div className="flex items-center">
          <input  type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
          <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">VIVA MAIS</label>
        </div>
      </li>
    </ul>
</div>}

        

    </div>
<div className="flex flex-col p-2 w-full ">
     <div className="flex flex-row w-full  justify-between p-2">
            <div className=" inline-flex text-white p-3 gap-4 bg-[#2b2e3b] rounded-sm min-w-[180px]">

                <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense  size={32}/></div>
                <h2 className="flex flex-col" >DESPESAS <span>R$ 4000</span></h2>
            </div>
            <div className=" inline-flex text-white p-3 gap-4 bg-[#2b2e3b] rounded-sm min-w-[180px]">

<div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense  size={32}/></div>
<h2 className="flex flex-col" >RECEITAS <span>R$ 4000</span></h2>
</div>
<div className=" inline-flex text-white p-3 gap-4 bg-[#2b2e3b] rounded-sm min-w-[180px]">

<div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense  size={32}/></div>
<h2 className="flex flex-col" >REMESSA + RECEITA <span>R$ 4000</span></h2>
</div>
<div className=" inline-flex text-white p-3 gap-4 bg-[#2b2e3b] rounded-sm min-w-[180px]">

<div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense  size={32}/></div>
<h2 className="flex flex-col" >SALDO <span>R$ 4000</span></h2>
</div>

        </div>
<div className="flex flex-col p-2 ml-2 text-white bg-[#2b2e3b] rounded-lg w-fit">
    <h2 className="pl-2 text-lg font-semibold">Teste</h2>

<Grafico/>
</div>
        

     </div>
</div>
      

        </>
       
    )
}