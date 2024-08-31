


import { Drawer, Sidebar } from "flowbite-react";
import Link from "next/link";

import { useState } from "react";
import { HiArrowSmRight, HiTable } from "react-icons/hi";
import { HiInbox, HiShoppingBag, HiUser, HiWallet } from "react-icons/hi2";



export default function SideBar(){
    const [isOpen,setClose] = useState(true)
    return(
        <>
        <button onClick={()=>setClose(true)}>ABRIR</button>
        <div className="flex min-h-[50vh] items-center justify-center">
        <Drawer  open={isOpen} onClose={()=>setClose(false)}>
            <Drawer.Header title="MENU" titleIcon={() => <></>}  />
            <Drawer.Items>
       <Sidebar   aria-label="Sidebar with multi-level dropdown example"
            className="[&>div]:bg-transparent [&>div]:p-0">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Collapse label="Administrativo"  icon={HiWallet}>
          <Sidebar.Item > <Link href="/admcontrato">Adm Contrato</Link></Sidebar.Item>
            
          </Sidebar.Collapse>
          <Sidebar.Collapse icon={HiShoppingBag} label="E-commerce">
            <Sidebar.Item >Products</Sidebar.Item>
            <Sidebar.Item href="#">Sales</Sidebar.Item>
            <Sidebar.Item href="#">Refunds</Sidebar.Item>
            <Sidebar.Item href="#">Shipping</Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Item href="#" icon={HiInbox}>
            Inbox
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiUser}>
            Users
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiShoppingBag}>
            Products
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiArrowSmRight}>
            Sign In
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiTable}>
            Sign Up
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
    </Drawer.Items>
       </Drawer>
       </div>
       </>
    )
}