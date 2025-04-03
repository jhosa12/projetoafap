
import { api } from "@/lib/axios/apiClient";
import { Badge, Button, Popover, Table, TextInput } from "flowbite-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiDocument } from "react-icons/hi2";
import { HiFilter } from "react-icons/hi";
import FichaConsulta from "@/Documents/afapSaude/fichaConsulta";
import { useReactToPrint } from "react-to-print";
import { ModalConferencia } from "./modalConferencia";
import { IoMdTrash } from "react-icons/io";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import { toast } from "sonner";



export interface CaixaFechamento{
  pix:number,
  cartao:number,
  transferencia:number,
  cedulas:number
}

export interface FechamentoProps{
 
    id_conf: number|null,
    id_ccustos: number|null,
    data: Date,
    dataFecha:Date,
    dataConf: Date,
    caixaCad:Partial<CaixaFechamento>,
    caixaReal: Partial<CaixaFechamento>
    caixaVerif: Partial<CaixaFechamento>
    status: string,
    observacao: string,
    ccustos: {
        descricao: string
    }

}


interface DataProps {
  
}
export default function Conferencia({  }: DataProps) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [caixa,setCaixa] = useState<Array<FechamentoProps>>([])
  const [dadosCaixa,setDadosCaixa] = useState<Partial<FechamentoProps>>({caixaCad:{cartao:0,cedulas:0,pix:0,transferencia:0},caixaReal:{cartao:0,cedulas:0,pix:0,transferencia:0},caixaVerif:{cartao:0,cedulas:0,pix:0,transferencia:0},ccustos:{descricao:''},data:new Date(),dataConf:new Date(),id_ccustos:null,id_conf:null,observacao:'',status:'' })

  const [openExcluir,setExcluir] = useState(false)

useEffect(
  ()=>{
    listar()
  },[]
)


const currentPage = useRef<FichaConsulta>(null)



const imprimirFicha = useReactToPrint({
  content:()=>currentPage.current
})

const listar =useCallback( async()=>{
      try {

        const response = await api.post('/caixa/listaFechamento')
       setCaixa(response.data)
        
      } catch (error) {
        console.log(error)
      }
},[]
)


const handleAtualizar=useCallback(async()=>{
  const dataConferencia = new Date()
  dataConferencia.setTime(dataConferencia.getTime() - dataConferencia.getTimezoneOffset() * 60 * 1000);
toast.promise(
        api.post('/caixa/atualizarFechamento',{
          id_conf:dadosCaixa.id_conf,
          caixaCad:dadosCaixa.caixaCad,
          caixaVerif:dadosCaixa.caixaVerif,
          caixaReal:dadosCaixa.caixaReal,
          dataConferencia:dataConferencia.toISOString()  
                }),
                {
                  error:'Erro ao atualizar dados',
                  loading:'Atualizando....',
                  success:(response)=>{
                    const novo = [...caixa]
                    const index = caixa.findIndex(it=>it.id_conf===dadosCaixa.id_conf)
                    novo[index] = response.data
                    console.log(response.data)
                    setCaixa(novo)
                    
                    return'Dados atualizados com sucesso!'}
                }
      )
   

},[dadosCaixa]

)
const handleExcluir = useCallback(async()=>{
   toast.promise(
      api.delete(`/financeiro/deletarFechamento`,{
        data:{id_conf:dadosCaixa.id_conf}}),
      {
        error:'Erro ao excluir dados',
        loading:'Excluindo....',
        success:()=>{
          listar()
          setExcluir(true)
          return 'Dados excluidos com sucesso!'}
      }
    )
  
   
},[dadosCaixa.id_conf])



  return (
    <div className="flex flex-col py-2 px-1 gap-2">

      <div className="overflow-x-auto max-h-[calc(100vh-180px)]">
        <Table theme={{root:{shadow:'none'},body:{cell:{base:"px-4 py-1 text-xs"}},head:{cell:{base:"px-4 py-1"}}}}  >

          <Table.Head>
            <Table.HeadCell>Caixa</Table.HeadCell>
            <Table.HeadCell>Data Caixa</Table.HeadCell>
            <Table.HeadCell>Data FECHAMENTO</Table.HeadCell>
            <Table.HeadCell>Data Conferencia</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Observação</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y" >
            {caixa?.map((item, index) => (
              <Table.Row key={item.id_conf} className="text-black ">
                <Table.Cell className="whitespace-nowrap  text-gray-900">
                  {item?.ccustos?.descricao}
                </Table.Cell>
                <Table.Cell> {new Date(item.data).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</Table.Cell>
                <Table.Cell> 
                  {new Date(item.dataFecha).toLocaleDateString('pt-BR',{timeZone:'UTC'})}-
                  {new Date(item.dataFecha).toLocaleTimeString('pt-BR')}
                  
                  </Table.Cell>
                  <Table.Cell> {item.dataConf && new Date(item.dataConf).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</Table.Cell>
                <Table.Cell>{Teste({caixaCadastrado:item.caixaCad,caixaReal:item.caixaReal,caixaVerificado:item.caixaVerif})==='PENDENTE'?<Badge className="justify-center text-xs" color="warning">PENDENTE</Badge>:Teste({caixaCadastrado:item.caixaCad,caixaReal:item.caixaReal,caixaVerificado:item.caixaVerif})==='DIVERGENTE'?<Badge className="justify-center text-xs" color="failure">DIVERGENTE</Badge>:<Badge color="success" className="justify-center text-xs">CONVERGENTE</Badge>}</Table.Cell>
                <Table.Cell>{item.observacao}</Table.Cell>
                <Table.Cell className="space-x-4">
                
                  <button onClick={() => {setDadosCaixa({...item}), setExcluir(true)}} className="text-gray-500 hover:text-red-600 ">
                    <IoMdTrash size={18} />
                  </button>
                  <button onClick={() => {setDadosCaixa({...item}), setOpenModal(true)}} className="font-medium text-gray-500 hover:text-blue-600 ">
                    <HiDocument size={17} />
                  </button>
                </Table.Cell>

              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>




     {/* <div className="hidden">
     <FichaConsulta nascimento={new Date()} parentesco="" responsavel="" bairro="" cidade=""  cpf="" endereco=""  nome="" rg="" celular=""  ref={currentPage}/>
      </div>*/
}




     {openModal && <ModalConferencia handleAtualizar={handleAtualizar} setDadosCaixa={setDadosCaixa} dadosCaixa={dadosCaixa??{}} openModal={openModal} setOpenModal={setOpenModal}/>}



     <ModalConfirmar
        handleConfirmar={handleExcluir}
        pergunta={"Tem certeza que deseja excluir esse caixa?"}
        openModal={openExcluir}
         setOpenModal={setExcluir}
     />

    </div>
  );
}


interface TesteProps {
  caixaReal: Partial<CaixaFechamento>;
  caixaVerificado: Partial<CaixaFechamento>;
  caixaCadastrado: Partial<CaixaFechamento>;
}

const Teste = ({ caixaReal, caixaVerificado, caixaCadastrado }: TesteProps): string => {
  // Função auxiliar para verificar divergências
  const isDivergente = (caixa1:Partial<CaixaFechamento>, caixa2: Partial<CaixaFechamento>): boolean => {
    return (
      caixa1?.pix !== caixa2?.pix ||
      caixa1?.cartao !== caixa2?.cartao ||
      caixa1?.cedulas !== caixa2?.cedulas ||
      caixa1?.transferencia !== caixa2?.transferencia
    );
  };


  // Se o caixa verificado não existir, status pendente
  if (!caixaVerificado) {
    return 'PENDENTE';
  }

  // Verificar divergências entre os três estados
  if (isDivergente(caixaCadastrado, caixaReal)) {
    return 'DIVERGENTE';
  }

  if (isDivergente(caixaCadastrado, caixaVerificado)) {
    return 'DIVERGENTE';
  }

  if (isDivergente(caixaReal, caixaVerificado)) {
    return 'DIVERGENTE';
  }


  // Se tudo estiver correto, o status pode ser 'CONFORME'
  return 'CONVERGENTE';
};