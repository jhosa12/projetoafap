

import { ConsultaProps, ExamesData, ExamesProps, MedicoProps } from "@/pages/afapSaude";
import { api } from "@/services/apiClient";
import { Badge, Button, Dropdown, Table } from "flowbite-react";
import { ChangeEvent, useCallback, useContext, useRef, useState } from "react";
import { ModalConsulta } from "./components/modalNovaConsulta";
import { toast } from "react-toastify";
import { HiDocument, HiOutlineTrash, HiPencil } from "react-icons/hi2";
import { ModalDeletarExame } from "./components/modalDeletarExame";
import { HiDotsVertical, HiFilter } from "react-icons/hi";
import { ModalFiltroConsultas } from "./components/modalFiltro";
import FichaConsulta from "@/Documents/afapSaude/fichaConsulta";
import { useReactToPrint } from "react-to-print";
import { MdDelete } from "react-icons/md";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { BiMoneyWithdraw } from "react-icons/bi";
import { AuthContext } from "@/contexts/AuthContext";




interface DataProps {
  medicos: Array<MedicoProps>,
  consultas: Array<ConsultaProps>
  exames: Array<ExamesProps>
  setConsultas: (array: Array<ConsultaProps>) => void
  buscarConsultas: ({ startDate, endDate }: { startDate: Date, endDate: Date }) => Promise<void>
  loading: boolean
}
export default function Consultas({ medicos, consultas, exames, setConsultas, buscarConsultas, loading }: DataProps) {
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState<Partial<ConsultaProps>>()
  const {usuario} = useContext(AuthContext)
  const [modalFiltro, setModalFiltro] = useState<boolean>(false)
  const [modalDeletar, setModalDeletar] = useState<boolean>(false)
  const [dataExame, setDataExam] = useState<ExamesData>({
    data: new Date,
    desconto: 0,
    id_exame: null,
    nome: '',
    valorBruto: 0,
    valorFinal: 0,
    porcFun: 0,
    porcPart: 0,
    porcPlan: 0
  })

const currentPage = useRef<FichaConsulta>(null)



const imprimirFicha = useCallback(useReactToPrint({
  content: () => currentPage.current,
}), []);

const handleReceberConsulta = useCallback(async (item: Partial<ConsultaProps>)=>{
try {
  const response = await toast.promise(
    api.put('/afapSaude/receberConsulta',{
      id_consulta: item?.id_consulta,
    id_usuario:usuario?.id,
    datalancUTC:new Date(),
    descricao:"CONSULTA",
    historico:`CONSULT.${item?.id_consulta}-${item?.nome}-${item?.espec}`,
    valor:item?.vl_final,
    usuario:usuario?.nome,
    }),
    {
      error: 'Erro ao receber consulta',
      pending: 'Recebendo consulta....',
      success: 'Consulta recebida com sucesso!'
    }
  )
  buscarConsultas({startDate:new Date(),endDate:new Date()})
} catch (error) {
  console.log(error)
}
},[usuario])



const handleDeletar = useCallback(async () => {
  try {
    const response = await toast.promise(
      api.delete(`/afapSaude/consultas/deletarCadastro/${data?.id_consulta}`),
      {
        error: 'Erro ao deletar dados',
        pending: 'Deletando dados....',
        success: 'Dados deletados com sucesso!',
      }
    );
      setConsultas(consultas.filter(atual => atual.id_consulta !== data?.id_consulta));
 
  } catch (error) {
    console.log(error);
  }
}, [consultas, data, setConsultas]);



  const handleExame = useCallback((event: ChangeEvent<HTMLSelectElement>) => {

    if (!event.target.value) {
      setDataExam({
        data: new Date,
        desconto: 0,
        id_exame: null,
        nome: '',
        valorBruto: 0,
        valorFinal: 0,
        porcFun: 0,
        porcPart: 0,
        porcPlan: 0
      })
      return
    }
    const item = exames.find(atual => atual.id_exame === Number(event.target.value))


    item?.id_exame && setDataExam({
      desconto: 0,
      data: new Date(),
      id_exame: item?.id_exame,
      nome: item?.nome ?? '',
      valorBruto: item?.valorBruto ?? 0,
      valorFinal: item.valorBruto,
      porcFun: item.porcFun,
      porcPart: item.porcPart,
      porcPlan: item.porcPlan
    })
  },[exames])


  return (
    <div className="flex flex-col p-2 gap-2">
      <div className="ml-auto inline-flex gap-4">
        <Button theme={{ color: { light: "border border-gray-300 bg-white text-gray-900  enabled:hover:bg-gray-100 " } }} color={'light'} size={'sm'} onClick={() => setModalFiltro(true)}>  <HiFilter className="mr-2 h-5 w-5" /> Filtro</Button>
        <Button size={'sm'} onClick={() =>{setData({celular:'',cpf:'',data:new Date(),espec:'',exames:[],id_consulta:null,id_med:null,nome:'',tipoDesc:'',vl_consulta:0,vl_desc:0,vl_final:0}), setOpenModal(true)}}>Nova Consulta</Button>
      </div>




      <div className="overflow-x-auto h-[calc(100vh-160px)]">
        <Table hoverable theme={{ body: { cell: { base: "px-6 text-black py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs" } } }}  >

          <Table.Head>
            <Table.HeadCell>Nome</Table.HeadCell>
            <Table.HeadCell>Especialidade</Table.HeadCell>
            <Table.HeadCell>Data</Table.HeadCell>
            <Table.HeadCell>Tipo Desc.</Table.HeadCell>
            <Table.HeadCell>Valor Desc.</Table.HeadCell>
            <Table.HeadCell>Valor Final</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {consultas.map((item, index) => (
              <Table.Row key={item.id_consulta} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {item.nome}
                </Table.Cell>
                <Table.Cell>{item.espec}</Table.Cell>
                <Table.Cell>{new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Table.Cell>
                <Table.Cell>{item.tipoDesc}</Table.Cell>
                <Table.Cell>{Number(item.vl_desc).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                <Table.Cell>{Number(item.vl_final).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                <Table.Cell>
                
              <Badge color={item.status==='PENDENTE'?'yellow':item.status==='CANCELADO'?'red':'green'}>{item.status}</Badge>
                </Table.Cell>
                <Table.Cell className="space-x-4">
                  <button onClick={() => { setData({ ...item }), setOpenModal(true) }} className="font-medium text-gray-500 hover:text-cyan-600">
                    <HiPencil size={16} />
                  </button>
                  <button onClick={() => { setModalDeletar(true), setData({ ...item }) }} className="font-medium text-gray-500 hover:text-red-600 ">
                    <MdDelete size={18} />
                  </button>
                  <button onClick={() => imprimirFicha()} className="font-medium text-gray-500 hover:text-blue-600 ">
                    <HiDocument size={16} />
                  </button>
                  <button onClick={() => handleReceberConsulta(item)} className="font-medium text-gray-500 hover:text-blue-600 ">
                    <BiMoneyWithdraw size={18} />
                  </button>
                </Table.Cell>

              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

     {openModal && <ModalConsulta  consultas={consultas}  dataExame={dataExame}  handleExame={handleExame}  consulta={data ??{}} setConsultas={setConsultas} exames={exames} medicos={medicos} openModal={openModal} setOpenModal={setOpenModal} />}

      <ModalDeletarExame setOpenModal={setModalDeletar} show={modalDeletar} handleDeletarExame={handleDeletar} />
      <ModalFiltroConsultas buscarConsultas={buscarConsultas} loading={loading} setFiltro={setModalFiltro} show={modalFiltro} />



      <div className="hidden">
        <FichaConsulta bairro="" cidade="" contrato={0} cpf="" logradouro="" material="" nome="" rg="" telefone="" uf="" ref={currentPage}/>
      </div>
    </div>
  );
}
