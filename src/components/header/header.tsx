import { geist, roboto_Mono } from "@/fonts/fonts";
import { Avatar, Label } from "flowbite-react";
import { AuthContext, signOut } from "@/contexts/AuthContext";


import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
  } from "@/components/ui/menubar"
import { Bell, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useContext } from "react";


export function Header() {

    const {usuario} = useContext(AuthContext)


    return(
        <header className={`${geist.className} bg-white border-b p-2 border-gray-200 inline-flex justify-between items-center `}>
            <div className="inline-flex items-center gap-2">
        <Avatar   rounded alt="user" img={"/improved_logo.png"} />
            <div className="flex flex-col">
            <Label value="Sistema de Gestão AFAP - V 2.0"/>
            <Label className="text-gray-600" value="AFAP - PARAÍSO"/>
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

