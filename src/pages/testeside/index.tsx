import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses} from 'react-pro-sidebar';
import logo from '../../../public/logoafap.png';
import fototeste from '../../../public/fototeste.jpeg'
import { FiAlertOctagon } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import { HiDocumentSearch } from "react-icons/hi";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiReceiveMoney } from "react-icons/gi";
import { TbReportMoney } from "react-icons/tb";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { MdNewLabel } from "react-icons/md";
import { FaCross } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { useState } from 'react';
import Image from 'next/image';
import Adm from '../admcontrato/index'

export default function SideBar(){
 const [isOpen,setIsOpen]= useState(true )
    return(
      <div className='flex flex-col w-full overscroll-contain'>
        <header>
    <nav className="border-gray-200 px-4 lg:px-6 py-2.5 bg-[#101418] " >
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <div className="flex items-center">
                <Image onClick={()=>setIsOpen(!isOpen)} src={logo} className="cursor-pointer w-full mr-2 h-8 sm:h-11" alt="Flowbite Logo" />
                <span className="self-center text-xl font-semibold  text-[#e6ba55]">SISAFAP</span>
            </div>
            <div className="flex items-center gap-4">
    <Image className="w-10 h-10 rounded-full" src={fototeste} alt=""/>
    <div className  ="font-medium text-white">
        <div>Henrique Freitas</div>
        <div className="text-sm  text-gray-400">Técnico de TI</div>
    </div>
</div>
     
        </div>
    </nav>

    
</header>
   <div className=' flex flex-row bg-[#101418] w-full '> 
  
   <div className={`flex h-[100vh] overscroll-y-${isOpen ? 'auto' : 'hidden'}`}>
        <Sidebar  collapsed={!isOpen}  backgroundColor='#101418'  rootStyles={{
            [`.${sidebarClasses.container}`]: {
              height:'89%',
              
            },
          }}>
    

  <Menu  transitionDuration={600}  closeOnClick={true} menuItemStyles={
    {
      button:{
        display:'flex',
        color:'#9ca3af',
        ":hover":{color:'#FFFFFF',backgroundColor:'#101418'}
      },
      subMenuContent:{
        backgroundColor:'#101418',
        
      }
    }
  } >
   
    <SubMenu icon={<MdManageAccounts size={30}/>} label={<span className='font-bold'>Administrativo</span>} active={true}>
      <MenuItem icon={<HiDocumentSearch size={25} /> } >Adm Contrato</MenuItem>
     <SubMenu icon={<GiReceiveMoney size={25}/>} label='Caixa'  > 
      <MenuItem icon={<FaMoneyBillTransfer size={23} />} >Movimentação</MenuItem>
      <MenuItem icon={<TbReportMoney size={23}/>}>Relatório</MenuItem>
       </SubMenu>
     
    </SubMenu>
    <SubMenu icon={<FaCross size={25} />} label="Fúnebre">
       <MenuItem icon={<MdNewLabel size={23}/>}>Solicitar Serviço</MenuItem> 
       <MenuItem icon={<HiDocumentReport size={23}/>}>Relatório</MenuItem>
       </SubMenu>
   
    <SubMenu icon={<FaCross size={25} />} label="Fúnebre">
       <MenuItem icon={<MdNewLabel size={23}/>}>Solicitar Serviço</MenuItem> 
       <MenuItem icon={<HiDocumentReport size={23}/>}>Relatório</MenuItem>
       </SubMenu>
       <SubMenu icon={<FaCross size={25} />} label="Fúnebre">
       <MenuItem icon={<MdNewLabel size={23}/>}>Solicitar Serviço</MenuItem> 
       <MenuItem icon={<HiDocumentReport size={23}/>}>Relatório</MenuItem>
       </SubMenu>
  </Menu>
</Sidebar>
</div>
<Adm/>
</div>  
</div>
    )
}