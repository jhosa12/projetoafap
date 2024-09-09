import { Label, Select, TextInput } from "flowbite-react"
import InputMask from 'react-input-mask'
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";





export function TabContrato(){
    const {data,closeModa,dadosassociado} = useContext(AuthContext)

 

    const utcToLocal = (dateStr:Date) => {
      const date = new Date(dateStr);
      return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    };
    



    return(
        <>
             
          
            <div className="grid gap-2 grid-flow-c-dense pl-2 pr-2 w-full  grid-cols-4" >


            <div className="col-span-1" >
        <div className=" block">
          <Label  value="Contrato" />
        </div>
        <TextInput disabled sizing={'sm'} value={data.contrato?.id_contrato}  type="number"  />
      </div> 
      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Origem" />
        </div>
        <Select value={data.contrato?.origem}sizing={'sm'} onChange={e=>closeModa({...data,contrato:{origem:e.target.value}})}>
                    <option selected></option>
                    <option value={'PLANO NOVO'} >PLANO NOVO</option>
                    <option value={'TRANSFERÊNCIA'} >TRANSFERÊNCIA</option>
                  </Select >
      </div> 

      <div className="col-span-2" >
        <div className=" block">
          <Label  value="Plano" />
        </div>
        <Select value={data.contrato?.id_plano} sizing={'sm'}  onChange={(e) => {
                    const selectedPlano = data.planos?.find(item => item.id_plano === Number(e.target.value));
                    closeModa({
                      contrato: {
                        ...data.contrato,
                        id_plano: Number(selectedPlano?.id_plano),
                        plano: selectedPlano?.descricao

                      }
                    });

                  }}>
                     <option value=" ">{}</option>
                      {data.planos?.map((item,index) => {
                    return (
                      <option
                        
                        value={item.id_plano} key={index} >{item.descricao}</option>
                    )
                  })}
                  
                  </Select >
      </div> 

       
      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Valor" />
        </div>
        <TextInput onChange={e => closeModa({ contrato: { ...data.contrato, valor_mensalidade: Number(e.target.value) } })} disabled sizing={'sm'} value={data.contrato?.valor_mensalidade}  type="number"  />
      </div> 

      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Cobrador" />
        </div>
        <Select value={data.contrato?.cobrador}sizing={'sm'} onChange={e=>closeModa({...data,contrato:{cobrador:e.target.value}})}>
                    <option selected></option>
                    <option >JACKSON</option>
                    <option >SAMUEL</option>
                  </Select >
      </div> 

      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Consultor" />
        </div>
        <Select value={data.contrato?.consultor}sizing={'sm'} onChange={e=>closeModa({...data,contrato:{consultor:e.target.value}})}>
                    <option selected></option>
                    <option >JACKSON</option>
                    <option >SAMUEL</option>
                  </Select >
      </div> 


              
      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Supervisor" />
        </div>
        <Select value={data.contrato?.supervisor}sizing={'sm'} onChange={e=>closeModa({...data,contrato:{supervisor:e.target.value}})}>
                    <option selected></option>
                    <option >JACKSON</option>
                    <option >SAMUEL</option>
                  </Select >
      </div> 
            
      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Parcelas" />
        </div>
        <TextInput onChange={e => closeModa({ contrato: { ...data.contrato, n_parcelas: Number(e.target.value) } })} disabled sizing={'sm'} value={data.contrato?.n_parcelas}  type="number"  />
      </div>  



      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Vencimento" />
        </div>
       <DatePicker selected={data.contrato?.data_vencimento ? utcToLocal(data.contrato.data_vencimento) : null}  onChange={e => { e && closeModa({...data,contrato:{data_vencimento:e}}) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
      </div>

      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Adesão" />
        </div>
       <DatePicker selected={data.contrato?.dt_adesao ? utcToLocal(data.contrato.dt_adesao):null}  onChange={e => { e && closeModa({...data,contrato:{dt_adesao:e}}) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
      </div>

      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Carência" />
        </div>
       <DatePicker selected={data.contrato?.dt_carencia ? utcToLocal(data.contrato.dt_carencia):null} onChange={e => { e && closeModa({...data,contrato:{dt_carencia:e}}) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase  z-50 text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
      </div>

           

            </div>
        
        </>
    )
}