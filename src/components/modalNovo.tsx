
import { FormEvent } from "react";
import { IoIosClose } from "react-icons/io";
import React from 'react';

interface PremiosProps{
    id_produto:string,
    descricao: string,
    unidade: string,
    valor_custo: number,
    quantidade:number,
    situacao: string,
    grupo: string,
    tipo: string,
    openModal:boolean
}
interface CadastroProps{
    cadastroPremio : ()=>Promise<void>
    setarDadosPremios: (fields:Partial<PremiosProps>)=>void
    dadosPremio:Partial<PremiosProps>
}

export default function ModalNovo({cadastroPremio,setarDadosPremios,dadosPremio}:CadastroProps){




    function teste(event:FormEvent){
        event.preventDefault();
       cadastroPremio()
    }
    return(
        <div className="fixed top-0 right-0 left-0 z-50 w-full h-[100%] max-h-full">
            <div className="flex h-full justify-center items-center">
            <div className="fixed flex flex-col  w-2/4 max-h-[500px] min-h-min rounded-lg shadow bg-gray-700">
                <button  type="button" onClick={()=>setarDadosPremios({...dadosPremio,openModal:false})} className="absolute cursor-pointer right-0 text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
    <IoIosClose size={30}/>
        </button>
        <form onSubmit={teste}>
        <div className="p-2   border-gray-600 grid mt-2 gap-2 grid-flow-row-dense grid-cols-4">
        <div className=" col-span-4">
<label className="flex flex-row text-nowrap w-full pl-2  border-b-[1px]  text-lg col-start-1 font-semibold  gap-2 text-white">CADASTRAR NOVO PRÊMIO</label>
</div>

<div className="mb-1 col-span-2">
    <label  className="block mb-1 text-xs font-medium  text-white">PRÊMIO</label>
    <input value={dadosPremio.descricao} onChange={(e)=>{setarDadosPremios({...dadosPremio,descricao:e.target.value.toUpperCase()})}} type="text" placeholder="Descrição do Prêmio" className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">QUANTIDADE</label>
    <input value={dadosPremio.quantidade} onChange={(e)=>{setarDadosPremios({...dadosPremio,quantidade:Number(e.target.value)})}} type="number" placeholder="Quantidade" className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-white">EMPRESA</label>
    <input value={dadosPremio.situacao} onChange={(e)=>{setarDadosPremios({...dadosPremio,situacao:e.target.value})}} type="text" placeholder="Quantidade" className="block w-full  pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
</div>

<div className="flex col-span-4 justify-center">
            <button type="submit" className="rounded-lg bg-blue-600 p-1 font-semibold ">SALVAR</button>
     </div>

</div>
</form>
            </div>
            </div>
        </div>
    )
}