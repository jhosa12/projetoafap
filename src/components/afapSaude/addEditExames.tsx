import { ExamesProps } from "@/pages/afapSaude";
import { Button, Table } from "flowbite-react";
import { ModalEditExames } from "./components/modalAddEditExames";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import { HiOutlineTrash, HiPencil } from "react-icons/hi2";
import { ModalDeletarExame } from "./components/modalDeletarExame";
import { AuthContext } from "@/contexts/AuthContext";

interface DataProps{
    exames:Array<ExamesProps>
    setExames:(array:Array<ExamesProps>)=>void
}

export function AddEditExames({exames,setExames}:DataProps){
const [openModal,setOpenModal]= useState<boolean>(false)
const [data,setData] = useState<ExamesProps>({data:new Date(),id_exame:null,nome:'',porcFun:0,porcPart:0,porcPlan:0,usuario:'',valorBruto:0,valorFinal:0})
const {usuario} = useContext(AuthContext)

const [openDeletar,setOpenDeletar] = useState<boolean>(false)


const handleAdicionarExame =async()=>{
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
    } catch (error) {
            toast.warn('Consulte o TI')
    }
}


const handleDeletarExame=async ()=>{

    try {
        const response = await toast.promise(
            api.delete(`/afapSaude/exames/deletarExame/${data.id_exame}`),
            {error:'Erro ao deletar exame',
                pending:'Deletando exame.....',
                success:'Exame deletado com sucesso!'
            }
        )
        const novoArray = [...exames]
        const index = novoArray.findIndex(item=>item.id_exame===data.id_exame)
        novoArray.splice(index,1)
        setExames(novoArray)
       
    } catch (error) {
        toast.warn('Consulte o TI')
    }

}


const handleEditarExame =async()=>{
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



    } catch (error) {
            toast.warn('Consulte o TI')
    }
}






    return(
        <div className="space-y-2">
            <Button  onClick={()=>{setData({data:new Date(),id_exame:null,nome:'',porcFun:0,porcPart:0,porcPlan:0,usuario:usuario?.nome??'',valorBruto:0,valorFinal:0}),setOpenModal(true)}} size={'sm'} theme={{color:{light:"border border-gray-300 bg-white text-gray-900   enabled:hover:bg-gray-100  "}}} color={'light'} className="ml-auto mr-2">Adicionar</Button>
            <div className="overflow-x-auto">
      <Table theme={{body:{cell:{base:"px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg"}}}} hoverable>
        <Table.Head>
          <Table.HeadCell>Exame</Table.HeadCell>
          <Table.HeadCell>Valor</Table.HeadCell>
          <Table.HeadCell>Desconto Particular</Table.HeadCell>
          <Table.HeadCell>Desconto Funerária</Table.HeadCell>
          <Table.HeadCell>Desconto Plano</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {exames.map((item,index)=>(
            <Table.Row key={item.id_exame} className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
            <Table.Cell  className="whitespace-nowrap font-medium text-gray-900 dark:text-white ">
              {item.nome}
            </Table.Cell>
            <Table.Cell>{Number(item.valorBruto).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
            <Table.Cell>{item.porcPart}%</Table.Cell>
            <Table.Cell>{item.porcFun}%</Table.Cell>
            <Table.Cell>{item.porcPlan}%</Table.Cell>
            <Table.Cell className="space-x-8">
              <button onClick={()=>{setData({...item,data:new Date()}),setOpenModal(true)}} className="font-medium text-gray-500 hover:text-cyan-600 ">
                <HiPencil size={20}/>
              </button>
              <button onClick={()=>{setData({...item}),setOpenDeletar(true)}} className="font-medium text-gray-500 hover:text-red-600 ">
                <HiOutlineTrash size={20}/>
              </button>
            </Table.Cell>
          </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>

    <ModalEditExames handleEditarExame={handleEditarExame} handleAdicionarExame={handleAdicionarExame} data={data} setData={setData} openModal={openModal} setOpenModal={setOpenModal}/>

    <ModalDeletarExame handleDeletarExame={handleDeletarExame} setOpenModal={setOpenDeletar} show={openDeletar}/>
        </div>
    )



}