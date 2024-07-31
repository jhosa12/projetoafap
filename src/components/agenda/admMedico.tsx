
import { Card,Modal,ModalHeader,ModalBody,Button,Label,FileInput,TextInput,Textarea } from "flowbite-react";
import imag from "../../../public/carne.png"
import { MedicoProps } from "@/pages/agenda";
import { IoAddOutline } from "react-icons/io5";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import Image from "next/image";

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



    const convertBufferToUrl = (buffer: number[]) => {
        const byteArray = new Uint8Array(buffer);
        const blob = new Blob([byteArray], { type: 'image/png' });
        return URL.createObjectURL(blob);
      };



      const handleFile = (e:ChangeEvent<HTMLInputElement>)=>{
        if(!e.target.files){
            return;
        }

const imagem = e.target.files[0];
if(!imagem ){
    return;
}
if(imagem.type==='image/jpeg' || imagem.type==='image/png'){
   setarDadosMedico({...dataMedico,avatarUrl:URL.createObjectURL(e.target.files[0]),file:e.target.files[0]})
  


    }
}


    async function novoMedico() {
            const data =new FormData()
            data.append("nome",dataMedico.nome??'')
            data.append("espec",dataMedico.espec??'')
            data.append("sobre",dataMedico.sobre??'')
            if(dataMedico.file){
                data.append("file",dataMedico.file)
            }
        try {
        const novo =  await toast.promise(
            api.post("/agenda/novoMedico",data),
            {error:'Erro ao salvar dados',
                pending:'Salvando novos dados...',
                success:'Dados salvos com sucesso!'
            }
        )
        
        const novoArray = [...medicos]
        novoArray.push(novo.data)
        setArray(novoArray)
        } catch (error) {
            toast.error('erro na requisição')
        }
        
    }






    return(
        <>

        <div className=" max-h-[calc(100vh-110px)] justify-center items-center p-2 w-full grid grid-cols-4 gap-6 overflow-y-auto ">
     
   {medicos.map(item=>(
    <Card 
    key={item.id_med} 
     className="max-w-sm col-span-1" 
     imgSrc={`http://localhost:3333/file/${item.imageUrl}`}
   // renderImage={()=><Image alt="image med" className="rounded-lg w-full" width={250} height={100} src={convertBufferToUrl(item.image.data)}/>}
      horizontal>
        <div className="flex flex-col">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
      {item.nome}
    </h5>
    <span className="text-sm text-gray-500 dark:text-gray-400">{item.espec}</span>
        </div>

    <p className="font-normal text-gray-700 dark:text-gray-400">
     {item.sobre}
    </p>
  </Card>
   )) }
      <Card onClick={()=>setOpenModal(true)} className="flex justify-center items-center max-w-sm bg-gray-800"  horizontal>
            <IoAddOutline size={60}/>
      </Card>
        </div>

        <Modal
        content={"relative h-full w-full p-4 md:h-auto"}
         show={openModal}
         onClose={()=>setOpenModal(false)}
          size={'md'}
           popup 
        
           
           className="absolute bg-transparent ">
           
            <ModalHeader title={"Editar Dados"} className="flex text-white items-start justify-between bg-gray-800 rounded-t border-b p-4 border-gray-60">
                <h1 className="text-white">Editar Dados</h1>
                </ModalHeader>
            <ModalBody>
                <div className="space-y-2 p-2">
                <Label
        htmlFor="dropzone-file"
        className="flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
            <svg
            className="absolute  z-20 mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
       {!dataMedico.avatarUrl && <div className="flex flex-col items-center justify-center  pt-6">
      
        
          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG(MAX. 500x350px)</p>
        </div>}
        <FileInput onChange={handleFile} id="dropzone-file" className="hidden" />
       {dataMedico.avatarUrl && <img className="w-full h-36 object-center rounded-lg" src={dataMedico.avatarUrl} alt="fotoUser"  ></img>}
      </Label>
      <TextInput onChange={e=>setarDadosMedico({...dataMedico,nome:e.target.value})} placeholder="Nome do Médico"/>
      <TextInput onChange={e=>setarDadosMedico({...dataMedico,espec:e.target.value})} placeholder="Especialidade"/>
      <Textarea onChange={e=>setarDadosMedico({...dataMedico,sobre:e.target.value})} rows={4} placeholder="Descreva suas atividades"/>
        
          </div></ModalBody>

          <Modal.Footer>
          <Button color="blue"  onClick={novoMedico}>Salvar</Button>
          <Button color="gray" className="bg-gray-400" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>

        </Modal>
        </>

    )
}