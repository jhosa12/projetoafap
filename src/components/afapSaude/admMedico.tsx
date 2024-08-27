
import { Card,Modal,ModalHeader,ModalBody,Button,Label,FileInput,TextInput,Textarea,Dropdown,DropdownItem, FloatingLabel } from "flowbite-react";
import { MedicoProps } from "@/pages/afapSaude";
import { IoAddOutline } from "react-icons/io5";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";


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



      const handleFile = (e:ChangeEvent<HTMLInputElement>)=>{
        if(!e.target.files){
            return;
        }

const imagem = e.target.files[0];
if(!imagem ){
    return;
}
if(imagem.type==='image/jpeg' || imagem.type==='image/png'){
   setarDadosMedico({...dataMedico,imageUrl:'',tmpUrl:URL.createObjectURL(e.target.files[0]),file:e.target.files[0]})
    }
}
    async function novoMedico() {
            const data =new FormData()
            data.append("nome",dataMedico.nome??'')
            data.append("espec",dataMedico.espec??'')
            data.append("sobre",dataMedico.sobre??'')
            data.append("plano",String(dataMedico.plano)??'')
            data.append("funeraria",String(dataMedico.funeraria)??'')
            data.append("particular",String(dataMedico.particular)??'')
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
        setOpenModal(false)
        } catch (error) {
            toast.error('erro na requisição')
        }
        
    }



    async function editarMedico() {
      const data =new FormData()
      data.append("id_med",String(dataMedico.id_med))
      data.append("nome",dataMedico.nome??'')
      data.append("espec",dataMedico.espec??'')
      data.append("sobre",dataMedico.sobre??'')
      data.append("time",String(dataMedico.time)??'')
      data.append("imageUrl",dataMedico.imageUrl??'')
      data.append("plano",String(dataMedico.plano)??'')
      data.append("funeraria",String(dataMedico.funeraria)??'')
      data.append("particular",String(dataMedico.particular)??'')
      if(dataMedico.file){
          data.append("file",dataMedico.file)
      }
  try {
  const novo =  await toast.promise(
      api.put("/agenda/editarMedico",data),
      {error:'Erro ao salvar dados',
          pending:'Salvando novos dados...',
          success:'Dados salvos com sucesso!'
      }
  )
  
  const novoArray = [...medicos]
  const index = novoArray.findIndex(item=>item.id_med===dataMedico.id_med)
  novoArray[index]={...novo.data}
  setArray(novoArray)
  } catch (error) {
      toast.error('erro na requisição')
  }
  
}

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

        <div className=" max-h-[calc(100vh-110px)] justify-center items-center p-2 w-full grid grid-cols-4 gap-6 overflow-y-auto ">
     
   {medicos.map(item=>(
    <Card 
    key={item.id_med} 
     className=" relative  max-w-sm col-span-1 h-full" 
     imgSrc={`${process.env.NEXT_PUBLIC_API_URL}/file/${item.imageUrl}`}
   // renderImage={()=><Image alt="image med" className="rounded-lg w-full" width={250} height={100} src={convertBufferToUrl(item.image.data)}/>}
    
     
      >
        <div className="absolute top-0 right-0 z-10 flex justify-end px-4 pt-4">
        <Dropdown inline label="">
          <Dropdown.Item  onClick={()=>{setarDadosMedico({...item,tmpUrl:undefined}),setOpenModal(true)}}>
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

        <Modal
        className="absolute bg-transparent overflow-y-auto"
        content={"base"}
         show={openModal}
         onClose={()=>setOpenModal(false)}
          size={'xl'}
           popup 
        
         dismissible
          >
           
            <ModalHeader className="flex text-white items-start justify-between bg-gray-800 rounded-t border-b p-2 border-gray-60">
                {dataMedico.id_med?<h1 className="text-white">Editar Dados</h1>:<h1 className="text-white">Adicionar Novo Medico</h1>}
                </ModalHeader>
            <ModalBody>
                <div className="flex flex-col space-y-2 px-2  max-h-[82vh] overflow-y-auto">
                <Label
        htmlFor="dropzone-file"
        className="flex relative w-full cursor-pointer mt-2 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
       {!dataMedico.imageUrl && !dataMedico.tmpUrl && <div className="flex flex-col items-center justify-center pt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG(MAX. 500x350px)</p>
        </div>}
        <FileInput onChange={handleFile} id="dropzone-file" className="hidden" />
       {(dataMedico.imageUrl || dataMedico.tmpUrl) &&  <img className="w-full h-36 object-center rounded-lg" src={dataMedico.imageUrl?`${process.env.NEXT_PUBLIC_API_URL}/file/${dataMedico.imageUrl}`:dataMedico.tmpUrl} alt="fotoUser"  ></img>}
      </Label>
      <FloatingLabel label="Nome do Médico" variant="outlined" value={dataMedico.nome} onChange={e=>setarDadosMedico({...dataMedico,nome:e.target.value})} />
      <FloatingLabel label="Especialidade" variant="outlined" value={dataMedico.espec} onChange={e=>setarDadosMedico({...dataMedico,espec:e.target.value})} />
        <div className=" inline-flex gap-4">
        <FloatingLabel label="Valor Plano" variant="outlined" type="number" value={dataMedico.plano} onChange={e=>setarDadosMedico({...dataMedico,plano:Number(e.target.value)})} />
        <FloatingLabel label="Valor Funerária" variant="outlined" type="number" value={dataMedico.funeraria} onChange={e=>setarDadosMedico({...dataMedico,funeraria:Number(e.target.value)})} />
        <FloatingLabel label="Valor Particular" variant="outlined" type="number" value={dataMedico.particular} onChange={e=>setarDadosMedico({...dataMedico,particular:Number(e.target.value)})} />
      </div>
      <FloatingLabel label="Intervalo médio entre consultas em minutos" variant="outlined" type="number" value={dataMedico.time} onChange={e=>setarDadosMedico({...dataMedico,time:Number(e.target.value)})} />
      <Textarea  className="min-h-[100px] h-auto"  value={dataMedico.sobre} onChange={e=>setarDadosMedico({...dataMedico,sobre:e.target.value})} rows={4} placeholder="Descreva suas atividades"/>
        
          </div></ModalBody>

          <Modal.Footer>
         { !dataMedico.id_med?<Button color="blue"  onClick={novoMedico}>Salvar</Button>: <Button className="bg-yellow-400"  onClick={editarMedico}>Editar</Button>}
          <Button color="gray" className="bg-gray-400" onClick={() => setOpenModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>

        </Modal>
        </>

    )
}