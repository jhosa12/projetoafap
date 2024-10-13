import {  useContext, useEffect, useState } from "react"
import { FormWrapper } from "../../organizador"
import InputMask from 'react-input-mask'
import { TiDeleteOutline } from "react-icons/ti";
import { TiDelete } from "react-icons/ti";
import { MdDeleteForever } from "react-icons/md";
import { MdEditSquare } from "react-icons/md";
import { AuthContext } from "@/contexts/AuthContext";
import DatePicker,{registerLocale, setDefaultLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { Label, Select, Table, TextInput } from "flowbite-react";
import { ChildrenProps } from "./modalCadastro";
import { useForm } from "react-hook-form";
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

const {register:registerDep,setValue:setValueDep,watch:watchDep,reset:resetDep} = useForm<UserProps>()





     function adicionar(){
        if(watchDep('nome')!==''){
          const dados = {
            nome:watchDep('nome'),data_nasc:watchDep('data_nasc')||null,grau_parentesco:watchDep('grau_parentesco'),data_adesao:watchDep('data_adesao'),carencia:watchDep('carencia'),cad_dh:new Date(),celular:watchDep('celular') }   
   
            const currentItens = watch('arraydep')||[]
            setValue('arraydep',[...currentItens,dados]);
          // trigger('arraydep')
           resetDep()
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
 
        <div className="flex flex-row divide-x-2 max-h-96 gap-4  rounded-lg w-full">
        <div  className="grid border-white h-2/3  border-r-2 pb-3 gap-2   w-2/6  grid-cols-2" >
             
             
          <div className="col-span-2">
          <div className="mb-1 block">
          <Label  value="Nome" />
        </div>
        <TextInput {...registerDep('nome')} type="text"  />
          </div>
             
             
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Nascimento" />
        </div>
          <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={watchDep('data_nasc')||null} onChange={(date)=>date && setValueDep('data_nasc',date)}     className="flex uppercase w-full  pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
          </div>
             
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Parentesco" />
        </div>
            <Select  {...registerDep('grau_parentesco')}  >

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
          <Label  value="Celular" />
        </div>
          <InputMask  value={watchDep('celular')??''} onChange={e=>setValueDep('celular',e.target.value)} mask={'(99) 9 9999-9999'} type="text"  className="flex uppercase w-full  pr-2 pl-2  border  rounded-lg bg-gray-50 border-gray-300 placeholder-gray-400 "/>
          </div>
            
              
          
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Adesão" />
        </div>
          <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={watchDep('data_adesao')} onChange={(date)=>date && setValueDep('data_adesao',date)}   className="flex uppercase w-full  pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
          </div>


          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Carência" />
        </div>
          <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={watchDep('carencia')} onChange={(date)=>date && setValueDep('carencia',date)}   className="flex uppercase w-full  pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
          </div>



          
              <div className="col-span-2">
              <button  type="button" onClick={adicionar}  className=" block  justify-center items-center w-full px-3 py-1.5 text-sm font-medium text-center text-white rounded-lg  focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 focus:ring-blue-800" >ADICIONAR</button>  
              </div>
             
              </div>
                         

            <div className="flex w-4/5 overflow-x-auto">
              <Table striped>
                <Table.Head>
                  <Table.HeadCell>
                  Nome
                  </Table.HeadCell>
                  <Table.HeadCell>
                  Nasc
                  </Table.HeadCell>
                  <Table.HeadCell>
                  Parent.
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
                <Table.Body>
                {watch('arraydep')?.map((usuario, index) => (
                           <Table.Row key={index} className="bg-white font-semibold text-black text-xs border-gray-700 p-1">
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