import SideBar from "@/components/sideBar"
import { MdOutlineNotifications } from "react-icons/md";
  import { MultiStep } from "../../components/multiStep";
import { Item } from "../../components/dadosTitular";
import { DadosPlano } from "../../components/dadosPlano";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FaCircleArrowLeft } from "react-icons/fa6";
import {FormEvent, useState} from 'react'

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
  cpf:string
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
  cpf:''
}


export default function testeLayout() {

  const [data,setData] =useState(INITIAL_DATA)
   function updateFields(fields:Partial<FormData>){
    setData(prev=>{
      return {...prev,...fields}
    })
   }

  const {steps,currentStepIndex,step,next,back} =MultiStep([
    <Item {...data} updateFields={updateFields}/>,
    <DadosPlano {...data} updateFields={updateFields}/>,
    <div>THREE</div>,
  ])
  function onSubmit(e:FormEvent){
    e.preventDefault()
    next()

  }
  return (
    <div className="flex bg-slate-100">
      <SideBar />
      <div className="flex flex-col w-full">
        <div className=" shadow-sm flex flex-row justify-end items-center h-[70px]">
          <button className="rounded-lg mr-5 cursor-pointer hover:bg-slate-400"><MdOutlineNotifications size={25} /></button>
          <div className="bg-slate-300 mr-2 rounded-full w-[60px] h-[60px]"></div>
          <span className="flex flex-col mr-10 font-medium justify-center items-center">Henrique Freitas <span className="flex items-end text-[12px] font-sans">Consultor</span></span>
        </div>
        <div className="pl-2 pr-2 flex flex-col items-center justify-center w-full h-full">
        <div className="relative bg-white border-[1px] border-slate-300 p-2 shadow-lg rounded-lg">
        <form onSubmit={onSubmit}>
          <div className="absolute top-2 right-2">
            {currentStepIndex + 1} / {steps.length}
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

    </div>
  );
}