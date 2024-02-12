import {  useContext, useState } from "react"
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
registerLocale('pt', pt)

interface UserProps{
  nome:string,
    data_nasc:Date,
    grau_parentesco:string,
    data_adesao:Date,
    carencia:Date,
  

}

export function DadosDependentes(){

const {data,closeModa}= useContext(AuthContext)
const [nome,setNome]= useState("")
const [data_nasc,setNasc]= useState<Date>() 
const [grau_parentesco,setPar]= useState("")
const [data_adesao,setAdesao]= useState<Date>()
const [carencia,setCarencia]= useState<Date>()
const [arrayDependetes,setArray] =useState<Partial<UserProps[]>>([])


     function adicionar(){
        if(nome!==''){
          const dados = {
            nome,data_nasc,grau_parentesco,data_adesao,carencia
        }   
           // setArray([...arrayDependetes,dados])
            closeModa({...data,arraydep:[...data.arraydep || [],dados]})
            setNome("")
            setNasc(undefined)
            setPar("")
            setAdesao(undefined)
            setCarencia(undefined)     
        }   
        }

    return(
        <FormWrapper title="ADICIONAR DEPENDENTES">
        <div className="flex flex-row  max-h-96 gap-2 p-2 rounded-lg w-full">
        <div  className="grid border-white h-2/3  border-r-2 pb-3 gap-2 grid-flow-row-dense pl-2 pr-2 w-1/2  md:grid-cols-2" >
              <div className="col-span-2">
              <label  className="block mb-1 text-sm font-medium  text-white">NOME</label>
              <input  autoComplete="off"  className="block uppercase w-full pb-1.5 pt-2 pr-2 pl-2  border  rounded-lg bg-gray-50 sm:text-xs dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " value={nome} onChange={e=>setNome(e.target.value.toUpperCase())} type="text"></input>
              </div>
             
              <div>
              <label  className="block mb-1 text-sm font-medium  text-white">NASCIMENTO</label>
              <DatePicker dateFormat={"dd/MM/yyyy"} locale={"pt"}  className="block  w-full pb-1.5 pt-2 pr-2 pl-2  border  rounded-lg bg-gray-50 sm:text-xs dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " selected={data_nasc} onChange={(date)=>date && setNasc(date)} ></DatePicker>
              </div>
            
              
              <div>
              <label  className="block mb-1 text-sm font-medium  text-white">PARENTESCO</label>
              <select className="block w-full p-1.5  sm:text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={grau_parentesco} onChange={e=>setPar(e.target.value)} >
                    <option selected className="text-gray-200">PARENTESCO</option>
                    <option>CONJUGE</option>
                    <option>PAI</option>
                    <option>MÃE</option>
                    <option>FILHO(A)</option>
                    <option>PRIMO(A)</option>
                    <option>SOBRINHA(A)</option>
                    <option>NORA</option>
                    <option>GENRO</option>
                    <option>TIO(A)</option>
                    <option>AVÔ(Ó)</option>
                    <option>OUTROS</option>
                </select>
              </div>
              <div>
              <label className="block mb-1 text-sm font-medium  text-white">ADESÃO</label>
              <DatePicker dateFormat={"dd/MM/yyyy"} locale={"pt"}  className="block  w-full pb-1.5 pt-2 pr-2 pl-2  border  rounded-lg bg-gray-50 sm:text-xs dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " selected={data_adesao} onChange={(date)=>date && setAdesao(date)} ></DatePicker>
              </div>
              <div className="relative">
              <label  className="block mb-1 text-sm font-medium  text-white">CARÊNCIA</label>
              <DatePicker dateFormat={"dd/MM/yyyy"} locale={"pt"}  className="block  w-full pb-1.5 pt-2 pr-2 pl-2  border  rounded-lg bg-gray-50 sm:text-xs dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " selected={carencia} onChange={(date)=>date && setCarencia(date)} ></DatePicker>
              </div>
              <div className="col-span-2">
              <button  type="button" onClick={adicionar}  className=" block  justify-center items-center w-full px-3 py-1.5 text-sm font-medium text-center text-white rounded-lg  focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 focus:ring-blue-800" >ADICIONAR</button>  
              </div>
             
              </div>
                         

            <div className="flex flex-col w-full text-[13px]">
            <table 
                className="block  overflow-y-auto overflow-x-auto text-xs text-center rtl:text-center border-collapse rounded-lg text-gray-400">
                  <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
                          <tr >
                            <th scope="col" className=" px-4 py-1">Nome</th>
                            <th scope="col" className=" px-4 py-1">Nasc</th>
                            <th scope="col" className=" px-4 py-1">Parent.</th>
                            <th scope="col" className=" px-4 py-1">Adesão</th>
                            <th scope="col" className=" px-3 py-1">Carência</th>
                            <th scope="col" className=" px-4 py-1">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.arraydep?.map((usuario, index) => (
                            <tr className=" border-b border-l bg-gray-800 border-gray-700  hover:bg-gray-600" key={index}>
                              <th scope="row" className="px-4 py-1 font-medium  whitespace-nowrap text-white">{usuario.nome}</th>
                              <td className="px-4 py-1">{usuario.data_nasc?.toLocaleDateString()}</td>
                              <td className="px-4 py-1">{usuario.grau_parentesco}</td>
                              <td className="px-4 py-1">{usuario.data_adesao?.toLocaleDateString()}</td>
                              <td className="px-3 py-1">{usuario.carencia?.toLocaleDateString()}</td>
                              <td className="px-4 py-1">
                                <div className="flex gap-3">
                                <button  className="flex justify-center items-center"  ><MdEditSquare color='yellow' size={18}/></button>
                                <button  className="flex justify-center items-center " ><MdDeleteForever color='red' size={18}/></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
            </div>
        </div>
        </FormWrapper>
        )}