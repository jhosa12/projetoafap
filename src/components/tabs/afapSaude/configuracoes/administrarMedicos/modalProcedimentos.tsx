
import { ExamesProps, MedicoProps } from "@/pages/dashboard/afapSaude"
import { api } from "@/lib/axios/apiClient"
import {Modal, Table } from "flowbite-react"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { MdAdd, MdDelete, MdEdit } from "react-icons/md"
import { toast } from "react-toastify"
import { ModalConfirmar } from "../../components/modalConfirmar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


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
                    pending:'Realizando Cadastro.....',
                    success:'Cadastro Realizado com sucesso!'
                }
            )
            const novoArray = [...medicos]
           const index = novoArray.findIndex(item=>item.id_med==medico.id_med)
        novoArray[index].exames = [...novoArray[index].exames,response.data]
            setArrray(novoArray)


            setMedico({...medico,exames:[...medico.exames??[],response.data]})
          //  reset()

            
    
           // setExames([...exames,response.data])
        } catch (error) {
                toast.warn('Consulte o TI')
        }
    }


    const handleDeletarExame=async ()=>{

        try {
            const response = await toast.promise(
                api.delete(`/afapSaude/exames/deletarExame/${excluirId}`),
                {error:'Erro ao deletar exame',
                    pending:'Deletando exame.....',
                    success:'Exame deletado com sucesso!'
                }
            )
            const novoArray = [...medicos]
            const index = novoArray.findIndex(item=>item.id_med==medico.id_med)
            novoArray[index].exames = novoArray[index].exames.filter(item=>item.id_exame!==excluirId)
            setArrray(novoArray)
           // setExames(novoArray)
           setMedico({...medico,exames:novoArray[index].exames.filter(item=>item.id_exame!==excluirId)})

           setOpenExcluir(false)
           
        } catch (error) {
            toast.warn('Consulte o TI')
        }
    
    }



    const handleEditarExame =async(data:ExamesProps)=>{
        if(!data.nome||!data.porcFun||!data.porcPlan){
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
    
        } catch (error) {
                toast.warn('Consulte o TI')
        }
    }





    return (
        <>
        <Modal show={openModal} size="3xl" onClose={() => setOpenModal(false)} popup>
        <Modal.Header className="text-xs">{medico.nome}</Modal.Header>
        <Modal.Body >
            <div  className="space-y-2">
      
            <Button onClick={()=>{setProced({} as ExamesProps);setOpenEditar(true)}} variant={'outline'} size="sm"><MdAdd/>Adicionar</Button>
            <Table theme={{root:{shadow:'none'},body:{cell:{base:"px-4 py-1"}},head:{cell:{base:"px-4 py-1 border-b-2"}}}}>
                <Table.Head>
                    <Table.HeadCell>
                        Procedimento
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Particular
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Funerária
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Plano
                    </Table.HeadCell>
                    <Table.HeadCell>
                       Ações
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {medico?.exames?.map((item,index)=>(
                             <Table.Row className="text-xs font-medium text-black">
                             <Table.Cell>
                                 {item.nome}
                             </Table.Cell>
                             <Table.Cell>
                                 {Number(item.porcPart).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
                             </Table.Cell>
                             <Table.Cell>
                                 {Number(item.porcFun).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
                             </Table.Cell>
                             <Table.Cell>
                                {Number(item.porcPlan).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
                             </Table.Cell>
                             <Table.Cell className="inline-flex gap-2">
                                <button onClick={()=>{setExcluirId(item.id_exame);setOpenExcluir(true)}} type="button" className="hover:text-red-500">
                                <MdDelete size={16}/>
                                </button>

                                <button onClick={()=>{setProced(item);setOpenEditar(true)}} type="button" className="hover:text-blue-500">
                                <MdEdit size={16}/>
                                </button>
                             </Table.Cell>
                         </Table.Row>
                    ))}
                   
                </Table.Body>
            </Table>

            </div>
        </Modal.Body>

        </Modal>
    
        <ModalConfirmar
         openModal={openExcluir}
          setOpenModal={setOpenExcluir}
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
      <Modal size="md" show={open} onClose={onClose} popup>
            <Modal.Header/>
            <Modal.Body>
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

            </Modal.Body>
        </Modal>)
}