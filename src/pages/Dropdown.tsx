import { useState,ReactNode } from "react"

import {AiOutlineCaretUp,AiOutlineCaretDown} from "react-icons/ai"

interface IconsProps{
  id:number;
  icon:ReactNode
}
interface ListItem {
    id: number;
    name: string;
    status: boolean;
  }
interface DropProps{
    nome:string,
    visible:boolean,
}
export default function Dropdown({nome,visible}:DropProps){

   
    const[isOpen,setisOpen] = useState(false)
    const [isOpenSubItens,setOpenSubItens] = useState(false)
    return (
        <>
        {visible && (<div className={`overflow-hidden transition-all ${"hidden"?"flex flex-col items-center w-10/12":"origin-left duration-200"}`}>
          <button onClick={()=>setisOpen((prev)=>!prev)} className="font-medium rounded-lg  flex items-center justify-between p-2 w-full text-xs" >
         
        <div className="flex items-center gap-4">
       
        
        </div>
        {(<>{!isOpen?(<AiOutlineCaretDown/>):(<AiOutlineCaretUp/>)}</>)}
          </button>  
          {(<>
            {isOpen && (
                <div className=" pl-10 rounded-lg flex w-full h-full my-1 flex-col">
                  
                 
                </div>
            )}
          </>)}
         
        </div>) }
         
        </>
       
    )
}
