
import { FormWrapper } from "./organizador"
import InputMask from 'react-input-mask'

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
    return(
        <FormWrapper title="Dados do Titular">
        <div className="flex flex-col  gap-3 p-4   rounded-lg w-full h-full  ">
        <div  className="flex justify-between gap-1 pl-2 pr-2 w-full h-[32px]">
          <input placeholder="Nome" required className="p-2 rounded-lg w-3/5 border-2" value={name} onChange={e=>updateFields({name:e.target.value})} type="text"></input>
          <InputMask mask={"99/99/9999"} placeholder="Data Nasc." className="p-2 rounded-lg w-1/5 border-2" value={date} onChange={e=>updateFields({date:e.target.value})} type="text"></InputMask>
          <select className=" items-center justify-center pl-2 rounded-lg w-[74px] border-2">
            <option>Sexo</option>
            <option>M</option>
            <option>F</option>
          </select>
        </div>
        <div  className="flex justify-between  pl-2 pr-2 gap-1 w-full h-[32px]">
          <InputMask mask={"99999-999"} placeholder="CEP" required className=" p-2 rounded-lg w-1/5 border-2" type="text"/>
          <input placeholder="Endereço" required className=" p-2 rounded-lg w-3/5 border-2" type="text"/>
          <input placeholder="Nº" className=" p-2 rounded-lg w-[75px] border-2" type="text"/>
          
        </div>
         <div  className=" flex justify-between pl-2 pr-2 gap-1 w-full h-[32px]">
           <input placeholder="Bairro" required className="p-2 rounded-lg w-3/6 border-2" type="text"></input>
           <input placeholder="Referência" className="p-2 rounded-lg w-3/6 border-2" type="text"></input>
          <select required className=" items-center justify-center pl-2 rounded-lg w-[150px] border-2">
            <option></option>
            <option>Cedro</option>
            <option>Lavras</option>
            <option>Amaniutuba</option>
          </select>
          <select required className="items-center justify-center rounded-lg w-[75px] border-2">
          <option></option>
            <option>CE</option>
          </select>
        </div>
         <div  className="flex justify-between  pl-2 pr-2 gap-1 w-full h-[32px]">
           <input placeholder="Email" className=" p-2 rounded-lg w-2/3 border-2" type="email"></input>
          <input placeholder="RG" className=" p-2 rounded-lg w-1/2 border-2" type="text"></input>
          <InputMask mask={"999.999.999-99"} placeholder="CPF" className=" p-2 rounded-lg w-1/2 border-2" type="text"></InputMask>
         
        </div>
       <div  className="flex justify-start  pl-2 pr-2 gap-1 w-full h-[32px]">
           <InputMask mask={"(99) 9 9999-9999"} placeholder="Telefone 1"  className="placeholder-slate-400 p-2 rounded-lg w-1/4 border-[1px] border-gray-400" type="tel" ></InputMask>
           <InputMask mask={"(99) 9 9999-9999"} placeholder="Telefone 1"  className="placeholder-slate-400 p-2 rounded-lg w-1/4 border-[1px] border-gray-400" type="tel" ></InputMask>
        </div>
      </div>
      </FormWrapper>
    )
}