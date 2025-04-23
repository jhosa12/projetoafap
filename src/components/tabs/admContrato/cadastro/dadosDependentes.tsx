import {  useState } from "react"
import {  MdAddCircle, MdDeleteForever } from "react-icons/md";
import DatePicker,{registerLocale, setDefaultLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { Label, Modal, Select, Table, TextInput } from "flowbite-react";
import { ChildrenProps } from "@/components/modals/admContrato/cadastro/modalCadastro";
import { Control, Controller, useForm, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PhoneMaskInput } from "@/components/PhoneMaskInput";
registerLocale('pt', pt)

interface UserProps{
  nome:string,
    data_nasc:Date|undefined|null,
    grau_parentesco:string,
    data_adesao:Date,
    celular:string,
    carencia:Date,
    cad_dh:Date
}

export function DadosDependentes({register,setValue,watch,trigger}:ChildrenProps){

const {register:registerDep,setValue:setValueDep,watch:watchDep,reset:resetDep,control} = useForm<UserProps>()
const [open,setOpen] = useState(false)




     function adicionar(){
        if(watchDep('nome')!==''){
          const dados = {
            nome:watchDep('nome'),data_nasc:watchDep('data_nasc')||null,grau_parentesco:watchDep('grau_parentesco'),data_adesao:watchDep('data_adesao'),carencia:watchDep('carencia'),cad_dh:new Date(),celular:watchDep('celular') }   
   
            const currentItens = watch('arraydep')||[]
            setValue('arraydep',[...currentItens,dados]);
          // trigger('arraydep')
           resetDep({
            nome:'',data_nasc:null,grau_parentesco:'',data_adesao:new Date(),carencia:new Date(),celular:''
           })
        }   
        }
        const handleExcluirDependente = (index: number) => {
          const currentArray = watch("arraydep") || []; // Obtendo o array atual
      
          // Criando um novo array com o item removido
          const novoArray = [...currentArray];
          novoArray.splice(index, 1);
      
          // Atualizando o valor do array no formulário
          setValue("arraydep", novoArray);
        };

    return(
 
        <div className="flex flex-col divide-x-2 max-h-96 gap-2  rounded-lg w-full">
          <ModalAddDep adicionar={adicionar} show={open} onClose={()=>setOpen(false)} register={registerDep} control={control} setValue={setValueDep}/>
          <h1 className="font-semibold">Dependentes: {watch('arraydep')?.length}</h1>   

          <Button type="button" onClick={() => setOpen(true)} variant="outline" size={"sm"} className="mr-auto"><MdAddCircle size={20}/>Adicionar</Button> 

          <div></div>           

            <div className="flex w-full overflow-x-auto">
              <Table theme={{root:{shadow:'none'}, body: { cell: { base: " px-6 py-1  text-[11px] text-black" } },head:{cell:{base:"px-6 py-1 text-xs text-black font-semibold"}} }}>
                <Table.Head>
                  <Table.HeadCell>
                  Nome
                  </Table.HeadCell>
                  <Table.HeadCell>
                  Nasc
                  </Table.HeadCell>
                  <Table.HeadCell>
                  Parentesco
                  </Table.HeadCell>
                  <Table.HeadCell>
                  Celular
                  </Table.HeadCell>
                  <Table.HeadCell>
                  Adesão
                  </Table.HeadCell>
                  <Table.HeadCell>
                  Carência
                  </Table.HeadCell>
                  <Table.HeadCell>
                  Ações
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                {watch('arraydep')?.map((usuario, index) => (
                           <Table.Row key={index} >
                              <Table.Cell className="whitespace-nowrap" scope="row" >{usuario.nome}</Table.Cell>
                              <Table.Cell>{usuario.data_nasc?.toLocaleDateString()}</Table.Cell>
                              <Table.Cell>{usuario.grau_parentesco}</Table.Cell>
                              <Table.Cell className="whitespace-nowrap">{usuario.celular}</Table.Cell>
                              <Table.Cell >{usuario.data_adesao?.toLocaleDateString()}</Table.Cell>
                              <Table.Cell>{usuario.carencia?.toLocaleDateString()}</Table.Cell>
                              <Table.Cell>
                                <div className="flex gap-3">
                               
                                <button type="button" onClick={()=>handleExcluirDependente(index)}  className="flex justify-center items-center  hover:text-red-600 " ><MdDeleteForever  size={18}/></button>
                                </div>
                              </Table.Cell>
                              </Table.Row>
                          ))}

                </Table.Body>
              </Table>

         
            </div>
        </div>
     
        )}


interface DepProps {
    register:UseFormRegister<UserProps>
    control:Control<UserProps,any>
    setValue:UseFormSetValue<UserProps>
    show:boolean,
  onClose:()=>void,
  adicionar:()=>void
}

        export const ModalAddDep = ({control,onClose,register,setValue,show,adicionar}:DepProps)=>{
          return(
            <Modal show={show} size="md" onClose={() => onClose()} popup>
            <Modal.Header />
            <Modal.Body>
            <div  className="grid border-white   border-r-2 pb-3 gap-2    grid-cols-2" >
             
             
             <div className="col-span-2">
             <div className="mb-1 block">
             <Label className="text-xs"  value="Nome" />
           </div>
           <TextInput sizing="sm" {...register('nome')} type="text"  />
             </div>
                
                
             <div className="col-span-1">
             <div className="mb-1 block">
             <Label className="text-xs"  value="Nascimento" />
           </div>
           <Controller
           name="data_nasc"
           control={control}
           render={({ field:{onChange,value} }) => (
            <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={value} onChange={(date)=>onChange(date)}     className="flex uppercase w-full text-xs  pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
           )}
           />
           
             </div>
                
             <div className="col-span-1">
             <div className="mb-1 block">
             <Label className="text-xs"  value="Parentesco" />
           </div>
               <Select sizing="sm"  {...register('grau_parentesco')}  >
   
               <option selected className="text-gray-200">PARENTESCO</option>
                       <option>CONJUGE</option>
                       <option>PAI</option>
                       <option>MÃE</option>
                       <option>FILHO(A)</option>,
                       <option>IRMÃO(Ã)</option>
                       <option>PRIMO(A)</option>
                       <option>SOBRINHA(A)</option>
                       <option>NORA</option>
                       <option>GENRO</option>
                       <option>TIO(A)</option>
                       <option>AVÔ(Ó)</option>
                       <option>OUTROS</option>
               </Select>
             </div> 
   
   
             <div className="col-span-1">
             <div className="mb-1 block">
             <Label className="text-xs"  value="Celular" />
           </div>
          
            <PhoneMaskInput controlName="celular" register={register} />
           
           
           
             </div>
               
                 
             
             <div className="col-span-1">
             <div className="mb-1 block">
             <Label className="text-xs"  value="Adesão" />
           </div>

           <Controller
            name="data_adesao"
            control={control}
            render={({ field:{onChange,value} }) => (
              <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={value} onChange={(date)=>onChange(date)}   className="flex uppercase w-full text-xs  pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
            )}
           />
           
             </div>
   
   
             <div className="col-span-1">
             <div className="mb-1 block">
             <Label className="text-xs"  value="Carência" />
           </div>
           <Controller
           name="carencia"
           control={control}
           render={({ field:{onChange,value} }) => (
            <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={value} onChange={(date)=>onChange(date)}   className="flex uppercase w-full text-xs pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
           )}
           />
            
             </div>
   
                 <div className="col-span-2 flex justify-end ">
                 <Button className="" type="button" onClick={adicionar} size="sm">Adicionar</Button> 
                 </div>
                
                 </div>
            </Modal.Body>
            </Modal>
          )
        }