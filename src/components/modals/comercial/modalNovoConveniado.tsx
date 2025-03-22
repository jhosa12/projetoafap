import { ConveniadosProps } from "@/pages/dashboard/conveniados"
import { api } from "@/lib/axios/apiClient"
import { Button, FileInput, FloatingLabel, Label, Modal, TextInput } from "flowbite-react"
import { tmpdir } from "os"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"

interface DataProps{
    conveniados:Array<ConveniadosProps>,
    setConveniados:(conveniados:Array<ConveniadosProps>)=>void
    openModal:boolean
    setOpenModal:(open:boolean)=>void
    usuario:string,
    conveniado:ConveniadosProps
}


export  function ModalNovoConveniado({openModal,setOpenModal,usuario,conveniado,conveniados,setConveniados}:DataProps) {
    const {register, handleSubmit,watch} = useForm<ConveniadosProps>({
        defaultValues:{
            ...conveniado,
            usuario:usuario
        }
    })
    const [file,setFile] = useState<File|undefined>(undefined)
    const [tpmUrl, setTpmUrl] = useState<string>("");
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(!event.target.files){
        
            return;
        }
        const image = event.target.files[0];

        if(image?.type !== 'image/jpeg' &&  image?.type !== 'image/png'){
           
            return; 
        }  

 
        setFile(image);
        setTpmUrl(URL.createObjectURL(image));
    };


   const handleOnSubmit:SubmitHandler<ConveniadosProps> = async(data)=>{
        conveniado.id_conveniados ? handleEdit(data) : handleNovo(data)
    }

    const handleNovo = async(data:ConveniadosProps)=>{
       
        const formData = new FormData();

      
        formData.append("usuario",watch('usuario'));
        formData.append("conveniado",data.conveniado);
        formData.append("endereco",data.endereco);
        formData.append("fone",data.fone);
        file && formData.append("file",file);
     
  
        try {
            const response =await toast.promise(
                api.post('/conveniados/novoConveniado',formData),
                {
                    error:'Erro ao Requisitar Dados',
                    pending:'Listando dados.....',
                    success:'Dados Carregados'
                }
            )
            setConveniados([...conveniados,response.data])
        } catch (error) {
            console.log(error)
        }
    }


    const handleEdit = async(data:ConveniadosProps)=>{
       
        const formData = new FormData();

        formData.append("id_conveniados",String(data.id_conveniados));
        formData.append("usuario",watch('usuario'));
        formData.append("conveniado",data.conveniado);
        formData.append("endereco",data.endereco);
        formData.append("fone",data.fone);
        file && formData.append("file",file);
     
       
        try {
            const response =await toast.promise(
                api.put('/conveniados/editarConveniado',formData),
                {
                    error:'Erro ao Requisitar Dados',
                    pending:'Listando dados.....',
                    success:'Dados Carregados'
                }
            )
            const index = conveniados.findIndex(item=>item.id_conveniados===data.id_conveniados)
            conveniados[index]={...response.data}
            setConveniados([...conveniados])

        } catch (error) {
            console.log(error)
        }
    }




 
    return (

        <Modal show={openModal} size={'md'} onClose={() => setOpenModal(false)}>
            <Modal.Header>Administrar Conveniado</Modal.Header>
            <Modal.Body>
            <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col space-y-2 px-2  max-h-[82vh] overflow-y-auto">
                <Label
        htmlFor="dropzone-file"
        className="flex relative w-full cursor-pointer mt-2 p-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100   "
      >
            <svg
            className="absolute  z-20 mb-4 h-8 w-8 text-gray-500 "
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
       { <div className="flex flex-col items-center justify-center pt-6">
          <p className="text-xs text-gray-500 ">SVG, PNG, JPG(MAX. 500x350px)</p>
        </div>}
        <FileInput onChange={handleFileChange} id="dropzone-file" className="hidden" />
       {tpmUrl && <img className="w-full h-32 object-center rounded-lg" src={!tpmUrl?`${process.env.NEXT_PUBLIC_API_URL}/file/${watch('filename')}`:tpmUrl} alt="fotoUser"  ></img>}
      </Label>
      <FloatingLabel label="Conveniado" {...register('conveniado')} variant="outlined"  />
      <FloatingLabel label="Endereco" {...register('endereco')} variant="outlined" />
      
      <FloatingLabel  label="Telefone" variant="outlined" {...register('fone')} type="number" />
  
        <Button type="submit" className="w-full">{conveniado.id_conveniados ? 'Editar' : 'Cadastrar'}</Button>
          </form>
            </Modal.Body>
        </Modal>
    
)
}