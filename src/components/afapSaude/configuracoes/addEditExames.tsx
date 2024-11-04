import { ExamesProps } from "@/pages/afapSaude";
import { Button, Table } from "flowbite-react";
import { ModalEditExames } from "../components/modalAddEditExames";
import { useCallback, useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import { HiOutlineTrash, HiPencil } from "react-icons/hi2";
import { ModalDeletarExame } from "../components/modalDeletarExame";
import { AuthContext } from "@/contexts/AuthContext";
import { IoIosPrint } from "react-icons/io";
import { useReactToPrint } from "react-to-print";
import RelatorioLucroExames from "@/Documents/afapSaude/relatorioLucroExames";

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
    pageStyle: `
    @page {
        margin: 1rem;
    }
    @media print {
        body {
            -webkit-print-color-adjust: exact;
        }
        @page {
            size: auto;
            margin: 1rem;
        }
        @page {
            @top-center {
                content: none;
            }
            @bottom-center {
                content: none;
            }
        }
    }
  `,
    content: () => currentPage.current,
  }), []);


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
         <div className="flex flex-row justify-end gap-2 px-2">
         <Button  onClick={()=>{setData({...resetValues,data:new Date()}),setOpenModal(true)}} size={'sm'} theme={{color:{light:"border border-gray-300 bg-white text-gray-900   enabled:hover:bg-gray-100  "}}} color={'light'} >Adicionar</Button>
         <Button  onClick={imprimirRelatorio} size={'sm'} theme={{color:{light:"border border-gray-300 bg-white text-gray-900   enabled:hover:bg-gray-100  "}}} color={'light'}><IoIosPrint className="h-5 w-5 mr-2"/>Relatório</Button>
            </div>  
            <div className="overflow-x-auto ">
      <Table theme={{body:{cell:{base:"px-6 py-1 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg"}}}} hoverable>
        <Table.Head>
          <Table.HeadCell>Exame</Table.HeadCell>
          <Table.HeadCell>Valor Bruto</Table.HeadCell>
          <Table.HeadCell>Desconto Particular</Table.HeadCell>
          <Table.HeadCell>Desconto Funerária</Table.HeadCell>
          <Table.HeadCell>Desconto Plano</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y text-black text-xs">
          {exames.map((item,index)=>(
            <Table.Row key={item.id_exame} className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
            <Table.Cell  className="whitespace-nowrap font-medium text-gray-900 dark:text-white ">
              {item.nome}
            </Table.Cell>
            <Table.Cell>{Number(item.valorBruto).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
            <Table.Cell>{item.porcPart}%</Table.Cell>
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

   {openModal && <ModalEditExames handleEditarExame={handleEditarExame} handleAdicionarExame={handleAdicionarExame} data={data} setData={setData} openModal={openModal} setOpenModal={setOpenModal}/>}
{
  openDeletar &&  <ModalDeletarExame handleDeletarExame={handleDeletarExame} setOpenModal={setOpenDeletar} show={openDeletar}/>}


  <div style={{display:'none'}}>

    <RelatorioLucroExames  ref={currentPage} dados={exames}/>

  </div>
        </div>
    )



}