import { api } from "@/services/apiClient"
import { useEffect, useState } from "react"
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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
        guia_rua:string

    }
    
}
interface CobradorProps{
    id_consultor:number,
    nome:string
}

export default function Cobranca() {
    const [arrayCobranca,setArrayCobranca] = useState<Array<Partial<CobrancaProps>>>([]);
    const [selectCobrador,setSelectCobrador] = useState<Array<CobradorProps>>([]);
    const [dropCobrador,setDropCobrador]= useState<boolean>(false);
    const [dropBairros,setDropBairros]= useState<boolean>(false);
    const [valorTotal,setValor] = useState<number>(0);
    const [arrayBairros,setArrayBairros] = useState<Array<Partial<{bairro:string,check:boolean}>>>([])
    const [todos,setTodos]= useState(true)
    const [filtroBairros,setFiltroBairros] = useState<Array<string>>([])
    const [dataInicial,setDataInicial] = useState(new Date())
    const [dataFinal,setDataFinal] = useState(new Date())
    const [loading,setLoading]= useState(false)


    useEffect(()=>{
        listarCobranca()
        listarBairros()
    },[])
    async function listarBairros() {
        const bairros = await api.get("/bairros");
        const bairrosProps:Array<Partial<{bairro:string,check:boolean}>> = bairros.data
        const checkBairros = bairrosProps.map(item=>{return {...item,check:true}})
        setArrayBairros(checkBairros)
    }


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
        try {
            setLoading(true)
            const response = await api.post("/cobranca/lista",{
                dataInicial,
                dataFinal,
                status:[]
            })
            const valor = response.data.cobranca.reduce((acumulador:number,item:CobrancaProps)=>{
                  return  acumulador+=Number(item.valor_principal)
            },0)
            
            setArrayCobranca(response.data.cobranca)
            setSelectCobrador(response.data.cobrador)
            setValor(valor)
            setLoading(false)
        } catch (error) {
           toast.error('Erro na Requisição')
        }
        
    }
    return (
        <div className="flex  w-full justify-center p-4">
            <div className="flex flex-col w-full border  rounded-lg shadow  border-gray-700 ">
                <div className="text-gray-300 bg-gray-800 rounded-t-lg inline-flex items-center p-2 justify-between">
                    <h1 className=" text-lg  pl-3 font-medium">Relatórios de Cobrança</h1>
                    <div id="divFiltro" className="inline-flex gap-4">
                    <div>
          <label  className="block mb-1 text-xs font-medium  text-white">DATA INICIAL</label>
          <DatePicker selected={dataInicial} onChange={e=>e && setDataInicial(e)}  dateFormat={"dd/MM/yyyy"} locale={pt}   required className="block uppercase w-full py-[5px] pr-2 pl-2 sm:text-xs  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div>
          <label  className="block mb-1 text-xs font-medium  text-white">DATA FINAL</label>
          <DatePicker selected={dataFinal} onChange={e=>e && setDataFinal(e)}  dateFormat={"dd/MM/yyyy"} locale={pt}   required className="block uppercase w-full py-[5px] pr-2 pl-2 sm:text-xs  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="flex flex-col w-2/6">
                  <label className="block mb-1 text-xs font-medium text-gray-900 dark:text-white">STATUS</label>
                  <select defaultValue={''} className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs  text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option selected>ABERTO/REAGENDADO</option>
                    <option selected>ABERTO</option>
                    <option selected>REAGENDADO</option>
                   
                  </select>
                </div>
              
               
              
                <div className="flex flex-col relative w-2/5">
                <label className="block mb-1 ml-0 text-xs font-medium text-gray-900 dark:text-white">COBRADOR</label>
             
                <button onClick={() => setDropCobrador(!dropCobrador)}
                  className="flex w-full h-full justify-between items-center py-1 pl-2 pr-2 uppercase border rounded-lg  text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">

                 COBRADOR
                  <IoIosArrowDown size={16}/>


                </button>

                {dropCobrador && <ul className="flex flex-col w-full absolute  top-12 z-10 left-0 max-h-64 overflow-y-auto  bg-gray-600 p-1 rounded-lg">
                  <li className="flex items-center px-2 py-1">
                    <input onChange={() => {}} type="checkbox" checked />
                    <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">TODOS</label>
                  </li>
                  {selectCobrador.map((item, index) => {
                    return (
                      <li key={item.id_consultor} className="flex items-center px-2 py-1">
                        <input onChange={() => {}} type="checkbox" checked value={item?.id_consultor} />
                        <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">{item?.nome.toUpperCase()}</label>
                      </li>
                    )
                  })}
                </ul>}



              </div>

              <div className="flex flex-col relative w-2/5">
                <label className="block mb-1 ml-0 text-xs font-medium text-gray-900 dark:text-white">BAIRROS</label>
             
                <button onClick={() => setDropBairros(!dropBairros)}
                  className="flex w-full h-full justify-between items-center py-1 pl-2 pr-2 uppercase border rounded-lg  text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">

                 {todos?'TODOS':'PERSONALIZADO'}
                  <IoIosArrowDown size={16}/>


                </button>

                {dropBairros && <ul className="flex flex-col w-full absolute  top-12 z-10 left-0 max-h-64 overflow-y-auto  bg-gray-600 p-1 rounded-lg">
                  <li className="flex items-center px-2 py-1">
                    <input onChange={() => setTodos(!todos)} type="checkbox" checked={todos} />
                    <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">TODOS</label>
                  </li>
                  {arrayBairros.map((item, index) => {
                    return (
                      <li key={index} className="flex items-center px-2 py-1">
                        <input onChange={() => handleOptionChange(index)} type="checkbox" checked={item.check} />
                        <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">{item?.bairro?.toUpperCase()}</label>
                      </li>
                    )
                  })}
                </ul>}



              </div>
                  <div className="flex   items-end ">
                  <button disabled={loading} onClick={listarCobranca} className="inline-flex text-sm bg-blue-600 p-1 rounded-lg items-center" >{!loading?<span className="inline-flex items-center"><IoSearch/>BUSCAR</span>:<span className="inline-flex items-center gap-1"><AiOutlineLoading3Quarters size={20} className="animate-spin"/>CARREGANDO...</span>}</button>

                  </div>
            






                    </div>
           
                    </div>

                    <div className="p-2  ">
        <table 
     className="block max-h-[calc(100vh-155px)] overflow-y-auto overflow-x-auto text-xs text-left rtl:text-center border-collapse rounded-lg text-gray-400">
        <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
        <tr>
                <th scope="col" className=" px-2 py-1 whitespace-nowrap">
                    Nº LANC.
                </th>
                <th scope="col" className="px-8 py-1">
                    DATA
                </th>
                <th scope="col" className="px-5 py-1">
                    CONTA
                </th>
                <th scope="col" className="px-5 py-1">
                    C.CUSTOS
                </th>
                <th scope="col" className="px-5 py-1">
                    DOCUMENTO
                </th> 
                <th scope="col" className="px-5 py-1">
                    HISTÓRICO
                </th> 
                <th scope="col" className="px-5 py-1">
                    TIPO
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
            {arrayCobranca.map((item,index)=>(
            <tr key={item.id_mensalidade} className="border-b border-gray-500">
            <th scope="row"  className="px-2 py-1 font-medium  whitespace-nowrap">
                   {item.id_mensalidade}
            </th>
            <td data-tooltip-id="tooltip-hora" data-tooltip-place="bottom" className="px-6 py-1">
            {item.vencimento && new Date(item.vencimento).toLocaleDateString('pt-BR',{timeZone: 'UTC'})}
            </td>
            <td className="px-5 py-1 ">
            {item.cobranca && new Date(item.cobranca).toLocaleDateString('pt-BR',{timeZone:'UTC'})}
           
            </td>
            <td className="px-5 py-1 whitespace-nowrap ">
            {item.associado?.nome}
            </td>
            <td className="px-5 py-1 whitespace-nowrap ">
               {item.associado?.endereco}
            </td>
            <td className=" px-5 py-1 w-full whitespace-nowrap">
               {item.associado?.bairro}
            </td>
            <td className={`px-5 py-1  font-semibold ${item.status==='A'?"text-green-600":'text-red-600'} `}>
               {item.status}
            </td>
            <td className="px-5 py-1 ">
               R${item.valor_principal}
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

                <td  align="right"    className="text-white  font-semibold">VALOR: R${valorTotal}</td>
               
                
            </tr>
        </tfoot>
    
    </table>
    </div>
            </div>
      
        </div>
    )
}