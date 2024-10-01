import { api } from "@/services/apiClient";
import { useContext, useEffect, useRef, useState } from "react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Relatorio from '@/Documents/relatorioCobranca/DocumentTemplate';
import { useReactToPrint } from "react-to-print";
import { IoPrint } from "react-icons/io5";
import { AuthContext } from "@/contexts/AuthContext";
import ReactPaginate from "react-paginate";
import { HiFilter } from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { ModalFiltroCobranca } from "@/components/relatorioCobranca/modalCobranca";
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
export interface CobradorProps {
  id_consultor: number,
  nome: string
}
interface UltimosPagProsps {
  id_contrato: number,
  _max: { data_pgto: Date }
}

let formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

export default function Cobranca() {
  const [arrayCobranca, setArrayCobranca] = useState<Array<Partial<CobrancaProps>>>([]);
  const [selectCobrador, setSelectCobrador] = useState<Array<CobradorProps>>([]);
  const [valorTotal, setValor] = useState<number>(0);
  const [arrayBairros, setArrayBairros] = useState<Array<Partial<{ bairro: string, check: boolean }>>>([])
  const [todos, setTodos] = useState(true)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [reqListaBairros, setReq] = useState<boolean>()
  const [status, setStatus] = useState<Array<string>>(['A', 'R'])
  const componenteRef = useRef<Relatorio>(null)
  const { usuario,permissoes } = useContext(AuthContext)
  const [ultimosPag, setUltimosPag] = useState<Array<UltimosPagProsps>>([])
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;
  const [filtro, setFiltro] = useState<boolean>(false)
  const [empresa,setEmpresa] =useState<string>('')


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
    content: () => componenteRef.current
  })


  useEffect(() => {

    listarBairros()

  }, [])

  useEffect(() => {



   reqListaBairros && listarCobranca()



  }, [reqListaBairros])
  async function listarBairros() {
    const bairros = await api.get("/bairros");
    const bairrosProps: Array<Partial<{ bairro: string, check: boolean }>> = bairros.data
    const checkBairros = bairrosProps.map(item => { return { ...item, check: true } })
    setArrayBairros(checkBairros)
    setReq(true)
  }



  const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {

    const value = e.target.value;
    // Converter o valor para um array de strings
    const selectedValues = value.split(',');
    setStatus(selectedValues);

  };


  function handleOptionChange(index: number) {

    if (todos) {
      return;
    }
    const novoArray = [...arrayBairros]
    novoArray[index].check = !novoArray[index].check
    setArrayBairros(novoArray)

  }

  useEffect(() => {
    let novoArray
    if (todos) {
      novoArray = arrayBairros.map(item => { return { ...item, check: true } })
    }
    if (!todos) {
      novoArray = arrayBairros.map(item => { return { ...item, check: false } })
    }
    novoArray && setArrayBairros(novoArray)
  }, [todos])

  async function listarCobranca() {
    if (arrayBairros.length > 0) {
      try {
        console.log('CHAMOU')
        setLoading(true)
        const response = await api.post("/cobranca/lista", {
          dataInicial:startDate,
          dataFinal:endDate,
          status: status,
          bairros: arrayBairros.map(item => { if (item.check) { return item.bairro } }).filter(item => item != null)
        })
        const valor = response.data.cobranca.reduce((acumulador: number, item: CobrancaProps) => {
          return acumulador += Number(item.valor_principal)
        }, 0)
        console.log(response.data)
        setArrayCobranca(response.data.cobranca)
        setSelectCobrador(response.data.cobrador)
        setValor(valor)
        setLoading(false)
        setUltimosPag(response.data.ultimosPag)
      } catch (error) {
        toast.error('Erro na Requisição')
      }
    }

  }
  return (
    <div className="flex  w-full justify-center px-1">
      <div style={{ display: 'none' }}>
        <Relatorio
          ref={componenteRef}
          arrayCobranca={arrayCobranca}
          bairros={arrayBairros}
          cobrador={[]}
          dataFinal={startDate}
          dataInicial={endDate}
          ultimosPag={ultimosPag}
          status={status}
          todos={todos}
          usuario={usuario?.nome ?? ''}

        />
      </div>
      <div className="flex flex-col w-full border  rounded-lg shadow bg-white border-gray-700 max-h-[92vh] ">
        <div className="text-gray-600 bg-gray-50 rounded-t-lg inline-flex items-center p-2 justify-between   ">
          <h1 className=" text-lg  pl-3 font-medium">Relatórios de Cobrança</h1>
          <div id="divFiltro" className="inline-flex gap-4">
          
          

            <div className="flex   items-end gap-2">
              <Button 
                disabled={!permissoes.includes('ADM3.1')}
              size='sm' onClick={() => setFiltro(true)} color='cyan'>
                <HiFilter className="mr-2 h-5 w-5" /> Filtro
              </Button>

              <Button
              disabled={!permissoes.includes('ADM3.2')}
                size={'sm'}
                onClick={() => imprimirRelatorio()}
               
              ><IoPrint className="mr-2" size={18} />IMPRIMIR</Button>
            </div>
          </div>

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
            <Table.Body className="divide-y bg-white">
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
                <td colSpan={5} align="right" className="text-white  font-semibold">TOTAL MENSALIDADES: {arrayCobranca.length}</td>

                <td align="right" className="text-white  font-semibold">VALOR: {formatter.format(valorTotal)}</td>


              </tr>
            </tfoot>

            </Table>

          </div>
    
          <div className="flex w-full justify-end pr-8 ">
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
      <ModalFiltroCobranca empresa={empresa} setEmpresa={setEmpresa} selectCobrador={selectCobrador} setEndDate={setEndDate} startDate={startDate} endDate={endDate} handleChangeStatus={handleChangeStatus} listarCobranca={listarCobranca} loading={loading} setFiltro={setFiltro} setStartDate={setStartDate} show={filtro} arrayBairros={arrayBairros}
      handleOptionChange={handleOptionChange}
      setTodos={setTodos}
      todos={todos}
      />
    </div>
  )
}