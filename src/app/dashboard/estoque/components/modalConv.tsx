import { IoIosClose } from "react-icons/io";

import { FormEvent} from "react";


interface DadosProps{
    setOpenModal:()=>void
    arrayConv:Array<ConvProps>
    atualizarLista:()=>Promise<void>
    salvarDados:()=>Promise<void>
    dadosProduto:Partial<EstoqueProps>,
    setarDados:(fields:Partial<EstoqueProps>)=>void,
    editarDados:()=>Promise<void> 
    
}

interface ConvProps{
    id_produto:number,
    descricao:string
}

interface EstoqueProps{
    id_estoque:number,
    id_produto:number,
    total:number,
    produto:string,
    tipo:string
    estado:string,
    status:string,
    codProd:string,
    fornecedor:string

}




export function ModalConvEstoque({setOpenModal,arrayConv,salvarDados,dadosProduto,setarDados,editarDados}:DadosProps){
   

  




    const handleSubmit =(event:FormEvent)=>{
        event.preventDefault();

        if(!dadosProduto.id_estoque) salvarDados();
        else editarDados()
    
    }



    return(


        <div  className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full ">
        <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-20 bg-gray-100 ">
        <div className="fixed flex flex-col p-4  w-2/6  max-h-[calc(100vh-150px)] rounded-lg  shadow bg-gray-800">
        <button  type="button" onClick={()=>setOpenModal()} className="absolute cursor-pointer right-0 text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
        <IoIosClose size={30}/>
            </button>
            <form onSubmit={handleSubmit} className="flex flex-col w-full">
            <label className="flex w-full flex-row px-4 py-2 border-b-[1px] rounded-t-lg  text-lg col-start-1 font-semibold whitespace-nowrap gap-2 text-white">ADICIONAR PRODUTO</label>
            <div className="p-2  grid mt-2 gap-2 grid-flow-row-dense grid-cols-2">

            <div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">QUANTIDADE</label>
    <input type="number" value={dadosProduto.total} onChange={e=>{
       setarDados({...dadosProduto,total:Number(e.target.value)})}} className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"></input>

</div>
            <div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">PRODUTO</label>
    <select required defaultValue={dadosProduto.id_produto} onChange={e=>{
      
        const item = arrayConv.find(it=>it.id_produto===Number(e.target.value))
        
        setarDados({...dadosProduto,produto:item?.descricao,id_produto:item?.id_produto})

        }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
            <option value={''}></option>
     {arrayConv.map((item)=>(
        <option value={item.id_produto} key={item.id_produto}>{item.descricao}</option>
     ))}
      

    </select>

</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">FORNECEDOR</label>
    <input required value={dadosProduto.fornecedor} onChange={e=>{
       setarDados({...dadosProduto,fornecedor:e.target.value.toUpperCase()}) }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
  
    </input>

</div>





<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">ESTADO DO PRODUTO</label>
    <select required defaultValue={dadosProduto.estado} onChange={e=>{
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
            <button type="submit"  className="ml-auto my-1 rounded-lg mr-1 text-white font-semibold p-1 bg-blue-600">SALVAR</button>
            </form>
            </div>
            </div>
            </div>

    )
   
}