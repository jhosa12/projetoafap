
import { FormWrapper } from "./organizador"
import InputMask from 'react-input-mask'
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

import { useState } from "react";




export function Item(){
  const [inputType, setInputType] = useState('text');
  const {data,closeModa}= useContext(AuthContext)
    return(
        <FormWrapper title="DADOS DO TITULAR">
        <div className="flex flex-col   gap-9 p-4 rounded-lg w-full h-full ">
        <div  className="grid gap-2 grid-flow-c-dense pl-2 pr-2 w-full  md:grid-cols-4" >
        
        <div className="col-span-2">
          <label  className="block mb-1 text-sm font-medium  text-white">NOME</label>
          <input autoComplete='off' value={data.name} onChange={e=>closeModa({name:e.target.value})}  type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">NASCIMENTO</label>
          <input type="date" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2  border  rounded-lg bg-gray-50 sm:text-sm dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label   className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">SEXO</label>
            <select  className="block w-full pb-1 pt-1 pr-2 pl-2  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option   selected></option>
              <option   value="M">MASCULINO</option>
              <option   value="F">FEMININO</option>
            </select>
          </div>
       
        <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">CEP</label>
          <InputMask mask={'99999-9999'} type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">ENDEREÇO</label>
          <input autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">NUMERO</label>
          <input autoComplete="off" type="number" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">BAIRRO</label>
          <input autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-2">
          <label  className="block mb-1 text-sm font-medium  text-white">PONTO REF</label>
          <input autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">UF</label>
            <select className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm   text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected></option>
              <option value="M">CE</option>
              <option value="F">TO</option>
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">CIDADE</label>
            <select className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected></option>
              <option value="M">CEDRO</option>
              <option value="F">LAVRAS DA MANGABEIRA</option>
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">RG</label>
          <input autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">CPF</label>
          <input autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">UF</label>
            <select className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm   text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected></option>
              <option value="M">CEDRO</option>
              <option value="F">LAVRAS DA MANGABEIRA</option>
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">NATURALIDADE</label>
          <input autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">EMAIL</label>
          <input autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">CELULAR1</label>
          <InputMask mask={'99999-9999'} type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">CELULAR2</label>
          <InputMask mask={'99999-9999'} type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">TELEFONE</label>
          <InputMask mask={'99999-9999'} type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
        



        </div>


        </div>
        
  
      </FormWrapper>
    )
}