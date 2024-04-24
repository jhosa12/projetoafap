import { useState, ReactNode } from "react"

import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai"
import { FaCross, FaReadme } from "react-icons/fa";
import { CgAdd, CgBriefcase } from "react-icons/cg";
interface IconsProps {
  id: number;
  icon: ReactNode
}
interface DropProps {
  id:number,
  menu: string,
  submenu: Subprops[]
  sideBar:boolean
}
interface Subprops {
  subb: Array<string>
}


export default function Dropdown({ menu, submenu,sideBar,id }: DropProps) {
  const arrayIcons = [
     {id: 1, icon: <FaReadme size={25} key={1}/>,rota:"/login" },
     { id: 2, icon: <CgBriefcase size={25} key={2} />,rota:"/teste2" },
     { id: 3, icon: <FaCross size={25} key={3} /> ,rota:"/teste3"},
     { id: 4, icon: <CgAdd size={25} key={4} />,rota:"/teste4" },
   ];
  const icon =  arrayIcons.filter((e)=>e.id===id)
  const [isOpen, setisOpen] = useState(false)
  const [isOpenSubItens, setOpenSubItens] = useState(false)
  return (
    <>
      <div className={`overflow-hidden transition-all ${sideBar && "hidden" ? "flex flex-col items-start w-10/12" : "origin-left duration-200"}`}>
        
        <div className="flex flex-row justify-center items-center gap-2">
        {icon.map((e)=>e.icon)}
        <button onClick={() => setisOpen((prev) => !prev)} className="flex flex-row font-medium rounded-lg items-center justify-center" >
          {sideBar && (<span className="text-[11px] items-center" >{menu}</span>)}
          {sideBar && (<div className="ml-2">{!isOpen ? (<AiOutlineCaretDown />) : (<AiOutlineCaretUp />)}</div>)}
        </button>
       
        </div>
        {sideBar &&(<>
          {isOpen && (
            <div className=" pl-5 rounded-lg flex w-full h-full my-1 flex-col">
              <div className="">
                {submenu.map((ir, j) => (
                <div 
                key={j}
                 className=" ml-3 rounded-lg flex justify-between items-center cursor-pointer pr-3  hover:bg-white hover:text-black">
                <span className="font-medium text-[12px] pl-3  pb-1">{ir.subb}</span> 
                  <AiOutlineCaretDown size={12} />
                  </div>))}
              </div>
            </div>
          )}
        </>)}
      </div>
    </>

  )
}

