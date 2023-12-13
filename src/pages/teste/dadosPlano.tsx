import { type } from "os";
import { FormWrapper } from "./organizador";

type UserData={
  name:string,
  date:string
}
type UserFormProps = UserData & {
  updateFields: (fields:Partial<UserData>)=>void
}
export function DadosPlano({name,date,updateFields}:UserFormProps){
    return(
        <FormWrapper title="Dados do Plano">
              <div className="flex flex-col gap-4 p-4   rounded-lg  ">
        <div  className="flex gap-2 justify-center h-[32px]">
          <input placeholder="Contrato" className="p-2 rounded-lg w-1/5 border-2" type="text"></input>
          <select  className=" items-center justify-center pl-2 rounded-lg w-[150px] border-2">
            <option>Plano</option>
            <option>Lavras</option>
            <option>Amaniutuba</option>
          </select>
          <select  className=" items-center justify-center pl-2 rounded-lg w-[150px] border-2">
            <option>Origem</option>
            <option>Lavras</option>
            <option>Amaniutuba</option>
          </select>
          <select  className=" items-center justify-center pl-2 rounded-lg w-[150px] border-2">
            <option>Consultor</option>
            <option>Lavras</option>
            <option>Amaniutuba</option>
          </select>
         
        </div>
       
         <div  className=" flex flex-row justify-center gap-2">
          <label className="flex items-center">
          Vencimento:
          </label>
          <input placeholder="Bairro" className="mr-1 pl-2 rounded-lg w-1/5 border-2" type="date"/>
          <label className="flex items-center">
          Adesão:
          </label>
          <input placeholder="Bairro" className="mr-1 pl-2 rounded-lg w-1/5  border-2" type="date"/>
          <label className="flex items-center">
          Carência:
          </label>
          <input placeholder="Bairro" className="pl-2 rounded-lg w-1/5 border-2" type="date"/>
          
        </div>
        
      </div>
      </FormWrapper>


    )
}