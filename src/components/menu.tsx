import { useContext, useEffect, useState } from "react"
import Image from 'next/image';
import { MdManageAccounts } from "react-icons/md";
import logo from '../../public/logoafap.png'
import fototeste from '../../public/fototeste.jpeg'
import { MdLogout } from "react-icons/md";
import { AuthContext } from '@/contexts/AuthContext';
import { Tooltip } from 'react-tooltip';
import { IoIosClose } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import { io } from 'socket.io-client';
import Link from "next/link";



interface GrupoTeste{
   id_grupo:number,
   descricao:string
 }




export function MenuLateral(){
   const socket = io("https://apiafap.onrender.com");
    const [isOpen,setIsOpen]=useState(false);
    const {signOut,usuario}= useContext(AuthContext);
    const [isAdmOpen,setIsAdmOpen]= useState(false );
    const [isCaixaOpen,setIsCaixaOpen] = useState(false);
    const[teste,setTeste] = useState<GrupoTeste>();

  const userId =usuario?.id.toString()
    
  useEffect(() => {
   socket.on('connect', () => {
      socket.emit('userId', userId);
   });

   socket.on('nova-tarefa', (tarefa) => {
      // Lógica para lidar com a nova tarefa recebida
      console.log('Nova tarefa recebida:', tarefa);
      setTeste(tarefa);
   });

}, [socket, userId]);




  return (

   
    <div className='flex flex-col w-full'>

    <header className='border-b-[1px] border-gray-500'>
<nav className="border-gray-200 px-4 lg:px-6 py-2.5  " >
    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <div className="flex items-center">
            <Image onClick={()=>setIsOpen(!isOpen)}  src={logo}  className="cursor-pointer w-full mr-2 h-8 sm:h-11" alt="Flowbite Logo" />
            <span className="inline-flex whitespace-nowrap w-full text-xl font-semibold  text-white">SISTEMA DE GERENCIAMENTO AFAP</span>
        </div>
       
        <div className="flex items-center gap-4">
         
<button type="button" className="relative inline-flex items-center p-1 text-sm font-medium text-center text-white  rounded-lg  focus:ring-4 focus:outline-none   hover:bg-blue-700 focus:ring-blue-800">
<IoNotifications size={22}/>
  {teste && <div className="absolute inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-green-500 border-2 border-white rounded-full -top-1 -end-1 dark:border-gray-900"></div>}
</button>

          <button data-tooltip-id='logout' data-tooltip-content='Deslogar' onClick={signOut}>
          <MdLogout color='white' size={25}/>
          </button>
          <Tooltip id='logout'/>
          <div className="w-11 h-11 rounded-full overflow-hidden">
    <Image 
        className="object-cover" 
        src={usuario?.dir ? `${usuario.dir}` : fototeste} 
        width={100} 
        height={100} 
        alt=""
    />
</div>
<div className  ="font-medium text-white">
    <span>{usuario?.nome}</span>
    <div className="text-sm  text-gray-400">{usuario?.cargo}</div>
</div>
</div>
    </div>
</nav>
</header>
<div  className={`fixed  rounded-e-lg z-40 top-[65px] left-0 w-64 h-[645px] p-4 overflow-y-auto bg-gray-800 transition-transform ${isOpen ? "" : "transform -translate-x-full"}`}>
    <h5  className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</h5>
    <button onClick={()=>setIsOpen(!isOpen)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
       <IoIosClose size={35}/>
    </button>
  <div className="py-4 overflow-y-auto">
      <ul className="space-y-2 font-medium">
      <li >
    <button type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example" onClick={() =>setIsAdmOpen(!isAdmOpen)}>
    <MdManageAccounts size={25}/>
        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Administrativo</span>
            <FaAngleDown size={18}/>
    </button>
    <ul  className={`shadow-md rounded-lg py-2 space-y-2 transition duration-300 ${!isAdmOpen && "hidden"}`}>
        <li>
            <Link href="/admcontrato" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Adm Contrato</Link>
        </li>
        <li>
            <Link href="/gerenciarAdministrativo" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Gerenciar</Link>
        </li>
        <li>
            <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Invoice</a>
        </li>
    </ul>
</li>
         <li >
    <button type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example" onClick={() =>setIsCaixaOpen(!isCaixaOpen)}>
      <FaMoneyBillTransfer  size={23}/>
        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Caixa</span>
        <FaAngleDown size={18}/>
    </button>
    <ul  className={`shadow-md rounded-lg py-2 space-y-2 transition duration-300 ${!isCaixaOpen && "hidden"}`}>
        <li>
            <Link href='/caixa' className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Movimentar</Link>
        </li>
        <li>
            <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Relatórios</a>
        </li>
      
    </ul>
</li>
         <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
               <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
            </a>
         </li>
         <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
            </a>
         </li>
         <li>
            <Link href="/testeMapa" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                  <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z"/>
               </svg>
               <span className="flex-1 text-red-600 ms-3 whitespace-nowrap">Teste Mapa</span>
            </Link>
         </li>
         <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Sign In</span>
            </a>
         </li>
         <li>
            <Link href="/TI" target="blank" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z"/>
                  <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z"/>
                  <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Sugestões</span>
            </Link>
         </li>
      </ul>
   </div>
</div>
</div>
  )  
}