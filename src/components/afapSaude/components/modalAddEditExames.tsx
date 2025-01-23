import { ExamesProps } from "@/pages/afapSaude"
import { api } from "@/services/apiClient"
import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"



interface DataProps{
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
    exame:ExamesProps,
    exames:Array<ExamesProps>,
    setExames:(array:Array<ExamesProps>)=>void
   
}


export function ModalEditExames({openModal,setOpenModal,exame,setExames,exames}:DataProps){
const {register,setValue,handleSubmit} = useForm<ExamesProps>({
  defaultValues: exame
})

const handleFormSubmit:SubmitHandler<ExamesProps> = async (data) => {
   exame.id_exame ? handleEditarExame(data) :  handleAdicionarExame(data)
}



const handleAdicionarExame =async(data:ExamesProps)=>{


    if(!data.nome||!data.porcFun||!data.porcPlan||!data.valorBruto){
        toast.info('Preencha os campos obrigatórios!');
        return;
    }
    try {
        
        const response = await toast.promise(
            api.post('/afapSaude/exames/novoExame',
                data
            ),
            {
                error:'Erro ao Cadastrar Exame',
                pending:'Realizando Cadastro.....',
                success:'Cadastro Realizado com sucesso!'
            }
        )

        setExames([...exames,response.data])
        setOpenModal(false)
    } catch (error) {
            toast.warn('Consulte o TI')
    }
}


const handleEditarExame =async(data:ExamesProps)=>{
    if(!data.nome||!data.porcFun||!data.porcPlan||!data.valorBruto){
        toast.info('Preencha os campos obrigatórios!');
        return;
    }
    try {
        
        const response = await toast.promise(
            api.put('/afapSaude/exames/editarExame',
                data
            ),
            {
                error:'Erro ao atualizar Exame',
                pending:'Atualizando.....',
                success:'Atualização realizada com sucesso!'
            }
        )

        const novoArray =[...exames]
        const index = novoArray.findIndex(item=>item.id_exame===data.id_exame)
        novoArray[index] = {...response.data}
        setExames(novoArray)

        setOpenModal(false)

    } catch (error) {
            toast.warn('Consulte o TI')
    }
}






    return(

     
        <Modal  dismissible show={openModal} size={'lg'} onClose={() => setOpenModal(false)}>
         
        <Modal.Header>Administrar Exame</Modal.Header>
       
        <Modal.Body>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className=" grid grid-cols-2 gap-2">
          <div className="col-span-2">
           
                <Label className="text-xs"  htmlFor="exame" value="Exame" />
            
              <TextInput sizing={'sm'} {...register('nome')} id="exame"  placeholder="Nome Exame" required />
            </div>

            <div className="col-span-2"> 
           <Label className="text-xs"  htmlFor="exame" value="Orientações sobre a realização do exame" />
         <Textarea rows={3} className="text-xs" {...register('obs')} id="exame"  placeholder="Descreva todas as orientações que devem ser dadas ao cliente antes da realização do exame" />
       </div>

            <div>
              
                <Label className="text-xs" htmlFor="valor" value="Valor Bruto(R$)" />
             
              <TextInput sizing={'sm'} {...register('valorBruto')}  inputMode="numeric" id="valor"  placeholder="Valor" required />
            </div>

          
            <div>
             
                <Label className="text-xs" htmlFor="particular" value="Valor Particular(R$)" />
             
              <TextInput sizing={'sm'} {...register('porcPart')}  inputMode="numeric" id="particular"  placeholder="Desconto" required />
            </div>
            <div>
             
                <Label className="text-xs" htmlFor="funeraria" value="Desconto Funerária(%)" />
             
              <TextInput sizing={'sm'} {...register('porcFun')}  inputMode="numeric" id="funeraria"  placeholder="Desconto" required />
            </div>
            <div>
              
                <Label className="text-xs" htmlFor="plano" value="Desconto Plano(%)" />
             
              <TextInput sizing={'sm'} {...register('porcPlan')} inputMode="numeric" id="plano"  placeholder="Desconto" required />
            </div>

            <div className="col-span-2">
            <span className="italic text-xs text-red-700">
              Observação: O valor particular é calculado pelo valor bruto(valor dado pelo laboratório). O valor da funerária e do plano são calculados pelo valor particular.
            </span>
            </div>

           
          </div>
          <div className="inline-flex w-full justify-between">
          <Button type="submit" color={'warning'}>{exame.id_exame?'Editar Exame':'Cadastrar Exame'}</Button>
          <Button type="button" color="gray" onClick={() => setOpenModal(false)}>
            Cancelar
          </Button>
          </div>
          </form>
        </Modal.Body>
 
        <Modal.Footer>
       
        </Modal.Footer>
        
      </Modal>
     
    )
}