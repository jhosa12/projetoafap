import { api } from "@/lib/axios/apiClient";
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import Relatorio from '@/Documents/cobranca/DocumentTemplate';
import { useReactToPrint } from "react-to-print";
import { IoPrint } from "react-icons/io5";
import { AuthContext } from "@/store/AuthContext";
import ReactPaginate from "react-paginate";
import { HiFilter } from "react-icons/hi";
import {  Table } from "flowbite-react";
import { SubmitHandler } from "react-hook-form";
import { ConsultoresProps } from "@/types/consultores";
import { ajustarData } from "@/utils/ajusteData";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { pageStyle } from "@/utils/pageStyle";
import { ModalFiltroCobranca } from "../modalCobranca";


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
  cobrador:Array<string>
  bairros:Array<string>
  cidade:string
  statusReagendamento:string 
}





export interface UltimosPagProps {
  id_contrato: number,
  _max: { data_pgto: Date }
}

let formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

interface ScreenProps{
  arrayBairros: Array<Partial<{ bairro: string, check: boolean,id_empresa:string }>>
  cidades: Array<string|undefined>
}


export  function Cobranca({arrayBairros,cidades}:ScreenProps) {
  const [dataInicial, setDataicial] = useState<Date>(new Date())
  const [dataFinal, setDataFinal] = useState<Date>(new Date())
  const [arrayCobranca, setArrayCobranca] = useState<Array<Partial<CobrancaProps>>>([]);
  const [valorTotal, setValor] = useState<number>(0);
  const [loading, setLoading] = useState(false) 
  const componenteRef = useRef<HTMLDivElement>(null)
  const [ultimosPag, setUltimosPag] = useState<Array<UltimosPagProps>>([])
  const [currentPage, setCurrentPage] = useState(0);
  const [filtro, setFiltro] = useState<boolean>(false)
  const {consultores,usuario,permissoes,infoEmpresa} = useContext(AuthContext)
  const [isPrint,setIsPrint] = useState<boolean>(false)


  const itemsPerPage = 25;
  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected)

  }

  const offset = currentPage * itemsPerPage;
  const currentItems = arrayCobranca.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(arrayCobranca.length / itemsPerPage);





  const imprimirRelatorio = useReactToPrint({
    pageStyle:pageStyle,
  onBeforePrint:async()=>{
    setIsPrint(true)
  },
  onAfterPrint:()=>{
    setIsPrint(false)
  },
    contentRef:componenteRef
  })


  useEffect(()=>{
    isPrint && imprimirRelatorio()

  },[isPrint])










 const handleListarCobranca:SubmitHandler<FormProps> = async(data) => {
    setDataicial(data.startDate)
    setDataFinal(data.endDate)
   const {dataIni,dataFim} =  ajustarData(data.startDate, data.endDate)
   
  
      try {
        //console.log(data.status)
        setLoading(true)
        const response = await api.post("/cobranca/lista", {
          dataInicial:dataIni,
          dataFinal:dataFim,
          cobradores:data.cobrador,
          id_empresa:infoEmpresa?.id,
          status: data.status.split(','),
          bairros: data.bairros,
          cidade:data.cidade
        })
        const valor = response.data.cobranca.reduce((acumulador: number, item: CobrancaProps) => {
          return acumulador += Number(item.valor_principal)
        }, 0)
      
        setArrayCobranca(response.data.cobranca)
        setValor(valor)
        setUltimosPag(response.data.ultimosPag)
        setCurrentPage(0)
      } catch (error) {
      //  console.log(error)
        toast.error('Erro na Requisição')
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
          empresa={infoEmpresa?.razao_social??''}
          logo={infoEmpresa?.logoUrl??''}
          cobrador={[]}
          dataFinal={dataFinal}
          dataInicial={dataInicial}
          ultimosPag={ultimosPag}
          usuario={usuario?.nome ?? ''}
        />
      </div>}
      <div className="flex flex-col  w-full  h-[calc(100vh-57px)] ">
      
        
            <div className="flex  ml-auto items-end gap-2 pb-2 mr-3 text-black ">
              <Button 
                variant={'outline'}
                disabled={!permissoes.includes('ADM3.1')}
              size='sm' onClick={() => setFiltro(true)} color='light'>
                <HiFilter  /> FILTRO
              </Button>

              <Button
              variant={'outline'}
              disabled={!permissoes.includes('ADM3.2')}
                size={'sm'}
                onClick={() => imprimirRelatorio()}
               
              ><IoPrint  />IMPRIMIR</Button>
            </div>
         

          <div className="overflow-y-auto max-h-[calc(100vh-162px)] ">
          <Table  hoverable theme={{root:{shadow:'none'}, body: { cell: { base: "px-2 py-0 text-[11px] text-black" } },head:{cell:{base:"bg-gray-50 px-2 py-1  "}} }} 
    >
            <Table.Head >
             
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
            <Table.Body className="divide-y">
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
            </Table>

          </div>


          <div className="flex flex-row justify-between text-black bg-gray-200">

       
              <div className="inline-flex gap-4 ml-2">
                <span   className="whitespace-nowrap text-[12px] ">TOTAL MENSALIDADES: {arrayCobranca.length}</span>

                <span  className="whitespace-nowrap text-[12px]">VALOR: {formatter.format(valorTotal)}</span>
              </div>
          
       { arrayCobranca.length > 0 &&  <div className="flex w-full  justify-end mt-auto pr-8 ">
          <ReactPaginate
              previousLabel={(<IoIosArrowDropleftCircle className="mr-2 h-5 w-5" />)}
              nextLabel={(<IoIosArrowDroprightCircle className="mr-2 h-5 w-5" />)}
              breakLabel={'...'}
              breakClassName="breack-me"
              
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination inline-flex text-gray-600 gap-4 ml-auto justify-end font-sans text-[13px] '}
              activeClassName={'active text-blue-600'}

            />
          </div>}
          </div>
      </div>
   {filtro && <ModalFiltroCobranca cidades={cidades??[]}  inad={false}  empresa={infoEmpresa?.id??''}   selectCobrador={consultores} listarCobranca={handleListarCobranca} loading={loading} setFiltro={setFiltro}  show={filtro} arrayBairros={arrayBairros}/>}
    </div>
  )
}