import { MenuLateral } from "@/components/menu"
import Head from "next/head"
import { useState } from "react"


export default function gerenciarAdministrativo(){
    const [PlanosContas,setPlanosContas] =useState(true)
    const [Planos,setPlanos] = useState(false)
    const [Convalescencia,setConv] =useState(false)
    return(
<>
<Head>
    <title>Gerenciar setor Administrativo</title>
</Head>
<div className="flex flex-col w-full p-2  justify-center">
<MenuLateral/>
<div className="flex-col w-full p-2 mt-2 border  rounded-lg shadow  border-gray-700">
    <ul className="flex flex-wrap text-sm font-medium text-center  border-b  rounded-t-lg  border-gray-700 text-gray-400 "  >
        <li className="me-2">
            <button  type="button" onClick={()=>{setPlanos(false);setPlanosContas(true),setConv(false)}}    className={`inline-block p-2  rounded-t-lg hover:bg-gray-700 ${PlanosContas && "text-blue-500"} hover:text-gray-300  `}>Planos de Contas</button>
        </li>
        <li className="me-2">
            <button type="button"  onClick={()=>{setPlanos(true);setPlanosContas(false),setConv(false)}}   className={`inline-block p-2  rounded-t-lg hover:bg-gray-700 ${Planos && "text-blue-500"} hover:text-gray-300  `}>Planos</button>
        </li>
        <li className="me-2">
            <button type="button"  onClick={()=>{setPlanos(false);setPlanosContas(false),setConv(true)}}  className={`inline-block p-2  rounded-t-lg hover:bg-gray-700 ${Convalescencia && "text-blue-500"} hover:text-gray-300  `}>Convalescencia</button>
        </li>

    </ul>

</div>
</div>
</>
    )
}