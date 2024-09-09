import { Label, Select, TextInput } from "flowbite-react"
import InputMask from 'react-input-mask'
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";



export function TabTitular(){
const {data,closeModa} = useContext(AuthContext)



    return(
        <div className="grid  grid-cols-5 gap-2  ">

        <div className="col-span-2" >
  <div className=" block">
    <Label  value="Nome" />
  </div>
  <TextInput  sizing={'sm'} value={data.name} onChange={e=>closeModa({...data,name:e.target.value})} type="text" placeholder="Nome" required />
</div>
<div className="col-span-1" >
  <div className=" block">
    <Label  value="Nascimento" />
  </div>
 <DatePicker selected={data.nasc??null}  onChange={e => { e && closeModa({...data,nasc:e}) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
</div>

<div className="col-span-1" >
  <div className=" block">
    <Label htmlFor="email1" value="Sexo" />
  </div>
  <Select value={data.sexo}sizing={'sm'} onChange={e=>closeModa({...data,sexo:e.target.value})}>
              <option selected></option>
              <option value="M">MASCULINO</option>
              <option value="F">FEMININO</option>
            </Select >
</div>

<div className="col-span-1" >
  <div className=" block">
    <Label  value="CEP" />
  </div>
  <InputMask onChange={e=>closeModa({...data,cep:e.target.value})} value={data.cep} mask={'99999-9999'}  required className="flex  w-full  text-sm border  rounded-lg p-1.5 bg-gray-50 border-gray-300 placeholder-gray-400 " />
</div>


<div className="col-span-2" >
  <div className=" block">
    <Label  value="Endereço" />
  </div>
  <TextInput sizing={'sm'} value={data.endereco} onChange={e=>closeModa({...data,endereco:e.target.value})} type="text" placeholder="Endereço" required />
</div>



<div className="col-span-1" >
  <div className=" block">
    <Label  value="Numero" />
  </div>
  <TextInput sizing={'sm'} value={data.numero} onChange={e=>closeModa({...data,numero:Number(e.target.value)})} type="number" placeholder="Número" required />
</div>

<div className="col-span-2" >
  <div className=" block">
    <Label  value="Bairro" />
  </div>
  <TextInput sizing={'sm'} value={data.bairro} onChange={e=>closeModa({...data,bairro:e.target.value})} type="text" placeholder="Bairro" required />
</div>
          
<div className="col-span-2" >
  <div className=" block">
    <Label  value="Ponto ref" />
  </div>
  <TextInput sizing={'sm'} value={data.referencia} onChange={e=>closeModa({...data,referencia:e.target.value})} type="text" placeholder="referencia" required />
</div> 

<div className="col-span-1" >
  <div className=" block">
    <Label htmlFor="email1" value="UF" />
  </div>
  <Select value={data.uf}sizing={'sm'} onChange={e=>closeModa({...data,uf:e.target.value})}>
  <option selected></option>
              <option value={'AC'}>AC</option>
              <option  value={'AL'}>AL</option>
              <option  value={'AM'}>AM</option>
              <option  value={'AP'}>AP</option>
              <option  value={'BA'}>BA</option>
              <option  value={'CE'}>CE</option>
              <option  value={'DF'}>DF</option>
              <option  value={'ES'}>ES</option>
              <option  value={'GO'}>GO</option>
              <option  value={'MA'}>MA</option>
              <option  value={'MG'}>MG</option>
              <option  value={'MS'}>MS</option>
              <option  value={'MT'}>MT</option>
              <option  value={'DF'}>DF</option>
              <option  value={'PA'}>PA</option>
              <option  value={'PB'}>PB</option>
              <option  value={'PE'}>PE</option>
              <option  value={'PI'}>PI</option>
              <option  value={'PR'}>PR</option>
              <option  value={'PJ'}>RJ</option>
              <option  value={'RN'}>RN</option>
              <option  value={'RO'}>RO</option>
              <option  value={'RR'}>RR</option>
              <option  value={'RS'}>RS</option>
              <option  value={'SC'}>SC</option>
              <option  value={'SE'}>SE</option>
              <option  value={'SP'}>SP</option>
              <option  value={'TO'}>TO</option>
            </Select >
</div>


            


<div className="col-span-1" >
  <div className=" block">
    <Label htmlFor="email1" value="Cidade" />
  </div>
  <Select value={data.cidade}sizing={'sm'} onChange={e=>closeModa({...data,cidade:e.target.value})}>
              <option selected></option>
              {data.cidades?.map((item, index) => {
                return (
                  item.uf === data.uf ? (<option value={item.cidade} key={item.id_cidade}>{item.cidade}</option>) : ''
                )
              })}
            </Select >
</div>
          
<div className="col-span-1" >
  <div className=" block">
    <Label  value="RG" />
  </div>
  <TextInput sizing={'sm'} value={data.rg} onChange={e=>closeModa({...data,rg:e.target.value})} type="number"  />
</div> 
     
       
<div className="col-span-1" >
  <div className=" block">
    <Label  value="CPF" />
  </div>
  <InputMask onChange={e=>closeModa({...data,cpf:e.target.value})} value={data.cpf} mask={'999.999.999-99'}  required className="flex  w-full  text-sm border  rounded-lg p-1.5 bg-gray-50 border-gray-300 placeholder-gray-400 " />
</div>   

 <div className="col-span-1" >
  <div className=" block">
    <Label  value="Naturalidade" />
  </div>
  <TextInput sizing={'sm'} value={data.naturalidade} onChange={e=>closeModa({...data,naturalidade:e.target.value})} type="text"  />
</div>   


<div className="col-span-1" >
  <div className=" block">
    <Label  value="Celular1" />
  </div>
  <InputMask onChange={e=>closeModa({...data,celular1:e.target.value})} value={data.celular1} mask={'(99) 9 9999-9999'}  required className="flex  w-full  text-sm border  rounded-lg p-1.5 bg-gray-50 border-gray-300 placeholder-gray-400 " />
</div>  

<div className="col-span-1" >
  <div className=" block">
    <Label  value="Celular2" />
  </div>
  <InputMask onChange={e=>closeModa({...data,celular2:e.target.value})} value={data.celular2} mask={'(99) 9 9999-9999'}  required className="flex  w-full  text-sm border  rounded-lg p-1.5 bg-gray-50 border-gray-300 placeholder-gray-400 " />
</div>  
        
             
<div className="col-span-1" >
  <div className=" block">
    <Label  value="Telefone" />
  </div>
  <InputMask onChange={e=>closeModa({...data,telefone:e.target.value})} value={data.telefone} mask={'(99) 9 9999-9999'}  required className="flex  w-full  text-sm border  rounded-lg p-1.5 bg-gray-50 border-gray-300 placeholder-gray-400 " />
</div>     

<div className="col-span-2" >
  <div className=" block">
    <Label  value="E-mail" />
  </div>
  <TextInput sizing={'sm'} value={data.email} onChange={e=>closeModa({...data,email:e.target.value})} type="text"  />
</div>       

</div> 
    )
}