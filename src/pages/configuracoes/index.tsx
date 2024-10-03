import { useState } from "react"
import {Usuario} from "../../components/configuracoes/usuarios/usuario"

export default function UsuarioConfig() {
    const [menuIndex, setMenuIndex] = useState(1)
    
  return (
    <>
    <div className="flex flex-col px-4 w-full text-white">
    <ul className="flex flex-wrap mb-1 text-sm font-medium text-center  border-b  rounded-t-lg  border-gray-700 text-gray-100 "  >
            <li className="me-2">
              <button type="button" onClick={() => setMenuIndex(1)} className={`inline-block p-2 border-blue-600 rounded-t-lg hover:border-b-[1px]  hover:text-gray-300  `}>Usuários</button>
            </li>
         
          
         

          </ul>

          {menuIndex===1 && <Usuario/> }
        

    </div>
    </>
   
  )
}
