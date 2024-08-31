import {  useContext, useEffect, useState } from "react"
import { FormWrapper } from "./organizador"
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
registerLocale('pt', pt)

interface UserProps{
  nome:string,
    data_nasc:Date,
    grau_parentesco:string,
    data_adesao:Date,
    carencia:Date,
    cad_dh:Date
}

export function DadosDependentes(){

const {data,closeModa}= useContext(AuthContext)
const [nome,setNome]= useState("")
const[celular,setCelular]=useState('')
const [data_nasc,setNasc]= useState<Date>() 
const [grau_parentesco,setPar]= useState("")
const [data_adesao,setAdesao]= useState<Date>()
const [carencia,setCarencia]= useState<Date>()
const [arrayDependetes,setArray] =useState<Partial<UserProps[]>>([])

useEffect(()=>{
 setCarencia(data.contrato?.dt_carencia)
 setAdesao(data.contrato?.dt_adesao)
})

     function adicionar(){
        if(nome!==''){
          const dados = {
            nome,data_nasc,grau_parentesco,data_adesao,carencia,cad_dh:new Date(),celular
        }   
           // setArray([...arrayDependetes,dados])
            closeModa({...data,arraydep:[...data.arraydep || [],dados]})
            setNome("")
            setNasc(undefined)
            setPar("")
            setCelular('')    
        }   
        }
        const handleExcluirDependente=(index:number)=>{
            const novoArray = [...data.arraydep||[]]
            novoArray.splice(index,1)
            closeModa({...data,arraydep:novoArray})


        }

    return(
 
        <div className="flex flex-row divide-x-2 max-h-96 gap-4  rounded-lg w-full">
        <div  className="grid border-white h-2/3  border-r-2 pb-3 gap-2   w-2/6  grid-cols-2" >
             
             
          <div className="col-span-2">
          <div className="mb-1 block">
          <Label  value="Nome" />
        </div>
        <TextInput  value={nome} onChange={e=>setNome(e.target.value.toUpperCase())} type="text"  />
          </div>
             
             
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Nascimento" />
        </div>
          <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={data_nasc} onChange={(date)=>date && setNasc(date)}   className="flex uppercase w-full  pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
          </div>
             
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Parentesco" />
        </div>
            <Select  value={grau_parentesco} onChange={e=>setPar(e.target.value)} >

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
          <InputMask  value={celular} onChange={e=>setCelular(e.target.value)} mask={'(99) 9 9999-9999'} type="text"  className="flex uppercase w-full  pr-2 pl-2  border  rounded-lg bg-gray-50 border-gray-300 placeholder-gray-400 "/>
          </div>
            
              
          
          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Adesão" />
        </div>
          <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={data_adesao} onChange={(date)=>date && setAdesao(date)}   className="flex uppercase w-full  pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
          </div>


          <div className="col-span-1">
          <div className="mb-1 block">
          <Label  value="Carência" />
        </div>
          <DatePicker locale={pt} dateFormat={"dd/MM/yyyy"} selected={carencia} onChange={(date)=>date && setCarencia(date)}   className="flex uppercase w-full  pr-2 pl-2  border bg-gray-50  rounded-lg  border-gray-300 placeholder-gray-400 text-black "/>
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
                {data.arraydep?.map((usuario, index) => (
                           <Table.Row key={index} className="bg-white border-gray-700 p-1">
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

            {/*<table 
                className="block  overflow-y-auto overflow-x-auto text-xs text-center rtl:text-center border-collapse rounded-lg text-gray-400">
                  <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
                          <tr >
                            <th scope="col" className=" px-4 py-1">Nome</th>
                            <th scope="col" className=" px-4 py-1">Nasc</th>
                            <th scope="col" className=" px-4 py-1">Parent.</th>
                            <th scope="col" className=" px-4 py-1">Celular</th>
                            <th scope="col" className=" px-4 py-1">Adesão</th>
                            <th scope="col" className=" px-3 py-1">Carência</th>
                            <th scope="col" className=" px-4 py-1">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.arraydep?.map((usuario, index) => (
                            <tr className=" border-b border-l bg-gray-800 border-gray-700  " key={index}>
                              <th scope="row" className="px-4 py-1 font-medium  whitespace-nowrap text-white">{usuario.nome}</th>
                              <td className="px-4 py-1">{usuario.data_nasc?.toLocaleDateString()}</td>
                              <td className="px-4 py-1">{usuario.grau_parentesco}</td>
                              <td className="px-4 py-1 whitespace-nowrap">{usuario.celular}</td>
                              <td className="px-4 py-1">{usuario.data_adesao?.toLocaleDateString()}</td>
                              <td className="px-3 py-1">{usuario.carencia?.toLocaleDateString()}</td>
                              <td className="px-4 py-1">
                                <div className="flex gap-3">
                               
                                <button type="button" onClick={()=>handleExcluirDependente(index)}  className="flex justify-center items-center  hover:text-red-600 " ><MdDeleteForever  size={18}/></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>*/}
            </div>
        </div>
     
        )}