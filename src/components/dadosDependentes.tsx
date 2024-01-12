import {  useState } from "react"
import { FormWrapper } from "./organizador"
import InputMask from 'react-input-mask'
import { TiDeleteOutline } from "react-icons/ti";
import { TiDelete } from "react-icons/ti";
import { MdDeleteForever } from "react-icons/md";
import { MdEditSquare } from "react-icons/md";

interface UserProps{
    nome:string,
    nasc:string,
    parentesco:string,
    adesao:string,
    carencia:string
}

export function DadosDependentes(){


const [nome,setNome]= useState('')
const [nasc,setNasc]= useState('')
const [parentesco,setPar]= useState('')
const [adesao,setAdesao]= useState('')
const [carencia,setCarencia]= useState('')
    const [arrayDependetes,setArray] =useState<UserProps[]>([])


     function adicionar(){
        if(nome!==''){
          const data = {
            nome,nasc,parentesco,adesao,carencia
        }   
            setArray([...arrayDependetes,data])
            setNome("")
            setNasc("")
            setPar("")
            setAdesao("")
            setCarencia("")   
        }
        return
            
        }

    
    return(
        <FormWrapper title="ADICIONAR DEPENDENTES">
        <div className="flex flex-col   gap-9 p-2 rounded-lg w-full h-full ">
          
        <div  className="grid gap-2 grid-flow-row-dense pl-2 pr-2 w-full  md:grid-cols-4" >
              <div className="col-span-2">
              <label  className="block mb-1 text-sm font-medium  text-white">NOME</label>
              <input  autoComplete="off"  className="block uppercase w-full pb-1.5 pt-2 pr-2 pl-2  border  rounded-lg bg-gray-50 sm:text-xs dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " value={nome} onChange={e=>setNome(e.target.value.toUpperCase())} type="text"></input>
              </div>
              <div>
              <label  className="block mb-1 text-sm font-medium  text-white">NASCIMENTO</label>
              <InputMask mask={"99/99/9999"} className="block uppercase w-full pb-1.5 pt-2 pr-2 pl-2  border  rounded-lg bg-gray-50 sm:text-xs dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " value={nasc} onChange={e=>setNasc(e.target.value)} type="text"></InputMask>
              </div>
              <div>
              <label  className="block mb-1 text-sm font-medium  text-white">PARENTESCO</label>
              <select className="block w-full p-1.5  sm:text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={parentesco} onChange={e=>setPar(e.target.value)} >
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
              <InputMask mask={"99/99/9999"} className="block uppercase w-full pb-1.5 pt-2 pr-2 pl-2  border  rounded-lg bg-gray-50 sm:text-xs dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " value={adesao} onChange={e=>setAdesao(e.target.value)} type="text"></InputMask>
              </div>
              <div className="relative">
              <label  className="block mb-1 text-sm font-medium  text-white">CARÊNCIA</label>
              <InputMask mask={"99/99/9999"} className="block uppercase w-full pb-1.5 pt-2 pr-2 pl-2  border  rounded-lg bg-gray-50 sm:text-xs dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " value={carencia} onChange={e=>setCarencia(e.target.value)} type="text"></InputMask>
              <button  type="button" onClick={adicionar}  className=" absolute top-6 -right-28  px-3 py-1.5 text-sm font-medium text-center text-white rounded-lg  focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 focus:ring-blue-800" >ADICIONAR</button>  
              </div>
                          </div>
                         
                          
            <div className="flex flex-col h-4/5 w-full text-[13px]">
                        <table className="w-full text-xs text-left rtl:text-right overflow-y-auto   rounded-lg  text-gray-400 " border={1}>
                        <thead className=" w-full text-xs  uppercase bg-gray-700 text-gray-400" >
                          <tr >
                            <th scope="col" className=" px-5 py-2">Nome</th>
                            <th scope="col" className=" px-5 py-2">Nasc</th>
                            <th scope="col" className=" px-5 py-2">Parentesco</th>
                            <th scope="col" className=" px-5 py-2">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {arrayDependetes.map((usuario, index) => (
                            <tr className=" border-b bg-gray-800 border-gray-700  hover:bg-gray-600" key={index}>
                              <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">{usuario.nome}</th>
                              <td className="px-5 py-3">{usuario.nasc}</td>
                              <td className="px-5 py-3">{usuario.parentesco}</td>
                              <td className="px-5 py-3">
                                <div className="flex gap-3">
                                <button  className="flex justify-center items-center"  ><MdEditSquare color='yellow' size={22}/></button>
                                <button  className="flex justify-center items-center " ><MdDeleteForever color='red' size={25}/></button>
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