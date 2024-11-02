import { api } from '@/services/apiClient'
import { ChevronFirst, ChevronLast } from 'lucide-react'
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai"
import { useState, useEffect, createContext } from "react"
import Dropdownn from '../pages/Dropdownn'
import Image from 'next/image'
import logo from "../../public/logoafap.png"

interface SubMenusProps {
  id: string,
  user: string,
  permissions:PermissionsProps[]
}
interface PermissionsProps{
  id:number
  Button:string,
  sub:Subprops[]
}
interface Subprops{
  subb: Array<string>
}
function SideBar() {
    const [isOpen, setIsOpen] = useState(true);
    const [users, setUser] = useState<SubMenusProps[]>([]);
   
    
  
  
    useEffect(() => {
      try {
        loadSubmenus();
      } catch (err) {
        console.log("Erro ao fazer requisição", err)
      }
  
    }, []);
  
    async function loadSubmenus() {
      

      const response = await api.post("/me",{
        id:"47896364-0e02-4ce5-a8e5-3349967b41b0"
      }); 
      setUser(
       [response.data]
      ); 
      console.log(response.data)
    }
   
    return (
      <aside
        className={`overflow-hidden transition-all  ${isOpen
          ? "bg-[#1a1d1f] text-white h-[100vh] w-1/5  rounded-tr-[16px] rounded-br-[16px]"
          : "w-[70px] bg-[#1a1d1f] text-white h-[100vh] rounded-tr-[16px]  rounded-br-[16px]"
          }`}
      >
      
        <div className="relative p-4 pb-2 flex flex-row justify-between items-center">
          <Image
            src={logo}
            className={`overflow-hidden transition-all ${isOpen ? "w-40 h-14 ml-1" : "w-0"
              }`}
            alt=""
          />
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="absolute rounded-lg hover:bg-[#4a4d4f] right-0 top-1"
          >
            {!isOpen ? <ChevronLast /> : <ChevronFirst />} 
          </button>
        </div>
        <div className="border-t flex flex-col gap-2 p-3 items-center justify-centers">
       {users.map((item,i)=>(
        <>
        {item.permissions.map(e=>(<Dropdownn menu={e.Button} submenu={e.sub} id={e.id} sideBar={isOpen}/>))}
        </>
       ))}
        </div>
      </aside>
    );
  }
  export default SideBar