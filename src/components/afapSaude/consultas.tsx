

import { ConsultaProps,ExamesProps, MedicoProps } from "@/pages/afapSaude";
import { api } from "@/services/apiClient";
import { Badge, Button, Table } from "flowbite-react";
import { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ModalConsulta } from "./components/modalNovaConsulta";
import { toast } from "react-toastify";
import { HiDocument, HiMiniArrowDownOnSquare, HiPencil, HiPrinter, HiTrash } from "react-icons/hi2";
import { ModalDeletarExame } from "./components/modalDeletarExame";
import {  HiAdjustments, HiDocumentAdd, HiFilter } from "react-icons/hi";
import { ModalFiltroConsultas } from "./components/modalFiltro";
import FichaConsulta from "@/Documents/afapSaude/fichaConsulta";
import { useReactToPrint } from "react-to-print";
import { MdDelete } from "react-icons/md";
import { BiMoneyWithdraw } from "react-icons/bi";
import { AuthContext } from "@/contexts/AuthContext";
import { GiReturnArrow } from "react-icons/gi";
import { FaWhatsapp } from "react-icons/fa";
import handleWhatsAppClick from "@/utils/openWhats";
import pageStyle from "@/utils/pageStyle";
import { ReciboMensalidade } from "@/Documents/mensalidade/Recibo";
import { ModalConfirmar } from "./components/modalConfirmar";
import { ModalReceber } from "./exames/modalReceber";
import { formToJSON } from "axios";




interface DataProps {
  medicos: Array<MedicoProps>,
  consultas: Array<ConsultaProps>
  setConsultas: (array: Array<ConsultaProps>) => void
 
}

export const valorInicial ={celular:'',cpf:'',data:new Date(),espec:'',exames:[],id_consulta:null,id_med:null,nome:'',tipoDesc:'',vl_consulta:0,vl_desc:0,vl_final:0}


export default function Consultas({ medicos, consultas, setConsultas,  }: DataProps) {


  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState<Partial<ConsultaProps>>()
  const {usuario} = useContext(AuthContext)
  const [modalFiltro, setModalFiltro] = useState<boolean>(false)
  const [modalDeletar, setModalDeletar] = useState<boolean>(false)
  const [modalReceber,setModalReceber] = useState<boolean>(false)
  const [formPag,setFormPag] = useState<string>('')
  const [loading,setLoading] = useState<boolean>(false)


const currentPage = useRef<FichaConsulta>(null)
const currentRecibo = useRef<ReciboMensalidade>(null)



const imprimirFicha = useCallback(useReactToPrint({
  pageStyle: pageStyle,
  content: () => currentPage.current,
}), [data?.id_consulta]);



const imprimirRecibo = useCallback(useReactToPrint({
  pageStyle: pageStyle,
  content: () => currentRecibo.current,
  onBeforeGetContent: () => {
    if(!data?.id_consulta){
      toast.warning('Selecione uma consulta')
      return Promise.reject();
    }

    if(data?.status !== 'RECEBIDO'){
      toast.warning('Consulta não foi recebida!')
      return Promise.reject();
    }

    if(data?.vl_final === 0||data?.vl_final === null){
      toast.warning('Consulta sem valor definido!')
      return Promise.reject();
    }
    Promise.resolve();
  }
}), [data?.id_consulta]);



const buscarConsultas = async ({startDate,endDate,id_med}:{startDate:Date,endDate:Date,id_med?:number})=>{
  try {
    setLoading(true)
      const response = await api.post("/afapSaude/consultas",{
        startDate,
        endDate,
        id_med
      })
      
      setConsultas(response.data)
      setLoading(false)
  } catch (error) {
      console.log(error)
  }
}


useEffect(()=>{
  buscarConsultas({startDate:new Date(),endDate:new Date()})  
},[])



const handleReceberConsulta = useCallback(async ()=>{


  if(!data?.id_consulta){
    toast.warning('Selecione uma consulta')
    return
  }

  if(data?.status === 'RECEBIDO'){
    toast.warning('Consulta ja foi recebida!')
    return
  }
  if(data?.vl_final === 0||data?.vl_final === null){
    toast.warning('Consulta sem valor definido!')
    return;
  }

  if(!formPag){
    toast.warning('Selecione uma forma de pagamento')
    return
  }

try {
  const dataAtual = new Date()
  dataAtual.setTime(dataAtual.getTime() - dataAtual.getTimezoneOffset() * 60 * 1000)

  const response = await toast.promise(
    api.put('/afapSaude/receberConsulta',{
      id_consulta: data?.id_consulta,
    id_usuario:usuario?.id,
    datalancUTC:dataAtual.toISOString(),
    descricao:"CONSULTA",
    historico:`CONSULT.${data?.id_consulta}-${data?.nome}-${data?.espec}`,
    valor:data?.vl_final,
    usuario:usuario?.nome,
    }),
    {
      error: 'Erro ao receber consulta',
      pending: 'Recebendo consulta....',
      success: 'Consulta recebida com sucesso!'
    }
  )
  buscarConsultas({startDate:new Date(),endDate:new Date()})
  setData(valorInicial)
  setModalReceber(false)
} catch (error) {
  console.log(error)
}
},[usuario,data?.id_consulta,consultas,data?.vl_final,formPag])



const handleDeletar = useCallback(async () => {

  if(!data?.id_consulta){
    toast.warning('Selecione uma consulta')
    return
  }

  
  if(data?.status === 'RECEBIDO'){
    toast.warning('Impossivel deletar. Consulta ja foi recebida!')
    return
  }
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
  setModalDeletar(false);
  setData(valorInicial);

}, [consultas, data, setConsultas]);



 


  return (
    <div className="flex flex-col p-2 gap-2">
      <div className="ml-auto inline-flex gap-4">
      
       
        <Button.Group >
      
      <Button  className="text-blue-500" onClick={() =>{setData(valorInicial), setOpenModal(true)}} size={'sm'} color="gray">
        <HiDocumentAdd className="mr-2 h-4 w-4" />
        Adicionar
      </Button>
      <Button  onClick={() =>  setOpenModal(true)} size={'sm'} color="gray">
        <HiPencil className="mr-2 h-4 w-4" />
        Editar
      </Button>
      <Button onClick={() => imprimirFicha()} size={'sm'} color="gray">
        <HiDocument className="mr-2 h-4 w-4" />
         Prontuário
      </Button>

      <Button onClick={imprimirRecibo} size={'sm'} color="gray">
        <BiMoneyWithdraw className="mr-2 h-4 w-4" />
         Recibo
      </Button>
      <Button className="text-green-400" onClick={() => setModalReceber(true)} size={'sm'} color="gray">
        <HiMiniArrowDownOnSquare className="mr-2 h-4 w-4" />
        Receber
      </Button>
      <Button className="text-yellow-300" color="gray" type="button"  ><GiReturnArrow className="mr-2 h-4 w-4"/> Estornar</Button>
      <Button onClick={()=>handleWhatsAppClick(data?.celular)} size={'sm'} color="gray">
      <FaWhatsapp className="mr-2 h-4 w-4" />
        Abrir Conversa
      </Button>
      <Button className="text-red-500" onClick={()=>setModalDeletar(true)} size={'sm'} color="gray">
        <MdDelete className="mr-2 h-4 w-4" />
        Excluir
      </Button>
    </Button.Group>
    <Button theme={{ color: { light: "border border-gray-300 bg-white text-gray-900  enabled:hover:bg-gray-100 " } }} color={'light'} size={'sm'} onClick={() => setModalFiltro(true)}>  <HiFilter className="mr-2 h-4 w-4" /> Filtro</Button>
      </div>




      <div className="overflow-y-auto h-[calc(100vh-160px)]">
        <Table  theme={{ body: { cell: { base: "px-6 text-black py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs" } } }}  >

          <Table.Head>
            <Table.HeadCell>Nome</Table.HeadCell>
            <Table.HeadCell>Especialidade</Table.HeadCell>
            <Table.HeadCell>Data</Table.HeadCell>
            <Table.HeadCell>Tipo Desc.</Table.HeadCell>
            <Table.HeadCell>Valor Desc.</Table.HeadCell>
            <Table.HeadCell>Valor Final</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>    
          </Table.Head>
          <Table.Body className="divide-y">
            {consultas.map((item, index) => (
              <Table.Row onClick={() => setData(item)} key={item.id_consulta} className={`bg-white hover:cursor-pointer ${data?.id_consulta === item.id_consulta ? 'bg-gray-400' : ''} `}>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {item.nome}
                </Table.Cell>
                <Table.Cell>{item.espec}</Table.Cell>
                <Table.Cell>{new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Table.Cell>
                <Table.Cell>{item.tipoDesc}</Table.Cell>
                <Table.Cell>{Number(item.vl_desc).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                <Table.Cell>{Number(item.vl_final).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                <Table.Cell>
                
              <Badge className="justify-center" color={item.status==='PENDENTE'?'yellow':item.status==='CANCELADO'?'red':'green'}>{item.status}</Badge>
                </Table.Cell>
            

              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

     {openModal && <ModalConsulta setConsulta={setData} consultas={consultas} consulta={data ??{}} setConsultas={setConsultas}  medicos={medicos} openModal={openModal} setOpenModal={setOpenModal} />}

      <ModalDeletarExame setOpenModal={setModalDeletar} show={modalDeletar} handleDeletarExame={handleDeletar} />
      <ModalFiltroConsultas medicos={medicos} buscarConsultas={buscarConsultas} loading={loading} setFiltro={setModalFiltro} show={modalFiltro} />

   {modalReceber &&   <ModalReceber formPag={formPag} setFormPag={setFormPag} handleReceberExame={handleReceberConsulta}  openModal={modalReceber} setOpenModal={setModalReceber} />}



      <div className="hidden" style={{display:'none'}}>
        <FichaConsulta 
        bairro={data?.bairro??''}
         cidade={data?.cidade??''} 
          cpf={data?.cpf??''}
          endereco={data?.endereco??''} 
          nascimento={data?.nascimento??undefined}
          responsavel={data?.responsavel??''}
           nome={data?.nome??''}
            rg=""
             celular={data?.celular??''}
             parentesco={data?.grau_parentesco??''}
              
               ref={currentPage}/>


               <ReciboMensalidade
                associado={data?.nome??''}
                contrato={data?.id_consulta??null}
                data_pgto={data?.dt_pgto??null}
                n_doc=""
                referencia=""
                valor={data?.vl_final??0}
                vencimento={new Date()}
                ref={currentRecibo}
                referente={`Consulta Médica - ${data?.espec}`}

               
               />
              
      </div>
    </div>
  );
}
