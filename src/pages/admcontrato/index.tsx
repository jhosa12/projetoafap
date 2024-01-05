
import { IoMdSearch } from "react-icons/io";
import 'react-tabs/style/react-tabs.css';
import {ModalBusca} from '../../components/modal'
import Teste from '@/pages/teste/index';
import { useState } from "react";
type FormData={
    closeModal:boolean,
    nome:string
}
const INITIAL_DATA:FormData ={
    closeModal:false,
    nome:''
}
export default function AdmContrato(){
  const [textarea,setTextArea] = useState(true)
  const [modalbusca,setModalBusca] = useState(INITIAL_DATA)
  
  function updateFields(fields:Partial<FormData>){
    setModalBusca(prev=>{
        return {...prev,...fields}
    })
  }
    return(
        <div className={`flex  flex-col w-full pl-4` }>
            <div className="flex  flex-row justify-start gap-2 items-center w-full">
            <button onClick={()=>updateFields({closeModal:!modalbusca.closeModal})} type="button" className=" border font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center focus:ring-gray-600 dark:bg-gray-800 border-gray-700 text-white hover:bg-gray-700 me-2 mb-2">
            <IoMdSearch size={20}/>
        Buscar Cliente
    </button>
               
              
            </div>
      
            {modalbusca.closeModal && (<ModalBusca {...modalbusca} updateFields={updateFields}/>)}
        </div>
    )

}
