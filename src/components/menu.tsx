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
import { Header } from "./header/header";




  
export function MenuLateral(){
   
    const [isOpen,setIsOpen]=useState(false);
    const {usuario,getDadosFixos,empresas,permissoes,selectEmp,setSelectEmp}= useContext(AuthContext);
  
    const[notifyCount,setCount] = useState<number>();
    
    

 useEffect(() => {
    
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
<Header/>

  
 

</div>
  )  
}