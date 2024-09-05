

import { ConsultaProps, ExamesData, ExamesProps, MedicoProps } from "@/pages/afapSaude";
import { api } from "@/services/apiClient";
import { Button, Table } from "flowbite-react";
import { ChangeEvent, useRef, useState } from "react";
import { ModalConsulta } from "./components/modalNovaConsulta";
import { toast } from "react-toastify";
import { HiDocument, HiOutlineTrash, HiPencil } from "react-icons/hi2";
import { ModalDeletarExame } from "./components/modalDeletarExame";
import { HiFilter } from "react-icons/hi";
import { ModalFiltroConsultas } from "./components/modalFiltro";
import FichaConsulta from "@/Documents/afapSaude/fichaConsulta";
import { useReactToPrint } from "react-to-print";




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
  const [data, setData] = useState<ConsultaProps>({
    data: new Date(), espec: '', exames: [], id_consulta: null, id_med: null, nome: '', tipoDesc: '', vl_consulta: 0, vl_desc: 0, vl_final: 0, celular: '', cpf: ''
  })

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



const imprimirFicha = useReactToPrint({
  content:()=>currentPage.current
})








  const handleEditarConsulta = async () => {

    if(!data.id_med){
      toast.info('Selecione um especialista')
    }
    if(!data.tipoDesc){
      toast.info('Selecione um tipo de desconto')
    }
    try {
      const medico = medicos.find(item=>item.id_med===data.id_med)
      const response = await toast.promise(
        api.put('/afapSaude/consultas/Editarcadastro', {
          ...data,
          nome: data.nome,
          data: new Date(),
          espec: data.espec,
          exames: data.exames,
          id_med: data.id_med,
          tipoDesc: data.tipoDesc,
          vl_consulta:Number(medico?.particular)+data.exames.reduce((acc,at)=>{acc+=Number(at.valorBruto); return acc},0),
          vl_desc:(data.tipoDesc==='Funeraria'?Number(medico?.particular)-Number(medico?.funeraria):data.tipoDesc==='Plano'?Number(medico?.particular)-Number(medico?.plano):0)+data.exames.reduce((acc,at)=>{acc+=Number(at.desconto); return acc},0),

          vl_final:(data.tipoDesc==='Funeraria'?Number(medico?.funeraria):data.tipoDesc==='Plano'?Number(medico?.plano):Number(medico?.particular))+data.exames.reduce((acc,at)=>{acc+=Number(at.valorFinal); return acc},0), 
          celular: data.celular,
          cpf: data.cpf
        }),
        {
          error: 'Erro ao editar dados',
          pending: 'Alterando dados .....',
          success: 'Dados alterados com sucesso!'
        }
      )
      const novoArray = [...consultas]
      const index = novoArray.findIndex(item => item.id_consulta === data.id_consulta)
      novoArray[index] = { ...response.data }
      setConsultas(novoArray)
    } catch (error) {
      toast.warning('Consulte o TI')
    }
  }

  const handleDeletar = async () => {
    try {
      const response = await toast.promise(
        api.delete(`/afapSaude/consultas/deletarCadastro/${data.id_consulta}`),
        {
          error: 'Erro ao deletar dados',
          pending: 'Deletando dados....',
          success: 'Dados deletados com sucesso!'
        }
      )
      const novoArray = [...consultas]
      const index = novoArray.findIndex(item => item.id_consulta === data.id_consulta);
      novoArray.splice(index, 1)
      setConsultas(novoArray)
    } catch (error) {

    }
  }



  const handleExame = (event: ChangeEvent<HTMLSelectElement>) => {

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
  }






  const handleCadastrar = async () => {

    if(!data.id_med){
      toast.info('Selecione um especialista')
    }
    if(!data.tipoDesc){
      toast.info('Selecione um tipo de desconto')
    }
    try {
const medico = medicos.find(item=>item.id_med===data.id_med)
      const response = await toast.promise(
        api.post("/afapSaude/consultas/cadastro", {
          nome: data.nome,
          data: new Date(),
          espec: data.espec,
          exames: data.exames,
          id_med: data.id_med,
          tipoDesc: data.tipoDesc,
          vl_consulta:Number(medico?.particular)+data.exames.reduce((acc,at)=>{acc+=Number(at.valorBruto); return acc},0),
          vl_desc:(data.tipoDesc==='Funeraria'?Number(medico?.particular)-Number(medico?.funeraria):data.tipoDesc==='Plano'?Number(medico?.particular)-Number(medico?.plano):0)+data.exames.reduce((acc,at)=>{acc+=Number(at.desconto); return acc},0),

          vl_final:(data.tipoDesc==='Funeraria'?Number(medico?.funeraria):data.tipoDesc==='Plano'?Number(medico?.plano):Number(medico?.particular))+data.exames.reduce((acc,at)=>{acc+=Number(at.valorFinal); return acc},0), 
          celular: data.celular,
          cpf: data.cpf
        }),
        {
          error: 'Erro ao Cadastrar Dados',
          pending: 'Cadastrando Consulta.....',
          success: 'Consulta Cadastrada com sucesso'
        }
      )

      setConsultas([...consultas, response.data])

    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="flex flex-col py-2 gap-2">
      <div className="ml-auto inline-flex gap-4">
        <Button theme={{ color: { light: "border border-gray-300 bg-white text-gray-900  enabled:hover:bg-gray-100 " } }} color={'light'} size={'sm'} onClick={() => setModalFiltro(true)}>  <HiFilter className="mr-2 h-5 w-5" /> Filtro</Button>
        <Button size={'sm'} onClick={() =>{setData({celular:'',cpf:'',data:new Date(),espec:'',exames:[],id_consulta:null,id_med:null,nome:'',tipoDesc:'',vl_consulta:0,vl_desc:0,vl_final:0}), setOpenModal(true)}}>Nova Consulta</Button>
      </div>




      <div className="overflow-x-auto">
        <Table hoverable theme={{ body: { cell: { base: "px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg" } } }}  >

          <Table.Head>
            <Table.HeadCell>Nome</Table.HeadCell>
            <Table.HeadCell>Especialidade</Table.HeadCell>
            <Table.HeadCell>Data</Table.HeadCell>
            <Table.HeadCell>Valor Bruto</Table.HeadCell>
            <Table.HeadCell>Tipo Desc.</Table.HeadCell>
            <Table.HeadCell>Valor Desc.</Table.HeadCell>
            <Table.HeadCell>Valor Final</Table.HeadCell>
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
                <Table.Cell>{Number(item.vl_consulta).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                <Table.Cell>{item.tipoDesc}</Table.Cell>
                <Table.Cell>{Number(item.vl_desc).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                <Table.Cell>{Number(item.vl_final).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                <Table.Cell className="space-x-6">
                  <button onClick={() => { setData({ ...item }), setOpenModal(true) }} className="font-medium text-gray-500 hover:text-cyan-600">
                    <HiPencil size={18} />
                  </button>
                  <button onClick={() => { setModalDeletar(true), setData({ ...item }) }} className="font-medium text-gray-500 hover:text-red-600 ">
                    <HiOutlineTrash size={20} />
                  </button>
                  <button onClick={() => imprimirFicha()} className="font-medium text-gray-500 hover:text-blue-600 ">
                    <HiDocument size={20} />
                  </button>
                </Table.Cell>

              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <ModalConsulta handleEditarConsulta={handleEditarConsulta} dataExame={dataExame}  handleExame={handleExame} handleCadastrar={handleCadastrar} data={data} setData={setData} exames={exames} medicos={medicos} openModal={openModal} setOpenModal={setOpenModal} />

      <ModalDeletarExame setOpenModal={setModalDeletar} show={modalDeletar} handleDeletarExame={handleDeletar} />
      <ModalFiltroConsultas buscarConsultas={buscarConsultas} loading={loading} setFiltro={setModalFiltro} show={modalFiltro} />



      <div className="hidden">
        <FichaConsulta bairro="" cidade="" contrato={0} cpf="" logradouro="" material="" nome="" rg="" telefone="" uf="" ref={currentPage}/>
      </div>
    </div>
  );
}
