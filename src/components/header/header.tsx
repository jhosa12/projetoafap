
import { Avatar, Label } from "flowbite-react";
import { AuthContext, signOut } from "@/contexts/AuthContext";
import Router from 'next/router';

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
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Bell, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useContext, useState } from "react";
import Image from "next/image";
import { ModalAtivosInativos } from "../ativosInativos/modalAtivosInativos";



export function 
Header() {

    const {usuario,empresas,selectEmp,setSelectEmp,permissoes,infoEmpresa} = useContext(AuthContext)
    const [open,setOpen] = useState(false)


    return(
        <div className={`flex flex-row w-full bg-white border-b px-2 py-1 border-gray-200  justify-between items-center `}>
            <div className="inline-flex items-center gap-2">
        <Image width={50} height={50} priority alt="user" src={"/improved_logo.png"} />
            <div className="flex flex-col">
            <Label value="Sistema de Gestão AFAP - V 2.0"/>
            <Select   value={selectEmp} onValueChange={(e) => setSelectEmp(e)}>
      <SelectTrigger className="w-[150px] text-xs h-6">
        <SelectValue defaultValue={selectEmp}  />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup >
         {empresas?.filter(emp=>permissoes.includes(`EMP${emp.id}`))?.map((emp) => (
          <SelectItem className="text-xs" key={emp.id} value={emp.id}>{emp.nome}</SelectItem>
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
          <MenubarItem onClick={() => setOpen(true)}>
           <span>Ativos/Inativos</span>
          </MenubarItem>
          <MenubarItem>
          <Link href="/conveniados">Conveniados</Link>
          </MenubarItem>
          <MenubarItem>
          <Link href="/chart">Graficos</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
  
  <MenubarMenu >
  <MenubarTrigger asChild >
    <button disabled={!permissoes.includes('EMP4e61a06f-dee3-4c74-8b31-aca0d771dbff')} className="disabled:cursor-not-allowed disabled:text-gray-400" onClick={() => Router.push("/afapSaude")} type="button">Afap Saúde</button>
     
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
        <MenubarTrigger>Configurações</MenubarTrigger>
        <MenubarContent>
          <MenubarItem disabled={!permissoes.includes('CFG1')}>
          <Link  href="/configuracoes/usuario">Usuários</Link>
          </MenubarItem>
          <MenubarItem disabled={!permissoes.includes('CFG1')}>
          <Link  href="/configuracoes/empresas">Empresa</Link>
          </MenubarItem>
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
        <Avatar rounded img={usuario?.image} />

    <div className="flex flex-col items-center">
        <span  className="text-[13px] font-semibold">{usuario?.nome}</span>
        <span className="text-xs">{usuario?.cargo}</span>
    </div>
    

    </div>
  { open && <ModalAtivosInativos usuario={usuario?.nome} logo={infoEmpresa?.logoUrl} open={open} onClose={()=>setOpen(false)} id_empresa={selectEmp}/> }

        </div>
    )
}

