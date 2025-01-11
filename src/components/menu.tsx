import { useContext, useEffect, useState } from "react"
import Image from 'next/image';
import { MdManageAccounts } from "react-icons/md";
import logo from '../../public/novaLogo.png'
import { MdLogout } from "react-icons/md";
import { AuthContext,signOut } from '@/contexts/AuthContext';
import { Tooltip } from 'react-tooltip';
import { IoIosClose } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import { io } from 'socket.io-client';
import Link from "next/link";
import { api } from "@/services/apiClient";
import { RxDrawingPinFilled } from "react-icons/rx";
import { GrConfigure } from "react-icons/gr";
import { FaSortAlphaDown } from "react-icons/fa";
import { BsInboxesFill } from "react-icons/bs";
import { MdHealthAndSafety } from "react-icons/md";
import { useRouter } from "next/router";
import SideBar from "./menu/menuSide";
import { Avatar } from "flowbite-react";



  
export function MenuLateral(){
   
    const [isOpen,setIsOpen]=useState(false);
    const {usuario,getDadosFixos,empresas,permissoes,selectEmp,setSelectEmp}= useContext(AuthContext);
  
    const[notifyCount,setCount] = useState<number>();
    
    

 useEffect(() => {
    console.log("CHAMOU A REQUISIÇAÕ DE DADOS FIXOS")
    getDadosFixos();
    const socket = io("https://www.testeapiafap.shop", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    if (usuario) {
      socket.on('connect', () => {
        socket.emit('userId', usuario?.id.toString());
      });

      socket.on('nova-tarefa', (tarefa) => {
        if (tarefa) setCount(tarefa);
      });
    }

    return () => {
      socket.off('nova-tarefa');
    };
  }, [usuario?.id]);



async function contagem() {
 const cont = await api.post("/notification/contagem",{
   id_destino:String(usuario?.id)
 })
 setCount(cont.data)
}

  return (
 
    <div className='flex flex-col w-full'>
    <header className='border-b-[1px] border-gray-400'>
<nav className="border-gray-200 px-4 lg:px-6 py-2  " >
    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <div className="flex items-center">
            <Image onClick={()=>setIsOpen(!isOpen)}  src={logo}  className="cursor-pointer w-full mr-2 h-6 sm:h-8" alt="Flowbite Logo" />
            <h1 className="whitespace-nowrap pt-4 w-full text-base font-semibold  text-white">SISTEMA DE GERENCIAMENTO AFAP</h1>


            <div className="pt-4">
            <select value={selectEmp} onChange={e => setSelectEmp(e.target.value)} className="appearance-none  focus:outline-none focus:ring-0 py-0 px-4 border-0  bg-transparent text-white text-[16px] font-semibold m-0 ">
                {empresas.map((empresa) => (
                 permissoes.includes(`EMP${empresa.id}`) && <option className="text-black" key={empresa.id} value={empresa.id}>{empresa.nome}</option>
                ))}
              </select>
            </div>
             
        </div>
        <div className="flex relative items-center gap-4">
  <div className="relative">      
<Link href={"/notifications"}   className="relative inline-flex items-center p-1 text-sm font-medium text-center text-white  rounded-lg  hover:bg-gray-700 ">
<IoNotifications size={20}/>
  {!!notifyCount && <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-green-500 border-2  rounded-full -top-1 -end-1 border-gray-900">{notifyCount}</div>}
</Link>
</div> 
          <button data-tooltip-id='logout' data-tooltip-content='Deslogar' onClick={signOut}>
          <MdLogout color='white' size={23}/>
          </button>
          <Tooltip id='logout'/>
          {usuario?.image && <Avatar img={`${usuario.image}`}  alt="avatar of Jese" rounded />}
<div className  ="flex flex-col font-medium text-sm text-white">
    <span>{usuario?.nome}</span>
    <span className="text-xs  text-gray-400">{usuario?.cargo}</span>
</div>
</div>
    </div>
</nav>
</header>

  
 <SideBar isOpen={isOpen} setClose={setIsOpen}/>

</div>
  )  
}