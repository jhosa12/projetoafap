import { ChangeEvent, FormEvent, useState } from "react"
import { FormWrapper } from "./organizador"
import InputMask from 'react-input-mask'
import { TiDeleteOutline } from "react-icons/ti";
import { IoIosAddCircle } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { it } from "node:test";

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

    
    return(
        <FormWrapper title="Adicionar Dependentes">
        <div className="flex flex-col  gap-3 p-4 rounded-lg w-full h-full ">
            <div  className="flex flex-row w-full gap-2 text-[12px]">
                <input placeholder="Nome" className="p-1 rounded-lg w-4/5 border-[1px] border-black" value={nome} onChange={e=>setNome(e.target.value)} type="text"></input>
                <InputMask placeholder="Nasc." mask={"99/99/9999"} className="p-1 rounded-lg w-1/4 border-[1px]  border-black" value={nasc} onChange={e=>setNasc(e.target.value)} type="text"></InputMask>
                <select className="p-1 rounded-lg w-1/3 border-[1px] border-black" value={parentesco} onChange={e=>setPar(e.target.value)} >
                    <option className="text-gray-200">PARENTESCO</option>
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
                <InputMask mask={"99/99/9999"} placeholder="Adesão" className="p-1 rounded-lg w-1/4 border-[1px] border-black" value={adesao} onChange={e=>setAdesao(e.target.value)} type="text"></InputMask>
                <InputMask mask={"99/99/9999"} placeholder="Carência" className="p-1 rounded-lg w-1/4 border-[1px] border-black " value={carencia} onChange={e=>setCarencia(e.target.value)} type="text"></InputMask>
                <button type="button" onClick={adicionar}><IoIosAddCircle color="green" size={30}/></button>
            </div>
            <div className="flex flex-col w-full gap-1 text-[13px]">
                
                    
                        <table border={2}>
                        <thead >
                          <tr >
                            <th className="text-start">Nome</th>
                            <th className="text-start">Nasc</th>
                            <th className="text-start">Parentsco</th>
                            <th className="text-start">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {arrayDependetes.map((usuario, index) => (
                            <tr key={index}>
                              <td>{usuario.nome}</td>
                              <td>{usuario.nasc}</td>
                              <td>{usuario.parentesco}</td>
                              <td>
                                <button >Editar</button>
                                <button >Apagar</button>
                                
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    
                
            </div>
        </div>
        </FormWrapper>
        )}