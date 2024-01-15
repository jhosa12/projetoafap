
import { MultiStep } from "../../components/multiStep";
import { Item } from "../../components/dadosTitular";
import { DadosPlano } from "../../components/dadosPlano";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FaCircleArrowLeft } from "react-icons/fa6";
import {FormEvent, useState} from 'react'
import { DadosDependentes } from "@/components/dadosDependentes";
import { IoIosClose } from "react-icons/io";
import { createContext,useContext } from "react";
type FormData={
  name:string,
  date:string,
  sexo:string,
  cep:string,
  endereço:string,
  numero:string,
  bairro:string, 
  referencia:string,
  cidade:string,
  uf:string,
  email:string,
  rg:string,
  cpf:string,
  closeModal:boolean,
  closeModalPlano:boolean

}

const INITIAL_DATA:FormData ={
  name:'',
  date:'',
  sexo:'',
  cep:'',
  endereço:'',
  numero:'',
  bairro:'', 
  referencia:'',
  cidade:'',
  uf:'',
  email:'',
  rg:'',
  cpf:'',
  closeModal:false,
  closeModalPlano:false
}
type UserFormProps =FormData & {
  updateFields :(fields:Partial<FormData>)=>void
}

type TestForm ={
  closePlano:boolean,
  testeFields:()=>void
}


const MyContext = createContext({} as TestForm) 

export default function TesteLayout() {

  const [data,setData] =useState(INITIAL_DATA)
  const [closePlano,setTestePlano]=useState(false)
   function updateFields(fields:Partial<FormData>){
    setData(prev=>{
      return {...prev,...fields}
    })
   
   }
   function testeFields(){

    setTestePlano(true)
    console.log(closePlano)
   }

  const {steps,currentStepIndex,step,next,back} =MultiStep([
    <Item {...data} updateFields={updateFields}/>,
    <DadosPlano {...data} updateFields={updateFields}/>,
    <DadosDependentes />,
  ])
  function onSubmit(e:FormEvent){
    e.preventDefault()
    next()
  }
  return ( 
      <MyContext.Provider value={{closePlano,testeFields}}>
            <div  tabIndex={-1} aria-hidden="true" className="bg-opacity-5 bg-white overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full">
          <div className="pl-2 pr-2 flex flex-col items-center justify-center w-full h-full ">
          <div className="relative  border  rounded-lg shadow bg-gray-700 border-gray-600 p-2">
          <form onSubmit={onSubmit}>
            <div className="absolute font-bold text-white top-2 right-2">
              {currentStepIndex + 1} / {steps.length}
              <button onClick={()=>updateFields({closeModalPlano:true})} type="button" className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                      <IoIosClose size={30}/>
                  </button>
            </div>
            {step}
            <div className="flex mt-4 gap-2 justify-end">
             {currentStepIndex!==0 &&(<button type="button" onClick={back}><FaCircleArrowLeft style={{color:'#CA9629'}} size={30}/></button>)} 
              <button type="submit">
               {steps.length-1===currentStepIndex ?"Finish":(<FaCircleArrowRight size={30} style={{color:'#CA9629'}}/>)} 
                </button>
            </div>
          </form>
          </div>
          </div>
        </div>
      </MyContext.Provider>

        )
  } 
  export const useMyContext = () => useContext(MyContext);
