import { ConveniadosProps } from "@/app/dashboard/conveniados/page"
import { api } from "@/lib/axios/apiClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, type ChangeEvent } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

interface DataProps{
    conveniados:Array<ConveniadosProps>,
    setConveniados:(conveniados:Array<ConveniadosProps>)=>void
    openModal:boolean
    setOpenModal:(open:boolean)=>void
    usuario:string,
    conveniado:ConveniadosProps
}

export function ModalNovoConveniado({openModal,setOpenModal,usuario,conveniado,conveniados,setConveniados}:DataProps) {
    const {register, handleSubmit,watch} = useForm<ConveniadosProps>({
        defaultValues:{
            ...conveniado,
            usuario:usuario
        }
    })
    const [file,setFile] = useState<File|undefined>(undefined)
    const [tpmUrl, setTpmUrl] = useState<string>("");

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
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
     
  
           toast.promise(
                api.post('/conveniados/novoConveniado',formData),
                {
                    error:'Erro ao Requisitar Dados',
                    loading:'Listando dados.....',
                    success:(response)=>{
                        setConveniados([...conveniados,response.data])
                        return 'Dados Carregados'}
                }
            )
          
    
    }

    const handleEdit = async(data:ConveniadosProps)=>{
       
        const formData = new FormData();

        formData.append("id_conveniados",String(data.id_conveniados));
        formData.append("usuario",watch('usuario'));
        formData.append("conveniado",data.conveniado);
        formData.append("endereco",data.endereco);
        formData.append("fone",data.fone);
        file && formData.append("file",file);
     
       
        
           toast.promise(
                api.put('/conveniados/editarConveniado',formData),
                {
                    error:'Erro ao Requisitar Dados',
                    loading:'Listando dados.....',
                    success:(response)=>{
                        const index = conveniados.findIndex(item=>item.id_conveniados===data.id_conveniados)
                        conveniados[index]={...response.data}
                        setConveniados([...conveniados])
                        return'Dados Carregados'}
                }
            )
           

      
    }

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Administrar Conveniado</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col space-y-3 max-h-[82vh] overflow-y-auto">
                    <div className="space-y-2">
                        <Label htmlFor="file">Imagem (SVG, PNG, JPG)</Label>
                        <Input id="file" type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleFileChange} />
                        {tpmUrl && (
                            <img className="w-full h-32 object-center rounded-md" src={!tpmUrl ? `${process.env.NEXT_PUBLIC_API_URL}/file/${watch('filename')}` : tpmUrl} alt="fotoUser" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="conveniado">Conveniado</Label>
                        <Input id="conveniado" placeholder="Nome do conveniado" {...register('conveniado')} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="endereco">Endereço</Label>
                        <Input id="endereco" placeholder="Endereço" {...register('endereco')} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fone">Telefone</Label>
                        <Input id="fone" type="tel" placeholder="(00) 00000-0000" {...register('fone')} />
                    </div>

                    <Button type="submit" className="w-full">{conveniado.id_conveniados ? 'Editar' : 'Cadastrar'}</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}