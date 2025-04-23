
import { FormWrapper } from "../../../organizador";
import DatePicker from 'react-datepicker'
import pt from "date-fns/locale/pt";
import { useContext } from "react";
import { AuthContext } from "@/store/AuthContext";
import { Label, Select, TextInput } from "flowbite-react";
import { Controller, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ChildrenProps } from "@/components/modals/admContrato/cadastro/modalCadastro";
import { CepMaskInput } from "@/components/CepMaskInput";
import { CPFInput } from "@/components/CpfMaskInput";
import { PhoneMaskInput } from "@/components/PhoneMaskInput";



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
  //cidades:Array<Partial<CidadesProps>>
}



export function DadosTitular({register,setValue,watch,control}:ChildrenProps){

  const {cidades}= useContext(AuthContext)
 


  

    return(
      
        <div className="flex flex-col w-full h-full ">
        <div  className="grid gap-2   grid-cols-4" >


        <div className="col-span-2">
        <div >
          <Label className="text-xs"  htmlFor="nome" value="Nome" />
        </div>
        <TextInput sizing={'sm'} id="nome" {...register('name')} type="text" required />
      </div>
        
      
          <div className="flex flex-col w-full">
          <div >
          <Label className="text-xs"  htmlFor="nome" value="Nascimento" />
        </div>
        <Controller
        name="nasc"
        control={control}
        render={({ field: { onChange, value } }) => (
          <DatePicker selected={value} dateFormat={"dd/MM/yyyy"}  locale={pt} onChange={e=> onChange(e)}  required className="flex w-full uppercase  text-xs   border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
        )}
        />
       
          </div>
          <div className="col-span-1">
          <div >
          <Label className="text-xs"  htmlFor="sexo" value="Sexo" />
        </div>
            <Select  sizing={'sm'} className="flex w-full" {...register('sexo')} >
              <option   selected></option>
              <option   value="M">MASCULINO</option>
              <option   value="F">FEMININO</option>
            </Select>
          </div>
       
        <div className="col-span-1">
        <div >
          <Label className="text-xs" htmlFor="cep" value="CEP" />
        </div>
          <CepMaskInput controlName={'cep'}  register={register}/>
          </div>
          <div className="col-span-2">
          <div >
          <Label className="text-xs" htmlFor="endereco" value="Endereço" />
        </div>
        <TextInput  sizing={'sm'} id="endereco" {...register('endereco')} type="text" required />
          </div>

          <div className="col-span-1">
          <div >
          <Label className="text-xs" htmlFor="numero" value="Numero" />
        </div>
        <TextInput  sizing={'sm'} id="numero" {...register('numero')}  type="number"  />
          </div>
        
          <div className="col-span-1">
          <div >
          <Label className="text-xs" htmlFor="bairro" value="Bairro" />
        </div>
        <TextInput  sizing={'sm'} id="bairro" {...register('bairro')} type="text" required />
          </div>

          <div className="col-span-2">
          <div >
          <Label className="text-xs" htmlFor="ref" value="Referencia" />
        </div>
        <TextInput  sizing={'sm'} id="referencia" {...register('referencia')}  type="text"  />
          </div>

          
          <div className="col-span-1">
          <div >
          <Label className="text-xs" htmlFor="uf" value="UF" />
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
          <div >
          <Label className="text-xs" htmlFor="cidade" value="Cidade" />
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
          <div >
          <Label className="text-xs" htmlFor="rg" value="RG" />
        </div>
        <TextInput   sizing={'sm'} id="rg" {...register('rg')} type="number"  />
          </div>

          <div className="col-span-1">
          <div >
          <Label className="text-xs"  value="CPF" />
        </div>
       
          <CPFInput  register={register} controlName={'cpf'}/>
        
        
          </div>


          <div className="col-span-1">
          <div >
          <Label className="text-xs" htmlFor="naturalidade" value="Naturalidade" />
        </div>
        <TextInput  sizing={'sm'} id="rg" {...register('naturalidade')} type="text"  />
          </div>


          <div className="col-span-1">
          <div >
          <Label className="text-xs"  value="Email" />
        </div>
        <TextInput   sizing={'sm'} id="email" {...register('email')} type="text"  />
          </div>

      
          <div className="col-span-1">
          <div >
          <Label className="text-xs"  value="Celular 1" />
        </div>

        
                     <PhoneMaskInput register={register} controlName={'celular1'} />
                 
          </div>
          <div className="col-span-1">
          <div >
          <Label className="text-xs"  value="Celular 2" />
        </div>
   
            <PhoneMaskInput register={register} controlName={'celular2'}/>
         
          </div>
          <div className="col-span-1">
          <div >
          <Label className="text-xs"  value="Telefone" />
        </div>
     
            <PhoneMaskInput register={register} controlName={'telefone'}/>
         
          </div>
        </div>
        </div>
 
    )
}