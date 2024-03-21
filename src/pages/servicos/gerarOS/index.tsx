
import { api } from "@/services/apiClient";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/AuthContext";
import { IoMdSearch } from "react-icons/io";

interface ArrayProps{
    id:number
}
interface CheckListProps{
    id_check: number,
	descricao: string,
}


export default function GerarOS(){
    
    const {usuario}= useContext(AuthContext)
    const [falecido,setFalecido] =useState(true);
    const [declarante,setDeclarante] =useState(false);
    const [dadosObito,setObito] = useState(false);
    const [produtos,setProdutos] = useState(false);
    const [velorio,setVelorio] =useState(false)
    const [array,setArray]=useState<Array<ArrayProps>>([])
    const [checkList,setCheckList]=useState<Array<CheckListProps>>([])
    useEffect(()=>{
        try{
            
         carregarCheckList()
          
        }catch(err){
           toast.error('Erro ao Listar CheckList')
        }
     },[])

async function carregarCheckList() {
    const response = await api.get("/obitos/listarCheckList")
    setCheckList(response.data)
    
}




    return(
        <>
        <div className="flex flex-col w-full pl-10 pr-10 pt-4">
            <div className="flex flex-row p-2 border-b-[1px] border-gray-600">
            <h1 className="flex w-full  text-gray-300 font-semibold text-2xl ">Gerar Ordem de Serviço</h1>
            <div className="flex flex-row gap-8">
            <div className="flex items-center ">
    <input  type="checkbox" value="" className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600"/>
    <label  className="ms-2 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-300">PARTICULAR</label>
</div>
            <button onClick={()=>{}} type="button" className=" border font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center focus:ring-gray-600 bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
        <IoMdSearch size={20}/>
        Buscar
    </button> 
    </div>
            </div>
            <div className="flex-col w-full border mt-2 rounded-lg shadow  border-gray-700">
            <ul className="flex flex-wrap text-sm font-medium text-center  border-b   rounded-t-lg  border-gray-700 text-gray-400 bg-gray-800"  role="tablist">
        <li className="me-2">
            <button  type="button" onClick={()=>{setFalecido(true), setDeclarante(false),setObito(false),setProdutos(false),setVelorio(false)}}   className="inline-block p-4 font-semibold rounded-ss-lg  bg-gray-800 hover:bg-gray-700 text-blue-500">Falecido</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setFalecido(false), setDeclarante(true),setObito(false),setProdutos(false),setVelorio(false)}}    className="inline-block p-4  hover:bg-gray-700 hover:text-gray-300">Declarante</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setFalecido(false), setDeclarante(false),setObito(true),setProdutos(false),setVelorio(false)}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Dados do Óbito</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setFalecido(false), setDeclarante(false),setObito(false),setProdutos(true),setVelorio(false)}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Produtos e Serviços</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setFalecido(false), setDeclarante(false),setObito(false),setProdutos(false),setVelorio(true)}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Velório</button>
        </li>
    </ul>
   {falecido && <div className="rounded-lg p-6 grid grid-flow-row-dense grid-cols-4 gap-6">
    <div className="flex flex-col col-span-1">
            <label  className="block  text-xs font-medium  text-white">Nome do Falecido</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Data Nascimento</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Religião</label>
            <select  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs bg-[#0f172a] border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
                <option value="">CATÓLICA</option>
                <option value="">EVANGÉLICA</option>
            </select>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Sexo</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">RG</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">CPF</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Estado Civil</label>
            <select  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
                <option value="">CATÓLICA</option>
                <option value="">EVANGÉLICA</option>
            </select>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Certidão de Casamento</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Conjuge</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Naturalidade</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Profissão</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Nacionalidade</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Tipo de Inumado</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Cemitério</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Endereço do Cemitério</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
        
        </div>
        <div className="flex gap-2 text-gray-400 justify-center items-center  col-span-4">
            <span>Endereço</span>
        <div className="border-b-[1px] w-full border-gray-600"></div>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Endereço</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Número</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Bairro</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-row gap-x-4 col-span-1 ">
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">Cidade</label>
            <input  className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div>
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">UF</label>
            <input  className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div>
           
        </div>
      
        </div>}



        {declarante && <div className="rounded-lg p-6 grid grid-flow-row-dense grid-cols-4 gap-6">
    <div className="flex flex-col col-span-1">
            <label  className="block  text-xs font-medium  text-white">Nome do Declarante</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">CPF/CNPJ</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
    
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">RG</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>

        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Endereço</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
      
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Numero</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Bairro</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Complemento</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-row gap-x-4 col-span-1 ">
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">Cidade</label>
            <input  className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div>
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">UF</label>
            <input  className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div>
           
        </div>
        </div>}



        {dadosObito && <div className="rounded-lg p-6 grid grid-flow-row-dense grid-cols-4 gap-6">
    <div className="flex flex-col col-span-1">
            <label  className="block  text-xs font-medium  text-white">Data do Falecimento</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Local do Falecimento</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
    
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Hora do falecimento</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>

        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Hora da Solicitação</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
      
        <div className="flex flex-col col-span-3 ">
            <label  className="block  text-xs font-medium  text-white">Laudo Médico (Causa Morte)</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Número da D.O.</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Nome do Médico</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">CRM</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
    
     
        <div className="flex flex-row gap-x-4 col-span-1 ">
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">Data Sepultamento</label>
            <input  className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div>
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">Hora Sepultamento</label>
            <input  className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div> 
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Tipo</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Local do Velório</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-row gap-x-4 col-span-1 ">
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">Data Velório</label>
            <input  className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div>
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">Hora Valório</label>
            <input  className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div> 

        </div>
        <div className="flex flex-col col-span-3 ">
            <label  className="block  text-xs font-medium  p-1 text-white">Observações</label>
            <textarea  rows={3} className="whitespace-nowrap uppercase rounded-lg  py-1 px-2 w-full text-xs  bg-transparent border-2   text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</textarea>
        </div>
        </div>}



        {produtos && <div className="flex flex-col w-full rounded-lg p-6   gap-6">
    <div className="flex flex-row gap-6 w-full">
       <div>
          <label   className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
            <select  className="block w-full pb-1 pt-1 pr-2 pl-2 appearance-none text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option   selected></option>
              <option   value="M">MASCULINO</option>
              <option   value="F">FEMININO</option>
            </select>
          </div>
          <div>
          <label  className="block mb-1 text-sm font-medium  text-white">Valor Unit.</label>
          <input autoComplete='off'  type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div>
          <label  className="block mb-1 text-sm font-medium  text-white">Quantidade</label>
          <input autoComplete='off'  type="number" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div>
          <label  className="block mb-1 text-sm font-medium  text-white">Desconto</label>
          <input autoComplete='off'  type="number" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div>
          <label  className="block mb-1 text-sm font-medium  text-white">Acrescimo</label>
          <input autoComplete='off'  type="number" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div>
          <label  className="block mb-1 text-sm font-medium  text-white">Total</label>
          <input autoComplete='off'  type="number" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          </div>
          <div className="flex">
          <table 
         className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
            <thead className="sticky top-0 text-sm  uppercase bg-gray-700 text-gray-400">
                <tr>
                    <th scope="col" className=" px-2 py-1">
                        Descrição Item
                    </th>
               
                    <th scope="col" className="px-4 py-1">
                        Valor Unit.
                    </th>
                    <th scope="col" className="px-4 py-1">
                        Quantidade
                    </th>
                    <th scope="col" className="px-4 py-1">
                        Desconto
                    </th>
                    <th scope="col" className="px-4 py-1">
                        Acrescimo
                    </th>
                    <th scope="col" className="px-4 py-1">
                        Valor Total
                    </th>
                    <th scope="col" className="px-10 py-1">
                        <span >AÇÕES</span>
                    </th>
                </tr> 
            </thead>
            <tbody>
                {array?.map((item,index)=>(
               <tr key={index}  className={ `border-b bg-gray-800 border-gray-700  hover:bg-gray-600`}>
                  <td className="px-2 py-1">
                {item.id}
                </td> 
              
                <td className="px-10 py-1 inline-flex text-right gap-2">
                    <button  className="font-semibold rounded-lg bg-blue-600 px-2 py-1 text-white hover:underline"></button>
                    <button className=" rounded-lg bg-red-600 px-1 py-1 text-white hover:underline"></button>
                </td>
               
               </tr>
               ))}
    
                
               
            </tbody>
        
        </table>
        </div>
        </div>
        
        }


{velorio && <div className="flex w-full p-2"> <div className="rounded-lg p-6 grid grid-flow-row-dense grid-cols-3 gap-4  h-full">
    <div className="flex flex-col col-span-1">
            <label  className="block  text-xs font-medium  text-white">Endereço do Velório</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Número</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
    
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Bairro</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-2 ">
            <label  className="block  text-xs font-medium  text-white">Ponto de Referência</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-row gap-x-4 col-span-1 ">
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">Cidade</label>
            <input  className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div>
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">UF</label>
            <input  className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div>
           
        </div>

        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Copeira</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
      
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Enfermeira</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Veiculo Retirada</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Veiculo Cortejo</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
     
        </div>
        <div className="flex flex-col overflow-y-auto w-1/3 text-white p-2 gap-2 rounded-md bg-gray-600 mt-1 mb-1 max-h-[calc(100vh-250px)] ">
        <h1 className="border-b-[1px] border-gray-500">Checklist</h1>
        <ul className="flex flex-col gap-2">
           {checkList.map((item,index)=>{
            return(
<li className="flex items-center "> 
    <input  type="checkbox" value="" className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600"/>
    <label  className="ms-2 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-300">{item.descricao}</label>
            </li>
            )
           }) }
        </ul>

    </div>
        </div>
        }



    </div>
   
 
    
        </div>
        </>
    )
}