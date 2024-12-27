import { api } from "@/services/apiClient";
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { toast } from "react-toastify";
import Relatorio from '@/Documents/relatorioCobranca/DocumentTemplate';
import { useReactToPrint } from "react-to-print";
import { IoPrint } from "react-icons/io5";
import { AuthContext } from "@/contexts/AuthContext";
import ReactPaginate from "react-paginate";
import { HiFilter } from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { ModalFiltroCobranca } from "@/components/cobranca/modalCobranca";
import { SubmitHandler } from "react-hook-form";
import { ConsultoresProps } from "@/types/consultores";
import { ajustarData } from "@/utils/ajusteData";


interface CobrancaProps {
  id_mensalidade: number,
  id_contrato: number,
  id_acordo: number,
  referencia: string,
  status: string,
  parcela_n: number,
  vencimento: Date,
  cobranca: Date,
  valor_principal: number,
  associado: {
    nome: string,
    endereco: string,
    bairro: string,
    numero: string,
    cidade: string,
    uf: string,
    guia_rua: string,
    telefone: string,
    celular1: string,
    celular2: string

  }

}

export interface FormProps{
  startDate:Date,
  endDate:Date,
  periodo:boolean,
  id_empresa:string,
  param_nparcela:string,
  numeroParcelas:number,
  radio:boolean
  status:string,
  cobrador:Array<ConsultoresProps>
  bairros:Array<Partial<{ bairro: string, check: boolean }>>
}





export interface UltimosPagProps {
  id_contrato: number,
  _max: { data_pgto: Date }
}

let formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});




export  function Cobranca() {
  const [dataInicial, setDataicial] = useState<Date>(new Date())
  const [dataFinal, setDataFinal] = useState<Date>(new Date())
  const [arrayCobranca, setArrayCobranca] = useState<Array<Partial<CobrancaProps>>>([]);
  const [valorTotal, setValor] = useState<number>(0);
  const [arrayBairros, setArrayBairros] = useState<Array<Partial<{ bairro: string, check: boolean,id_empresa:string }>>>([])
  const [loading, setLoading] = useState(false) 
  const componenteRef = useRef<Relatorio>(null)
  const [ultimosPag, setUltimosPag] = useState<Array<UltimosPagProps>>([])
  const [currentPage, setCurrentPage] = useState(0);
  const [filtro, setFiltro] = useState<boolean>(false)
  const {consultores,usuario,selectEmp,permissoes} = useContext(AuthContext)
  const [isPrint,setIsPrint] = useState<boolean>(false)


  const itemsPerPage = 19;
  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected)

  }

  const offset = currentPage * itemsPerPage;
  const currentItems = arrayCobranca.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(arrayCobranca.length / itemsPerPage);





  const imprimirRelatorio = useReactToPrint({
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
  onBeforeGetContent:()=>{
    setIsPrint(true)
  },
  onAfterPrint:()=>{
    setIsPrint(false)
  },
    content: () => componenteRef.current
  })


  useEffect(()=>{
    isPrint && imprimirRelatorio()

  },[isPrint])


  useEffect(() => {

    listarBairros()

  }, [])



 const listarBairros =  useCallback(
  async()=> {

    const bairros = await api.get("/bairros");
    const bairrosProps: Array<Partial<{ bairro: string, check: boolean }>> = bairros.data
  
    setArrayBairros(bairrosProps)
    
  },[arrayBairros]
 ) 





 const handleListarCobranca:SubmitHandler<FormProps> = async(data) => {
    setDataicial(data.startDate)
    setDataFinal(data.endDate)
   const {dataIni,dataFim} =  ajustarData(data.startDate, data.endDate)
    if (arrayBairros.length > 0) {
      try {
        console.log(data.status)
        setLoading(true)
        const response = await api.post("/cobranca/lista", {
          dataInicial:dataIni,
          dataFinal:dataFim,
          cobradores:data.cobrador?.map(item => { if (item.check) { return item.nome} }).filter(item => item != null),
          id_empresa:selectEmp,
          status: data.status.split(','),
          bairros: data.bairros.map(item => { if (item.check) { return item.bairro } }).filter(item => item != null)
        })
        const valor = response.data.cobranca.reduce((acumulador: number, item: CobrancaProps) => {
          return acumulador += Number(item.valor_principal)
        }, 0)
      
        setArrayCobranca(response.data.cobranca)
        setValor(valor)
        setUltimosPag(response.data.ultimosPag)
      } catch (error) {
      //  console.log(error)
        toast.error('Erro na Requisição')
      }
    }

    setLoading(false)
    setFiltro(false)
   

  }
  return (
    <div className="flex  w-full justify-center ">
     {isPrint && <div style={{ display: 'none' }}>
        <Relatorio
          ref={componenteRef}
          arrayCobranca={arrayCobranca}
        
          cobrador={[]}
          dataFinal={dataFinal}
          dataInicial={dataInicial}
          ultimosPag={ultimosPag}
          usuario={usuario?.nome ?? ''}
        />
      </div>}
      <div className="flex flex-col bg-white w-full border  rounded-b-lg shadow  border-gray-700 h-[calc(100vh-57px)] ">
      
        
            <div className="flex  ml-auto items-end gap-2 p-2">
              <Button 
              theme={{color:{light:"border border-gray-300 bg-white text-gray-900  enabled:hover:bg-gray-100 "}}}
                disabled={!permissoes.includes('ADM3.1')}
              size='sm' onClick={() => setFiltro(true)} color='light'>
                <HiFilter className="mr-2 h-5 w-5" /> Filtro
              </Button>

              <Button
              disabled={!permissoes.includes('ADM3.2')}
                size={'sm'}
                onClick={() => imprimirRelatorio()}
               
              ><IoPrint className="mr-2" size={18} />IMPRIMIR</Button>
            </div>
         

          <div className="overflow-y-auto p-2 max-h-[77vh] ">
          <Table  hoverable theme={{ body: { cell: { base: "px-6 py-1 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg" } } }} 
    >
            <Table.Head theme={{cell:{base:"bg-gray-50 px-6 py-1 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg "}}}>
             
                <Table.HeadCell>
                  REF.
                </Table.HeadCell>
                <Table.HeadCell>
                  VENCIMENTO
                </Table.HeadCell>
                <Table.HeadCell>
                  COBRANÇA
                </Table.HeadCell>
                <Table.HeadCell>
                  TITULAR
                </Table.HeadCell>
                <Table.HeadCell>
                  ENDEREÇO
                </Table.HeadCell>
                <Table.HeadCell >
                  BAIRRO
                </Table.HeadCell>
                <Table.HeadCell >
                  STATUS
                </Table.HeadCell>
                <Table.HeadCell >
                  VALOR
                </Table.HeadCell>
             
            </Table.Head>
            <Table.Body className="divide-y text-xs text-black font-semibold ">
              {currentItems.map((item, index) => (
                <Table.Row key={item.id_mensalidade} >
                  <Table.Cell scope="row" >
                    {item.referencia}
                  </Table.Cell>
                  <Table.Cell data-tooltip-id="tooltip-hora" data-tooltip-place="bottom" >
                    {item.vencimento && new Date(item.vencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </Table.Cell>
                  <Table.Cell >
                    {item.cobranca && new Date(item.cobranca).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}

                  </Table.Cell>
                  <Table.Cell >
                    {item.id_contrato}-{item.associado?.nome}
                  </Table.Cell>
                  <Table.Cell >
                    {item.associado?.endereco}{item.associado?.numero ? "-Nº" + item.associado?.numero : ''}
                  </Table.Cell>
                  <Table.Cell >
                    {item.associado?.bairro}
                  </Table.Cell>
                  <Table.Cell className={` ${item.status === 'A' ? "text-green-600" : 'text-red-600'} `}>
                    {item.status}
                  </Table.Cell>
                  <Table.Cell >
                    {item.valor_principal && formatter.format(item.valor_principal)}
                  </Table.Cell>



                </Table.Row>

              ))}

</Table.Body>
            <tfoot>
              <tr>
                <td colSpan={5} align="right" className="  font-semibold">TOTAL MENSALIDADES: {arrayCobranca.length}</td>

                <td align="right" className="  font-semibold">VALOR: {formatter.format(valorTotal)}</td>


              </tr>
            </tfoot>

            </Table>

          </div>
    
          <div className="flex w-full  justify-end mt-auto pr-8 ">
            <ReactPaginate
              previousLabel={'Anterior'}
              nextLabel={'Próximo'}
              breakLabel={'...'}
              breakClassName="breack-me"
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination inline-flex text-gray-600 gap-4 ml-auto justify-end font-semibold  rounded-lg  '}
              activeClassName={'active text-blue-600'}

            />
          </div>
       
      </div>
   {filtro && <ModalFiltroCobranca  inad={false} setArrayBairros={setArrayBairros}  empresa={selectEmp}   selectCobrador={consultores} listarCobranca={handleListarCobranca} loading={loading} setFiltro={setFiltro}  show={filtro} arrayBairros={arrayBairros}/>}
    </div>
  )
}