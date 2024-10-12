import { Label, Select, TextInput } from "flowbite-react"
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { UseFormAssociadoProps } from "./modalEditarDados";





export function TabContrato({register,setValue,trigger,watch}:UseFormAssociadoProps){
   
    return(
        <>
             
          
            <div className="grid gap-2 grid-flow-c-dense pl-2 pr-2 w-full  grid-cols-4 font-semibold" >


            <div className="col-span-1" >
        <div className=" block">
          <Label  value="Contrato" />
        </div>
        <TextInput disabled sizing={'sm'} value={watch('contrato.id_contrato')}  type="number"  />
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
          /*
                    const selectedPlano = data.planos?.find(item => item.id_plano === Number(e.target.value));
                    closeModa({
                      contrato: {
                        ...data.contrato,
                        id_plano: Number(selectedPlano?.id_plano),
                        plano: selectedPlano?.descricao

                      }
                    });

                  */}}
                  >
                     <option value=" ">{}</option>
                      {
                        /*data.planos?.map((item,index) => {
                    return (
                      <option
                        
                        value={item.id_plano} key={index} >{item.descricao}</option>
                    )
                  })*/}
                  
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
                    <option >JACKSON</option>
                    <option >SAMUEL</option>
                  </Select >
      </div> 

      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Consultor" />
        </div>
        <Select sizing={'sm'} {...register('contrato.consultor')}>
                    <option selected></option>
                    <option >JACKSON</option>
                    <option >SAMUEL</option>
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



      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Vencimento" />
        </div>
       <DatePicker selected={watch('contrato.data_vencimento')}  onChange={e => { e && setValue('contrato.data_vencimento',e) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
      </div>

      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Adesão" />
        </div>
       <DatePicker selected={watch('contrato.dt_adesao')}  onChange={e => { e && setValue('contrato.dt_adesao',e)}} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
      </div>

      <div className="col-span-1" >
        <div className=" block">
          <Label  value="Carência" />
        </div>
       <DatePicker selected={watch('contrato.dt_carencia')} onChange={e => { e && setValue('contrato.dt_carencia',e) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase  z-50 text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
      </div>

           

            </div>
        
        </>
    )
}