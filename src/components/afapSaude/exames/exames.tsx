

import { ExamesData, ExamesProps} from "@/pages/afapSaude";
import { api } from "@/services/apiClient";
import { Badge, Button, Table } from "flowbite-react";
import {  useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {  HiMiniArrowDownOnSquare} from "react-icons/hi2";
import {  HiAdjustments, HiDocumentAdd, HiPrinter } from "react-icons/hi";
import { useReactToPrint } from "react-to-print";
import { AuthContext } from "@/contexts/AuthContext";
import { ModalAdministrarExame } from "./modalAdministrarExame";
import Orcamento from "@/Documents/afapSaude/orcamento";
import { FaWhatsapp } from "react-icons/fa";
import { GiReturnArrow } from "react-icons/gi";
import { FiltroExames } from "./filtro";
import { ModalReceber } from "./modalReceber";
import { ModalConfirmar } from "../components/modalConfirmar";
import { ajustarData } from "@/utils/ajusteData";
import handleWhatsAppClick from "@/utils/openWhats";
import { MdDelete } from "react-icons/md";
import { BiMoneyWithdraw } from "react-icons/bi";
import pageStyle from "@/utils/pageStyle";
import { ReciboMensalidade } from "@/Documents/mensalidade/Recibo";




interface DataProps{
  exames:Array<ExamesProps>
}


export interface FiltroForm {
  startDate:Date|undefined
  endDate:Date|undefined
  nome:string|undefined
  status:string|undefined
}


export interface ExameRealizadoProps{
  id_exame:number|null,
  id_selected:number|null,
  celular:string,
  endereco:string,
  numero:number|null,
  bairro:string,
  cidade:string,
  data_orcamento: Date,
  data_realizado:Date,
  exames:Array<ExamesData>,
  coleta:string,
  tipoDesc:string,
  cpf:string,
  data_nasc:Date,
  nome_responsavel:string,
  parentesco:string,
  nome:string,
  status:string,
  user:string,
}

export default function Exames({exames}:DataProps) {
  const valorInicial = {id_exame:null,celular:'',data_orcamento:new Date(),data_realizado:new Date(),exames:[],coleta:'',tipoDesc:'',cpf:'',data_nasc:new Date(),nome_responsavel:'',parentesco:'',nome:'',status:'',user:'',endereco:'',id_selected:null,numero:null,bairro:'',cidade:''}
    const [examesRealizados,setExames] = useState<Array<ExameRealizadoProps>>([])
    const [exameSelected, setExameSelected] = useState<ExameRealizadoProps>(valorInicial)
  const {usuario,infoEmpresa} = useContext(AuthContext)
  const [openModal, setOpenModal] = useState(false)
  const currentPage = useRef<Orcamento>(null)
  const [filtro,setFiltro] = useState<boolean>(false)
  const [openModalReceber, setOpenModalReceber] = useState(false)
  const [formPag,setFormPag] = useState<string>('')
  const [openModalDeletar, setOpenModalDeletar] = useState(false)
  const currentRecibo = useRef<ReciboMensalidade>(null)



  const handleReceberExame = useCallback(async ()=>{


    if (!formPag){
      toast.warn('Selecione a forma de pagamento')
      return}

    if(!exameSelected.id_exame){
      toast.warn('Selecione um exame para receber consulta')
      return
    }
    if(exameSelected.status==='RECEBIDO'){
      toast.warn('Exame já recebido')
      return
    }

    try {
      const dataAtual = new Date()
      dataAtual.setHours(dataAtual.getHours() - dataAtual.getTimezoneOffset() / 60)
      const response = await toast.promise(
        api.put('/afapSaude/receberExame',{
          id_exame: exameSelected?.id_exame,
        id_usuario:usuario?.id,
        datalanc:dataAtual.toISOString(),
        descricao:"EXAME",
        historico:`EXAME.${exameSelected?.id_exame}-${exameSelected?.nome}-${exameSelected?.tipoDesc}`,
        valor:exameSelected?.exames?.reduce((acc, item) => acc + item.valorFinal, 0),
        usuario:usuario?.nome,
        forma_pagamento:formPag
        }),
        {
          error: 'Erro ao receber exame',
          pending: 'Recebendo exame....',
          success: 'exame recebido com sucesso!'
        }
      )
     listarExamesRealizados({endDate:new Date(),nome:'',startDate:new Date(),status:''})
    } catch (error) {
      console.log(error)
    }
    },[exameSelected.id_exame,formPag])


  const imprimirOrcamento = useCallback(
    
    useReactToPrint({
    pageStyle:pageStyle,
    content: () => currentPage.current,
    onBeforeGetContent:()=>{
      if(!exameSelected?.id_exame){
        toast.error('Selecione um exame para imprimir')
        return Promise.reject();
      }
      Promise.resolve();
    
    }
  }), [exameSelected?.id_exame]);


  const imprimirRecibo = useCallback(useReactToPrint({
    pageStyle: pageStyle,
    content: () => currentRecibo.current,
    onBeforeGetContent: () => {
      if (!exameSelected?.id_exame) {
        toast.error('Selecione um exame para imprimir');
        return Promise.reject();
      }
      if(exameSelected?.status!=='RECEBIDO'){
          toast.error('Exame ainda não recebido')
        return Promise.reject();
      }
      Promise.resolve();
    }
  }), [exameSelected?.id_exame]);


  const handleDeletar = useCallback(async () => {
    if (!exameSelected?.id_exame) {
      toast.warn('Selecione um exame para deletar');
      return;
    }
    try {
      await toast.promise(
        api.delete(`/afapSaude/deletarExame/${exameSelected?.id_exame}`),
        {
          error: 'Erro ao deletar exame',
          pending: 'Deletando exame....',
          success: 'Exame deletado com sucesso!'
        }
      )
      setExames(examesRealizados.filter(item => item.id_exame !== exameSelected.id_exame))
    } catch (error) {
      console.log(error)
    }
    
  },[exameSelected.id_exame])





 
 useEffect(() => {
    listarExamesRealizados({endDate:new Date(),nome:'',startDate:new Date(),status:''})
  }, []);



const listarExamesRealizados =useCallback( async ({endDate,nome,startDate,status}:FiltroForm) => {
 
  if(startDate && endDate && startDate>endDate){
    toast.error('Data inicial maior que data final')
    return
  }

const {dataFim,dataIni} = ajustarData(startDate,endDate)

/* if(startDate && endDate){  dataIn = new Date(startDate)
  //dataIn.setHours(dataIn.getHours() - dataIn.getTimezoneOffset() / 60)
 //  dataOut = new Date(endDate)
 // dataOut.setHours(dataOut.getHours() - dataOut.getTimezoneOffset() / 60)
dataIn = new Date(startDate)
dataOut = new Date(endDate)

 //dataIn.setHours(0,0,0,0)
// dataOut.setHours(23,59,59,999)
dataIn.setTime(dataIn.getTime() - dataIn.getTimezoneOffset()*60*1000)
//dataOut.setTime(dataOut.getTime() - dataOut.getTimezoneOffset()*60*1000)
dataIn.setUTCHours(0,0,0,0)
dataOut.setUTCHours(23,59,59,999)


//console.log(dataIn.toISOString(),dataOut.toISOString())

 
}*/

  try {
    const response = await api.post("/afapSaude/examesRealizados/listar",{
      endDate:dataFim,
      nome,
      startDate:dataIni,
      status
    });
    setExames(response.data)
  } catch (error) {
    console.log(error);
  }
},[]);

const handleNovoExame = useCallback(async(data:ExameRealizadoProps) => {
  const dataAtual = new Date()
  dataAtual.setHours(dataAtual.getHours() - dataAtual.getTimezoneOffset() / 60)

if(data.exames.length===0){
  toast.error('Adicione ao menos um exame!')
    return
}

  

    try {
        const response =await toast.promise(
          api.post("/afapSaude/examesRealizados/novoExame",
            {...data,user:usuario?.nome,data_orcamento:dataAtual.toISOString(),data_realizado:undefined}
         ),
         {
          error:'Erro ao gerar novo exame',
          pending:'Gerando novo exame.....',
          success:'Exame gerado com sucesso!'
         }
        )

        setExames([...examesRealizados,response.data])
        setExameSelected(valorInicial)
  
    } catch (error) {
       console.log(error) 
       toast.error('Erro ao gerar novo exame')
    }
}, [examesRealizados,exameSelected.id_exame]);


const handleEditarExame = useCallback(async(data:ExameRealizadoProps)=>{
  
  if(!data.id_exame){
    toast.error('Selecione um exame para editar')
    return
  }
  try {
    const response =await toast.promise(
      api.put("/afapSaude/examesRealizados/editar",
        {...data}
     ),
     {
      error:'Erro ao editar exame',
      pending:'Editando exame.....',
      success:'Exame editado com sucesso!'
     }
    )

    setExames([...examesRealizados.filter(item=>item.id_exame!==Number(data.id_exame)),response.data])
    setExameSelected(valorInicial)
} catch (error) {
   console.log(error) 
   toast.error('Erro ao editar exame')
}
},[exameSelected.id_exame])


/*const handleDeletar = useCallback(async () => {
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
*/


  

  return (
    <div className="flex flex-col p-2 gap-2">
      <div className="ml-auto inline-flex gap-4">
      <FiltroExames filtroExames={listarExamesRealizados}  loading={false}  openModal={filtro} setOpenModal={()=>setFiltro(!filtro) }/>
        

        <Button.Group >
      <Button className="text-blue-500" onClick={() =>{ setOpenModal(true),setExameSelected(valorInicial)}} size={'xs'} color="gray">
        <HiDocumentAdd className="mr-2 h-4 w-4" />
        Adicionar
      </Button>
      <Button onClick={()=>setOpenModal(true)} size={'xs'} color="gray">
        <HiAdjustments  className="mr-2 h-4 w-4" />
        Editar
      </Button>
      <Button onClick={imprimirOrcamento} size={'xs'} color="gray">
        <HiPrinter className="mr-2 h-4 w-4" />
         Orçamento
      </Button>

      <Button onClick={imprimirRecibo} size={'xs'} color="gray">
        <BiMoneyWithdraw className="mr-2 h-4 w-4" />
         Recibo
      </Button>
      <Button className="text-green-400" onClick={()=>setOpenModalReceber(true)} size={'xs'} color="gray">
        <HiMiniArrowDownOnSquare className="mr-2 h-4 w-4" />
        Receber
      </Button>
      <Button size="xs" className="text-yellow-300" color="gray" type="button"  ><GiReturnArrow className="mr-2 h-4 w-4"/> Estornar</Button>
      <Button onClick={()=>handleWhatsAppClick(exameSelected?.celular)} size={'xs'} color="gray">
      <FaWhatsapp className="mr-2 h-4 w-4" />
        Abrir Conversa
      </Button>
      <Button className="text-red-500" onClick={()=>setOpenModalDeletar(true)} size={'xs'} color="gray">
        <MdDelete className="mr-2 h-4 w-4" />
        Excluir
      </Button>
    </Button.Group>

      </div>

      <div className="overflow-x-auto h-[calc(100vh-155px)]">
        <Table  theme={{root:{shadow:'none'}, body: { cell: { base: "px-4 text-black py-1 text-xs" } },head:{cell:{base:"px-4 text-black py-1 text-xs uppercase"}} }}  >

          <Table.Head>
            <Table.HeadCell>Nome</Table.HeadCell>
            <Table.HeadCell>Celular</Table.HeadCell>
            <Table.HeadCell>Data Orçamento</Table.HeadCell>
            <Table.HeadCell>Data Pag.</Table.HeadCell>
            <Table.HeadCell>Desconto</Table.HeadCell>
            <Table.HeadCell>Total</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
        
          </Table.Head>
          <Table.Body className="divide-y">
            {examesRealizados.map((item, index) => (
              <Table.Row   onClick={() => setExameSelected(item)} key={item.id_exame} className={`bg-white hover:cursor-pointer ${exameSelected?.id_exame === item.id_exame ? 'bg-gray-300' : ''  } `}>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {item.nome}
                </Table.Cell>
                <Table.Cell>{item.celular}</Table.Cell>
                <Table.Cell>{item.data_orcamento &&new Date(item.data_orcamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Table.Cell>
                <Table.Cell>{item.data_realizado && new Date(item.data_realizado).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Table.Cell>
                <Table.Cell>{item.tipoDesc}</Table.Cell>
                <Table.Cell>{Number(item.exames.reduce((total, exame) => total + exame.valorFinal, 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                
                <Table.Cell>
                
              <Badge className="flex justify-center" color={item.status==='ORÇAMENTO'?'yellow':'green'}>{item.status}</Badge>
                </Table.Cell>
             

              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>



       { openModal &&  <ModalAdministrarExame handleEditarExame={handleEditarExame}  handleNovoExame={handleNovoExame} arraySelectExames={exames} openModal={openModal} setOpenModal={()=>setOpenModal(false)} registro={exameSelected}/>}

      { openModalReceber && <ModalReceber formPag={formPag} setFormPag={setFormPag} openModal={openModalReceber} setOpenModal={()=>setOpenModalReceber(false)} handleReceberExame={handleReceberExame} />
}

<ModalConfirmar 
handleConfirmar={handleDeletar}
 openModal={openModalDeletar}
  pergunta="Tem certeza que deseja excluir esse exame?"
  setOpenModal={setOpenModalDeletar}
/>
        <div style={{display:'none'}}>
          <Orcamento dados={exameSelected} usuario={usuario?.nome ??''} ref={currentPage} />
          <ReciboMensalidade
                infoEmpresa={infoEmpresa}
                associado={exameSelected.nome_responsavel?exameSelected?.nome_responsavel:exameSelected?.nome}
                contrato={exameSelected?.id_exame??null}
                data_pgto={exameSelected?.data_realizado??null}
                n_doc=""
                referencia=""
                valor={exameSelected?.exames.reduce((total, exame) => total + exame.valorFinal, 0)}
                vencimento={new Date()}
                ref={currentRecibo}
                referente={`Exames`}
               />
        </div>

    </div>
  );
}
