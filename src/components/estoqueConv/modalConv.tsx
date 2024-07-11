import { IoIosClose } from "react-icons/io";

import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import { AuthContext } from "@/contexts/AuthContext";
import {nanoid} from 'nanoid'

interface DadosProps{
    openModal:boolean,
    setOpenModal:()=>void
    arrayConv:Array<ConvProps>
}

interface ConvProps{
    id_produto:number,
    descricao:string

}

interface EstoqueProps{
    quantidade:number,
    produto:string,
    estado:string,
    status:string,
    codProd:string

}


export function ModalConvEstoque({openModal,setOpenModal,arrayConv}:DadosProps){
    const {usuario} = useContext(AuthContext)

    const [dadosProduto,setDados] = useState<Partial<EstoqueProps>>({quantidade:1,status:'ABERTO'})

    const setarDados = (fields:Partial<EstoqueProps>)=>{
        setDados((prev:Partial<EstoqueProps>)=>{
            if(prev){
                return {...prev,...fields}
            }else{
                return {...fields}
            }

        })

    }


  

async function salvarDados() {
    const arrayProd:Array<EstoqueProps> =[]
    if(dadosProduto.quantidade)
    for(let i=0;i<dadosProduto.quantidade;i++){
            const codProd = nanoid(10)
        arrayProd.push({
            estado:dadosProduto.estado??'',
            codProd,
            produto:dadosProduto.produto??'',
            quantidade:1,
            status:dadosProduto.status??''
        })

    }

  await  toast.promise(
        api.post('/estoque/estoqueConv',{
            array:arrayProd,
            id_usuario:usuario?.id
        }),
        {
            error:'ERRO NA REQUISIÇÃO',
            pending:'SALVANDO DADOS.....',
            success:'DADOS SALVOS COM SUCESSO'
        }
    )
 

    
}




    return(


        <div  className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full ">
        <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-20 bg-gray-100 ">
        <div className="fixed flex flex-col  w-2/6  max-h-[calc(100vh-150px)] rounded-lg  shadow bg-gray-800">
        <button  type="button" onClick={()=>setOpenModal()} className="absolute cursor-pointer right-0 text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
        <IoIosClose size={30}/>
            </button>
            <form className="flex flex-col w-full">
            <label className="flex w-full flex-row px-4 py-2 border-b-[1px] rounded-t-lg  text-lg col-start-1 font-semibold whitespace-nowrap gap-2 text-white">ADICIONAR PRODUTO</label>
            <div className="p-2  grid mt-2 gap-2 grid-flow-row-dense grid-cols-2">

            <div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">QUANTIDADE</label>
    <input type="number" value={dadosProduto.quantidade} onChange={e=>{
       setarDados({...dadosProduto,quantidade:Number(e.target.value)})}} className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"></input>

</div>
            <div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">PRODUTO</label>
    <select  defaultValue={dadosProduto.produto} onChange={e=>{
        setarDados({...dadosProduto,produto:e.target.value})
        }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
            <option value={''}></option>
     {arrayConv.map((item)=>(
        <option value={item.descricao} key={item.id_produto}>{item.descricao}</option>
     ))}
      

    </select>

</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">ESTADO DO PRODUTO</label>
    <select  defaultValue={dadosProduto.estado} onChange={e=>{
       setarDados({...dadosProduto,estado:e.target.value}) }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
         <option value={''}></option>
    <option value={'NOVO'}>NOVO</option>
    <option value={'USADO'}>USADO</option>
    </select>

</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">STATUS</label>
    <select  defaultValue={dadosProduto.status} onChange={e=>{
        setarDados({...dadosProduto,status:e.target.value})}} className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
         
    <option value={'ABERTO'}>ABERTO</option>
    <option value={'FECHADO'}>FECHADO</option>
      

    </select>

</div>
            </div>
            <button type="button" onClick={salvarDados} className="ml-auto my-1 rounded-lg mr-1 text-white font-semibold p-1 bg-blue-600">SALVAR</button>
            </form>
            </div>
            </div>
            </div>

    )
   
}