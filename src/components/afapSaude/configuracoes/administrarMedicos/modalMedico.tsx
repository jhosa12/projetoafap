import { MedicoProps } from "@/pages/afapSaude"
import { api } from "@/services/apiClient"
import { Button, FileInput, FloatingLabel, Label, Modal, Textarea } from "flowbite-react"
import { ChangeEvent, useContext, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { FaNotesMedical } from "react-icons/fa"
import { IoIosSave } from "react-icons/io"
import { MdCancel } from "react-icons/md"
import { toast } from "react-toastify"
import { ModalProcedimentos } from "./modalProcedimentos"
import { AuthContext } from "@/contexts/AuthContext"


interface DataProps {
    openModal:boolean
    setOpenModal:(open:boolean)=>void
    dataMedico:Partial<MedicoProps>|MedicoProps,
    setDataMedico:(medico:Partial<MedicoProps>|MedicoProps)=>void
    medicos:Array<MedicoProps>,
    setArray:(array:Array<MedicoProps>)=>void
}



export function ModalMedico({openModal,setOpenModal,dataMedico,medicos,setArray,setDataMedico}:DataProps) {
    const [openProcedimentos,setModalProcedimentos] = useState(false);
    const {usuario} = useContext(AuthContext)

    const {register,formState:{errors},handleSubmit,watch,control,reset,setValue} = useForm<MedicoProps>(
        {
            defaultValues:dataMedico
        }
    )




    const handleOnSubmit:SubmitHandler<MedicoProps> = (data)=>{
        dataMedico.id_med ? editarMedico(data) :  novoMedico(data)

    }



    const handleFile = (e:ChangeEvent<HTMLInputElement>)=>{
        if(!e.target.files){
            return;
        }

const imagem = e.target.files[0];

if(imagem.type==='image/jpeg' || imagem.type==='image/png'){
  /* setarDadosMedico({...dataMedico,imageUrl:'',tmpUrl:URL.createObjectURL(e.target.files[0]),file:e.target.files[0]})*/
   setValue('file',e.target.files[0])
   setValue('imageUrl','')
   setValue('tmpUrl',URL.createObjectURL(e.target.files[0]))
    }
}



async function novoMedico(dados:MedicoProps) {
    const data =new FormData()
    data.append("nome",dados.nome)
    data.append("espec",dados.espec)
    data.append("time",String(dados.time))
    data.append("sobre",dados.sobre)
    data.append("plano",String(dados.plano))
    data.append("funeraria",String(dados.funeraria))
    data.append("particular",String(dados.particular))
    const {file} = watch()
    if(file){
        data.append("file",file)
    }
try {
const novo =  await toast.promise(
    api.post("/agenda/novoMedico",data),
    {error:'Erro ao salvar dados',
        pending:'Salvando novos dados...',
        success:'Dados salvos com sucesso!'
    }
)

setArray([...medicos,novo.data])
setOpenModal(false)
} catch (error) {
    toast.error('Erro na requisição')
}

}



async function editarMedico(dados:MedicoProps) {
    const data =new FormData()
    data.append("id_med",String(dados.id_med))
    data.append("nome",dados.nome??'')
    data.append("espec",dados.espec??'')
    data.append("sobre",dados.sobre??'')
    data.append("time",String(dados.time)??'')
    data.append("imageUrl",dados.imageUrl??'')
    data.append("plano",String(dados.plano)??'')
    data.append("funeraria",String(dados.funeraria)??'')
    data.append("particular",String(dados.particular)??'')
    if(dados.file){
        data.append("file",dados.file)
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
    toast.error('Erro na requisição')
}
}






    return (
        <>
        <Modal
        className="absolute bg-transparent overflow-y-auto"
        content={"base"}
         show={openModal}
         onClose={()=>setOpenModal(false)}
          size={'xl'}
           popup 
        
        
          >
           
            <Modal.Header className="flex text-white items-start justify-between bg-gray-800 rounded-t border-b p-2 border-gray-60">
                {dataMedico.id_med?<h1 className="text-white">Editar Dados</h1>:<h1 className="text-white">Adicionar Novo Medico</h1>}
                </Modal.Header>
            <Modal.Body>

                <form  onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col space-y-2 px-2 pt-2  ">
              
      <Button.Group outline>
        <Button type="submit" size="sm" color="gray">
          <IoIosSave  className="mr-3 h-4 w-4" />
          {dataMedico.id_med?'Atualizar':'Salvar'}
        </Button>
        <Button onClick={() => setModalProcedimentos(true)} type="button" size="sm" color="gray">
          <FaNotesMedical className="mr-3 h-4 w-4" />
          Procedimentos
        </Button>
        <Button onClick={() => setOpenModal(false)} type="button" size="sm" color="gray">
          <MdCancel className="mr-3 h-4 w-4" />
          Cancelar
        </Button>
      </Button.Group>
  
    
   
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
       {!watch('imageUrl') && !watch('tmpUrl') && <div className="flex flex-col items-center justify-center pt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG(MAX. 500x350px)</p>
        </div>}
        <FileInput  onChange={handleFile} id="dropzone-file" className="hidden" />
       {(watch('imageUrl') || watch('tmpUrl')) &&  <img className="w-full h-28 object-center rounded-lg" src={watch('imageUrl')?`${process.env.NEXT_PUBLIC_API_URL}/file/${watch('imageUrl')}`:watch('tmpUrl')} alt="fotoUser"  ></img>}
      </Label>
      <FloatingLabel sizing="sm" label="Nome do Médico" variant="outlined" {...register('nome')}  />
      <FloatingLabel sizing="sm" label="Especialidade" variant="outlined" {...register('espec')} />
        <div className=" inline-flex gap-4">

   {/*     <FloatingLabel sizing="sm" label="Valor Plano" variant="outlined" type="number" {...register('plano')} />

        <FloatingLabel sizing="sm" label="Valor Funerária" variant="outlined" type="number" {...register('funeraria')} />

        <FloatingLabel sizing="sm" label="Valor Particular" variant="outlined" type="number" {...register('particular')} />*/}
      </div>

      <FloatingLabel sizing="sm" label="Intervalo médio entre consultas em minutos" variant="outlined" type="number" {...register('time')}/>

      <Textarea   className="min-h-[40px] h-auto text-xs"  {...register('sobre')} rows={2} placeholder="Descreva suas atividades"/>

    
          </form>
          </Modal.Body>
        </Modal>

      { openProcedimentos && <ModalProcedimentos setMedico={setDataMedico} medicos={medicos} setArrray={setArray} usuario={usuario?.nome}  medico={dataMedico} openModal={openProcedimentos} setOpenModal={setModalProcedimentos} />}

        </>
    )
}