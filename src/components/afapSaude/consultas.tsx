

import {  ConsultaProps, EventProps, MedicoProps } from "@/pages/afapSaude";
import { api } from "@/services/apiClient";
import {  Button, Table } from "flowbite-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ModalConsulta } from "./components/modalNovaConsulta";
import { toast } from "react-toastify";
import { HiDocument, HiMiniArrowDownOnSquare, HiPencil, HiPrinter } from "react-icons/hi2";
import { ModalDeletarExame } from "./components/modalDeletarExame";
import {   HiDocumentAdd, HiFilter } from "react-icons/hi";
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
import { ModalReceber } from "./exames/modalReceber";
import { ajustarData } from "@/utils/ajusteData";
import { ModalConfirmar } from "./components/modalConfirmar";
import ListaConsultas from "@/Documents/afapSaude/listaConsultas";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



interface DataProps {
  medicos: Array<MedicoProps>,
  consultas: Array<ConsultaProps>
  setConsultas: (array: Array<ConsultaProps>) => void
  events: Array<EventProps>
 
}

export const valorInicial ={celular:'',cpf:'',data:new Date(),espec:'',exames:[],id_consulta:null,id_med:null,nome:'',tipoDesc:'',vl_consulta:0,vl_desc:0,vl_final:0}
export const status = ["AGENDADO","AGUARDANDO DATA","CONFIRMADO","ATENDIDO","CANCELADO","RECEBIDO"]

export default function Consultas({ medicos, consultas, setConsultas,events  }: DataProps) {


  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState<Partial<ConsultaProps>>()
  const {usuario,infoEmpresa} = useContext(AuthContext)
 // const [modalFiltro, setModalFiltro] = useState<boolean>(false)
 // const [modalDeletar, setModalDeletar] = useState<boolean>(false)
 // const [modalReceber,setModalReceber] = useState<boolean>(false)
  const [formPag,setFormPag] = useState<string>('')
  const [loading,setLoading] = useState<boolean>(false)
  const [openStatus,setOpenStatus] = useState<boolean>(false)
  //const [modalEstornar,setModalEstornar] = useState<boolean>(false)
  const [modal,setModal] = useState<{[key:string]:boolean}>({
      filtro:false,
      deletar:false,
      receber:false,
      estornar:false
  })
const currentPage = useRef<FichaConsulta>(null)
const currentRecibo = useRef<ReciboMensalidade>(null)
const currentConsultas = useRef<ListaConsultas>(null)



const handleEstornarConsulta = async ()=>{
  if (!data?.id_consulta){
    return
  }
  if(data.status !== 'RECEBIDO'){
    toast.warning('Consulta ainda nao foi recebida')
    return
  }
  try {
    const response = await toast.promise(
      api.put('/afapSaude/estornarConsulta', {id_consulta:data?.id_consulta}),
      {
        error: 'Erro ao estornar consulta',
        pending: 'Estornando consulta.....',
        success: 'Consulta estornada com sucesso'
      }
    )

    setModal({estornar:false})
    setData(undefined)

    
  }catch(error){
    console.log(error)
   

  }
  buscarConsultas({startDate:new Date(),endDate:new Date(),id_med:undefined,status:undefined})
}







const handleChangeStatus = async ({status,item}:{status: string,item:ConsultaProps}) => {



  if(item.status==='RECEBIDO'){
    toast.warning('Consulta já foi recebida!')
    return
  }

  if((status==='CONFIRMADO'|| status==='CANCELADO')&& !item.data_prev){
    toast.warning('Cliente ainda não agendou data!')
    return
  }
  
 if(status){
  setData({...item,status:status})
 }

 setOpenStatus(true)

 
}


const handleAlterarStatus = async () => {

  if(!data?.data_prev ) {
      toast.warning('Cliente ainda não agendou data!')
      return;
  }

   
  try {
   alert(data.status)
      const evento = await toast.promise(
 
          api.put("/afapSaude/consultas/Editarcadastro", {
              id_consulta: data?.id_consulta,
              id_agmed:data?.status === 'AGUARDANDO DATA' ? null : data?.id_agmed,
              data_prev: data?.status === 'AGUARDANDO DATA' ? null : data?.data_prev,
              id_med:Number(data.id_med),
              status: data?.status
          }),
          {
              error: 'Erro na requisição',
              pending: 'Alterando status..',
              success: 'Status alterado com sucesso'
          }

      )
      const novo = [...consultas]
      const index = consultas.findIndex(item => item.id_consulta === data?.id_consulta)
              novo[index] = { ...evento.data }
        
          setConsultas(novo)

        setOpenStatus(false)
        setData({})

  } catch (error) {
      toast.error('Erro ao gerar evento')
 
  }
}





const imprimirFicha = useCallback(useReactToPrint({
  pageStyle: pageStyle,
  content: () => currentPage.current,
}), [data?.id_consulta]);

const imprimirConsultas = useCallback(useReactToPrint({
  pageStyle: `
      @page {
          size: landscape;
          margin: 1rem;
      }
      @media print {
          body {
              -webkit-print-color-adjust: exact;
          }
          @page {
              size: landscape;
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
  content: () => currentConsultas.current,
}), [consultas]);


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



const buscarConsultas = async ({startDate,endDate,id_med,status,buscar,nome}:{startDate:Date|undefined,endDate:Date|undefined,id_med?:number,status:string|undefined,buscar?:string,nome?:string})=>{

 const {dataIni,dataFim} =  ajustarData(startDate,endDate)

  if ((startDate && endDate) && startDate > endDate) {
    toast.warning('Data inicial não pode ser maior que a data final')
    return
  }


  try {
    setLoading(true)
      const response = await api.post("/afapSaude/consultas",{
        startDate:dataIni,
        endDate:dataFim,
        id_med:id_med?Number(id_med):undefined,
      status,
      buscar,
      nome
     })
      
      setConsultas(response.data)
      setModal({filtro:false})
  
  } catch (error) {
      console.log(error)
  }
  setLoading(false)
}


useEffect(()=>{
  buscarConsultas({startDate:new Date(),endDate:new Date(),status:undefined})  
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
  if(data?.status ==='AGUARDANDO DATA'){
    toast.warning('Consulta ainda não foi agendada!')
    return
  }

  if(data?.procedimentos?.length === 0){
    toast.warning('Defina os procedimentos realizados!')
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
    historico:`CONSULTA.${data?.id_consulta}-${data?.nome}-${data?.espec}`,
    valor:data?.procedimentos?.reduce((total, item) => total + item.valorFinal, 0),
    usuario:usuario?.nome,
    }),
    {
      error: 'Erro ao receber consulta',
      pending: 'Recebendo consulta....',
      success: 'Consulta recebida com sucesso!'
    }
  )
  buscarConsultas({startDate:new Date(),endDate:new Date(),status:undefined})
  setData(valorInicial)
  setModal({receber:false})
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
      api.delete(`/afapSaude/consultas/deletarCadastro`,{
       data:{
        id_consulta:data?.id_consulta
       }
      }),
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
  setModal({deletar:false})
  setData(valorInicial);

}, [consultas, data, setConsultas]);


  return (
    <div className="flex flex-col p-2 gap-2">
      <div className="ml-auto inline-flex gap-4">
      
       
        <Button.Group >
      
      <Button  className="text-blue-500" onClick={() =>{setData(valorInicial), setOpenModal(true)}} size={'xs'} color="gray">
        <HiDocumentAdd className="mr-2 h-4 w-4" />
        Adicionar
      </Button>
      <Button  onClick={() =>  setOpenModal(true)} size={'xs'} color="gray">
        <HiPencil className="mr-2 h-4 w-4" />
        Editar
      </Button>
        <Button onClick={imprimirConsultas} size={'xs'} color="gray">
              <HiPrinter className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
      <Button onClick={() => imprimirFicha()} size={'xs'} color="gray">
        <HiDocument className="mr-2 h-4 w-4" />
         Prontuário
      </Button>

      <Button onClick={imprimirRecibo} size={'xs'} color="gray">
        <BiMoneyWithdraw className="mr-2 h-4 w-4" />
         Recibo
      </Button>
      <Button className="text-green-400" onClick={() => setModal({receber:true})} size={'xs'} color="gray">
        <HiMiniArrowDownOnSquare className="mr-2 h-4 w-4" />
        Receber
      </Button>
      <Button onClick={()=>setModal({estornar:true})} size={'xs'} className="text-yellow-300" color="gray" type="button"  ><GiReturnArrow className="mr-2 h-4 w-4"/> Estornar</Button>
      <Button onClick={()=>handleWhatsAppClick(data?.celular)} size={'xs'} color="gray">
      <FaWhatsapp className="mr-2 h-4 w-4" />
        Abrir Conversa
      </Button>
      <Button className="text-red-500" onClick={()=>setModal({deletar:true})} size={'xs'} color="gray">
        <MdDelete className="mr-2 h-4 w-4" />
        Excluir
      </Button>
      <Button theme={{ color: { light: "border border-gray-300 bg-white text-gray-900  enabled:hover:bg-gray-100 " } }} color={'light'} size={'xs'} onClick={() => setModal({filtro: true})}>  <HiFilter className="mr-2 h-4 w-4" /> Filtro</Button>
    </Button.Group>
  
      </div>

      <div className="overflow-y-auto h-[calc(100vh-155px)] ">
        <Table  theme={{root:{shadow:'none'}, body: { cell: { base: "px-4 text-black py-1 text-[11px]" } },head: { cell: { base: "px-4 text-black py-1 text-xs" } } }}  >

          <Table.Head>
            <Table.HeadCell>Nome</Table.HeadCell>
            <Table.HeadCell>Especialidade</Table.HeadCell>
            <Table.HeadCell>Data</Table.HeadCell>
            <Table.HeadCell>Data Prev.</Table.HeadCell>
            <Table.HeadCell>Hora Prev</Table.HeadCell>
            <Table.HeadCell>Valor</Table.HeadCell>
            <Table.HeadCell>Usuário</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>    
          </Table.Head>
          <Table.Body className="divide-y">
            {consultas.map((item, index) => (
              <Table.Row onClick={() => setData(item)} key={item.id_consulta} className={`bg-white hover:cursor-pointer ${data?.id_consulta === item.id_consulta ? 'bg-gray-300 text-white' : ''} `}>
                <Table.Cell className="whitespace-nowrap font-medium ">
                  {item.nome}
                </Table.Cell>
                <Table.Cell>{item.espec}</Table.Cell>
                <Table.Cell>{new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Table.Cell>
                <Table.Cell>{item.data_prev && new Date(item?.data_prev).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Table.Cell>
             
                <Table.Cell>{item.hora_prev && new Date(item?.hora_prev).toLocaleTimeString('pt-BR')}</Table.Cell>
                <Table.Cell>{Number(item?.procedimentos?.reduce((acc, curr) => acc + curr.valorFinal, 0)?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                <Table.Cell>{item?.user}</Table.Cell>
                <Table.Cell onClick={(e) => e.stopPropagation()}>

               {/* <select   className={`font-semibold border-none p-0 rounded-lg focus:ring-0 hover:cursor-pointer  appearance-none outline-none text-[11px] ${
    item?.status === 'AGENDADO' ? 'text-blue-500' :
    item?.status === 'AGUARDANDO DATA' ? 'text-yellow-500' :
    item?.status === 'CONFIRMADO' ? 'text-cyan-500' :
    item?.status === 'RECEBIDO' ? 'text-green-500' :
    item?.status === 'CANCELADO' ? 'text-red-500' : ''
  }`}  value={item?.status} onChange={(e)=> { handleChangeStatus({item, status:e.target.value})}}>
                                        <option disabled className="font-semibold text-blue-500" value={'AGENDADO'}>
                                        AGENDADO
                                            </option>
                                        <option className="text-yellow-500 font-semibold" value={'AGUARDANDO DATA'}>AGUARDANDO DATA</option>
                                        <option className="text-green-500 font-semibold" value={'CONFIRMADO'}>CONFIRMADO</option>
                                        <option className="text-red-500 font-semibold" value={'CANCELADO'}>CANCELADO</option>
                                        <option disabled className="text-green-500 font-semibold" value={'RECEBIDO'}>RECEBIDO</option>
                                    </select>*/}

<Select  value={item?.status} onValueChange={(e) => { handleChangeStatus({item, status:e})}} >
      <SelectTrigger className={`border-0 shadow-none text-xs focus:ring-0 ${
    item?.status === 'AGENDADO' ? 'text-blue-500' :
    item?.status === 'AGUARDANDO DATA' ? 'text-yellow-500' :
    item?.status === 'CONFIRMADO' ? 'text-cyan-500' :
    item?.status === 'RECEBIDO' ? 'text-green-500' :
    item?.status === 'CANCELADO' ? 'text-red-500' : ''
  } `} >
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent className="shadow-none " >
        <SelectGroup className="shadow-none ">
         
       {  status.map(item=>(<SelectItem className="text-xs" disabled={item==='AGENDADO'||item==='RECEBIDO'} key={item} value={item} >{item}</SelectItem>))}

        
        </SelectGroup>
      </SelectContent>
    </Select>
                </Table.Cell>
            

              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

     {openModal && <ModalConsulta usuario={usuario?.nome} id_usuario={usuario?.id} events={events} setConsulta={setData} consultas={consultas} consulta={data ??{}} setConsultas={setConsultas}  medicos={medicos} openModal={openModal} setOpenModal={setOpenModal} buscarConsultas={buscarConsultas} />}

      <ModalDeletarExame setOpenModal={()=>setModal({deletar:false})} show={modal.deletar} handleDeletarExame={handleDeletar} />


     {modal.filtro && <ModalFiltroConsultas medicos={medicos} buscarConsultas={buscarConsultas} loading={loading} setFiltro={()=>setModal({filtro:false})} show={modal.filtro} />
}
   {modal.receber &&   <ModalReceber formPag={formPag} setFormPag={setFormPag} handleReceberExame={handleReceberConsulta}  openModal={modal.receber} setOpenModal={()=>setModal({receber:false})} />}



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
               infoEmpresa={infoEmpresa}
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

               <ListaConsultas ref={currentConsultas} dados={consultas}/>
              
      </div>





      <ModalConfirmar pergunta="Realmente deseja alterar o status?" handleConfirmar={handleAlterarStatus} openModal={openStatus} setOpenModal={setOpenStatus}/>

      <ModalConfirmar pergunta="Realmente deseja Estornar a consulta?" handleConfirmar={handleEstornarConsulta} openModal={modal.estornar} setOpenModal={()=>setModal({estornar:false})}/>

    </div>
  );
}
