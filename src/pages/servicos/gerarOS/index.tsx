
import { api } from "@/services/apiClient";
import { use, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/AuthContext";
import { IoMdSearch } from "react-icons/io";

interface ArrayProps{
    descricao:string ;
    valor_unit:number | null,
    quantidade:number | null ,
    desconto:number |null ,
    acrescimo:number |null,
    valor_total:number  | null

}
interface CheckListProps{
    id_check: number,
	descricao: string,
    status:boolean
}
interface ListaProdutos{
    
		id_produto: number,
		descricao: string,
		unidade: string,
		valor_custo: number,
		valor_venda: number,
		quantidade: number,
		margem_lucro: number,
		valor_aluguel:number,
		est_inicial: number,
		est_entradas: number,
	    est_saidas: number,
		est_saldo: number,
		situacao: string,
		data_inc: Date,
		grupo: string,
		tipo: string,
		taxa_conval:number
}


export default function GerarOS(){
    
    const {usuario}= useContext(AuthContext)
    const [falecido,setFalecido] =useState(true);
    const [declarante,setDeclarante] =useState(false);
    const [dadosObito,setObito] = useState(false);
    const [produtos,setProdutos] = useState(false);
    const [velorio,setVelorio] =useState(false);
    const [checagem,setChecagem] =useState(false);
   const[listaProduto,setListaProdutos] =useState<Partial<ArrayProps>>({descricao:''})
    const [arrayProdutos,setArrayProdutos]=useState<Array<Partial<ArrayProps>>>([]);
    const [checkList,setCheckList]=useState<Array<CheckListProps>>([])
    const [selectProdutos,setselectProdutos]=useState<Array<ListaProdutos>>([])



    function setarProdutos(fields:Partial<ArrayProps>){
        setListaProdutos((prev:Partial<ArrayProps>)=>{
            if(prev){
                return {...prev,...fields}
            }
            else{
                return {...fields}
            }

        })
        
    }
  useEffect(()=>{
    setListaProdutos({acrescimo:null,desconto:null,descricao:'',quantidade:null,valor_total:null,valor_unit:null})

  },[arrayProdutos])
    
    useEffect(()=>{
        try{
         listarProdutos() 
         carregarCheckList()
          
        }catch(err){
           toast.error('Erro ao Listar CheckList')
        }
     },[])



async function listarProdutos() {
    const response = await api.get("/obitos/listarProdutos")
    console.log(response.data)
    setselectProdutos(response.data)
    
}




async function carregarCheckList() {
    const response = await api.get("/obitos/listarCheckList")
    setCheckList(response.data)
    
}
    function alterCheckList(index:number){
     const novoArray = [...checkList];
     novoArray[index].status = !novoArray[index].status
     setCheckList(novoArray)
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
            <button  type="button" onClick={()=>{setFalecido(true), setDeclarante(false),setObito(false),setProdutos(false),setVelorio(false),setChecagem(false)}}   className="inline-block p-4 font-semibold rounded-ss-lg  bg-gray-800 hover:bg-gray-700 text-blue-500">Falecido</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setFalecido(false), setDeclarante(true),setObito(false),setProdutos(false),setVelorio(false),setChecagem(false)}}    className="inline-block p-4  hover:bg-gray-700 hover:text-gray-300">Declarante</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setFalecido(false), setDeclarante(false),setObito(true),setProdutos(false),setVelorio(false),setChecagem(false)}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Dados do Óbito</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setFalecido(false), setDeclarante(false),setObito(false),setProdutos(true),setVelorio(false),setChecagem(false)}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Produtos e Serviços</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setFalecido(false), setDeclarante(false),setObito(false),setProdutos(false),setVelorio(true),setChecagem(false)}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Velório</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setFalecido(false), setDeclarante(false),setObito(false),setProdutos(false),setVelorio(false),setChecagem(true)}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">CheckLists</button>
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
    <div className="flex flex-row text-white gap-6 w-full">
       <div>
          <label   className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
            <select defaultValue={listaProduto.descricao} onChange={e=>{
                const item = selectProdutos.find((item)=>item.id_produto===Number(e.target.value))
                setarProdutos({descricao:item?.descricao,valor_unit:item?.valor_venda})

            }} className="block w-full pb-1 pt-1 pr-2 pl-2 appearance-none text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
             <option value={''}></option>
              {selectProdutos.map((item,index)=>{
                return(
                    <option key={item.id_produto} value={item.id_produto}>{item.descricao}</option>
                )

              })}
             
            </select>
          </div>
          <div>
          <label  className="block mb-1 text-sm font-medium  text-white">Valor Unit.</label>
          <input value={Number(listaProduto.valor_unit)} onChange={(e)=>setarProdutos({valor_unit:Number(e.target.value)})} autoComplete='off'  type="text"  className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div>
          <label  className="block mb-1 text-sm font-medium  text-white">Quantidade</label>
          <input value={Number(listaProduto.quantidade)} onChange={(e)=>setarProdutos({quantidade:Number(e.target.value)})} autoComplete='off'  type="text"  className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div>
          <label  className="block mb-1 text-sm font-medium  text-white">Desconto</label>
          <input value={Number(listaProduto.desconto)} onChange={(e)=>setarProdutos({desconto:Number(e.target.value)})} autoComplete='off'  type="text"  className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div>
          <label  className="block mb-1 text-sm font-medium  text-white">Acrescimo</label>
          <input value={Number(listaProduto.acrescimo)} onChange={(e)=>setarProdutos({acrescimo:Number(e.target.value)})} autoComplete='off'  type="text"  className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div>
          <label  className="block mb-1 text-sm font-medium  text-white">Total</label>
          <input value={Number(listaProduto.valor_total)} onChange={(e)=>setarProdutos({valor_total:Number(e.target.value)})}  autoComplete='off'  type="text"  className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
          </div>
          <div className="flex items-end">
          <button onClick={()=>{
            
            const novoArray = [...arrayProdutos];
            novoArray.push(listaProduto)
            setArrayProdutos(novoArray)
            
            
            }}
             className="flex bg-blue-600 p-1 pl-2 pr-2 rounded-lg ">Adicionar</button>
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
                {arrayProdutos?.map((item,index)=>(
               <tr key={index}  className={ `border-b bg-gray-800 border-gray-700  hover:bg-gray-600`}>
                  <td className="px-2 py-1">
                {item.descricao}
                </td> 
                <td className="px-2 py-1">
                {item.valor_unit}
                </td> 
                <td className="px-2 py-1">
                {item.quantidade}
                </td> 
                <td className="px-2 py-1">
                {item.desconto}
                </td> 
                <td className="px-2 py-1">
                {item.acrescimo}
                </td> 
                <td className="px-2 py-1">
                {item.valor_total}
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


{velorio &&  <div className="rounded-lg p-6 grid grid-flow-row-dense grid-cols-4 gap-6  h-full">
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
        <div className="flex flex-row gap-x-4 col-span-1 ">
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">Data de Saída</label>
            <input  className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div>
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">Hora de Saída</label>
            <input  className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div>
        </div>
        <div className="flex flex-row gap-x-4 col-span-1 ">
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">Data de Retorno</label>
            <input  className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div>
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">Hora de Retorno</label>
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
   
      
        }

        {checagem &&  <div className="flex flex-row w-full justify-around rounded-lg p-2   gap-6">    <div className="flex flex-col overflow-y-auto w-1/3 text-white p-2 gap-2 rounded-md bg-gray-600 mt-1 mb-1 max-h-[calc(100vh-250px)] ">
        <h1 className="border-b-[1px] border-gray-500">Checklist Saída</h1>
        <ul className="flex flex-col gap-2">
           {checkList.map((item,index)=>{
            return(
<li  className="flex items-center "> 
    <input checked={item.status} onChange={()=>alterCheckList(index)} type="checkbox" value="" className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600"/>
    <label  className="ms-2 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-300">{item.descricao}</label>
            </li>
            )
           }) }
        </ul>

    </div>

    <div className="flex flex-col overflow-y-auto w-1/3 text-white p-2 gap-2 rounded-md bg-gray-600 mt-1 mb-1 max-h-[calc(100vh-250px)] ">
        <h1 className="border-b-[1px] border-gray-500">Checklist Retorno</h1>
        <ul className="flex flex-col gap-2">
           {checkList.map((item,index)=>{
            return(
<li  className="flex items-center "> 
    <input checked={item.status} onChange={()=>alterCheckList(index)} type="checkbox" value="" className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600"/>
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