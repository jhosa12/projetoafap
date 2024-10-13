

import { FormWrapper } from "../../organizador";
import { AuthContext } from '@/contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { Label, Select, TextInput } from "flowbite-react";
import { ChildrenProps } from "./modalCadastro";
import { set } from "date-fns";


registerLocale('pt', pt)

export function DadosPlano({register,setValue,watch}:ChildrenProps){
  const {empresas,consultores,planos} =useContext(AuthContext)
 

    return(
     
            
        <div  className="grid gap-2 grid-flow-c-dense  w-full  md:grid-cols-4" >

<div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Empresa" />
        </div>
            <Select value={watch('id_empresa')} onChange={(e)=>{
              const emp = empresas?.find(item => item.id === e.target.value)
              if(emp){setValue('id_empresa',emp?.id)
              setValue('empresa',emp?.nome)}else{
            setValue('id_empresa','')
            setValue('empresa','')
          }
            }}
           
             >
            <option selected></option>
            {empresas?.map((item)=>{
              return (
                <option value={item.id} key={item.id} >{item.nome}</option>
              )
            })}
             
            </Select>
          </div>
  
        <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Origem" />
        </div>
            <Select {...register('origem')}  >
            <option selected></option>
              <option >PLANO NOVO</option>
              <option >TRANSFERÊNCIA</option>
            </Select>
          </div>

          <div className="col-span-1">
          <div className="mb-1 block">
          <Label value="Plano" />
        </div>
            <Select value={watch('contrato.id_plano')} onChange={(e) => {
    const selectedPlanId = Number(e.target.value); 
    const selectedPlan = planos?.find(plan =>plan.id_plano === selectedPlanId);
    if(selectedPlan){
      setValue('contrato.id_plano',selectedPlanId);
      setValue('contrato.plano',selectedPlan.descricao);  
      setValue('contrato.valor_mensalidade',Number(selectedPlan?.valor));
    }
  }} >
             <option></option>
  {planos?.map((item)=>{
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
        <TextInput   value={watch('contrato.valor_mensalidade')} {...register('contrato.valor_mensalidade')} type="number" required />
          </div>
        


          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Cobrador" />
        </div>
            <Select value={watch('contrato.cobrador')} {...register('contrato.cobrador')}   >

            <option selected></option>
            {consultores?.map((item)=>
               (
               item.funcao==='COBRADOR (RDA)' && <option value={item.nome} key={item.id_consultor} >{item.nome}</option>
              )
            )}
            </Select>
          </div>


          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Consultor" />
        </div>
            <Select value={watch('contrato.consultor')} {...register('contrato.consultor')}  >

            <option selected></option>
            {consultores?.map((item,index)=>
              (
              item.funcao==='PROMOTOR(A) DE VENDAS' && <option value={item.nome} key={index} >{item.nome}</option>
              )
            )}
            </Select>
          </div>


          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Supervisor" />
        </div>
            <Select  value={watch('contrato.supervisor')} {...register('contrato.supervisor')} >

            <option selected></option>
              <option >JACKSON</option>
              <option >SAMUEL</option>
            </Select>
          </div>
         
      

          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Numero de Parcelas" />
        </div>
        <TextInput   {...register('contrato.n_parcelas')}  type="number" required />
          </div>
         
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label value="Venc. 1° Parcela" />
        </div>
          <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={watch('contrato.data_vencimento')} onChange={(e)=>e && setValue('contrato.data_vencimento',e)}  required className="block  uppercase  pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
          </div>


          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Data de adesão" />
        </div>
          <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={watch('contrato.dt_adesao')} onChange={e=>e && setValue('contrato.dt_adesao',e)}  required className="block  uppercase  pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
          </div>


          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Fim da carência" />
        </div>
          <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={watch('contrato.dt_carencia')} onChange={e=>e && setValue('contrato.dt_carencia',e)}  required className="block  uppercase  pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
          </div>

         
        </div>


      
   


    )
}