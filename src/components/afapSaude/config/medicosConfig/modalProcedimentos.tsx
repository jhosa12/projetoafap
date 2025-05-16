
import { api } from "@/lib/axios/apiClient"

import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { MdAdd, MdDelete, MdEdit } from "react-icons/md"
import { ModalConfirmar } from "../../../modals/modalConfirmar"

import { Input } from "@/components/ui/input"
import { ExamesProps, MedicoProps } from "@/types/afapSaude"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


interface DataProps {
    openModal:boolean
    setOpenModal:(open:boolean)=>void
    medico:Partial<MedicoProps>|MedicoProps
    setMedico:(medico:Partial<MedicoProps>|MedicoProps)=>void
    medicos:Array<MedicoProps>
    setArrray:(array:Array<MedicoProps>)=>void
    usuario?:string
}


export function ModalProcedimentos({openModal,setOpenModal,medico,usuario,medicos,setArrray,setMedico}:DataProps) {

   
    const [openExcluir, setOpenExcluir] = useState(false)
    const [excluirId, setExcluirId] = useState<number|null>(null)
    const [openEditar, setOpenEditar] = useState(false)
    const [proced, setProced] = useState<ExamesProps>({} as ExamesProps)

    const handleAdicionarExame =async(data:ExamesProps)=>{
        if(!data.nome||!data.porcFun||!data.porcPlan){
            toast.info('Preencha os campos obrigatórios!');
            return;
        }
        try {
            
            const response = await toast.promise(
                api.post('/afapSaude/exames/novoExame',
                    {...data,nome:data.nome.toUpperCase(),id_medico:medico.id_med,usuario}
                ),
                {
                    error:'Erro ao Cadastrar Exame',
                    loading:'Realizando Cadastro.....',
                    success:(response)=>{
                        const novoArray = [...medicos]
                        const index = novoArray.findIndex(item=>item.id_med==medico.id_med)
                     novoArray[index].exames = [...novoArray[index].exames,response.data]
                         setArrray(novoArray)
             
             
                         setMedico({...medico,exames:[...medico.exames??[],response.data]})
                       //  reset()
                        
                       return 'Cadastro Realizado com sucesso!'}
                }
            )
           

            
    
           // setExames([...exames,response.data])
        } catch (error) {
                toast.warning('Consulte o TI')
        }
    }


    const handleDeletarExame=async ()=>{

         toast.promise(
                api.delete(`/afapSaude/exames/deletarExame/${excluirId}`),
                {error:'Erro ao deletar exame',
                    loading:'Deletando exame.....',
                    success:()=>{
                        const novoArray = [...medicos]
                        const index = novoArray.findIndex(item=>item.id_med==medico.id_med)
                        novoArray[index].exames = novoArray[index].exames.filter(item=>item.id_exame!==excluirId)
                        setArrray(novoArray)
                       // setExames(novoArray)
                       setMedico({...medico,exames:novoArray[index].exames.filter(item=>item.id_exame!==excluirId)})
            
                       setOpenExcluir(false)
                        return 'Exame deletado com sucesso!'}
                }
            )
            
           
      
    
    }



    const handleEditarExame =async(data:ExamesProps)=>{
        if(!data.nome||!data.porcFun||!data.porcPlan){
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
                             // const novoArray =[...exames]
           // const index = novoArray.findIndex(item=>item.id_exame===data.id_exame)
          //  novoArray[index] = {...response.data}
           //setExames(novoArray)
           const novoArray = [...medicos]
           const index = novoArray.findIndex(item=>item.id_med==medico.id_med)
           
           const index2 = novoArray[index].exames.findIndex(item=>item.id_exame===data.id_exame)
           novoArray[index].exames[index2] = {...response.data}
           setArrray(novoArray)
          // setExames(novoArray)
          setMedico({...medico,exames:novoArray[index].exames})
            setOpenEditar(false)
                        
                       return 'Atualização realizada com sucesso!'}
                }
            )
    
    }

    return (
        <>
       <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className="max-w-4xl ">
        <DialogHeader>
          <DialogTitle className="text-xs">{medico.nome}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 px-4 py-2">
          <Button
            onClick={() => {
              setProced({} as ExamesProps)
              setOpenEditar(true)
            }}
            variant="outline"
            size="sm"
          >
            <MdAdd className="mr-1" />
            Adicionar
          </Button>

          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="px-4 py-1 border-b-2">Procedimento</TableHead>
                <TableHead className="px-4 py-1 border-b-2">Particular</TableHead>
                <TableHead className="px-4 py-1 border-b-2">Funerária</TableHead>
                <TableHead className="px-4 py-1 border-b-2">Plano</TableHead>
                <TableHead className="px-4 py-1 border-b-2">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medico?.exames?.map((item, index) => (
                <TableRow key={item.id_exame} className="text-xs font-medium text-black">
                  <TableCell className="px-4 py-1">{item.nome}</TableCell>
                  <TableCell className="px-4 py-1">
                    {Number(item.porcPart).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="px-4 py-1">
                    {Number(item.porcFun).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="px-4 py-1">
                    {Number(item.porcPlan).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="px-4 py-1">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setExcluirId(item.id_exame)
                          setOpenExcluir(true)
                        }}
                        type="button"
                        className="hover:text-red-500"
                      >
                        <MdDelete size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setProced(item)
                          setOpenEditar(true)
                        }}
                        type="button"
                        className="hover:text-blue-500"
                      >
                        <MdEdit size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
    
        <ModalConfirmar
         openModal={openExcluir}
          setOpenModal={()=>setOpenExcluir(false)}
          pergunta="Tem certeza que deseja excluir o procedimento?"
          handleConfirmar={handleDeletarExame}
           />

       {openEditar && <ModalEditarProced
        handleEditar={handleEditarExame}
         handleNovo={handleAdicionarExame}
          open={openEditar}
           onClose={()=>setOpenEditar(false)}
           proced={proced}/>}
        </>
    )
}



interface ProcedProps{
    open:boolean
    onClose:()=>void,
    proced:ExamesProps,
    handleNovo:(data:ExamesProps)=>Promise<void>
    handleEditar:(data:ExamesProps)=>Promise<void>
}

export const ModalEditarProced = ({onClose,open,proced,handleNovo,handleEditar}:ProcedProps)=>{
    const {register,handleSubmit,watch,reset} = useForm<ExamesProps>({
        defaultValues:proced
    })

        const handleOnSubmit:SubmitHandler<ExamesProps> = (data) =>{
          data.id_exame ? handleEditar(data) : handleNovo(data)
        }


       


      return ( 
      <Dialog  open={open} onOpenChange={onClose} >
           
            <DialogContent>
                 <DialogHeader/>
                <form onSubmit={handleSubmit(handleOnSubmit)} className="grid grid-cols-2 gap-4">
                    <div className="col-span-2" >
                        <label className="text-xs"  htmlFor="nome">Procedimento</label>
                        <Input id="nome"  placeholder="Procedimento" {...register('nome')} />
                    </div>
                    <div>
                        <label className="text-xs"  htmlFor="porcPart">Particular</label>
                        <Input id="porcPart" placeholder="Particular"  {...register('porcPart')}/>
                    </div>

                    <div>
                        <label className="text-xs" htmlFor="porcFun">Funerária</label>
                        <Input id="porcFun" placeholder="Funerária" {...register('porcFun')}/>
                    </div>

                    <div>
                        <label className="text-xs" htmlFor="porcPlan">Plano</label>
                        <Input id="porcPlan"  placeholder="Plano" {...register('porcPlan')} />
                    </div>


                    
                    <div>
                        <label className="text-xs" htmlFor="valorRepasse">Valor Repasse</label>
                        <Input id="valorRepasse" placeholder="Valor de Repasse" {...register('valorRepasse')} />
                    </div>
               
               
                <Button className="col-span-2" type="submit" size="sm">{proced.id_exame?'EDITAR':'ADICIONAR'}</Button>
                    
                </form>

            </DialogContent>
        </Dialog>)
}