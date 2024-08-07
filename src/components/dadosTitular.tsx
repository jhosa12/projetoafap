
import { FormWrapper } from "./organizador";
import InputMask from 'react-input-mask';
import DatePicker from 'react-datepicker'
import pt from "date-fns/locale/pt";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";



interface CidadesProps  {
  id_cidade: number,
  estado: number,
  uf: string,
  cidade: string
}
interface TitularProps{
  name:string,
  nasc:Date,
  sexo:string,
  cep:string,
  endereco:string,
  numero:number,
  profissao:string,
  bairro:string,
  referencia:string,
  uf:string,
  cidade:string,
  rg:string,
  cpf:string,
  naturalidade:string,
  email:string,
  celular1:string,
  celular2:string,
  telefone:string,
  cidades:Array<Partial<CidadesProps>>
}
interface DadosProps{
 // titular:Partial<TitularProps>
  data:Partial<TitularProps>
  closeModa: (fields:Partial<TitularProps>)=>void
}

export function Item(){

  const {data,closeModa}= useContext(AuthContext)
 


  

    return(
        <FormWrapper title="DADOS DO TITULAR">
        <div className="flex flex-col   gap-9 p-4 rounded-lg w-full h-full ">
        <div  className="grid gap-2 grid-flow-c-dense pl-2 pr-2 w-full  md:grid-cols-4" >
        
        <div className="col-span-2">
          <label  className="block mb-1 text-sm font-medium  text-white">NOME</label>
          <input autoComplete='off' value={data.name} onChange={e=>closeModa({...data,name:e.target.value.toUpperCase()})}  type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">NASCIMENTO</label>
          <DatePicker  selected={data.nasc} locale={pt} onChange={e=>e && closeModa({...data,nasc:e})}  required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2  border  rounded-lg sm:text-sm bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label   className="block mb-1 text-sm font-medium text-white">SEXO</label>
            <select value={data.sexo} onChange={e=>closeModa({...data,sexo:e.target.value.toUpperCase()})} className="block w-full pb-1 pt-1 pr-2 pl-2  text-sm  border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
              <option   selected></option>
              <option   value="M">MASCULINO</option>
              <option   value="F">FEMININO</option>
            </select>
          </div>
       
        <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">CEP</label>
          <InputMask value={data.cep} onChange={e=>closeModa({...data,cep:e.target.value})} mask={'99999-9999'} type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-2">
          <label  className="block mb-1 text-sm font-medium  text-white">ENDEREÇO</label>
          <input value={data.endereco} onChange={e=>closeModa({...data,endereco:e.target.value.toUpperCase()})} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">NUMERO</label>
          <input value={data.numero} onChange={e=>closeModa({...data,numero:Number(e.target.value)})} autoComplete="off" type="number" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">BAIRRO</label>
          <input value={data.bairro} onChange={e=>closeModa({...data,bairro:e.target.value.toUpperCase()})} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-2">
          <label  className="block mb-1 text-sm font-medium  text-white">PONTO REF</label>
          <input value={data.referencia} onChange={e=>closeModa({...data,referencia:e.target.value.toUpperCase()})} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">UF</label>
            <select value={data.uf} onChange={e=>closeModa({...data,uf:e.target.value.toUpperCase()})} className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm    border  rounded-lg    bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
              <option selected></option>
             
                  <option>AC</option>
                  <option>AL</option>
                  <option>AM</option>
                  <option>AP</option>
                  <option>BA</option>
                  <option>CE</option>
                  <option>DF</option>
                  <option>ES</option>
                  <option>GO</option>
                  <option>MA</option>
                  <option>MG</option>
                  <option>MS</option>
                  <option>MT</option>
                  <option>DF</option>
                  <option>PA</option>
                  <option>PB</option>
                  <option>PE</option>
                  <option>PI</option>
                  <option>PR</option>
                  <option>RJ</option>
                  <option>RN</option>
                  <option>RO</option>
                  <option>RR</option>
                  <option>RS</option>
                  <option>SC</option>
                  <option>SE</option>
                  <option>SP</option>
                  <option>TO</option>

                
              
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-white">CIDADE</label>
            <select value={data.cidade} onChange={e=>closeModa({...data,cidade:e.target.value.toUpperCase()})} className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  text-sm  border  rounded-lg    bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
              <option selected></option>
                {data.cidades?.map((item)=>{
                  return(
                      item.uf===data.uf?(<option>{item.cidade}</option>):''
                  )
                })}
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">RG</label>
          <input value={data.rg} onChange={e=>closeModa({...data,rg:e.target.value})} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">CPF</label>
          <InputMask mask={'999.999.999-99'}  value={data.cpf} onChange={e=>closeModa({cpf:e.target.value})} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">NATURALIDADE</label>
          <input value={data.naturalidade} onChange={e=>closeModa({...data,naturalidade:e.target.value.toUpperCase()})} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">EMAIL</label>
          <input value={data.email} onChange={e=>closeModa({...data,email:e.target.value.toUpperCase()})} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">CELULAR1</label>
          <InputMask value={data.celular1} onChange={e=>closeModa({...data,celular1:e.target.value})} mask={'(99) 9 9999-9999'} type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">CELULAR2</label>
          <InputMask value={data.celular2} onChange={e=>closeModa({...data,celular2:e.target.value})} mask={'(99) 9 9999-9999'} type="text"  className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">TELEFONE</label>
          <InputMask value={data.telefone} onChange={e=>closeModa({...data,telefone:e.target.value})} mask={'(99) 9 9999-9999'} type="text"  className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
        </div>
        </div>
      </FormWrapper>
    )
}