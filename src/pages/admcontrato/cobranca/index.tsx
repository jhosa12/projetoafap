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
import {useReactToPrint} from "react-to-print";
import { IoPrint } from "react-icons/io5";
import { AuthContext } from "@/contexts/AuthContext";
import ReactPaginate from "react-paginate";
interface CobrancaProps{
    id_mensalidade:number,
    id_contrato:number,
    id_acordo:number,
    referencia:string,
    status:string,
    parcela_n:number,
    vencimento:Date,
    cobranca:Date,
    valor_principal:number,
    associado:{
        nome:string,
        endereco:string,
        bairro:string,
        numero:string,
        cidade:string,
        uf:string,
        guia_rua:string,
        telefone:string,
        celular1:string,
        celular2:string

    }
    
}
interface CobradorProps{
    id_consultor:number,
    nome:string
}
interface UltimosPagProsps{
  id_contrato:number,
  _max:{data_pgto:Date}
}

let formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

export default function Cobranca() {
    const [arrayCobranca,setArrayCobranca] = useState<Array<Partial<CobrancaProps>>>([]);
    const [selectCobrador,setSelectCobrador] = useState<Array<CobradorProps>>([]);
    const [dropCobrador,setDropCobrador]= useState<boolean>(false);
    const [dropBairros,setDropBairros]= useState<boolean>(false);
    const [valorTotal,setValor] = useState<number>(0);
    const [arrayBairros,setArrayBairros] = useState<Array<Partial<{bairro:string,check:boolean}>>>([])
    const [todos,setTodos]= useState(true)
    const [dataInicial,setDataInicial] = useState(new Date())
    const [dataFinal,setDataFinal] = useState(new Date())
    const [loading,setLoading]= useState(false)
    const [reqListaBairros,setReq]= useState<boolean>() 
    const [status,setStatus] = useState<Array<string>>(['A','R'])
    const componenteRef = useRef<Relatorio>(null)
    const {usuario} = useContext(AuthContext)
    const [ultimosPag,setUltimosPag] = useState<Array<UltimosPagProsps>>([])
  const [currentPage,setCurrentPage] =useState(0);
  const itemsPerPage = 20;


  const handlePageClick = (selectedItem:{selected:number})=>{
    setCurrentPage(selectedItem.selected)

  }

  const offset = currentPage*itemsPerPage;
  const currentItems = arrayCobranca.slice(offset,offset+itemsPerPage);
  const pageCount =Math.ceil(arrayCobranca.length/itemsPerPage);





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
      content:()=>componenteRef.current
    })


    useEffect(()=>{
    
      listarBairros()
     
    },[])

    useEffect(()=>{

        listarCobranca()


  
    },[reqListaBairros])
    async function listarBairros() {
        const bairros = await api.get("/bairros");
        const bairrosProps:Array<Partial<{bairro:string,check:boolean}>> = bairros.data
        const checkBairros = bairrosProps.map(item=>{return {...item,check:true}})
        setArrayBairros(checkBairros)
        setReq(true)
    }



    const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {

      const value = e.target.value;
      // Converter o valor para um array de strings
      const selectedValues = value.split(',');
      setStatus(selectedValues);
     
    };


    function handleOptionChange(index:number){

        if(todos){
            return;
        }
        const novoArray = [...arrayBairros]
        novoArray[index].check = !novoArray[index].check
        setArrayBairros(novoArray)

    }

    useEffect(()=>{
        let novoArray
        if(todos){
            novoArray = arrayBairros.map(item=>{return{...item,check:true}})
        }
        if(!todos){
            novoArray = arrayBairros.map(item=>{return {...item,check:false}})
        }
       novoArray &&  setArrayBairros(novoArray)
    },[todos])

    async function listarCobranca() {
     if(arrayBairros.length>0) {  try {
      console.log('CHAMOU')
            setLoading(true)
            const response = await api.post("/cobranca/lista",{
                dataInicial,
                dataFinal,
                status:status,
                bairros:arrayBairros.map(item=>{if(item.check){return item.bairro}}).filter(item=>item!=null)
            })
            const valor = response.data.cobranca.reduce((acumulador:number,item:CobrancaProps)=>{
                  return  acumulador+=Number(item.valor_principal)
            },0)
            console.log(response.data)
            setArrayCobranca(response.data.cobranca)
            setSelectCobrador(response.data.cobrador)
            setValor(valor)
            setLoading(false)
            setUltimosPag(response.data.ultimosPag)
        } catch (error) {
           toast.error('Erro na Requisição')
        }}
        
    }
    return (
        <div className="flex  w-full justify-center p-4">
        <div style={{display:'none'}}>
        <Relatorio 
        ref={componenteRef}
         arrayCobranca={arrayCobranca}
         bairros={arrayBairros}
         cobrador={[]}
         dataFinal={dataFinal}
         dataInicial={dataInicial}
         ultimosPag={ultimosPag}
         status={status}
         todos={todos}
         usuario={usuario?.nome??''}

          />
          </div> 
            <div className="flex flex-col w-full border  rounded-lg shadow  border-gray-700 max-h-[calc(100vh-100px)] ">
                <div className="text-gray-300 bg-gray-800 rounded-t-lg inline-flex items-center p-2 justify-between   ">
                    <h1 className=" text-lg  pl-3 font-medium">Relatórios de Cobrança</h1>
                    <div id="divFiltro" className="inline-flex gap-4">
                    <div>
          <label  className="block mb-1 text-xs font-medium  text-white">DATA INICIAL</label>
          <DatePicker selected={dataInicial} onChange={e=>e && setDataInicial(e)}  dateFormat={"dd/MM/yyyy"} locale={pt}   required className="block uppercase w-full py-[5px] pr-2 pl-2 sm:text-xs  border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div>
          <label  className="block mb-1 text-xs font-medium  text-white">DATA FINAL</label>
          <DatePicker selected={dataFinal} onChange={e=>e && setDataFinal(e)}  dateFormat={"dd/MM/yyyy"} locale={pt}   required className="block uppercase w-full py-[5px] pr-2 pl-2 sm:text-xs  border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="flex flex-col w-2/6">
                  <label className="block mb-1 text-xs font-medium text-white">STATUS</label>
                  <select defaultValue={''} onChange={handleChangeStatus} className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs  text-xs  border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                    <option value={['A','R']} selected>ABERTO/REAGENDADO</option>
                    <option value={['A']} selected>ABERTO</option>
                    <option value={['R']} selected>REAGENDADO</option>
                   
                  </select>
                </div>
              
               
              
                <div className="flex flex-col relative w-2/5">
                <label className="block mb-1 ml-0 text-xs font-medium  text-white">COBRADOR</label>
             
                <button onClick={() => setDropCobrador(!dropCobrador)}
                  className="flex w-full h-full justify-between items-center py-1 pl-2 pr-2 uppercase border rounded-lg  text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">

                 COBRADOR
                  <IoIosArrowDown size={16}/>


                </button>

                {dropCobrador && <ul className="flex flex-col w-full absolute  top-12 z-10 left-0 max-h-64 overflow-y-auto  bg-gray-600 p-1 rounded-lg">
                  <li className="flex items-center px-2 py-1">
                    <input onChange={() => {}} type="checkbox" checked />
                    <label className="ms-2  text-xs whitespace-nowrap  text-gray-300">TODOS</label>
                  </li>
                  {selectCobrador.map((item, index) => {
                    return (
                      <li key={item.id_consultor} className="flex items-center px-2 py-1">
                        <input onChange={() => {}} type="checkbox" checked value={item?.id_consultor} />
                        <label className="ms-2  text-xs whitespace-nowrap  text-gray-300">{item?.nome.toUpperCase()}</label>
                      </li>
                    )
                  })}
                </ul>}



              </div>

              <div className="flex flex-col relative w-2/5">
                <label className="block mb-1 ml-0 text-xs font-medium text-white">BAIRROS</label>
             
                <button onClick={() => setDropBairros(!dropBairros)}
                  className="flex w-full h-full justify-between items-center py-1 pl-2 pr-2 uppercase border rounded-lg  text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">

                 {todos?'TODOS':'PERSONALIZADO'}
                  <IoIosArrowDown size={16}/>


                </button>

                {dropBairros && <ul className="flex flex-col w-full absolute  top-12 z-10 left-0 max-h-64 overflow-y-auto  bg-gray-600 p-1 rounded-lg">
                  <li className="flex items-center px-2 py-1">
                    <input onChange={() => setTodos(!todos)} type="checkbox" checked={todos} />
                    <label className="ms-2  text-xs whitespace-nowrap text-gray-300">TODOS</label>
                  </li>
                  {arrayBairros.map((item, index) => {
                    return (
                      <li key={index} className="flex items-center px-2 py-1">
                        <input onChange={() => handleOptionChange(index)} type="checkbox" checked={item.check} />
                        <label className="ms-2  text-xs whitespace-nowrap text-gray-300">{item?.bairro?.toUpperCase()}</label>
                      </li>
                    )
                  })}
                </ul>}



              </div>
                  <div className="flex   items-end gap-2">
                  <button disabled={loading} onClick={listarCobranca} className="inline-flex text-sm bg-blue-600 p-1 rounded-lg items-center" >{!loading?<span className="inline-flex items-center"><IoSearch/>BUSCAR</span>:<span className="inline-flex items-center gap-1"><AiOutlineLoading3Quarters size={20} className="animate-spin"/>CARREGANDO...</span>}</button>
                    <button
                     onClick={()=>imprimirRelatorio()} 
                     className="inline-flex justify-center items-center text-sm font-medium bg-white text-black p-1 rounded-lg"
                      ><IoPrint  size={18}/>IMPRIMIR</button>
                  </div>
            






                    </div>
           
                    </div>

                    <div className="p-2 max-h-[calc(100vh-150px)]  ">
        <table 
     className="block  overflow-y-auto max-h-[calc(100vh-220px)] text-xs text-left rtl:text-center border-collapse rounded-lg text-gray-400">
        <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
        <tr>
                <th scope="col" className=" px-2 py-1 whitespace-nowrap">
                   REF.
                </th>
                <th scope="col" className="px-5 py-1">
                    VENCIMENTO
                </th>
                <th scope="col" className="px-5 py-1">
                    COBRANÇA
                </th>
                <th scope="col" className="px-5 py-1">
                    TITULAR
                </th>
                <th scope="col" className="px-5 py-1">
                    ENDEREÇO
                </th> 
                <th scope="col" className="px-5 py-1">
                    BAIRRO
                </th> 
                <th scope="col" className="px-5 py-1">
                    STATUS
                </th>
                <th scope="col" className="px-5 py-1">
                    VALOR
                </th>  
                <th scope="col" className="px-4 py-1">
                    AÇÕES
                </th> 
             
            </tr>
            
        </thead>
        <tbody className="text-white">
            {currentItems.map((item,index)=>(
            <tr key={item.id_mensalidade} className="border-b border-gray-500">
            <th scope="row"  className="px-2 py-1 font-medium  whitespace-nowrap">
                   {item.referencia}
            </th>
            <td data-tooltip-id="tooltip-hora" data-tooltip-place="bottom" className="px-6 py-1">
            {item.vencimento && new Date(item.vencimento).toLocaleDateString('pt-BR',{timeZone: 'UTC'})}
            </td>
            <td className="px-5 py-1  ">
            {item.cobranca && new Date(item.cobranca).toLocaleDateString('pt-BR',{timeZone:'UTC'})}
           
            </td>
            <td className="px-5 py-1 w-full whitespace-nowrap ">
            {item.id_contrato}-{item.associado?.nome}
            </td>
            <td className="px-5 py-1 w-full whitespace-nowrap ">
               {item.associado?.endereco}{item.associado?.numero?"-Nº"+item.associado?.numero:''}
            </td>
            <td className=" px-5 py-1 w-full whitespace-nowrap">
               {item.associado?.bairro}
            </td>
            <td className={`px-5 py-1 w-full font-semibold ${item.status==='A'?"text-green-600":'text-red-600'} `}>
               {item.status}
            </td>
            <td className="px-5 py-1 w-full ">
               {item.valor_principal && formatter.format(item.valor_principal)}
            </td>
           
            
            <td className="px-4 py-1 text-right">
                <button onClick={(event)=>{
                              
                             
                            }} className="font-medium  text-blue-500 hover:underline">Edit</button>
            </td>
           </tr>

            ))}
           
        </tbody>
        <tfoot>
            <tr>
                <td colSpan={5} align="right"    className="text-white  font-semibold">TOTAL MENSALIDADES: {arrayCobranca.length}</td>

                <td  align="right"    className="text-white  font-semibold">VALOR: {formatter.format(valorTotal)}</td>
               
                
            </tr>
        </tfoot>
    
    </table>
    <div className="flex w-full justify-end ">
    <ReactPaginate
        previousLabel={'Anterior'}
        nextLabel={'Próximo'}
        breakLabel={'...'}
        breakClassName="breack-me"
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination inline-flex text-gray-400 gap-4 ml-auto justify-end font-semibold  rounded-lg  '}
        activeClassName={'active text-blue-600'}
    
    />
    </div>
    </div>
            </div>
      
        </div>
    )
}