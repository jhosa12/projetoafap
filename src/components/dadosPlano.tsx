

import { FormWrapper } from "./organizador";
import { AuthContext } from '@/contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { Label, Select, TextInput } from "flowbite-react";

registerLocale('pt', pt)

export function DadosPlano(){
  const {data,closeModa,usuario} =useContext(AuthContext)
  const [inicioDatas,setDatas] =useState(true)
  useEffect(()=>{
    if(inicioDatas){
      const dataCarencia = new Date().setMonth(new Date().getMonth()+3)
      closeModa({contrato:{...data.contrato,dt_adesao:new Date(),dt_carencia:new Date(dataCarencia)},/*planos:usuario?.planos*/})
    }
    setDatas(false)
   
  },[])
    return(
     
            
        <div  className="grid gap-2 grid-flow-c-dense  w-full  md:grid-cols-4" >
  
        <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Origem" />
        </div>
            <Select value={data.origem} onChange={e=>closeModa({origem:e.target.value})}  >
            <option selected></option>
              <option >PLANO NOVO</option>
              <option >TRANSFERÊNCIA</option>
            </Select>
          </div>

          <div className="col-span-1">
          <div className="mb-1 block">
          <Label value="Plano" />
        </div>
            <Select  value ={data.contrato?.id_plano} onChange={(e) => {
    const selectedPlanId = Number(e.target.value); 
    const selectedPlan = data.planos?.find(plan =>plan.id_plano === selectedPlanId);
    if(selectedPlan){
      closeModa({
        contrato: {
          ...(data.contrato || {}),
          id_plano: selectedPlanId, 
          valor_mensalidade: Number(selectedPlan.valor),
          plano:selectedPlan.descricao
        }
      });
      console.log(selectedPlan.descricao)
    }
  }} >
             <option></option>
  {data.planos?.map((item)=>{
    return (
      <option value={item.id_plano} key={item.id_plano} >{item.descricao}</option>
    )
  })}
            </Select>
          </div>
         

          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Valor" />
        </div>
        <TextInput   value={data.contrato?.valor_mensalidade} onChange={e=>closeModa({contrato:{...data.contrato,valor_mensalidade:Number(e.target.value)}})} type="number" required />
          </div>
        


          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Cobrador" />
        </div>
            <Select value={data.contrato?.cobrador} onChange={e=>closeModa({contrato:{...data.contrato,cobrador:e.target.value}})}   >

            <option selected></option>
              <option >JACKSON</option>
              <option >SAMUEL</option>
            </Select>
          </div>


          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Consultor" />
        </div>
            <Select value={data.contrato?.consultor} onChange={e=>closeModa({contrato:{...data.contrato,consultor:e.target.value}})}  >

            <option selected></option>
              <option >JACKSON</option>
              <option >SAMUEL</option>
            </Select>
          </div>


          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Supervisor" />
        </div>
            <Select  value={data.contrato?.supervisor} onChange={e=>closeModa({contrato:{...data.contrato,supervisor:e.target.value}})} >

            <option selected></option>
              <option >JACKSON</option>
              <option >SAMUEL</option>
            </Select>
          </div>
         
      

          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Numero de Parcelas" />
        </div>
        <TextInput   value={data.contrato?.n_parcelas} onChange={e=>closeModa({contrato:{...data.contrato,n_parcelas:Number(e.target.value)}})}  type="number" required />
          </div>
         
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label value="Venc. 1° Parcela" />
        </div>
          <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={data.contrato?.data_vencimento} onChange={(e)=>e && closeModa({contrato:{...data.contrato,data_vencimento:e}})}  required className="block  uppercase  pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
          </div>


          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Data de adesão" />
        </div>
          <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={data.contrato?.dt_adesao} onChange={e=>e && closeModa({contrato:{...data.contrato,dt_adesao:e}})}  required className="block  uppercase  pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
          </div>


          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Fim da carência" />
        </div>
          <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={data.contrato?.dt_carencia} onChange={e=>e && closeModa({contrato:{...data.contrato,dt_carencia:e}})}  required className="block  uppercase  pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
          </div>

         
        </div>


      
   


    )
}