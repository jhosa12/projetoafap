import { Label, Select, TextInput } from "flowbite-react"
import InputMask from 'react-input-mask'
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { UseFormAssociadoProps } from "../../../../modals/admContrato/dadosAssociado/modalEditarDados";
import { useContext } from "react";
import { AuthContext } from "@/store/AuthContext";
import { Controller } from "react-hook-form";



export function TabTitular({register,setValue,watch,control}:UseFormAssociadoProps){
  const {cidades} = useContext(AuthContext)



    return(
        <div className="grid  grid-cols-5 gap-2 ">

        <div className="col-span-2" >
  <div className=" block">
    <Label className="text-xs"  value="Nome" />
  </div>
  <TextInput  sizing={'sm'} {...register('nome')} type="text" placeholder="Nome" required />
</div>
<div className="col-span-1" >
  <div className=" block">
    <Label className="text-xs"  value="Nascimento" />
  </div>
  <Controller 
    name="data_nasc"
    control={control}
    render={({ field:{onChange,value} }) => (
      <DatePicker selected={value}  onChange={e => { e && onChange(e) }} dateFormat={"dd/MM/yyyy"} locale={pt}  className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
    )}
  />
</div>

<div className="col-span-1" >
  <div className=" block">
    <Label className="text-xs" htmlFor="email1" value="Sexo" />
  </div>
  <Select sizing={'sm'}  {...register('sexo')} id="sexo" >
              <option selected></option>
              <option value="M">MASCULINO</option>
              <option value="F">FEMININO</option>
            </Select >
</div>

<div className="col-span-1" >
  <div className=" block">
    <Label className="text-xs"  value="CEP" />
  </div>
  <Controller 
    name="cep"
    control={control}
    render={({ field:{onChange,value} }) => (
      <InputMask  onChange={e=>onChange(e.target.value)} value={value} mask={'99999-999'}  required className="flex  w-full  text-xs border  rounded-lg p-2 bg-gray-50 border-gray-300 placeholder-gray-400 " />
    )}
  />
 
</div>


<div className="col-span-2" >
  <div className=" block">
    <Label className="text-xs"  value="Endereço" />
  </div>
  <TextInput sizing={'sm'} {...register('endereco')} type="text" placeholder="Endereço" required />
</div>



<div className="col-span-1" >
  <div className=" block">
    <Label className="text-xs"  value="Numero" />
  </div>
  <TextInput sizing={'sm'} {...register('numero')} type="number" placeholder="Número"  />
</div>

<div className="col-span-2" >
  <div className=" block">
    <Label className="text-xs"  value="Bairro" />
  </div>
  <TextInput sizing={'sm'} {...register('bairro')} type="text" placeholder="Bairro" required />
</div>
          
<div className="col-span-2" >
  <div className=" block">
    <Label className="text-xs"  value="Ponto ref" />
  </div>
  <TextInput sizing={'sm'} {...register('guia_rua')} type="text" placeholder="referencia"  />
</div> 

<div className="col-span-1" >
  <div className=" block">
    <Label className="text-xs" htmlFor="email1" value="UF" />
  </div>
  <Select sizing={'sm'} {...register('uf')} id="uf" >
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
    <Label className="text-xs"  value="Cidade" />
  </div>
  <Select  sizing={'sm'} {...register('cidade')} id="cidade" required >
              <option selected></option>
            { cidades?.map((item, index) => {
                return (
                  item.uf === watch('uf') ? (<option value={item.cidade} key={item.id_cidade}>{item.cidade}</option>) : ''
                )
              })}
            </Select >
</div>
          
<div className="col-span-1" >
  <div className=" block">
    <Label className="text-xs"  value="RG" />
  </div>
  <TextInput sizing={'sm'} {...register('rg')} type="number"  />
</div> 
     
       
<div className="col-span-1" >
  <div className=" block">
    <Label className="text-xs"  value="CPF" />
  </div>

  <Controller
    name="cpfcnpj"
    control={control}
    render={({ field:{onChange,value} }) => (
      <InputMask onChange={e=>onChange(e.target.value)} value={value} mask={'999.999.999-99'}  className="flex  w-full  text-xs border  rounded-lg p-2 bg-gray-50 border-gray-300 placeholder-gray-400 " />
    )}
  />
 
</div>   

 <div className="col-span-1" >
  <div className=" block">
    <Label className="text-xs"  value="Naturalidade" />
  </div>
  <TextInput sizing={'sm'} {...register('naturalidade')} type="text"  />
</div>   


<div className="col-span-1" >
  <div className=" block">
    <Label className="text-xs"  value="Celular1" />
  </div>
  <Controller
    name="celular1"
    control={control}
    render={({ field:{onChange,value} }) => (
      <InputMask onChange={e=>onChange(e.target.value)} value={value} mask={'(99) 9 9999-9999'} className="flex  w-full  text-xs border  rounded-lg p-2 bg-gray-50 border-gray-300 placeholder-gray-400 " />
    )}
  />
 
</div>  

<div className="col-span-1" >
  <div className=" block">
    <Label className="text-xs"  value="Celular2" />
  </div>
  <Controller
    name="celular2"
    control={control}
    render={({ field:{onChange,value} }) => (
      <InputMask onChange={e=>onChange(e.target.value)} value={value} mask={'(99) 9 9999-9999'}   className="flex  w-full  text-xs border  rounded-lg p-2 bg-gray-50 border-gray-300 placeholder-gray-400 " />
    )}
    />
 
</div>  
        
             
<div className="col-span-1" >
  <div className=" block">
    <Label className="text-xs"  value="Telefone" />
  </div>
  <Controller
    name="telefone"
    control={control}
    render={({ field:{onChange,value} }) => (
      <InputMask onChange={e=>onChange(e.target.value)} value={value} mask={'(99) 9 9999-9999'}   className="flex  w-full  text-xs border  rounded-lg p-2 bg-gray-50 border-gray-300 placeholder-gray-400 " />
    )}
  />
 
</div>     

<div className="col-span-2" >
  <div className=" block">
    <Label className="text-xs"  value="E-mail" />
  </div>
  <TextInput sizing={'sm'} {...register('email')} type="text"  />
</div>       

</div> 
    )
}