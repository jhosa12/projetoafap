import useApiGet from "@/hooks/useApiGet"
import useApiPost from "@/hooks/useApiPost"
import { ConsultaProps } from "@/pages/afapSaude"
import { Dropdown, Modal, TextInput } from "flowbite-react"
import { FormEvent, useState } from "react"
import { UseFormReset } from "react-hook-form"
import { MdArrowDropDown, MdKeyboardArrowRight } from "react-icons/md"



interface DataProps{
    visible:boolean,
    setVisible:()=>void,
    reset:UseFormReset<ConsultaProps>
}


export const ModalBuscaConsulta = ({ setVisible,visible,reset}:DataProps) => {
    const [criterio,setCriterio] = useState('')
    const [input,setInput]= useState('')
    const {data,postData:busca,loading} = useApiPost<ConsultaProps[],{nome:string|undefined,cpf:string|undefined}>("/afapSaude/consultas")


    const handleOnSubmit = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
       await busca({
        nome:criterio==='NOME'?input.toUpperCase():undefined,
        cpf:criterio==='CPF'?input.toUpperCase():undefined,
    })
      
    }

    return (
        <Modal size="lg" dismissible show={visible} onClose={setVisible} popup>
            <Modal.Header />
            <Modal.Body>
              <form onSubmit={handleOnSubmit} className="flex flex-col w-full">
                    <div className="inline-flex w-full">
                        <Dropdown  renderTrigger={()=><button type="button" className="flex-shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center rounded-s-lg  focus:outline-none  border-gray-300 border-[1px]  bg-gray-100  hover:bg-gray-300  ">{criterio?criterio:'CRITÉRIO'}<MdArrowDropDown size={18}/></button>}>
                            <Dropdown.Item onClick={()=>setCriterio('NOME')}>NOME</Dropdown.Item>
                            <Dropdown.Item onClick={()=>setCriterio('CPF')}>CPF</Dropdown.Item>
                        </Dropdown>
                       
                     <input onChange={(e)=>setInput(e.target.value)}  className="uppercase focus:outline-none border-gray-300 w-full focus:ring-0 border-[1px]  px-2.5   text-sm bg-gray-100 placeholder-gray-400 " />

                     <button className="bg-blue-500 px-1.5 text-sm text-white rounded-e-lg" type="submit">BUSCAR</button>
                    </div>


                   <ul className="flex w-full pt-2">
                    {data?.map((item,index)=>(
                        <li key={index} onClick={()=>{reset({...item,espec:'',tipoDesc:'',vl_final:null,id_med:null,id_consulta:null});setVisible()}} className="inline-flex items-center justify-between w-full p-2 rounded-lg cursor-pointer border-gray-500   bg-gray-200 hover:bg-gray-300">                                 
                        <div className="flex flex-col">
                         <span className="w-full text-sm font-semibold">{item.nome}</span>
                        
                             <span className="pr-2 w-full text-sm text-gray-600">{item.endereco}, {item.numero}, {item.bairro}, {item.cidade}</span>
                          
                            
                             </div>
                           <MdKeyboardArrowRight size={20} className="text-gray-600"/>
                       
                         </li>
                    ))}
                   </ul>

              </form>
            </Modal.Body>

        </Modal>
    )
}