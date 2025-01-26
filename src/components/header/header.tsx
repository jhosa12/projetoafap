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
        
         
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Comercial</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
           <Link href="/vendas">Vendas</Link>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Search the web</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Find...</MenubarItem>
              <MenubarItem>Find Next</MenubarItem>
              <MenubarItem>Find Previous</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Afap Saude</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>
            Always Show Full URLs
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            Reload <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Toggle Fullscreen</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Hide Sidebar</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value="benoit">
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>Edit...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Add Profile...</MenubarItem>
        </MenubarContent>
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

