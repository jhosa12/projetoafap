import { AuthContext } from "@/contexts/AuthContext";
import { Modal } from "flowbite-react";
import { useContext } from "react";




interface DataProps{
    setarFalecidoDependente:({nome,data_nasc}:{nome:string,data_nasc:Date})=>void
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
}


export function ModalDependente({setarFalecidoDependente,openModal,setOpenModal}:DataProps){
    const {dadosassociado} = useContext(AuthContext)
return(
    <Modal show={openModal} onClose={()=>setOpenModal(false)}>
        <Modal.Header>Selecione o Dependente</Modal.Header>
        <Modal.Body>
       
             

                    
                           
                            <ul className="flex flex-col pt-2 overflow-y-auto text-gray-300 gap-2 ">
                                {dadosassociado?.dependentes?.map((item, index) => {
                                    return (
                                        item.excluido !== true && <li onClick={() => setarFalecidoDependente({ nome: item.nome, data_nasc: item.data_nasc })} className="flex cursor-pointer hover:bg-gray-400 bg-gray-300 p-1 pl-2 pr-2 rounded-lg ">
                                            {item.nome}
                                        </li>
                                    )

                                })}
                            </ul>

                     
               
        
        </Modal.Body>
    </Modal>
)


}