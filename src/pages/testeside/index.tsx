
import logo from '../../../public/logoafap.png';
import fototeste from '../../../public/fototeste.jpeg'
import { MdManageAccounts } from "react-icons/md";
import { HiDocumentSearch } from "react-icons/hi";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiReceiveMoney } from "react-icons/gi";
import { TbReportMoney } from "react-icons/tb";
import { MdNewLabel } from "react-icons/md";
import { FaCross } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { useContext, useState } from 'react';
import Image from 'next/image';
import Adm from '../admcontrato/index'
import { canSRRAuth } from '@/utils/canSSRAuth';
import { MdLogout } from "react-icons/md";
import { AuthContext } from '@/contexts/AuthContext';
import { Tooltip } from 'react-tooltip';
import { MenuLateral } from '@/components/menu';


export default function SideBar(){



    return(
      <div className='flex flex-col w-full overscroll-contain '>
       
<MenuLateral/>

 
</div>
  )
}

export const getServerSideProps = canSRRAuth(async(ctx)=>{
  return{
    props:{}
  }
})

