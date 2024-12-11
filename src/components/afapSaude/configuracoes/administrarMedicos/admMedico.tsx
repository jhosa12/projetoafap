
import { Card,Modal,ModalHeader,ModalBody,Button,Label,FileInput,Textarea,Dropdown, FloatingLabel } from "flowbite-react";
import { MedicoProps } from "@/pages/afapSaude";
import { IoAddOutline } from "react-icons/io5";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import { ModalMedico } from "./modalMedico";


interface DataProps{
    medicos:Array<MedicoProps>
    setArray:(array:Array<MedicoProps>)=>void
   
}
export default function AdmMedico({medicos,setArray}:DataProps){

    const [openModal, setOpenModal] = useState(false);
    const [dataMedico,setDataMedico]= useState<Partial<MedicoProps>>({})

    const setarDadosMedico=(fields:Partial<MedicoProps>)=>{
        setDataMedico((prev: Partial<MedicoProps>)=>{
            if(prev){return {...prev,...fields}}
            else return {...fields}
        })
    }



  //  const convertBufferToUrl = (buffer: number[]) => {
    //    const byteArray = new Uint8Array(buffer);
      //  const blob = new Blob([byteArray], { type: 'image/png' });
       ;// return URL.createObjectURL(blob);
      //};










async function deletarMedico(id:number) {
  
try {
const novo =  await toast.promise(
  api.delete(`/agenda/deletarMedico/${id}`),
  {error:'Erro ao salvar dados',
      pending:'Salvando novos dados...',
      success:'Dados salvos com sucesso!'
  }
)

const novoArray = [...medicos]
const index = novoArray.findIndex(item=>item.id_med===id)
novoArray.splice(index,1)
setArray(novoArray)
} catch (error) {
  toast.error('erro na requisição')
}
}

    return(
        <>

        <div className=" max-h-[calc(100vh-155px)] justify-center items-center p-2 w-full grid grid-cols-4 gap-6 overflow-y-auto ">
     
   {medicos?.map(item=>(
    <Card 
    key={item.id_med} 
     className=" relative  max-w-sm col-span-1 h-full" 
     imgSrc={`${process.env.NEXT_PUBLIC_API_URL}/file/${item.imageUrl}`}
   // renderImage={()=><Image alt="image med" className="rounded-lg w-full" width={250} height={100} src={convertBufferToUrl(item.image.data)}/>}
    
     
      >
        <div className="absolute top-0 right-0 z-10 flex justify-end px-4 pt-4">
        <Dropdown inline label="" theme={{arrowIcon:"ml-2 h-4 w-4 text-gray-600 bg-white rounded-lg "}}>
          <Dropdown.Item  onClick={()=>{setarDadosMedico({...item,tmpUrl:undefined,exames:item.exames}),setOpenModal(true)}}>
            <span
              
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Editar
            </span>
          </Dropdown.Item>
     
          <Dropdown.Item>
            <button
              onClick={()=>deletarMedico(item.id_med)}
              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Deletar
            </button>
          </Dropdown.Item>
        </Dropdown>
      </div>
        <div className="flex flex-col">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
      {item.nome}
    </h5>
    <span className="text-sm text-gray-500 dark:text-gray-400">{item.espec}</span>
        </div>

    <p className=" font-normal break-words overflow-y-auto text-gray-700 dark:text-gray-400">
     {item.sobre}
    </p>
  </Card>
   )) }
      <Card onClick={()=>{
        setarDadosMedico({
          espec:undefined,
          exames:[],
          file:undefined,
          id_med:undefined,
          imageUrl:undefined,
          nome:undefined,
          sobre:undefined,
          tmpUrl:undefined,
          funeraria:undefined,
          particular:undefined,
          plano:undefined,
          time:undefined
        })
        setOpenModal(true)
        }} className="flex cursor-pointer justify-center items-center max-w-sm bg-gray-800"  horizontal>
            <IoAddOutline size={60}/>
      </Card>
        </div>



      {openModal &&  <ModalMedico setDataMedico={setDataMedico} openModal={openModal} setOpenModal={setOpenModal} dataMedico={dataMedico} medicos={medicos} setArray={setArray}/>}

       
        </>

    )
}