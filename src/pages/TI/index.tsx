import { useEffect, useState } from "react"
import { toast } from "react-toastify"
interface IdeiasProps{
    id_ideia:number,
    descricao:string,
    data_post:Date,
    status:string
}

export default function TiArea(){
    const [arrayIdeias,setIdeias]= useState<Array<IdeiasProps>>([])
   
    return(
        <div className="flex w-full h-screen ml-2 mt-2 gap-2 ">
            <div className="flex flex-col w-1/4 gap-2 ">
            <textarea placeholder="Digite aqui as ideias e sugestões!" className=" h-2/3 text-sm p-2 rounded-lg  border-0 bg-gray-800 focus:ring-0 text-white placeholder-gray-400" />
               <button className=" p-2  text-white font-semibold rounded-lg bg-blue-600">LANÇAR</button>
            </div>
            <div className="flex flex-row  w-full h-3/4 gap-2 mr-4 ">
            <div className="flex flex-col items-center overflow-y-auto w-full rounded-lg border-[1px] border-gray-400 p-2 bg-gray-700">
                    <h1 className=" text-white uppercase font-semibold">Sugestões/Ideias Pendentes</h1>
                    <ul>

                    <li></li>

                    </ul>
            </div>
            <div className=" flex flex-col items-center overflow-y-auto w-full p-2 rounded-lg border-[1px] border-gray-400  bg-gray-700">
            <h1 className=" text-white uppercase font-semibold">Concluídas</h1>
            </div>
            </div>
        </div>
    )
}