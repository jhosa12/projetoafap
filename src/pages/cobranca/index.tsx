import {  Suspense, useContext, useEffect, useState,lazy } from "react"
import Head from "next/head"
import { AuthContext } from "@/contexts/AuthContext"
import {  Tabs } from "flowbite-react"
import {  FaCalendarCheck, FaStore } from "react-icons/fa"
import { RiHistoryLine} from "react-icons/ri"
import { Cobranca } from "@/components/cobranca/cobranca/cobranca"
import { Inadimplencia } from "@/components/cobranca/indimplencia/indimplencia"
import { FaCalendarDays } from "react-icons/fa6"










export default function AdministrarEstoque(){
  
  
    const {permissoes,selectEmp} = useContext(AuthContext);
    const [tab,setTab] = useState<number>(0)
   

   

  
    return(
        <>
            <Head>
                <title>Cobrança</title>
            </Head>

            <div className="flex flex-col w-full text-white">
      <Tabs  theme={{base: 'bg-white rounded-b-lg',tabpanel:'bg-white rounded-b-lg h-[calc(100vh-104px)]',tablist:{tabitem:{base: "flex items-center text-xs justify-center rounded-t-lg px-4 py-3  font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",variant:{underline:{active:{
        on:"active rounded-t-lg border-b-2 border-blue-600 text-blue-500 ",
        off:"border-b-2 border-transparent text-black hover:border-gray-700 hover:text-gray-600 "
      }}}}}}}  variant="underline"  onActiveTabChange={e=>setTab(e)}>

      <Tabs.Item  active={tab===0} title="COBRANÇA" icon={()=>(<FaCalendarCheck className="mr-2 h-4 w-4"/>)}>
       {tab===0 && <Cobranca/>}
     
      </Tabs.Item>
      <Tabs.Item  active={tab===1} title="INADIMPLENCIA" icon={()=><FaCalendarDays  className="mr-2 h-4 w-4"/>}>
     {tab===1 &&
     <Suspense fallback={<div>Carregando...</div>}>
       <Inadimplencia/>
     </Suspense>
     
      
      }
      </Tabs.Item>

    
    </Tabs>
      </div>
        </>
     
    )

}