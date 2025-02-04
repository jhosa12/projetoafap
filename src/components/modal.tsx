import { FormEvent, useState,useContext} from "react"
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Modal } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { MdKeyboardArrowRight } from "react-icons/md";


interface ContratoProps{
    id_contrato:number
}
interface DependentesProps{
    nome:string
}
interface DadosProps{
    id_associado:number,
    id_global:number
    nome:string,
    numero:number,
    bairro:string,
    uf:string
    cidade:string,
    endereco:string,
    contrato:ContratoProps,
    dependentes:Array<DependentesProps>
}


interface Props{
    visible:boolean,
    setVisible:()=>void
}


export function ModalBusca({setVisible,visible}:Props){
    const {carregarDados,data,closeModa,empresas,selectEmp}= useContext(AuthContext)
    const [loading,setLoading] = useState(false)
    const [input,setInput] =useState('')
    const [array,setarray]=useState<DadosProps[]>([])
    const [dropOpen,setDrop] = useState<boolean>(false)
    const [criterio,setCriterio]=useState("Contrato")
  
 
   
  
 async function onSubmit(event:FormEvent){
    event.preventDefault()
   
    setLoading(true)
   await buscar()
   setLoading(false)
  
  }
 
 

  async function buscar(){
    let response:any

    if(criterio ==="Contrato"){
        response =  await api.post('/buscar',{
            id_contrato:Number(input),
            id_empresa:selectEmp
        })
       

      }
     else if(criterio ==="Titular"){
        response =  await api.post('/buscar',{
            nome:input.toUpperCase(),
            id_empresa:selectEmp
        })
        
      }
     else if(criterio ==="Dependente"){
         response =  await api.post('/buscar',{
            dependente:input.toUpperCase(),
            id_empresa:selectEmp
        })
       
      }
      else if(criterio ==="Endereço"){
         response =  await api.post('/buscar',{
            endereco:input.toUpperCase(),
            id_empresa:selectEmp
        })
    
      }
      else if(criterio ==="Bairro"){
        response =  await api.post('/buscar',{
            bairro:input.toUpperCase(),
            id_empresa:selectEmp
        })
       
      }
      setarray(response?.data??[])
      
    }
    
    return(
       <Modal size={'2xl'} show={visible} onClose={setVisible}>
  
    <Modal.Header className="flex w-full"> 
   
            <form onSubmit={onSubmit} className="flex w-full">
   
   
    <button onClick={()=>setDrop(!dropOpen)} className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-xs font-medium text-center rounded-s-lg focus:outline-none  border-gray-200  bg-gray-100  hover:bg-gray-300   " type="button">{criterio} 
    <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
  </svg></button>
 
      {dropOpen && (
          <div className="absolute top-[65px]  divide-gray-100 rounded-lg shadow w-44 bg-gray-200">
          <ul className="py-2 text-xs text-black">
          <li >
              <span className="block px-4 py-2  hover:bg-gray-300 hover:" onClick={()=>{setCriterio('Contrato'),setDrop(false)}}>Contrato</span>
          </li>
          <li>
              <span className="block px-4 py-2  hover:bg-gray-300 hover:" onClick={()=>{setCriterio('Titular'),setDrop(false)}}>Titular</span>
          </li>
          <li>
              <span className="block px-4 py-2  hover:bg-gray-300 hover:" onClick={()=>{setCriterio('Dependente'),setDrop(false)}}>Dependente</span>
          </li>
          <li>
              <span className="block px-4 py-2  hover:bg-gray-300 hover:"  onClick={()=>{setCriterio('Endereço'),setDrop(false)}}>Endereço</span>
          </li>
          <li>
              <span className="block px-4 py-2  hover:bg-gray-300 hover:"  onClick={()=>{setCriterio('Bairro'),setDrop(false)}}>Bairro</span>
          </li>
          </ul>
      </div>
      )}

<div className="inline-flex  w-[25vw]">
    <input 
        value={input} 
        onChange={e => setInput(e.target.value)} 
        type={criterio === "Contrato" ? "number" : "search"} 
        className="uppercase focus:outline-none w-full focus:ring-0 border-gray-100 border-s-gray-300  px-2.5   text-xs bg-gray-100 placeholder-gray-400 " 
        placeholder="Search" 
        required 
    />
    <button 
        type="submit" 
        className=" p-2.5 h-full text-xs font-medium bg-blue-600 hover:bg-blue-700 rounded-e-lg">
        <HiSearch color='white' className="w-5 h-5"/>
    </button>
</div>

   
</form>
                
         
    </Modal.Header>
      <Modal.Body>
      
           
            {loading?((<div className="flex flex-col h-full justify-center items-center p-2"><AiOutlineLoading3Quarters color='blue' size={40} className="animate-spin"/></div>)):(
                <div className="flex flex-col  mb-1 text-xs ">
                <p className="text-gray-600 mb-2">Selecione o Contrato:</p>
                <ul className="overflow-y-auto space-y-2 mb-2">
                                {array.map((item,index)=>(
                                     <li key={index} onClick={()=>{carregarDados(item.id_global),setVisible()}} className="inline-flex items-center justify-between w-full p-2 rounded-lg cursor-pointer border-gray-500   bg-gray-200 hover:bg-gray-300">
                                                               
                                    <div className="block">
                                     <div className="w-full  font-semibold"><span className="pr-2">{item?.contrato?.id_contrato}</span>{item.nome}<span className="flex flex-col gap-1">{item?.dependentes?.map((i,id)=>(<span>DEPENDENTE: {i.nome}</span>))}</span></div>
                                     <div className="w-full  text-gray-600">
                                         <span className="pr-2">{item.endereco}{item.id_associado}</span>
                                         Nº:<span className="pr-2">{item.numero}</span>
                                         BAIRRO:<span className="pr-2"> {item.bairro}</span>
                                         CIDADE:<span className="pr-2 font-semibold">{item.cidade}/{item.uf}</span>
                                         </div>
                                         </div>
                                       <MdKeyboardArrowRight size={20} className="text-gray-600"/>
                                   
                                     </li>
                                ))}     
                </ul>
            </div>
            )}
            
     
        </Modal.Body>
        </Modal>


    
    )
}