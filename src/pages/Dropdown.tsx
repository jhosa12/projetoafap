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
    array: ListItem[]
    comp:IconsProps[];
    sideBar:boolean
}
export default function Dropdown({nome,visible,array,comp,sideBar}:DropProps){

   
    const[isOpen,setisOpen] = useState(false)
    const [isOpenSubItens,setOpenSubItens] = useState(false)
    return (
        <>
        {visible && (<div className={`overflow-hidden transition-all ${sideBar && "hidden"?"flex flex-col items-center w-10/12":"origin-left duration-200"}`}>
          <button onClick={()=>setisOpen((prev)=>!prev)} className="font-medium rounded-lg  flex items-center justify-between p-2 w-full text-xs" disabled={!sideBar}>
         
        <div className="flex items-center gap-4">
        <div>{comp.map((item)=>(item.icon))}</div>
        {sideBar && (<span >{nome}</span>)}
        </div>
        {sideBar && (<>{!isOpen?(<AiOutlineCaretDown/>):(<AiOutlineCaretUp/>)}</>)}
          </button>  
          {sideBar &&(<>
            {isOpen && (
                <div className=" pl-10 rounded-lg flex w-full h-full my-1 flex-col">
                    {array.map((item,i)=>(

                        <div className="" key={i}>
                        {item.status && (<div onClick={()=>setOpenSubItens((prev)=>!prev)} className="flex w-full p-2 justify-between cursor-pointer hover:bg-white hover:text-black rounded-lg">
                <h3 className="text-xs">{item.name}</h3>
                 <h3>{(<AiOutlineCaretDown size={12}/>)}</h3>    
                 </div>)}
                
                        </div>))} 
                 
                </div>
            )}
          </>)}
         
        </div>) }
         
        </>
       
    )
}

