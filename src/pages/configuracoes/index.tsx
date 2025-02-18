
import {Usuario} from "../../components/configuracoes/usuarios/usuario"
import { Tabs } from "flowbite-react"
import { MdAddBusiness } from "react-icons/md"
import { Empresas } from "@/components/configuracoes/empresas/empresas"
import { FaUsers } from "react-icons/fa"

export default function TabsConfig() {
   
    
  return (
    <Tabs
    theme={{ base: 'bg-white rounded-b-lg', tablist: { tabitem: { base: "flex items-center justify-center enabled:text-black rounded-t-lg p-4 text-xs font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 " } } }}
     aria-label="Tabs with underline" variant="underline">
    <Tabs.Item active title="Usuários" icon={FaUsers}>
      <Usuario/>
    </Tabs.Item>
    <Tabs.Item title="Empresas" icon={MdAddBusiness}>
    <Empresas/>
    </Tabs.Item>
  </Tabs>
   
  )
}
