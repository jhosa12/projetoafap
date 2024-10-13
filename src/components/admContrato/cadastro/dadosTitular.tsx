
import { FormWrapper } from "../../organizador";
import InputMask from 'react-input-mask';
import DatePicker from 'react-datepicker'
import pt from "date-fns/locale/pt";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Label, Select, TextInput } from "flowbite-react";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ChildrenProps } from "./modalCadastro";



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


export function DadosTitular({register,setValue,watch}:ChildrenProps){

  const {cidades}= useContext(AuthContext)
 


  

    return(
      
        <div className="flex flex-col w-full h-full ">
        <div  className="grid gap-2  font-semibold grid-cols-4" >


        <div className="col-span-2">
        <div className="mb-1 block">
          <Label htmlFor="nome" value="Nome" />
        </div>
        <TextInput sizing={'sm'} id="nome" {...register('name')} type="text" required />
      </div>
        
      
          <div className="flex flex-col w-full">
          <div className="mb-1 block">
          <Label htmlFor="nome" value="Nascimento" />
        </div>
          <DatePicker  selected={watch('nasc')} locale={pt} onChange={e=>e && setValue('nasc',e)}  required className="flex w-full uppercase  text-xs   border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
          </div>
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label htmlFor="sexo" value="Sexo" />
        </div>
            <Select  sizing={'sm'} className="flex w-full" {...register('sexo')} >
              <option   selected></option>
              <option   value="M">MASCULINO</option>
              <option   value="F">FEMININO</option>
            </Select>
          </div>
       
        <div className="col-span-1">
        <div className="mb-1 block">
          <Label htmlFor="cep" value="CEP" />
        </div>
          <InputMask value={watch('cep')} onChange={e=>setValue('cep',e.target.value)} mask={'99999-9999'} type="text" required className="flex uppercase w-full  text-xs  border  rounded-lg bg-gray-50 border-gray-300 placeholder-gray-400 "/>
          </div>
          <div className="col-span-2">
          <div className="mb-1 block">
          <Label htmlFor="endereco" value="Endereço" />
        </div>
        <TextInput  sizing={'sm'} id="endereco" {...register('endereco')} type="text" required />
          </div>

          <div className="col-span-1">
          <div className="mb-1 block">
          <Label htmlFor="numero" value="Numero" />
        </div>
        <TextInput  sizing={'sm'} id="numero" {...register('numero')}  type="number"  />
          </div>
        
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label htmlFor="bairro" value="Bairro" />
        </div>
        <TextInput  sizing={'sm'} id="bairro" {...register('bairro')} type="text" required />
          </div>

          <div className="col-span-2">
          <div className="mb-1 block">
          <Label htmlFor="ref" value="Referencia" />
        </div>
        <TextInput  sizing={'sm'} id="referencia" {...register('referencia')}  type="text"  />
          </div>

          
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label htmlFor="uf" value="UF" />
        </div>
            <Select   sizing={'sm'} {...register('uf')} >
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
            <Select  sizing={'sm'} 
            {...register('cidade')} required  >
              <option selected></option>
                {cidades?.map((item)=>{
                  return(
                      item.uf===watch('uf')?(<option>{item.cidade}</option>):''
                  )
                })}
            </Select>
          </div>

          <div className="col-span-1">
          <div className="mb-1 block">
          <Label htmlFor="rg" value="RG" />
        </div>
        <TextInput   sizing={'sm'} id="rg" {...register('rg')} type="number"  />
          </div>

          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="CPF" />
        </div>
          <InputMask mask={'999.999.999-99'}  value={watch('cpf')} onChange={e=>setValue('cpf',e.target.value)} autoComplete="off" type="text" required className="flex uppercase w-full text-xs border  rounded-lg bg-gray-50 border-gray-300 placeholder-gray-400 "/>
          </div>


          <div className="col-span-1">
          <div className="mb-1 block">
          <Label htmlFor="naturalidade" value="Naturalidade" />
        </div>
        <TextInput  sizing={'sm'} id="rg" {...register('naturalidade')} type="text"  />
          </div>


          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Email" />
        </div>
        <TextInput   sizing={'sm'} id="email" {...register('email')} type="text"  />
          </div>

      
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Celular 1" />
        </div>
          <InputMask value={watch('celular1')} onChange={e=>setValue('celular1',e.target.value)} mask={'(99) 9 9999-9999'} type="text" required className="flex uppercase w-full  text-xs  border  rounded-lg bg-gray-50 border-gray-300 placeholder-gray-400 "/>
          </div>
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Celular 2" />
        </div>
          <InputMask value={watch('celular2')} onChange={e=>setValue('celular2',e.target.value)} mask={'(99) 9 9999-9999'} type="text"  className="flex uppercase w-full  text-xs  border  rounded-lg bg-gray-50 border-gray-300 placeholder-gray-400  "/>
          </div>
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Telefone" />
        </div>
          <InputMask value={watch('telefone')} onChange={e=>setValue('telefone',e.target.value)} mask={'(99) 9 9999-9999'} type="text"  className="flex uppercase w-full  text-xs  border  rounded-lg bg-gray-50 border-gray-300 placeholder-gray-400  "/>
          </div>
        </div>
        </div>
 
    )
}