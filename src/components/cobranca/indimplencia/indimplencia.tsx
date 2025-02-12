import { api } from "@/services/apiClient";
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print";
import { IoPrint } from "react-icons/io5";
import { AuthContext } from "@/contexts/AuthContext";
import ReactPaginate from "react-paginate";
import { HiFilter } from "react-icons/hi";
import { Badge, Table } from "flowbite-react";
import { ModalFiltroCobranca } from "@/components/cobranca/modalCobranca";
import { SubmitHandler } from "react-hook-form";
import { ConsultoresProps } from "@/types/consultores";
import useApiPost from "@/hooks/useApiPost";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import RelatorioInadimplencia from "@/Documents/relatorioCobranca/RelatorioIndimplencia";
import { Button } from "@/components/ui/button";
import { ajustarData } from "@/utils/ajusteData";




export interface InadimplenciaProps{
  associado:{
    nome:string,
    endereco:string,
    bairro:string,
    celular1:string,
    celular2:string,
    numero:string,
    cidade:string,
    guia_rua:string
  },
  mensalidade:Array<{valor_principal:number,referencia:string}>
  overdueCount:number,//numero de mensalidades vencidas
  totalOverdueAmount:number // Valor total das mensalidades vencidas
  lastPaidPayment:Date,
  cobranca:Date,
}


interface ReqProps{
    id_empresa:string
    n_parcelas:number,
    param:string,
    startDate:Date,
    endDate:Date,
    status:Array<string>,
    bairros:Array<string>
  }

interface ContagemProps{
    n1:number,
    n2:number,
    n3:number,
    nn:number
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





export interface UltimosPagProsps {
  id_contrato: number,
  _max: { data_pgto: Date }
}

let formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});




export  function Inadimplencia() {

  const [arrayBairros, setArrayBairros] = useState<Array<Partial<{ bairro: string, check: boolean,id_empresa:string }>>>([])
  const componenteRef = useRef<RelatorioInadimplencia>(null)
  const [currentPage, setCurrentPage] = useState(0);
  const [filtro, setFiltro] = useState<boolean>(false)
  const {consultores,selectEmp,permissoes,usuario} = useContext(AuthContext)
  const [isPrint,setIsPrint] = useState<boolean>(false)
  const [cont,setContagem] = useState<ContagemProps>()



  const {data,loading,postData}= useApiPost<Array<InadimplenciaProps>,ReqProps>('/cobranca/inadimplencia')


  const itemsPerPage = 19;
  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected)

  }

const contagem = useCallback(() => {
if(data){

  setContagem({
    n1:data.filter(item=>item.overdueCount===1).length,
    n2:data.filter(item=>item.overdueCount===2).length,
    n3:data.filter(item=>item.overdueCount===3).length,
    nn:data.filter(item=>item.overdueCount>3).length
  })
}

},[data])

useEffect(()=>{
   contagem() 
},[data])









  const offset = currentPage * itemsPerPage;
  const currentItems = data?.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil((data?.length ?? 0) / itemsPerPage);

  const imprimirRelatorio = useReactToPrint({
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



  const handleInadimplencia:SubmitHandler<FormProps> = async (data) => {

    
   
       // console.log(data)
    postData({
      startDate:data.periodo?new Date('1900-01-01'):data.startDate,
      endDate:data.periodo?new Date():data.endDate,
      id_empresa:selectEmp,
      //cobradores:watch('cobrador').filter(item=>item.check).map(item=>item.nome),
     // bairros:watch('bairros').map(item => { if (item.check) { return item.bairro } }).filter(item => item != null),
      n_parcelas:Number(data.numeroParcelas),
     // radio:watch('radio'),
     // status:watch('status'),
     // periodo:watch('periodo'),
     status:data.status.split(',').map(item=>item.trim()),
      param:data.param_nparcela,
      bairros:data.bairros.map(item => { if (item.check) { return item.bairro } }).filter(item => item != null),
    })
        
    }



  return (
    <div className="flex  w-full justify-center ">
      <div style={{ display: 'none' }}>
        <RelatorioInadimplencia usuario={usuario?.nome} dados={data??[]} ref={componenteRef} />
      </div>
 
      <div className="flex flex-col w-full h-[calc(100vh-100px)] ">
      
        <div className="flex flex-row w-full justify-between items-end p-2">
         <div className="inline-flex gap-4">
         <Badge  color="success" >1 Mensalidade: {cont?.n1}</Badge>
         <Badge color="info" >2 Mensalidades: {cont?.n2}</Badge>
         <Badge color="warning" >3 Mensalidades: {cont?.n3}</Badge>
         <Badge color="red" >Mais de 3: {cont?.nn}</Badge>
        </div>   
       
        <div className="flex items-end gap-2 text-black">
              <Button 
              variant={'outline'}
                disabled={!permissoes.includes('ADM3.1')}
              size='sm' onClick={() => setFiltro(true)} color='light'>
                <HiFilter /> FILTRO
              </Button>
              <Button
              variant={'outline'}
              disabled={!permissoes.includes('ADM3.2')}
                size={'sm'}
                onClick={() => imprimirRelatorio()}
               
              ><IoPrint  />IMPRIMIR</Button>
            </div>
        </div>
         
         

          <div className="overflow-y-auto p-2 max-h-[70vh] ">
          <Table  hoverable theme={{root:{shadow:'none'}, body: { cell: { base: "px-3 py-1 text-[11px] " } } }} 
    >
            <Table.Head theme={{cell:{base:"bg-gray-50 px-3 py-1 "}}}>
             
                <Table.HeadCell>
                  TITULAR
                </Table.HeadCell>
                <Table.HeadCell>
                  ENDEREÇO
                </Table.HeadCell>
                <Table.HeadCell>
                  GUIA DE RUA
                </Table.HeadCell>
                <Table.HeadCell>
                  TELEFONES
                </Table.HeadCell>
                <Table.HeadCell>
                  COBRANÇA
                </Table.HeadCell>
                <Table.HeadCell >
                  ULT. PAG
                </Table.HeadCell>
                <Table.HeadCell >
                  PARCELAS
                </Table.HeadCell>
                <Table.HeadCell >
                  VALOR
                </Table.HeadCell>
           
             
            </Table.Head>
            <Table.Body className="divide-y  text-black ">
              {currentItems?.map((item, index) => (
                <Table.Row key={index} >
                  <Table.Cell scope="row" >
                    {item.associado.nome}
                  </Table.Cell>
                  <Table.Cell data-tooltip-id="tooltip-hora" data-tooltip-place="bottom" >
                    {item.associado.endereco}{item.associado.numero ? "-Nº" + item.associado.numero : ''}
                  </Table.Cell>
                  <Table.Cell >
                    {item.associado.guia_rua}

                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap" >
                    {item.associado.celular1}
                  </Table.Cell>
                  <Table.Cell >
                   {item.cobranca && new Date(item.cobranca).toLocaleDateString('pt-BR',{timeZone:'UTC'})}
                  </Table.Cell>
                  <Table.Cell >
                    {item.lastPaidPayment && new Date(item.lastPaidPayment).toLocaleDateString('pt-BR',{timeZone:'UTC'})}
                  </Table.Cell>
                  <Table.Cell >
                    {item.overdueCount}
                  </Table.Cell>
                  <Table.Cell >
                    {Number(item.totalOverdueAmount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Table.Cell>
                 
                



                </Table.Row>

              ))}

</Table.Body>
          

            </Table>

          </div>
    
          <div className="flex flex-row justify-between text-black">

       
<div className="inline-flex gap-4 ml-2">
  <span   className="whitespace-nowrap font-sans text-[12px]  ">CONTRATOS: {data?.length}</span>

  <span  className="whitespace-nowrap  font-sans text-[12px]">MENSALIDADES: {data?.reduce((total, item) => total + item.overdueCount, 0)}</span>

  <span  className="whitespace-nowrap  font-sans text-[12px]">VALOR: {data?.reduce((total, item) => total + item.totalOverdueAmount, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>




</div>



{data &&<div className="flex w-full  justify-end mt-auto pr-8 ">
<ReactPaginate
previousLabel={(<IoIosArrowDropleftCircle className="mr-2 h-5 w-5" />)}
nextLabel={(<IoIosArrowDroprightCircle className="mr-2 h-5 w-5" />)}
breakLabel={'...'}
breakClassName="breack-me"
pageCount={pageCount}
marginPagesDisplayed={2}
pageRangeDisplayed={5}
onPageChange={handlePageClick}
containerClassName={'pagination inline-flex text-gray-600 gap-4 ml-auto justify-end   rounded-lg  font-sans text-[13px] '}
activeClassName={'active text-blue-600'}

/>
</div>}
</div>
       
      </div>
   {filtro && <ModalFiltroCobranca inad={true}  setArrayBairros={setArrayBairros}  empresa={selectEmp}   selectCobrador={consultores} listarCobranca={handleInadimplencia} loading={loading} setFiltro={setFiltro}  show={filtro} arrayBairros={arrayBairros}/>}
    </div>
  )
}