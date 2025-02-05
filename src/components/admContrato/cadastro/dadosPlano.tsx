

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
          <div >
          <Label className="text-xs"  value="Origem" />
        </div>
            <Select sizing="sm" {...register('contrato.origem')}  >
            <option selected></option>
              <option value={'PLANO NOVO'} >PLANO NOVO</option>
              <option value={'TRANSFERENCIA SEM CA'} >TRANSFERÊNCIA</option>
            </Select>
          </div>

          <div className="col-span-1">
          <div >
          <Label className="text-xs" value="Plano" />
        </div>
            <Select sizing="sm" value={watch('contrato.id_plano')} onChange={(e) => {
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
          <div >
          <Label className="text-xs"  value="Valor" />
        </div>
        <TextInput sizing="sm"  value={watch('contrato.valor_mensalidade')} {...register('contrato.valor_mensalidade')} type="number" required />
          </div> 
          <div className="col-span-1">
          <div >
          <Label className="text-xs"  value="Cobrador" />
        </div>
            <Select sizing="sm" value={watch('contrato.cobrador')} {...register('contrato.cobrador')}   >

            <option selected></option>
            {consultores?.map((item)=>
               (
               item.funcao==='COBRADOR (RDA)' && <option value={item.nome} key={item.id_consultor} >{item.nome}</option>
              )
            )}
            </Select>
          </div>


          <div className="col-span-1">
          <div >
          <Label className="text-xs"  value="Consultor" />
        </div>
            <Select sizing="sm" value={watch('contrato.consultor')} {...register('contrato.consultor')}  >

            <option selected></option>
            {consultores?.map((item,index)=>
              (
              item.funcao==='PROMOTOR(A) DE VENDAS' && <option value={item.nome} key={index} >{item.nome}</option>
              )
            )}
            </Select>
          </div>


          <div className="col-span-1">
          <div >
          <Label className="text-xs"  value="Supervisor" />
        </div>
            <Select sizing="sm"  value={watch('contrato.supervisor')} {...register('contrato.supervisor')} >

            <option selected></option>
              <option >JACKSON</option>
              <option >SAMUEL</option>
            </Select>
          </div>
         
      

          <div className="col-span-1">
          <div >
          <Label className="text-xs"  value="Numero de Parcelas" />
        </div>
        <TextInput sizing="sm"  {...register('contrato.n_parcelas')}  type="number" required />
          </div>
         
          <div className="col-span-1">
          <div >
          <Label className="text-xs" value="Venc. 1° Parcela" />
        </div>
          <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={watch('contrato.data_vencimento')} onChange={(e)=>e && setValue('contrato.data_vencimento',e)}  required className="block text-xs uppercase  pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
          </div>


          <div className="col-span-1">
          <div >
          <Label className="text-xs"  value="Data de adesão" />
        </div>
          <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={watch('contrato.dt_adesao')} onChange={e=>e && setValue('contrato.dt_adesao',e)}  required className="block text-xs uppercase  pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
          </div>


          <div className="col-span-1">
          <div >
          <Label className="text-xs"  value="Fim da carência" />
        </div>
          <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={watch('contrato.dt_carencia')} onChange={e=>e && setValue('contrato.dt_carencia',e)}  required className="block text-xs uppercase  pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
          </div>

         
        </div>


      
   


    )
}