

import { ExamesData, ExamesProps} from "@/pages/afapSaude";
import { api } from "@/services/apiClient";
import { Badge, Button, Table } from "flowbite-react";
import {  useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {  HiMiniArrowDownOnSquare, HiTrash} from "react-icons/hi2";
import {  HiAdjustments, HiDocumentAdd, HiFilter, HiPrinter } from "react-icons/hi";
import { useReactToPrint } from "react-to-print";
import { AuthContext } from "@/contexts/AuthContext";
import { ModalAdministrarExame } from "./modalAdministrarExame";
import Orcamento from "@/Documents/afapSaude/orcamento";
import { FaWhatsapp } from "react-icons/fa";
import { GiReturnArrow } from "react-icons/gi";
import { FiltroExames } from "./filtro";



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
  id_exame:number,
  celular:string,
  endereco:string,
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
  const valorInicial = {id_exame:0,celular:'',data_orcamento:new Date(),data_realizado:new Date(),exames:[],coleta:'',tipoDesc:'',cpf:'',data_nasc:new Date(),nome_responsavel:'',parentesco:'',nome:'',status:'',user:'',endereco:''}
    const [examesRealizados,setExames] = useState<Array<ExameRealizadoProps>>([])
    const [exameSelected, setExameSelected] = useState<ExameRealizadoProps>(valorInicial)
  const {usuario} = useContext(AuthContext)
  const [openModal, setOpenModal] = useState(false)
  const currentPage = useRef<Orcamento>(null)
  const [filtro,setFiltro] = useState<boolean>(false)





  const formatPhoneNumber = (phoneNumber: string) => {
    // Remove todos os caracteres que não sejam números
    let cleaned = phoneNumber.replace(/\D/g, '');

    // Verifica se o telefone tem 11 dígitos (2 dígitos DDD + 9 dígitos número)
    if (cleaned.length === 11) {
        // Adiciona o código do país (Brasil: +55)
        return `55${cleaned}`;
    } else {
        console.error('Número de telefone inválido:', phoneNumber);
        return null;
    }
};


const handleWhatsAppClick = useCallback(()=>{
  if (!exameSelected.id_exame) {
    toast.warn('Selecione um exame para abrir o WhatsApp');
    return;
  }

  if (!exameSelected.celular) {
    toast.warn('Número inexistente');
    return;
  }


  const formattedNumber = formatPhoneNumber(exameSelected.celular);
  if (formattedNumber) {
      const message = encodeURIComponent("Olá, gostaria de agendar uma consulta ?");
      const whatsappURL = `whatsapp://send?phone=${formattedNumber}&text=${message}`;
      window.open(whatsappURL);
  }
},[])




  const handleReceberExame = useCallback(async ()=>{

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
    },[usuario])


  const imprimirOrcamento = useCallback(useReactToPrint({
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








 
 useEffect(() => {
    listarExamesRealizados({endDate:new Date(),nome:'',startDate:new Date(),status:''})
  }, []);



const listarExamesRealizados = useCallback(async ({endDate,nome,startDate,status}:FiltroForm) => {
  try {
    const response = await api.post("/afapSaude/examesRealizados/listar",{
      endDate,
      nome,
      startDate,
      status
    });
    setExames(response.data)
  } catch (error) {
    console.log(error);
  }
}, []);

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
            {...data,user:usuario?.nome,data_orcamento:dataAtual.toISOString()}
         ),
         {
          error:'Erro ao gerar novo exame',
          pending:'Gerando novo exame.....',
          success:'Exame gerado com sucesso!'
         }
        )

        setExames([...examesRealizados,response.data])
  
    } catch (error) {
       console.log(error) 
       toast.error('Erro ao gerar novo exame')
    }
}, []);


const handleEditarExame = useCallback(async(data:ExameRealizadoProps)=>{
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
} catch (error) {
   console.log(error) 
   toast.error('Erro ao editar exame')
}
},[])


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
      
      <Button onClick={() =>{ setOpenModal(true),setExameSelected(valorInicial)}} size={'sm'} color="gray">
        <HiDocumentAdd className="mr-2 h-4 w-4" />
        Adicionar
      </Button>
      <Button onClick={()=>setOpenModal(true)} size={'sm'} color="gray">
        <HiAdjustments className="mr-2 h-4 w-4" />
        Editar
      </Button>
      <Button onClick={imprimirOrcamento} size={'sm'} color="gray">
        <HiPrinter className="mr-2 h-4 w-4" />
         Orçamento
      </Button>

      <Button onClick={imprimirOrcamento} size={'sm'} color="gray">
        <HiPrinter className="mr-2 h-4 w-4" />
         Recibo
      </Button>
      <Button onClick={handleReceberExame} size={'sm'} color="gray">
        <HiMiniArrowDownOnSquare className="mr-2 h-4 w-4" />
        Receber
      </Button>
      <Button color="gray" type="button"  ><GiReturnArrow className="mr-2 h-4 w-4"/> Estornar</Button>
      <Button onClick={handleWhatsAppClick} size={'sm'} color="gray">
      <FaWhatsapp className="mr-2 h-4 w-4" />
        Abrir Conversa
      </Button>
      <Button size={'sm'} color="gray">
        <HiTrash className="mr-2 h-4 w-4" />
        Excluir
      </Button>
    </Button.Group>

      </div>

      <div className="overflow-x-auto h-[calc(100vh-160px)]">
        <Table  theme={{ body: { cell: { base: "px-6 text-black py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs" } } }}  >

          <Table.Head>
            <Table.HeadCell>Nome</Table.HeadCell>
            <Table.HeadCell>Celular</Table.HeadCell>
            <Table.HeadCell>Data Orçamento</Table.HeadCell>
            <Table.HeadCell>Data Realizado</Table.HeadCell>
            <Table.HeadCell>Desconto</Table.HeadCell>
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
                
                <Table.Cell>
                
              <Badge className="flex justify-center" color={item.status==='ORÇAMENTO'?'yellow':'green'}>{item.status}</Badge>
                </Table.Cell>
             

              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>



       { openModal &&  <ModalAdministrarExame handleEditarExame={handleEditarExame}  handleNovoExame={handleNovoExame} arraySelectExames={exames} openModal={openModal} setOpenModal={()=>setOpenModal(false)} registro={exameSelected}/>}


        <div style={{display:'none'}}>
          <Orcamento dados={exameSelected} ref={currentPage} />
        </div>

    </div>
  );
}
