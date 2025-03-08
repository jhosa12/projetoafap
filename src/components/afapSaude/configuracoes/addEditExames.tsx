import { ExamesProps } from "@/pages/afapSaude";
import { Button, Table } from "flowbite-react";
import { ModalEditExames } from "../components/modalAddEditExames";
import { useCallback, useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import { HiOutlineTrash, HiPencil } from "react-icons/hi2";
import { AuthContext } from "@/contexts/AuthContext";
import { IoIosPrint } from "react-icons/io";
import { useReactToPrint } from "react-to-print";
import RelatorioLucroExames from "@/Documents/afapSaude/relatorioLucroExames";
import pageStyle from "@/utils/pageStyle";
import { ModalConfirmar } from "../components/modalConfirmar";

interface DataProps{
    exames:Array<ExamesProps>
    setExames:(array:Array<ExamesProps>)=>void
}

export function AddEditExames({exames,setExames}:DataProps){
const resetValues ={data:new Date(),id_exame:0,nome:'',porcFun:0,porcPart:0,porcPlan:0,usuario:'',valorBruto:0,valorFinal:0,obs:''}
const [openModal,setOpenModal]= useState<boolean>(false)
const [data,setData] = useState<ExamesProps>(resetValues)
const {usuario} = useContext(AuthContext)
const currentPage = useRef<RelatorioLucroExames>(null)

const [openDeletar,setOpenDeletar] = useState<boolean>(false)



const imprimirRelatorio = useCallback(useReactToPrint({
    pageStyle:pageStyle,
    content: () => currentPage.current,
  }), []);





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
        setOpenDeletar(false)
       
    } catch (error) {
        toast.warn('Consulte o TI')
    }

}

    return(
        <div className="space-y-2">
         <div className="flex flex-row justify-end gap-2 px-2">
         <Button  onClick={()=>{setData({...resetValues,data:new Date()}),setOpenModal(true)}} size={'xs'} theme={{color:{light:"border border-gray-300 bg-white text-gray-900   enabled:hover:bg-gray-100  "}}} color={'light'} >Adicionar</Button>
         <Button  onClick={imprimirRelatorio} size={'xs'} theme={{color:{light:"border border-gray-300 bg-white text-gray-900   enabled:hover:bg-gray-100  "}}} color={'light'}><IoIosPrint className="h-4 w-4 mr-2"/>Relatório</Button>
            </div>  
            <div className="overflow-y-auto h-[calc(100vh-210px)] ">
      <Table theme={{root:{shadow:'none'},body:{cell:{base:"px-6 py-1 text-[11px]"}},head:{cell:{base:"px-6 py-1"}}}} hoverable>
        <Table.Head>
          <Table.HeadCell>Exame</Table.HeadCell>
          <Table.HeadCell>Valor Bruto</Table.HeadCell>
          <Table.HeadCell>Valor Particular</Table.HeadCell>
          <Table.HeadCell>Desconto Funerária</Table.HeadCell>
          <Table.HeadCell>Desconto Plano</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y text-black">
          {exames.map((item,index)=>(
            <Table.Row key={item.id_exame} className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
            <Table.Cell  className="whitespace-nowrap font-medium text-gray-900 dark:text-white ">
              {item.nome}
            </Table.Cell>
            <Table.Cell>{Number(item.valorBruto).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
            <Table.Cell>{Number(item.porcPart).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
            <Table.Cell>{item.porcFun}%</Table.Cell>
            <Table.Cell>{item.porcPlan}%</Table.Cell>
            <Table.Cell className="space-x-4">
              <button onClick={()=>{setData({...item,data:new Date()}),setOpenModal(true)}} className="font-medium text-gray-500 hover:text-cyan-600 ">
                <HiPencil size={16}/>
              </button>
              <button onClick={()=>{setData({...item}),setOpenDeletar(true)}} className="font-medium text-gray-500 hover:text-red-600 ">
                <HiOutlineTrash size={16}/>
              </button>
            </Table.Cell>
          </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>

   {openModal && <ModalEditExames exames={exames}  exame={data} setExames={setExames} openModal={openModal} setOpenModal={setOpenModal}/>}
{
  openDeletar &&  <ModalConfirmar pergunta="Tem certeza que deseja deletar esse exame?" handleConfirmar={handleDeletarExame} setOpenModal={setOpenDeletar} openModal={openDeletar}/>}


  <div style={{display:'none'}}>

    <RelatorioLucroExames  ref={currentPage} dados={exames}/>

  </div>
        </div>
    )



}