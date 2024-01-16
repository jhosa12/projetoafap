
import InputMask from 'react-input-mask'
import { FormWrapper } from "./organizador";

type UserData={
  name:string,
  date:string
}
type UserFormProps = UserData & {
  updateFields: (fields:Partial<UserData>)=>void
}
export function DadosPlano(){
    return(
        <FormWrapper title="DADOS DO PLANO">
              <div className="flex flex-col   gap-9 p-4 rounded-lg w-full h-full ">
        <div  className="grid gap-2 grid-flow-c-dense pl-2 pr-2 w-full  md:grid-cols-4" >
        
        <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">CONTRATO</label>
          <input autoComplete="off"  type="number" required className="block uppercase w-full p-2 border  rounded-lg bg-gray-50 sm:text-xs dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
         
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">ORIGEM</label>
            <select className="block w-full p-1.5  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected></option>
              <option value="M">PLANO NOVO</option>
              <option value="F">TRANSFERÊNCIA</option>
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">PLANO</label>
            <select className="block w-full p-1.5  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected></option>
              <option value="M">GOLD</option>
              <option value="F">PLANO B6</option>
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">VALOR</label>
          <input disabled autoComplete="off" type="number" required className="block uppercase w-full p-2 border  rounded-lg bg-gray-50 sm:text-xs dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">COBRADOR</label>
            <select className="block w-full p-1.5  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected></option>
              <option value="M">JACKSON</option>
              <option value="F">SAMUEL</option>
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">CONSULTOR</label>
            <select className="block w-full p-1.5  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected></option>
              <option value="M">MATEUS</option>
              <option value="F">JOÃO</option>
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">SUPERVISOR</label>
            <select className="block w-full p-1.5  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option selected></option>
              <option value="M">MATEUS</option>
              <option value="F">JOÃO</option>
            </select>
          </div>
        
       
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">NP</label>
          <input autoComplete="off" type="number" required className="block uppercase w-full p-2 border  rounded-lg bg-gray-50 sm:text-xs dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">VENC. 1° PARCELA</label>
          <input type="date" required className="block uppercase w-full pb-1.5 pt-2 pr-2 pl-2  border  rounded-lg bg-gray-50 sm:text-xs dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">DATA DE ADESÃO</label>
          <input type="date" required className="block uppercase w-full pb-1.5 pt-2 pr-2 pl-2  border  rounded-lg bg-gray-50 sm:text-xs dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">FIM DA CARÊNCIA</label>
          <input type="date" required className="block uppercase w-full pb-1.5 pt-2 pr-2 pl-2  border  rounded-lg bg-gray-50 sm:text-xs dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
         
        </div>


        </div>
      </FormWrapper>


    )
}