import { api } from '@/services/apiClient'
import { ChevronFirst, ChevronLast } from 'lucide-react'
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai"
import { useState, useEffect, createContext } from "react"
import Dropdown from '../Dropdown'
import Image from 'next/image'

import { FaReadme } from "react-icons/fa";
import { CgAdd } from "react-icons/cg";
import { CgBriefcase } from "react-icons/cg";
import { FaCross } from "react-icons/fa";
import { canSSRAuth } from '../../utils/canSSRAuth'
import { split } from 'postcss/lib/list'
interface SubMenusProps {
  id: number,
  name: string,
  status: boolean,
  menu_id: number
}
function MenuLateral() {
  const [isOpen, setIsOpen] = useState(true);
  const [submenus, setSubmenus] = useState<SubMenusProps[]>([]);
  const [menus, setMenus] = useState<SubMenusProps[]>([]);
  const arrayIcons = [
    { id: 1, icon: <FaReadme size={25} key={1} /> },
    { id: 2, icon: <CgBriefcase size={25} key={2} /> },
    { id: 3, icon: <FaCross size={25} key={3} /> },
    { id: 4, icon: <CgAdd size={25} key={4} /> },
  ];

  useEffect(() => {
    try {
      loadSubmenus();
    } catch (err) {
      console.log("Erro ao fazer requisição", err)
    }

  }, []);

  async function loadSubmenus() {
    const response = await api.get("/submenus");
    const menusGet = await api.get("/menu");
    console.log(menusGet.data);
    setSubmenus(response.data);
    setMenus(menusGet.data);
  }
   const teste = menus.map((item,i)=>{
    return item.name.split(";")
  })
  console.log(teste)
  
  return (
    <aside
      className={`overflow-hidden transition-all ${isOpen
        ? "bg-[#1a1d1f] text-white h-[calc(100vh-16px)] w-1/5 mt-4 rounded-tr-[16px]"
        : "w-[70px] bg-[#1a1d1f] text-white h-[calc(100vh-16px)] mt-4 rounded-tr-[16px]"
        }`}
    >
      <div className="relative p-4 pb-2 flex flex-row justify-between items-center">
     
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute rounded-lg hover:bg-[#4a4d4f] right-0 top-1"
        >
          {!isOpen ? <ChevronLast /> : <ChevronFirst />}
        </button>
      </div>
      <div className="border-t flex flex-col gap-2 p-3 items-center justify-centers">
        {menus.map((item, i) => (
          <Dropdown
            nome={item.name}
            visible={item.status}
            array={submenus.filter((it) => it.menu_id === item.id)}
            comp={arrayIcons.filter((i) => i.id === item.id)}
            sideBar={isOpen}
          />
        ))}
      </div>
    </aside>
  );
}

export default MenuLateral

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {}
  }
})