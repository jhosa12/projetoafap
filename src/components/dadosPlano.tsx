

import { FormWrapper } from "./organizador";
import { AuthContext } from '@/contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';

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
        <FormWrapper title="DADOS DO PLANO">
              <div className="flex flex-col   gap-9 p-4 rounded-lg w-full h-full ">
        <div  className="grid gap-2 grid-flow-c-dense pl-2 pr-2 w-full  md:grid-cols-4" >
  
   
         
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">ORIGEM</label>
            <select value={data.origem} onChange={e=>closeModa({origem:e.target.value})} className="block w-full  pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg    bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
              <option selected></option>
              <option >PLANO NOVO</option>
              <option >TRANSFERÊNCIA</option>
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-white">PLANO</label>
          <select
          defaultValue ={data.contrato?.plano}
  className="block w-full p-1.5 pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
  onChange={(e) => {
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
  }}>
    <option></option>
  {data.planos?.map((item)=>{
    return (
      <option value={item.id_plano} key={item.id_plano} >{item.descricao}</option>
    )
  })}
</select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">VALOR</label>
          <input value={data.contrato?.valor_mensalidade} onChange={e=>closeModa({contrato:{...data.contrato,valor_mensalidade:Number(e.target.value)}})} autoComplete="off" type="number" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">COBRADOR</label>
            <select value={data.contrato?.cobrador} onChange={e=>closeModa({contrato:{...data.contrato,cobrador:e.target.value}})} className="block w-full   pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
              <option selected></option>
              <option >JACKSON</option>
              <option >SAMUEL</option>
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium text-white">CONSULTOR</label>
            <select value={data.contrato?.consultor} onChange={e=>closeModa({contrato:{...data.contrato,consultor:e.target.value}})} className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border rounded-lg    bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
              <option selected></option>
              <option >MATEUS</option>
              <option >JOÃO</option>
            </select>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">SUPERVISOR</label>
            <select value={data.contrato?.supervisor} onChange={e=>closeModa({contrato:{...data.contrato,supervisor:e.target.value}})} className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border rounded-lg  focus:border-blue-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 ">
              <option selected></option>
              <option >MATEUS</option>
              <option >JOÃO</option>
            </select>
          </div>
        
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">NP</label>
          <input value={data.contrato?.n_parcelas} onChange={e=>closeModa({contrato:{...data.contrato,n_parcelas:Number(e.target.value)}})} autoComplete="off" type="number" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div  className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">VENC. 1° PARCELA</label>
          <DatePicker   dateFormat={"dd/MM/yyyy"} locale={pt} selected={data.contrato?.data_vencimento} onChange={(e)=>e && closeModa({contrato:{...data.contrato,data_vencimento:e}})}  required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">DATA DE ADESÃO</label>
          <DatePicker  dateFormat={"dd/MM/yyyy"} locale={pt} selected={data.contrato?.dt_adesao} onChange={e=>e && closeModa({contrato:{...data.contrato,dt_adesao:e}})} required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="col-span-1">
          <label  className="block mb-1 text-sm font-medium  text-white">FIM DA CARÊNCIA</label>
          <DatePicker dateFormat={"dd/MM/yyyy"} locale={pt} selected={data.contrato?.dt_carencia} onChange={e=>e && closeModa({contrato:{...data.contrato,dt_carencia:e}})} required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
         
        </div>


        </div>
      </FormWrapper>


    )
}