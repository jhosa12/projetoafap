
import { FormWrapper } from "./organizador";
import InputMask from 'react-input-mask';
import DatePicker from 'react-datepicker'
import pt from "date-fns/locale/pt";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Label, Select, TextInput } from "flowbite-react";



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
      
        <div className="flex flex-col w-full h-full ">
        <div  className="grid gap-2  font-semibold grid-cols-4" >


        <div className="col-span-2">
        <div className="mb-1 block">
          <Label htmlFor="nome" value="Nome" />
        </div>
        <TextInput sizing={'sm'} id="nome" value={data.name} onChange={e=>closeModa({...data,name:e.target.value.toUpperCase()})} type="text" required />
      </div>
        
      
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label htmlFor="nome" value="Nascimento" />
        </div>
          <DatePicker  selected={data.nasc} locale={pt} onChange={e=>e && closeModa({...data,nasc:e})}  required className="flex w-full uppercase  text-xs   border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
          </div>
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label htmlFor="sexo" value="Sexo" />
        </div>
            <Select  sizing={'sm'} className="flex w-full" value={data.sexo} onChange={e=>closeModa({...data,sexo:e.target.value.toUpperCase()})} >
              <option   selected></option>
              <option   value="M">MASCULINO</option>
              <option   value="F">FEMININO</option>
            </Select>
          </div>
       
        <div className="col-span-1">
        <div className="mb-1 block">
          <Label htmlFor="cep" value="CEP" />
        </div>
          <InputMask value={data.cep} onChange={e=>closeModa({...data,cep:e.target.value})} mask={'99999-9999'} type="text" required className="flex uppercase w-full  text-xs  border  rounded-lg bg-gray-50 border-gray-300 placeholder-gray-400 "/>
          </div>
          <div className="col-span-2">
          <div className="mb-1 block">
          <Label htmlFor="endereco" value="Endereço" />
        </div>
        <TextInput  sizing={'sm'} id="endereco" value={data.endereco} onChange={e=>closeModa({...data,endereco:e.target.value.toUpperCase()})} type="text" required />
          </div>

          <div className="col-span-1">
          <div className="mb-1 block">
          <Label htmlFor="numero" value="Numero" />
        </div>
        <TextInput  sizing={'sm'} id="numero" value={data.numero} onChange={e=>closeModa({...data,numero:Number(e.target.value)})}  type="number" required />
          </div>
        
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label htmlFor="bairro" value="Bairro" />
        </div>
        <TextInput  sizing={'sm'} id="bairro" value={data.bairro} onChange={e=>closeModa({...data,bairro:e.target.value.toUpperCase()})} type="text" required />
          </div>

          <div className="col-span-2">
          <div className="mb-1 block">
          <Label htmlFor="ref" value="Referencia" />
        </div>
        <TextInput  sizing={'sm'} id="referencia" value={data.referencia} onChange={e=>closeModa({...data,referencia:e.target.value.toUpperCase()})}  type="text" required />
          </div>

          
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label htmlFor="uf" value="UF" />
        </div>
            <Select   sizing={'sm'} value={data.uf} onChange={e=>closeModa({...data,uf:e.target.value.toUpperCase()})} >
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
            </Select>
          </div>
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label htmlFor="cidade" value="Cidade" />
        </div>
            <Select  sizing={'sm'} value={data.cidade} onChange={e=>closeModa({...data,cidade:e.target.value.toUpperCase()})} >
              <option selected></option>
                {data.cidades?.map((item)=>{
                  return(
                      item.uf===data.uf?(<option>{item.cidade}</option>):''
                  )
                })}
            </Select>
          </div>

          <div className="col-span-1">
          <div className="mb-1 block">
          <Label htmlFor="rg" value="RG" />
        </div>
        <TextInput   sizing={'sm'} id="rg"value={data.rg} onChange={e=>closeModa({...data,rg:e.target.value})} type="number" required />
          </div>

          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="CPF" />
        </div>
          <InputMask mask={'999.999.999-99'}  value={data.cpf} onChange={e=>closeModa({cpf:e.target.value})} autoComplete="off" type="text" required className="flex uppercase w-full text-xs border  rounded-lg bg-gray-50 border-gray-300 placeholder-gray-400 "/>
          </div>


          <div className="col-span-1">
          <div className="mb-1 block">
          <Label htmlFor="naturalidade" value="Naturalidade" />
        </div>
        <TextInput  sizing={'sm'} id="rg"value={data.naturalidade} onChange={e=>closeModa({...data,naturalidade:e.target.value.toUpperCase()})} type="text" required />
          </div>


          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Email" />
        </div>
        <TextInput   sizing={'sm'} value={data.email} onChange={e=>closeModa({...data,email:e.target.value.toUpperCase()})} type="text" required />
          </div>

      
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Celular 1" />
        </div>
          <InputMask value={data.celular1} onChange={e=>closeModa({...data,celular1:e.target.value})} mask={'(99) 9 9999-9999'} type="text" required className="flex uppercase w-full  text-xs  border  rounded-lg bg-gray-50 border-gray-300 placeholder-gray-400 "/>
          </div>
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Celular 2" />
        </div>
          <InputMask value={data.celular2} onChange={e=>closeModa({...data,celular2:e.target.value})} mask={'(99) 9 9999-9999'} type="text"  className="flex uppercase w-full  text-xs  border  rounded-lg bg-gray-50 border-gray-300 placeholder-gray-400  "/>
          </div>
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Telefone" />
        </div>
          <InputMask value={data.telefone} onChange={e=>closeModa({...data,telefone:e.target.value})} mask={'(99) 9 9999-9999'} type="text"  className="flex uppercase w-full  text-xs  border  rounded-lg bg-gray-50 border-gray-300 placeholder-gray-400  "/>
          </div>
        </div>
        </div>
 
    )
}