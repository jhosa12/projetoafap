
import InputMask from 'react-input-mask'
import { FormWrapper } from "./organizador";
import { AuthContext } from '@/contexts/AuthContext';
import { useContext } from 'react';

export function DadosPlano(){
  const {data,closeModa} =useContext(AuthContext)
    return(
        <FormWrapper title="DADOS DO PLANO">
              <div className="flex flex-col   gap-9 p-4 rounded-lg w-full h-full ">
        <div  className="grid gap-2 grid-flow-c-dense pl-2 pr-2 w-full  md:grid-cols-4" >
        
        <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">CONTRATO</label>
          <input value={data.contrato} onChange={e=>closeModa({contrato:Number(e.target.value)})} autoComplete="off"  type="number" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
         
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">ORIGEM</label>
            <select value={data.origem} onChange={e=>closeModa({origem:e.target.value})} className="block w-full  pb-1 pt-1 pr-2 pl-2 sm:text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected></option>
              <option >PLANO NOVO</option>
              <option >TRANSFERÊNCIA</option>
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">PLANO</label>
            <select value={data.plano} onChange={e=>closeModa({plano:e.target.value})} className="block w-full p-1.5  pb-1 pt-1 pr-2 pl-2 sm:text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected></option>
              <option >GOLD</option>
              <option >PLANO B6</option>
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">VALOR</label>
          <input value={data.valor} onChange={e=>closeModa({valor:e.target.value})} disabled autoComplete="off" type="number" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">COBRADOR</label>
            <select value={data.cobrador} onChange={e=>closeModa({cobrador:e.target.value})} className="block w-full   pb-1 pt-1 pr-2 pl-2 sm:text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected></option>
              <option >JACKSON</option>
              <option >SAMUEL</option>
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">CONSULTOR</label>
            <select value={data.consultor} onChange={e=>closeModa({consultor:e.target.value})} className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected></option>
              <option >MATEUS</option>
              <option >JOÃO</option>
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">SUPERVISOR</label>
            <select value={data.supervisor} onChange={e=>closeModa({supervisor:e.target.value})} className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected></option>
              <option >MATEUS</option>
              <option >JOÃO</option>
            </select>
          </div>
        
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">NP</label>
          <input value={data.np} onChange={e=>closeModa({np:Number(e.target.value)})} autoComplete="off" type="number" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">VENC. 1° PARCELA</label>
          <input value={data.dtvenc} onChange={e=>closeModa({dtvenc:e.target.value})} type="date" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">DATA DE ADESÃO</label>
          <input value={data.dtadesao} onChange={e=>closeModa({dtadesao:e.target.value})} type="date" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">FIM DA CARÊNCIA</label>
          <input value={data.dtcarencia} onChange={e=>closeModa({dtcarencia:e.target.value})} type="date" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
         
        </div>


        </div>
      </FormWrapper>


    )
}