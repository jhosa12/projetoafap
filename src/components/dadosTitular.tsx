
import { FormWrapper } from "./organizador"
import InputMask from 'react-input-mask'


import { useState } from "react";







type UserData={
  name:string,
  date:string,
  sexo:string,
  cep:string,
  endereço:string,
  numero:string,
  bairro:string, 
  referencia:string,
  cidade:string,
  uf:string,
  email:string,
  rg:string,
  cpf:string
}
type UserFormProps=UserData & {
  updateFields:(fields:Partial<UserData>)=>void
}

export function Item({name,date,updateFields}:UserFormProps){
  const [inputType, setInputType] = useState('text');
    return(
        <FormWrapper title="Dados do Titular">
         

        <div className="flex flex-col   gap-9 p-4 rounded-lg w-full h-full bg-[#363640]">
        <div  className="grid gap-2 grid-flow-col-dense pl-2 pr-2 w-full h-[30px] md:grid-cols-3 " >
          <div className="col-span-2">
          <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
          <input className="w-full text-[14px] border-[1px] rounded-[9px] p-1 pl-3 bg-[#21222c] text-white " id="name" type="text"  />
          </div>
          <div className="col-span-1">
          <label htmlFor="data" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Data Nasc.</label>
          <input id="data" type="date" className=" col-span-1 w-full text-[14px] border-[1px] rounded-[9px] p-1 pl-3 bg-[#21222c] text-white " />
          </div>
          <div className="col-span-1">
          <label htmlFor="sexo" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Sexo</label>
          <select id="sexo" className=" w-full text-[14px] border-[1px] rounded-[9px] p-1 pl-3 bg-[#21222c] text-white ">
          <option> </option>
          <option>M</option>
          <option>F</option>
        </select>
          </div>
        </div>
        
        <div>
          <div className="" >
          <label htmlFor="cep" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">CEP</label>
          <InputMask mask={"99999-999"} className="w-full border-[1px] rounded-[9px] p-1 pl-3 bg-[#21222c] text-white " id="cep" type="text"  />
          </div>
          <div>
          <label htmlFor="endereco" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Endereço</label>
          <input id="endereco" type="text" className=" border-[1px] rounded-[9px] p-1 pl-3 bg-[#21222c] text-white " />
          </div>
          <div>
          <label htmlFor="n" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">N°</label>
          <input id="n" type="text" className=" border-[1px] rounded-[9px] p-1 pl-3 bg-[#21222c] text-white " />
          </div>
        </div>
        
        
        
        
      
     
      </div>
  
      </FormWrapper>
    )
}