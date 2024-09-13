

import { ConsultaProps, ExamesData, ExamesProps, MedicoProps } from "@/pages/afapSaude";
import { api } from "@/services/apiClient";
import { Button, Table } from "flowbite-react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { HiDocument, HiOutlineTrash, HiPencil } from "react-icons/hi2";
import { HiFilter } from "react-icons/hi";
import FichaConsulta from "@/Documents/afapSaude/fichaConsulta";
import { useReactToPrint } from "react-to-print";
import { ModalConferencia } from "./modalConferencia";
import { CaixaProps } from "@/pages/financeiro/login";



export interface CaixaFechamento{
  pix:number,
  cartao:number,
  transferencia:number,
  cedulas:number
}

export interface FechamentoProps{
 
    id_conf: number,
    id_ccustos: number,
    data: Date,
    dataConf: Date,
    caixaCad:CaixaFechamento,
    caixaReal: CaixaFechamento
    caixaVerif: CaixaFechamento
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
  const [dadosCaixa,setDadosCaixa] = useState<FechamentoProps|null>()

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

        const response = await api.get('/caixa/listaFechamento')
       setCaixa(response.data)
        
      } catch (error) {
        console.log(error)
      }

},[]
)





  










  return (
    <div className="flex flex-col py-2 gap-2">
      <div className="ml-auto inline-flex gap-4">
        <Button theme={{ color: { light: "border border-gray-300 bg-white text-gray-900  enabled:hover:bg-gray-100 " } }} color={'light'} size={'sm'} onClick={() => {}}>  <HiFilter className="mr-2 h-5 w-5" /> Filtro</Button>
        <Button size={'sm'} onClick={() =>{}}>Nova Consulta</Button>
      </div>




      <div className="overflow-x-auto">
        <Table hoverable theme={{ body: { cell: { base: "px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg" } } }}  >

          <Table.Head>
            <Table.HeadCell>Caixa</Table.HeadCell>
            <Table.HeadCell>Data</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Observação</Table.HeadCell>
        
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {caixa?.map((item, index) => (
              <Table.Row key={item.id_conf} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {item.ccustos.descricao}
                </Table.Cell>
                <Table.Cell> {new Date(item.data).toLocaleDateString('pt-BR')}</Table.Cell>
                <Table.Cell>{Teste({caixaCadastrado:item.caixaCad,caixaReal:item.caixaReal,caixaVerificado:item.caixaVerif})}</Table.Cell>
                <Table.Cell>{item.observacao}</Table.Cell>
                <Table.Cell className="space-x-6">
                  <button onClick={() => {  }} className="font-medium text-gray-500 hover:text-cyan-600">
                    <HiPencil size={18} />
                  </button>
                  <button onClick={() => { }} className="font-medium text-gray-500 hover:text-red-600 ">
                    <HiOutlineTrash size={20} />
                  </button>
                  <button onClick={() => {setDadosCaixa({...item}), setOpenModal(true)}} className="font-medium text-gray-500 hover:text-blue-600 ">
                    <HiDocument size={20} />
                  </button>
                </Table.Cell>

              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>




      <div className="hidden">
        <FichaConsulta bairro="" cidade="" contrato={0} cpf="" logradouro="" material="" nome="" rg="" telefone="" uf="" ref={currentPage}/>
      </div>





      <ModalConferencia dadosCaixa={dadosCaixa??null} openModal={openModal} setOpenModal={setOpenModal}/>
    </div>
  );
}


interface TesteProps {
  caixaReal: CaixaFechamento;
  caixaVerificado: CaixaFechamento;
  caixaCadastrado: CaixaFechamento;
}

const Teste = ({ caixaReal, caixaVerificado, caixaCadastrado }: TesteProps): string => {
  // Função auxiliar para verificar divergências
  const isDivergente = (caixa1: CaixaFechamento, caixa2: CaixaFechamento): boolean => {
    return (
      caixa1.pix !== caixa2.pix ||
      caixa1.cartao !== caixa2.cartao ||
      caixa1.cedulas !== caixa2.cedulas ||
      caixa1.transferencia !== caixa2.transferencia
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