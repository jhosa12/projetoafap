
import { api } from "@/lib/axios/apiClient"
import { ExamesProps } from "@/types/afapSaude"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"



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
     toast.promise(
            api.post('/afapSaude/exames/novoExame',
                data
            ),
            {
                error:'Erro ao Cadastrar Exame',
                loading:'Realizando Cadastro.....',
                success:(response)=>{
                    
        setExames([...exames,response.data])
        setOpenModal(false)
                  return 'Cadastro Realizado com sucesso!'}
            }
        )
}


const handleEditarExame =async(data:ExamesProps)=>{
    if(!data.nome||!data.porcFun||!data.porcPlan||!data.valorBruto){
        toast.info('Preencha os campos obrigatórios!');
        return;
    }


    toast.promise(
            api.put('/afapSaude/exames/editarExame',
                data
            ),
            {
                error:'Erro ao atualizar Exame',
                loading:'Atualizando.....',
                success:(response)=>{
                  const novoArray =[...exames]
                  const index = novoArray.findIndex(item=>item.id_exame===data.id_exame)
                  novoArray[index] = {...response.data}
                  setExames(novoArray)
          
                  setOpenModal(false)
                  
                  return 'Atualização realizada com sucesso!'}
            }
        )

}






    return(

     
        <Dialog open={openModal} onOpenChange={setOpenModal}>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Administrar Exame</DialogTitle>
    </DialogHeader>

    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <Label htmlFor="exame" className="text-xs">
            Exame
          </Label>
          <Input
            id="exame"
            placeholder="Nome Exame"
            {...register("nome")}
            required
            className="text-sm"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="obs" className="text-xs">
            Orientações sobre a realização do exame
          </Label>
          <Textarea
            id="obs"
            placeholder="Descreva todas as orientações que devem ser dadas ao cliente antes da realização do exame"
            rows={3}
            {...register("obs")}
            className="text-xs"
          />
        </div>

        <div>
          <Label htmlFor="valor" className="text-xs">
            Valor Bruto (R$)
          </Label>
          <Input
            id="valor"
            inputMode="numeric"
            placeholder="Valor"
            {...register("valorBruto")}
            required
            className="text-sm"
          />
        </div>

        <div>
          <Label htmlFor="particular" className="text-xs">
            Valor Particular (R$)
          </Label>
          <Input
            id="particular"
            inputMode="numeric"
            placeholder="Desconto"
            {...register("porcPart")}
            required
            className="text-sm"
          />
        </div>

        <div>
          <Label htmlFor="funeraria" className="text-xs">
            Desconto Funerária (%)
          </Label>
          <Input
            id="funeraria"
            inputMode="numeric"
            placeholder="Desconto"
            {...register("porcFun")}
            required
            className="text-sm"
          />
        </div>

        <div>
          <Label htmlFor="plano" className="text-xs">
            Desconto Plano (%)
          </Label>
          <Input
            id="plano"
            inputMode="numeric"
            placeholder="Desconto"
            {...register("porcPlan")}
            required
            className="text-sm"
          />
        </div>

        <div className="col-span-2">
          <span className="italic text-xs text-red-700">
            Observação: O valor particular é calculado pelo valor bruto (valor
            dado pelo laboratório). O valor da funerária e do plano são
            calculados pelo valor particular.
          </span>
        </div>
      </div>

      <div className="inline-flex w-full justify-between mt-4">
        <Button type="submit" variant="default">
          {exame.id_exame ? "Editar Exame" : "Cadastrar Exame"}
        </Button>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancelar
          </Button>
        </DialogClose>
      </div>
    </form>

    <DialogFooter />
  </DialogContent>
</Dialog>
     
    )
}