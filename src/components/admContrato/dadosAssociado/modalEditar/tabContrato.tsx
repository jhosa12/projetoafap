import { Label, Select, TextInput } from "flowbite-react"
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
registerLocale('pt', pt)
import { UseFormAssociadoProps } from "./modalEditarDados";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";







export function TabContrato({register,setValue,trigger,watch}:UseFormAssociadoProps){

  const {consultores,planos} = useContext(AuthContext)
   
    return(
        <>
             
          
            <div className="grid gap-2 grid-flow-c-dense Z-50 pl-2 pr-2 w-full  grid-cols-4 font-semibold" >


            <div className="col-span-1" >
        <div className=" block">
          <Label  value="Contrato" />
        </div>
        <TextInput disabled sizing={'sm'} value={watch('contrato.id_contrato')}  type="number"  />
      </div> 

      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Vencimento" />
        </div>
       <DatePicker selected={watch('contrato.data_vencimento')}  onChange={e => { e && setValue('contrato.data_vencimento',e )}} dateFormat={"dd/MM/yyyy"} locale={"pt"} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
      </div>

      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Adesão" />
        </div>
       <DatePicker selected={watch('contrato.dt_adesao')} onChange={e => { e && setValue('contrato.dt_adesao',e)}} dateFormat={"dd/MM/yyyy"}  locale={"pt"} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
      </div>

      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Carência" />
        </div>
       <DatePicker selected={watch('contrato.dt_carencia')} onChange={e => { e && setValue('contrato.dt_carencia',e) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase  z-50 text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
      </div>

      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Origem" />
        </div>
        <Select sizing={'sm'} {...register('contrato.origem')}>
                    <option selected></option>
                    <option value={'PLANO NOVO'} >PLANO NOVO</option>
                    <option value={'TRANSFERÊNCIA'} >TRANSFERÊNCIA</option>
                  </Select >
      </div> 

      <div className="col-span-2" >
        <div className=" block">
          <Label  value="Plano" />
        </div>
        <Select disabled value={watch('contrato.id_plano')} sizing={'sm'}  onChange={(e) => {
    const selectedPlanId = Number(e.target.value); 
    const selectedPlan = planos?.find(plan =>plan.id_plano === selectedPlanId);
    if(selectedPlan){
      setValue('contrato.id_plano',selectedPlanId);
      setValue('contrato.plano',selectedPlan.descricao);  
      setValue('contrato.valor_mensalidade',Number(selectedPlan?.valor));
    }
  }} 
                  >
                     <option value=" ">{}</option>
                     {planos?.map((item)=>{
    return (
      <option value={item.id_plano} key={item.id_plano} >{item.descricao}</option>
    )
  })}
                  </Select >
      </div> 

       
      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Valor" />
        </div>
        <TextInput  disabled sizing={'sm'} {...register('contrato.valor_mensalidade')}  type="number"  />
      </div> 

      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Cobrador" />
        </div>
        <Select sizing={'sm'} {...register('contrato.cobrador')}>
                    <option selected></option>
                    {consultores?.map((item)=>
               (
               item.funcao==='COBRADOR (RDA)' && <option value={item.nome} key={item.id_consultor} >{item.nome}</option>
              )
            )}
                  </Select >
      </div> 

      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Consultor" />
        </div>
        <Select sizing={'sm'} {...register('contrato.consultor')}>
                    <option selected></option>
                    {consultores?.map((item,index)=>
              (
              item.funcao==='PROMOTOR(A) DE VENDAS' && <option value={item.nome} key={index} >{item.nome}</option>
              )
            )}
                  </Select >
      </div> 


              
      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Supervisor" />
        </div>
        <Select sizing={'sm'} {...register('contrato.supervisor')}>
                    <option selected></option>
                    <option >JACKSON</option>
                    <option >SAMUEL</option>
                  </Select >
      </div> 
            
      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Parcelas" />
        </div>
        <TextInput  disabled sizing={'sm'} value={watch('contrato.n_parcelas')}  type="number"  />
      </div>  



     
           

            </div>
        
        </>
    )
}