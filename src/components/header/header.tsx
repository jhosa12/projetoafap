import { geist} from "@/fonts/fonts";
import { Avatar, Label } from "flowbite-react";
import { AuthContext, signOut } from "@/contexts/AuthContext";


import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
  } from "@/components/ui/menubar";
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Bell, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useContext } from "react";
import Image from "next/image";


export function Header() {

    const {usuario,empresas,selectEmp,setSelectEmp} = useContext(AuthContext)


    return(
        <header className={`${geist.className} bg-white border-b px-2 py-1 border-gray-200 inline-flex justify-between items-center `}>
            <div className="inline-flex items-center gap-2">
        <Image width={50} height={50} priority alt="user" src={"/improved_logo.png"} />
            <div className="flex flex-col">
            <Label value="Sistema de Gestão AFAP - V 2.0"/>
            <Select  value={selectEmp} onValueChange={(e) => setSelectEmp(e)}>
      <SelectTrigger className="w-[180px] text-xs">
        <SelectValue defaultValue={selectEmp}  />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup >
         {empresas.map((emp) => (
          <SelectItem key={emp.id} value={emp.id}>{emp.nome}</SelectItem>
        ))}
        
        </SelectGroup>
      </SelectContent>
    </Select>
            </div>
           
            </div>



           
            <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Administrativo</MenubarTrigger>
        <MenubarContent>
          <MenubarItem >
           <Link href={"/admcontrato"}>Administrar Contrato</Link>  
          </MenubarItem>
          <MenubarItem>
           <Link href="/estoque">Estoque </Link> 
          </MenubarItem>
          <MenubarItem>
           <Link href="/caixa">Caixa</Link> 
          </MenubarItem>
          <MenubarItem>
           <Link href="/renovacao">Renovação</Link> 
          </MenubarItem>
          <MenubarItem>
           <Link href="/cobranca">Cobrança</Link> 
          </MenubarItem>
          <MenubarItem>
           <Link href="/gerenciarAdministrativo">Gerenciar</Link> 
          </MenubarItem>
          <MenubarItem>
           <Link href="/financeiro">Financeiro</Link> 
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Sorteios</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem><Link href="/sorteio">Sorteios</Link></MenubarItem>
              <MenubarItem><Link href="/sorteio/configuracoes">Configurar Parâmetros</Link></MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        
         
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Comercial</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
           <Link href="/vendas">Vendas</Link>
          </MenubarItem>
          <MenubarItem>
          <Link href="/conveniados">Conveniados</Link>
          </MenubarItem>
          <MenubarItem>
          <Link href="/chart">Graficos</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
  
  <MenubarMenu>
  <MenubarTrigger>
        <Link href="/afapSaude">Afap Saude</Link>  
          </MenubarTrigger>
  </MenubarMenu>

  <MenubarMenu>
        <MenubarTrigger>Serviços</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
           <Link href="/servicos/listarObitos">Óbitos</Link>
          </MenubarItem>
          <MenubarItem>
          <Link href="/servicos/convalescencia/listagem">Convalescentes</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      
       
      
      <MenubarMenu>
  <MenubarTrigger>
        <Link href="/configuracoes">Configurações</Link>  
          </MenubarTrigger>
  </MenubarMenu>

 






    </Menubar>

           
  
    <div className="inline-flex items-center gap-4 mr-2">

        <Button variant={"secondary"}>
        <Bell size={20} />
        </Button>
    
    <Button onClick={signOut} variant={"secondary"}>
    <LogIn  size={20} />
    </Button>


    <div className="flex flex-col">
        <Label  value={usuario?.nome}/>
        <span className="text-xs">{usuario?.cargo}</span>
    </div>
    

    </div>
            

        </header>
    )
}

