import { ModalConfirm } from "@/components/estoque/historico/modalConfirm"
import { ExamesProps, MedicoProps } from "@/pages/afapSaude"
import { api } from "@/services/apiClient"
import { Button, Modal, Table, TextInput } from "flowbite-react"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { MdDelete } from "react-icons/md"
import { toast } from "react-toastify"
import { ModalConfirmar } from "../../components/modalConfirmar"


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

    const {register,handleSubmit,watch,reset} = useForm<ExamesProps>()
    const [openExcluir, setOpenExcluir] = useState(false)
    const [excluirId, setExcluirId] = useState<number|null>(null)

    const handleAdicionarExame:SubmitHandler<ExamesProps> =async(data)=>{
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
            reset()

            
    
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
           
        } catch (error) {
            toast.warn('Consulte o TI')
        }
    
    }






    return (
        <>
        <Modal show={openModal} size="3xl" onClose={() => setOpenModal(false)} popup>
        <Modal.Header>{medico.nome}</Modal.Header>
        <Modal.Body >
            <form onSubmit={handleSubmit(handleAdicionarExame)} className="space-y-2">
            <div className="flex flex-row gap-2 w-full mt-1">
                <TextInput className="w-full" sizing="sm" placeholder="Procedimento" {...register('nome')} />
                <TextInput sizing="sm" placeholder="Particular"  {...register('porcPart')}/>
                <TextInput sizing="sm" placeholder="Funerária" {...register('porcFun')}/>
                <TextInput sizing="sm" placeholder="Plano" {...register('porcPlan')} />
                <Button type="submit" size="xs">Adicionar</Button>
            </div>
            <Table theme={{body:{cell:{base:"px-6 py-1 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg"}}}}>
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
                             <Table.Row className="text-xs font-semibold text-black">
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
                             <Table.Cell>
                                <button onClick={()=>{setExcluirId(item.id_exame);setOpenExcluir(true)}} type="button" className="hover:text-red-500">
                                <MdDelete size={16}/>
                                </button>
                             </Table.Cell>
                         </Table.Row>
                    ))}
                   
                </Table.Body>
            </Table>

            </form>
        </Modal.Body>

        </Modal>
    
        <ModalConfirmar
         openModal={openExcluir}
          setOpenModal={setOpenExcluir}
          pergunta="Tem certeza que deseja excluir o procedimento?"
          handleConfirmar={handleDeletarExame}
           />
        </>
    )
}